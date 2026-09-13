import * as vscode from "vscode";
import {
    AntigravityQuotaSummaryBucket,
    AntigravityQuotaSummarySnapshot,
    getAntigravityCurrentAccount,
    getAntigravityQuotaSummary,
} from "./hub-auth-client";
import { getManagedAccounts } from "./account-registry";
import { saveManagedAccountUsageSnapshot } from "./quota-summary-store";

export interface QuotaMonitorConfig {
    intervalMinutes: number;
    reminderEnabled: boolean;
    thresholdPercent: number;
}

/**
 * Service for periodically refreshing Antigravity quota in the background
 * and notifying the user when their active quota falls below a safety threshold.
 *
 * Rules respected:
 * - NO aggressive polling (minimum 1 minute safe interval).
 * - NO automatic switching of inactive accounts.
 * - Deduplicated warnings per quota reset window.
 */
export class QuotaMonitorService implements vscode.Disposable {
    private timer?: NodeJS.Timeout;
    private isRefreshing = false;
    private config: QuotaMonitorConfig;
    private notifiedDeduplicationKeys = new Set<string>();

    constructor(
        private readonly context: vscode.ExtensionContext,
        initialConfig: QuotaMonitorConfig,
        private readonly onQuotaUpdated?: (
            usage: AntigravityQuotaSummarySnapshot,
        ) => Promise<void> | void,
    ) {
        this.config = this.sanitizeConfig(initialConfig);
        this.start();
    }

    public updateConfig(newConfig: Partial<QuotaMonitorConfig>): void {
        const oldInterval = this.config.intervalMinutes;
        this.config = this.sanitizeConfig({
            ...this.config,
            ...newConfig,
        });

        if (this.config.intervalMinutes !== oldInterval) {
            this.start();
        }
    }

    public start(): void {
        this.stop();

        if (this.config.intervalMinutes <= 0) {
            return;
        }

        // Safe minimum of 1 minute (60,000 ms) to avoid aggressive polling
        const safeMinutes = Math.max(1, this.config.intervalMinutes);
        const intervalMs = safeMinutes * 60 * 1000;

        this.timer = setInterval(() => {
            void this.checkAndRefreshNow();
        }, intervalMs);
    }

    public stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    public async checkAndRefreshNow(): Promise<AntigravityQuotaSummarySnapshot | null> {
        if (this.isRefreshing) {
            return null;
        }

        this.isRefreshing = true;

        try {
            const current = await getAntigravityCurrentAccount();
            if (!current || !current.email) {
                return null;
            }

            const usage = await getAntigravityQuotaSummary(true);

            // Persist for managed accounts
            const managedAccounts = getManagedAccounts(this.context);
            const normalizedEmail = current.email.trim().toLowerCase();
            const isManaged = managedAccounts.some(
                account => account.email.trim().toLowerCase() === normalizedEmail,
            );

            if (isManaged) {
                await saveManagedAccountUsageSnapshot(
                    this.context,
                    current.email,
                    usage,
                );
            }

            // Notify UI listener
            if (this.onQuotaUpdated) {
                await this.onQuotaUpdated(usage);
            }

            // Evaluate low quota reminders
            if (this.config.reminderEnabled && usage.buckets && usage.buckets.length > 0) {
                await this.evaluateLowQuotaBuckets(current.email, usage.buckets);
            }

            return usage;
        } catch {
            // Background monitoring fails silently without breaking the user experience
            return null;
        } finally {
            this.isRefreshing = false;
        }
    }

    private async evaluateLowQuotaBuckets(
        email: string,
        buckets: AntigravityQuotaSummaryBucket[],
    ): Promise<void> {
        for (const bucket of buckets) {
            if (typeof bucket.remainingFraction !== "number" || bucket.disabled) {
                continue;
            }

            const remainingPercent = Math.max(
                0,
                Math.min(100, Math.round(bucket.remainingFraction * 100)),
            );

            const bucketIdentifier = bucket.displayName || bucket.bucketId || "Quota";
            const resetKey = bucket.resetTime || "ongoing";
            const dedupKey = `${email.toLowerCase()}:${bucketIdentifier}:${resetKey}`;

            if (remainingPercent <= this.config.thresholdPercent) {
                if (!this.notifiedDeduplicationKeys.has(dedupKey)) {
                    this.notifiedDeduplicationKeys.add(dedupKey);

                    const windowLabel = bucket.window || bucket.description || "Window";
                    const alertMsg = `Antigravity Quota Alert: ${bucketIdentifier} (${windowLabel}) is low (${remainingPercent}% remaining).`;

                    void vscode.window
                        .showWarningMessage(
                            alertMsg,
                            "Switch Account",
                            "View Details",
                            "Dismiss",
                        )
                        .then(selection => {
                            if (selection === "Switch Account") {
                                void vscode.commands.executeCommand(
                                    "boygr.antigravityAccountSwitcher.switchAccount",
                                );
                            } else if (selection === "View Details") {
                                void vscode.commands.executeCommand(
                                    "boygr.antigravityAccountSwitcher.accountsView.focus",
                                );
                            }
                        });
                }
            } else {
                // If quota is above threshold, clear previous deduplication key for this bucket
                this.notifiedDeduplicationKeys.delete(dedupKey);
            }
        }
    }

    public clearDeduplicationCache(): void {
        this.notifiedDeduplicationKeys.clear();
    }

    private sanitizeConfig(config: QuotaMonitorConfig): QuotaMonitorConfig {
        return {
            intervalMinutes:
                typeof config.intervalMinutes === "number" && config.intervalMinutes >= 0
                    ? config.intervalMinutes
                    : 5,
            reminderEnabled: config.reminderEnabled !== false,
            thresholdPercent:
                typeof config.thresholdPercent === "number" && config.thresholdPercent > 0
                    ? Math.min(100, config.thresholdPercent)
                    : 20,
        };
    }

    public dispose(): void {
        this.stop();
        this.notifiedDeduplicationKeys.clear();
    }
}

import * as vscode from "vscode";
import {
    AntigravityQuotaSummaryBucket,
    AntigravityQuotaSummarySnapshot,
    getAntigravityCurrentAccount,
    getAntigravityQuotaSummary,
} from "./hub-auth-client";
import { getManagedAccounts } from "./account-registry";
import {
    getAccountRemainingPercent,
    getManagedAccountUsageSnapshots,
    refreshExpiredManagedAccountUsageSnapshots,
    saveManagedAccountUsageSnapshot,
} from "./quota-summary-store";
import { recordUsageSnapshotIfAvailable } from "./quota-history-store";

export interface QuotaMonitorConfig {
    intervalMinutes: number;
    reminderEnabled: boolean;
    thresholdPercent: number;
    smartQuotaFallback?: boolean;
    notifyQuotaReset?: boolean;
    autoSwitchOnExhaustion?: boolean;
    autoRoundRobin?: boolean;
    enableQuotaAudio?: boolean;
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
    private resetAlarmTimers = new Map<string, NodeJS.Timeout>();
    private lastAutoRotationTime = 0;
    public onAudioChime?: (chime: "restored" | "warning") => Promise<void> | void;

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
            await recordUsageSnapshotIfAvailable(
                this.context,
                current.email,
                usage,
            );

            // Auto-replenish expired snapshots of saved accounts whose resetTime has arrived
            await refreshExpiredManagedAccountUsageSnapshots(
                this.context,
                current.email,
            ).catch(() => false);

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

            if (remainingPercent === 0) {
                const exhaustKey = `${email.toLowerCase()}:${bucketIdentifier}:exhausted:${resetKey}`;
                if (!this.notifiedDeduplicationKeys.has(exhaustKey)) {
                    this.notifiedDeduplicationKeys.add(exhaustKey);
                    if (this.config.autoSwitchOnExhaustion !== false) {
                        await this.handleQuotaExhaustion(email, bucketIdentifier, bucket);
                    }
                    if (bucket.resetTime) {
                        this.scheduleResetAlarm(email, bucketIdentifier, bucket.resetTime);
                    }
                }
            } else if (remainingPercent <= this.config.thresholdPercent) {
                if (!this.notifiedDeduplicationKeys.has(dedupKey)) {
                    this.notifiedDeduplicationKeys.add(dedupKey);

                    const windowLabel = bucket.window || bucket.description || "Window";
                    const isSmartFallbackEnabled = this.config.smartQuotaFallback !== false;

                    let bestCandidate: { email: string; label?: string; percent: number } | undefined;
                    if (isSmartFallbackEnabled) {
                        const savedAccounts = getManagedAccounts(this.context);
                        const usageSnapshots = getManagedAccountUsageSnapshots(this.context);
                        const otherAccounts = savedAccounts.filter(
                            acc => acc.email.toLowerCase() !== email.toLowerCase(),
                        );

                        let maxPercent = -1;
                        for (const candidate of otherAccounts) {
                            const candidatePercent = getAccountRemainingPercent(
                                usageSnapshots[candidate.email.toLowerCase()],
                            );
                            if (typeof candidatePercent === "number" && candidatePercent > remainingPercent) {
                                if (candidatePercent > maxPercent) {
                                    maxPercent = candidatePercent;
                                    bestCandidate = {
                                        email: candidate.email,
                                        label: candidate.label,
                                        percent: candidatePercent,
                                    };
                                }
                            }
                        }
                    }

                    if (this.config.enableQuotaAudio !== false && this.onAudioChime) {
                        void this.onAudioChime("warning");
                    }

                    if (bestCandidate) {
                        const candidateName = bestCandidate.label || bestCandidate.email;
                        const alertMsg = `Antigravity Quota Low: ${bucketIdentifier} (${windowLabel}) is at ${remainingPercent}%. Switch to ${candidateName} (${bestCandidate.percent}% quota)?`;
                        const switchBtn = `Switch to ${candidateName}`;

                        void vscode.window
                            .showWarningMessage(
                                alertMsg,
                                switchBtn,
                                "Choose Another",
                                "Dismiss",
                            )
                            .then(selection => {
                                if (selection === switchBtn) {
                                    void vscode.commands.executeCommand(
                                        "boygr.antigravityAccountSwitcher.switchAccount",
                                        {
                                            email: bestCandidate!.email,
                                            label: bestCandidate!.label,
                                        },
                                    );
                                } else if (selection === "Choose Another") {
                                    void vscode.commands.executeCommand(
                                        "boygr.antigravityAccountSwitcher.switchAccount",
                                    );
                                }
                            });
                    } else {
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

                    if (bucket.resetTime) {
                        this.scheduleResetAlarm(email, bucketIdentifier, bucket.resetTime);
                    }
                }
            } else {
                // If quota is above threshold, clear previous deduplication key for this bucket
                this.notifiedDeduplicationKeys.delete(dedupKey);
            }
        }
    }

    private async handleQuotaExhaustion(
        email: string,
        bucketIdentifier: string,
        bucket: AntigravityQuotaSummaryBucket,
    ): Promise<void> {
        const savedAccounts = getManagedAccounts(this.context);
        const usageSnapshots = getManagedAccountUsageSnapshots(this.context);
        const otherAccounts = savedAccounts.filter(
            acc => acc.email.toLowerCase() !== email.toLowerCase(),
        );

        let bestCandidate: { email: string; label?: string; percent: number } | undefined;
        let maxPercent = -1;
        for (const candidate of otherAccounts) {
            const candidatePercent = getAccountRemainingPercent(
                usageSnapshots[candidate.email.toLowerCase()],
            );
            if (typeof candidatePercent === "number" && candidatePercent > 0) {
                if (candidatePercent > maxPercent) {
                    maxPercent = candidatePercent;
                    bestCandidate = {
                        email: candidate.email,
                        label: candidate.label,
                        percent: candidatePercent,
                    };
                }
            }
        }

        const windowLabel = bucket.window || bucket.description || "current cycle";
        if (bestCandidate) {
            if (this.config.autoRoundRobin) {
                const now = Date.now();
                if (now - this.lastAutoRotationTime > 60000) {
                    this.lastAutoRotationTime = now;
                    await vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.switchAccount",
                        {
                            email: bestCandidate.email,
                            label: bestCandidate.label,
                        },
                    );
                    const candidateName = bestCandidate.label || bestCandidate.email;
                    void vscode.window.showInformationMessage(
                        `⚡ Auto-Round-Robin: Rotated Antigravity account to ${candidateName} (${bestCandidate.percent}% available).`,
                    );
                    if (this.config.enableQuotaAudio !== false && this.onAudioChime) {
                        void this.onAudioChime("warning");
                    }
                    return;
                }
            }
            const candidateName = bestCandidate.label || bestCandidate.email;
            const alertMsg = `⚡ Antigravity Rate Limit: Quota is exhausted (0%) for ${email}! Switch to ${candidateName} (${bestCandidate.percent}% available)?`;
            const switchBtn = `Switch Now (${candidateName})`;

            void vscode.window
                .showErrorMessage(
                    alertMsg,
                    switchBtn,
                    "Select Account",
                    "Dismiss",
                )
                .then(selection => {
                    if (selection === switchBtn) {
                        void vscode.commands.executeCommand(
                            "boygr.antigravityAccountSwitcher.switchAccount",
                            {
                                email: bestCandidate!.email,
                                label: bestCandidate!.label,
                            },
                        );
                    } else if (selection === "Select Account") {
                        void vscode.commands.executeCommand(
                            "boygr.antigravityAccountSwitcher.switchAccount",
                        );
                    }
                });
        } else {
            void vscode.window
                .showErrorMessage(
                    `⚡ Antigravity Rate Limit: ${bucketIdentifier} (${windowLabel}) is exhausted (0% remaining).`,
                    "Add Google Account",
                    "Dismiss",
                )
                .then(selection => {
                    if (selection === "Add Google Account") {
                        void vscode.commands.executeCommand(
                            "boygr.antigravityAccountSwitcher.addAccount",
                        );
                    }
                });
        }
    }

    private scheduleResetAlarm(
        email: string,
        bucketIdentifier: string,
        resetTimeStr: string,
    ): void {
        if (this.config.notifyQuotaReset === false) {
            return;
        }

        const resetMs = new Date(resetTimeStr).getTime();
        if (isNaN(resetMs)) {
            return;
        }

        const diffMs = resetMs - Date.now();
        const alarmKey = `${email.toLowerCase()}:${bucketIdentifier}:${resetTimeStr}`;

        if (this.resetAlarmTimers.has(alarmKey) || diffMs <= 0) {
            return;
        }

        // Delay timer until 2 seconds after reset
        const timerMs = Math.min(diffMs + 2000, 24 * 60 * 60 * 1000);

        const timer = setTimeout(async () => {
            this.resetAlarmTimers.delete(alarmKey);

            if (this.config.notifyQuotaReset === false) {
                return;
            }

            const current = await getAntigravityCurrentAccount().catch(() => undefined);
            const currentEmail = current?.email?.toLowerCase();
            const targetEmail = email.toLowerCase();

            const savedAccounts = getManagedAccounts(this.context);
            const targetAccount = savedAccounts.find(
                a => a.email.toLowerCase() === targetEmail,
            );
            const displayName = targetAccount?.label || targetAccount?.email || email;

            if (this.config.enableQuotaAudio !== false && this.onAudioChime) {
                void this.onAudioChime("restored");
            }

            if (currentEmail !== targetEmail) {
                const switchBtn = `Switch back to ${displayName}`;
                void vscode.window
                    .showInformationMessage(
                        `Antigravity Quota Restored: ${bucketIdentifier} for ${displayName} has reset! Switch back?`,
                        switchBtn,
                        "Dismiss",
                    )
                    .then(selection => {
                        if (selection === switchBtn) {
                            void vscode.commands.executeCommand(
                                "boygr.antigravityAccountSwitcher.switchAccount",
                                {
                                    email: targetAccount ? targetAccount.email : email,
                                    label: targetAccount?.label,
                                },
                            );
                        }
                    });
            } else {
                void vscode.window.showInformationMessage(
                    `Antigravity Quota Restored: ${bucketIdentifier} quota has refreshed.`,
                );
            }
        }, timerMs);

        this.resetAlarmTimers.set(alarmKey, timer);
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
            smartQuotaFallback: config.smartQuotaFallback !== false,
            notifyQuotaReset: config.notifyQuotaReset !== false,
            autoSwitchOnExhaustion: config.autoSwitchOnExhaustion !== false,
            autoRoundRobin: config.autoRoundRobin === true,
            enableQuotaAudio: config.enableQuotaAudio !== false,
        };
    }

    public dispose(): void {
        this.stop();
        this.notifiedDeduplicationKeys.clear();
        for (const timer of this.resetAlarmTimers.values()) {
            clearTimeout(timer);
        }
        this.resetAlarmTimers.clear();
    }
}

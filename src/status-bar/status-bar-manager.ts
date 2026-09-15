import * as vscode from "vscode";

import {
    AntigravityCurrentAccount,
    AntigravityQuotaSummaryBucket,
    AntigravityQuotaSummarySnapshot,
} from "../antigravity/hub-auth-client";

export type StatusBarDisplayFormat = "compact" | "detailed" | "percentageOnly";

export interface StatusBarSettings {
    show: boolean;
    format: StatusBarDisplayFormat;
}

export class AntigravityStatusBarManager implements vscode.Disposable {
    private readonly statusBarItem: vscode.StatusBarItem;
    private readonly disposables: vscode.Disposable[] = [];
    private lastAccount?: AntigravityCurrentAccount;
    private lastUsage?: AntigravityQuotaSummarySnapshot;
    private lastIsRunning = false;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100,
        );
        this.statusBarItem.command =
            "boygr.antigravityAccountSwitcher.statusBarMenu";


        this.disposables.push(this.statusBarItem);

        // Listen for configuration changes
        this.disposables.push(
            vscode.workspace.onDidChangeConfiguration((event) => {
                if (
                    event.affectsConfiguration(
                        "boygr.antigravityAccountSwitcher.showStatusBarItem",
                    ) ||
                    event.affectsConfiguration(
                        "boygr.antigravityAccountSwitcher.statusBarFormat",
                    )
                ) {
                    this.render();
                }
            }),
        );

        this.render();
    }

    public update(
        account?: AntigravityCurrentAccount,
        usage?: AntigravityQuotaSummarySnapshot,
        isRunning = true,
    ): void {
        this.lastAccount = account;
        this.lastUsage = usage;
        this.lastIsRunning = isRunning;
        this.render();
    }

    public dispose(): void {
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
        this.disposables.length = 0;
    }

    private getSettings(): StatusBarSettings {
        const config = vscode.workspace.getConfiguration(
            "boygr.antigravityAccountSwitcher",
        );
        const show = config.get<boolean>("showStatusBarItem", true);
        const format = config.get<StatusBarDisplayFormat>(
            "statusBarFormat",
            "compact",
        );
        return { show, format };
    }

    private findPrimaryBucket(
        usage?: AntigravityQuotaSummarySnapshot,
    ): AntigravityQuotaSummaryBucket | undefined {
        if (!usage || !usage.buckets || usage.buckets.length === 0) {
            return undefined;
        }

        // Look for 5-hour limit bucket first as it's the primary fast-cycle limit
        const fiveHourBucket = usage.buckets.find(
            (b) =>
                !b.disabled &&
                (b.window?.toLowerCase().includes("5") ||
                    b.displayName?.toLowerCase().includes("5-hour") ||
                    b.description?.toLowerCase().includes("5-hour")),
        );

        if (fiveHourBucket) {
            return fiveHourBucket;
        }

        // Fallback to first non-disabled bucket with valid remainingFraction
        return usage.buckets.find(
            (b) => !b.disabled && typeof b.remainingFraction === "number",
        );
    }

    private formatCountdown(resetTime?: string): string | undefined {
        if (!resetTime) {
            return undefined;
        }

        const due = new Date(resetTime).getTime();
        if (Number.isNaN(due)) {
            return undefined;
        }

        const diffMs = due - Date.now();
        if (diffMs <= 0) {
            return "resetting";
        }

        const diffMinutes = Math.ceil(diffMs / (60 * 1000));
        if (diffMinutes < 60) {
            return `${diffMinutes}m`;
        }

        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    private render(): void {
        const settings = this.getSettings();

        if (!settings.show) {
            this.statusBarItem.hide();
            return;
        }

        if (!this.lastIsRunning) {
            this.statusBarItem.text = "$(account) Antigravity Account Switcher: Offline";
            this.statusBarItem.tooltip =
                "Antigravity Hub is not running. Click to open Antigravity Account Switcher in Activity Bar.";
            this.statusBarItem.backgroundColor = undefined;
            this.statusBarItem.show();
            return;
        }

        if (!this.lastAccount || !this.lastAccount.email) {
            this.statusBarItem.text = "$(account) Antigravity Account Switcher: No Account";
            this.statusBarItem.tooltip =
                "No active Google account detected in Antigravity. Click to open Antigravity Account Switcher in Activity Bar.";
            this.statusBarItem.backgroundColor = undefined;
            this.statusBarItem.show();
            return;
        }

        const primaryBucket = this.findPrimaryBucket(this.lastUsage);
        let pct: number | undefined;
        let countdownStr: string | undefined;

        if (
            primaryBucket &&
            typeof primaryBucket.remainingFraction === "number"
        ) {
            pct = Math.max(
                0,
                Math.min(
                    100,
                    Math.round(primaryBucket.remainingFraction * 100),
                ),
            );
            countdownStr = this.formatCountdown(primaryBucket.resetTime);
        }

        // 1. Determine Display Text based on format
        if (pct !== undefined) {
            switch (settings.format) {
                case "percentageOnly":
                    this.statusBarItem.text = `$(account) ${pct}%`;
                    break;
                case "detailed":
                    this.statusBarItem.text = countdownStr
                        ? `$(account) Antigravity Account Switcher: ${pct}% (${countdownStr})`
                        : `$(account) Antigravity Account Switcher: ${pct}%`;
                    break;
                case "compact":
                default:
                    this.statusBarItem.text = `$(account) Antigravity Account Switcher: ${pct}%`;
                    break;
            }
        } else {
            this.statusBarItem.text = "$(account) Antigravity Account Switcher: Active";
        }

        // 2. Dynamic Warning / Error Background
        if (pct !== undefined) {
            if (pct <= 10) {
                this.statusBarItem.backgroundColor = new vscode.ThemeColor(
                    "statusBarItem.errorBackground",
                );
            } else if (pct <= 20) {
                this.statusBarItem.backgroundColor = new vscode.ThemeColor(
                    "statusBarItem.warningBackground",
                );
            } else {
                this.statusBarItem.backgroundColor = undefined;
            }
        } else {
            this.statusBarItem.backgroundColor = undefined;
        }

        // 3. Rich Markdown Tooltip
        const md = new vscode.MarkdownString("", true);
        md.isTrusted = true;
        md.supportHtml = true;

        const displayName =
            this.lastAccount.displayName ||
            this.lastAccount.email.split("@")[0] ||
            "Antigravity User";

        md.appendMarkdown(`### Antigravity Account Switcher\n\n`);
        md.appendMarkdown(
            `**Active Account:** ${displayName} (\`${this.lastAccount.email}\`)\n\n`,
        );

        if (this.lastUsage && this.lastUsage.buckets.length > 0) {
            md.appendMarkdown(`---\n\n`);
            for (const b of this.lastUsage.buckets) {
                if (b.disabled) {
                    continue;
                }
                const name = b.displayName || b.window || "Quota";
                const fraction =
                    typeof b.remainingFraction === "number"
                        ? `${Math.round(b.remainingFraction * 100)}%`
                        : "N/A";
                const reset = this.formatCountdown(b.resetTime);
                const resetText = reset ? ` *(resets in ${reset})*` : "";
                md.appendMarkdown(
                    `- **${name}:** **${fraction}** remaining${resetText}\n`,
                );
            }
            md.appendMarkdown(`\n`);
        }

        md.appendMarkdown(
            `*Click to switch accounts or view quota options.*`,
        );


        this.statusBarItem.tooltip = md;
        this.statusBarItem.show();
    }
}

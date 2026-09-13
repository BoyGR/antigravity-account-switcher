import * as vscode from "vscode";
import { getManagedAccounts } from "../antigravity/account-registry";
import { getAllAccountsQuotaHistory } from "../antigravity/quota-history-store";

export const EXPORT_ANALYTICS_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.exportQuotaAnalytics";

export function registerExportAnalyticsCommand(
    context: vscode.ExtensionContext,
): vscode.Disposable {
    return vscode.commands.registerCommand(
        EXPORT_ANALYTICS_COMMAND_ID,
        async () => {
            try {
                const history = getAllAccountsQuotaHistory(context, 30);
                const accounts = getManagedAccounts(context);
                const accountMap = new Map(accounts.map(a => [a.email.toLowerCase(), a]));

                const entries: Array<{
                    email: string;
                    label: string;
                    group: string;
                    date: string;
                    lowestRemainingPercent: number;
                    timestamp: string;
                }> = [];

                for (const [email, records] of Object.entries(history)) {
                    const acc = accountMap.get(email.toLowerCase());
                    const label = acc?.label || "";
                    const group = acc?.group || "";
                    for (const r of records) {
                        entries.push({
                            email,
                            label,
                            group,
                            date: r.date,
                            lowestRemainingPercent: r.lowestRemainingPercent,
                            timestamp: new Date(r.timestamp).toISOString(),
                        });
                    }
                }

                if (entries.length === 0) {
                    void vscode.window.showInformationMessage(
                        "No quota history recorded yet. Quota history builds up automatically as you use Antigravity.",
                    );
                    return;
                }

                // Sort descending by date
                entries.sort((a, b) => b.date.localeCompare(a.date));

                const formatChoice = await vscode.window.showQuickPick(
                    [
                        {
                            label: "CSV (Comma-Separated Values)",
                            description: "Best for Excel, Google Sheets, or data analysis",
                            format: "csv",
                        },
                        {
                            label: "JSON (JavaScript Object Notation)",
                            description: "Structured raw data format",
                            format: "json",
                        },
                    ],
                    {
                        placeHolder: "Select export format for Quota Analytics",
                    },
                );

                if (!formatChoice) {
                    return;
                }

                const todayStr = new Date().toISOString().slice(0, 10);
                const defaultName = `antigravity-quota-analytics-${todayStr}.${formatChoice.format}`;

                const destination = await vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file(defaultName),
                    filters:
                        formatChoice.format === "csv"
                            ? { "CSV Files": ["csv"] }
                            : { "JSON Files": ["json"] },
                    saveLabel: "Export Analytics",
                    title: "Export Antigravity Quota Analytics",
                });

                if (!destination) {
                    return;
                }

                let fileContent: string;
                if (formatChoice.format === "csv") {
                    const header = "Date,Email,Label,Group,LowestRemainingPercent,RecordedAt\n";
                    const rows = entries.map(e =>
                        `"${e.date}","${e.email}","${e.label.replace(/"/g, '""')}","${e.group.replace(/"/g, '""')}",${e.lowestRemainingPercent},"${e.timestamp}"`,
                    );
                    fileContent = header + rows.join("\n");
                } else {
                    fileContent = JSON.stringify(
                        {
                            schema: "boygr.antigravity.analytics.v1",
                            exportedAt: new Date().toISOString(),
                            totalRecords: entries.length,
                            history: entries,
                        },
                        null,
                        2,
                    );
                }

                await vscode.workspace.fs.writeFile(
                    destination,
                    new TextEncoder().encode(fileContent),
                );

                void vscode.window.showInformationMessage(
                    `Successfully exported ${entries.length} quota analytics record(s) to ${destination.fsPath}.`,
                );
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                void vscode.window.showErrorMessage(
                    `Failed to export quota analytics: ${msg}`,
                );
            }
        },
    );
}


import * as vscode from "vscode";
import {
    getManagedAccounts,
    importManagedAccounts,
} from "../antigravity/account-registry";

export const EXPORT_ACCOUNTS_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.exportAccounts";

export const IMPORT_ACCOUNTS_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.importAccounts";

interface AccountsBackupPayload {
    schema: string;
    version: number;
    exportedAt: string;
    accounts: Array<{
        email: string;
        label?: string;
        displayName?: string;
        colorTag?: string;
        group?: string;
        plan?: string;
        g1Tier?: string;
        isPro?: boolean;
        firstSeenAt?: string;
        lastSeenAt?: string;
    }>;
}

export function registerBackupAccountsCommands(
    context: vscode.ExtensionContext,
    onAccountsUpdated?: () => Promise<void> | void,
): vscode.Disposable[] {
    const exportDisposable = vscode.commands.registerCommand(
        EXPORT_ACCOUNTS_COMMAND_ID,
        async () => {
            try {
                const accounts = getManagedAccounts(context);
                if (accounts.length === 0) {
                    void vscode.window.showInformationMessage(
                        "No saved Antigravity accounts to export.",
                    );
                    return;
                }

                const defaultFileName = `antigravity-accounts-backup-${new Date().toISOString().slice(0, 10)}.json`;
                const destination = await vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file(defaultFileName),
                    filters: {
                        "JSON Files": ["json"],
                    },
                    saveLabel: "Export Accounts",
                    title: "Export Antigravity Saved Accounts",
                });

                if (!destination) {
                    return;
                }

                const payload: AccountsBackupPayload = {
                    schema: "boygr.antigravity.accounts.backup.v1",
                    version: 1,
                    exportedAt: new Date().toISOString(),
                    accounts: accounts.map(a => ({
                        email: a.email,
                        label: a.label,
                        displayName: a.displayName,
                        colorTag: a.colorTag,
                        group: a.group,
                        plan: a.plan,
                        g1Tier: a.g1Tier,
                        isPro: a.isPro,
                        firstSeenAt: a.firstSeenAt,
                        lastSeenAt: a.lastSeenAt,
                    })),
                };

                const content = new TextEncoder().encode(
                    JSON.stringify(payload, null, 2),
                );

                await vscode.workspace.fs.writeFile(destination, content);

                void vscode.window.showInformationMessage(
                    `Exported ${accounts.length} Antigravity account(s) to ${destination.fsPath}.`,
                );
            } catch (error) {
                const msg =
                    error instanceof Error ? error.message : String(error);
                void vscode.window.showErrorMessage(
                    `Failed to export accounts: ${msg}`,
                );
            }
        },
    );

    const importDisposable = vscode.commands.registerCommand(
        IMPORT_ACCOUNTS_COMMAND_ID,
        async () => {
            try {
                const selected = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        "JSON Files": ["json"],
                    },
                    openLabel: "Import Accounts",
                    title: "Import Antigravity Saved Accounts",
                });

                if (!selected || selected.length === 0) {
                    return;
                }

                const fileUri = selected[0];
                const rawBytes = await vscode.workspace.fs.readFile(fileUri);
                const text = new TextDecoder("utf-8").decode(rawBytes);

                let parsed: unknown;
                try {
                    parsed = JSON.parse(text);
                } catch {
                    throw new Error("The selected file is not valid JSON.");
                }

                let accountsList: Array<{
                    email: string;
                    label?: string;
                    displayName?: string;
                    colorTag?: string;
                    group?: string;
                    plan?: string;
                    g1Tier?: string;
                    isPro?: boolean;
                    firstSeenAt?: string;
                    lastSeenAt?: string;
                }> = [];

                if (Array.isArray(parsed)) {
                    accountsList = parsed;
                } else if (
                    parsed &&
                    typeof parsed === "object" &&
                    "accounts" in parsed &&
                    Array.isArray((parsed as AccountsBackupPayload).accounts)
                ) {
                    accountsList = (parsed as AccountsBackupPayload).accounts;
                } else {
                    throw new Error(
                        "Invalid backup format: Expected a JSON object with an 'accounts' array or an array of accounts.",
                    );
                }

                if (accountsList.length === 0) {
                    void vscode.window.showWarningMessage(
                        "No accounts found in the selected file to import.",
                    );
                    return;
                }

                const result = await importManagedAccounts(
                    context,
                    accountsList,
                );

                if (onAccountsUpdated) {
                    await onAccountsUpdated();
                }

                void vscode.window.showInformationMessage(
                    `Imported ${result.added + result.updated} Antigravity account(s) (${result.added} added, ${result.updated} updated).`,
                );
            } catch (error) {
                const msg =
                    error instanceof Error ? error.message : String(error);
                void vscode.window.showErrorMessage(
                    `Failed to import accounts: ${msg}`,
                );
            }
        },
    );

    return [exportDisposable, importDisposable];
}


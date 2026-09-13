import * as vscode from "vscode";

import {
    switchAntigravityAccount,
} from "../antigravity/account-switcher";
import { getManagedAccounts } from "../antigravity/account-registry";
import { getAntigravityCurrentAccount } from "../antigravity/hub-auth-client";
import { syncAntigravityUi } from "../antigravity/ui-sync";

export const SWITCH_ACCOUNT_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.switchAccount";

export interface SwitchAccountCommandArgument {
    email: string;
    label?: string;
}

function getDisplayName(
    argument: SwitchAccountCommandArgument,
): string {
    const label = argument.label?.trim();

    if (label) {
        return `${label} (${argument.email})`;
    }

    return argument.email;
}

export function registerSwitchAccountCommand(
    context: vscode.ExtensionContext,
): void {
    const disposable =
        vscode.commands.registerCommand(
            SWITCH_ACCOUNT_COMMAND_ID,
            async (
                argument?: SwitchAccountCommandArgument,
            ) => {
                try {
                    let targetAccount = argument;

                    if (
                        !targetAccount ||
                        typeof targetAccount.email !== "string" ||
                        !targetAccount.email.trim()
                    ) {
                        const savedAccounts = getManagedAccounts(context);
                        if (savedAccounts.length === 0) {
                            vscode.window.showInformationMessage(
                                "No saved Antigravity accounts found. Use 'Add / Switch Google Account' first.",
                            );
                            return;
                        }

                        const currentAccount = await getAntigravityCurrentAccount().catch(() => undefined);
                        const items = savedAccounts.map(account => {
                            const isCurrent =
                                currentAccount?.email?.toLowerCase() === account.email.toLowerCase();
                            return {
                                label: account.label
                                    ? `${account.label} (${account.email})`
                                    : account.email,
                                description: isCurrent ? "(Active)" : undefined,
                                account: {
                                    email: account.email,
                                    label: account.label,
                                },
                            };
                        });

                        const selected = await vscode.window.showQuickPick(items, {
                            placeHolder: "Select an Antigravity account to switch to",
                        });

                        if (!selected) {
                            return;
                        }

                        targetAccount = selected.account;
                    }

                    const targetEmail =
                        targetAccount.email.trim();

                    const displayName =
                        getDisplayName({
                            ...targetAccount,
                            email: targetEmail,
                        });

                    const confirmation =
                        await vscode.window.showWarningMessage(
                            `Switch Antigravity account to ${displayName}?`,
                            {
                                modal: true,
                                detail:
                                    "Antigravity's official Google account chooser will open. " +
                                    `Select ${targetEmail} to complete the switch.`,
                            },
                            "Switch Account",
                        );

                    if (confirmation !== "Switch Account") {
                        return;
                    }

                    const result =
                        await switchAntigravityAccount(
                            targetEmail,
                        );

                    if (!result.verified) {
                        throw new Error(
                            `The account switch to ${targetEmail} could not be verified.`,
                        );
                    }

                    const syncResult = await syncAntigravityUi();

                    if (!result.changed) {
                        vscode.window.showInformationMessage(
                            `${displayName} is already the active Antigravity account.`,
                        );
                    } else if (syncResult.syncedOfficialPanel) {
                        vscode.window.showInformationMessage(
                            `Antigravity switched to ${displayName}.`,
                        );
                    } else {
                        const choice =
                            await vscode.window.showInformationMessage(
                                `Antigravity switched to ${displayName}. Reload window to update the official Antigravity panel?`,
                                "Reload Window",
                                "Later",
                            );

                        if (choice === "Reload Window") {
                            await vscode.commands.executeCommand(
                                "workbench.action.reloadWindow",
                            );
                        }
                    }
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    vscode.window.showErrorMessage(
                        `Antigravity Account Switcher: ${message}`,
                    );

                    try {
                        await syncAntigravityUi();
                    } catch {
                        // Safely ignore secondary sync issues on failure path
                    }
                }
            },
        );

    context.subscriptions.push(disposable);
}

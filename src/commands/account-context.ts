import * as vscode from "vscode";

import {
    ManagedAntigravityAccount,
    removeManagedAccount,
    updateManagedAccountLabel,
} from "../antigravity/account-registry";

export const EDIT_ACCOUNT_LABEL_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.editAccountLabel";

export const REMOVE_SAVED_ACCOUNT_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.removeSavedAccount";

interface AccountTreeCommandArgument {
    account?: ManagedAntigravityAccount;
}

function getAccount(
    argument?: AccountTreeCommandArgument,
): ManagedAntigravityAccount {
    const account = argument?.account;

    if (!account?.email?.trim()) {
        throw new Error(
            "No saved Antigravity account was provided.",
        );
    }

    return account;
}

export function registerAccountContextCommands(
    context: vscode.ExtensionContext,
): void {
    const editLabel =
        vscode.commands.registerCommand(
            EDIT_ACCOUNT_LABEL_COMMAND_ID,
            async (
                argument?: AccountTreeCommandArgument,
            ) => {
                try {
                    const account =
                        getAccount(argument);

                    const label =
                        await vscode.window.showInputBox({
                            title:
                                `Edit Label — ${account.email}`,
                            prompt:
                                "Local label only. Leave empty to remove the label.",
                            value:
                                account.label || "",
                            placeHolder:
                                "Personal, Work, Account A, etc.",
                            ignoreFocusOut:
                                true,
                        });

                    if (label === undefined) {
                        return;
                    }

                    const updated =
                        await updateManagedAccountLabel(
                            context,
                            account.email,
                            label,
                        );

                    vscode.window.showInformationMessage(
                        updated.label
                            ? `Account label changed to "${updated.label}".`
                            : `Local label removed from ${updated.email}.`,
                    );

                    await vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.refreshAccountsView",
                    );
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    vscode.window.showErrorMessage(
                        `Antigravity Account Switcher: ${message}`,
                    );
                }
            },
        );

    const removeAccount =
        vscode.commands.registerCommand(
            REMOVE_SAVED_ACCOUNT_COMMAND_ID,
            async (
                argument?: AccountTreeCommandArgument,
            ) => {
                try {
                    const account =
                        getAccount(argument);

                    const confirmation =
                        await vscode.window.showWarningMessage(
                            `Remove ${account.email} from Saved Accounts?`,
                            {
                                modal: true,
                                detail:
                                    "This removes only local Antigravity Account Switcher metadata. " +
                                    "It does not sign out, change the active account, or delete Google credentials.",
                            },
                            "Remove",
                        );

                    if (confirmation !== "Remove") {
                        return;
                    }

                    const removed =
                        await removeManagedAccount(
                            context,
                            account.email,
                        );

                    if (removed) {
                        vscode.window.showInformationMessage(
                            `Removed ${account.email} from Saved Accounts.`,
                        );
                    } else {
                        vscode.window.showInformationMessage(
                            `${account.email} was not present in Saved Accounts.`,
                        );
                    }

                    await vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.refreshAccountsView",
                    );
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    vscode.window.showErrorMessage(
                        `Antigravity Account Switcher: ${message}`,
                    );
                }
            },
        );

    context.subscriptions.push(
        editLabel,
        removeAccount,
    );
}

import * as vscode from "vscode";

import {
    switchAntigravityAccount,
} from "../antigravity/account-switcher";

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
                    if (
                        !argument ||
                        typeof argument.email !== "string" ||
                        !argument.email.trim()
                    ) {
                        throw new Error(
                            "No target Antigravity account was provided.",
                        );
                    }

                    const targetEmail =
                        argument.email.trim();

                    const displayName =
                        getDisplayName({
                            ...argument,
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

                    if (!result.changed) {
                        vscode.window.showInformationMessage(
                            `${displayName} is already the active Antigravity account.`,
                        );
                    } else {
                        vscode.window.showInformationMessage(
                            `Antigravity switched to ${displayName}.`,
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

                    await vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.refreshAccountsView",
                    );
                }
            },
        );

    context.subscriptions.push(disposable);
}

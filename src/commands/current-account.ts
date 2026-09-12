import * as vscode from "vscode";

import {
    getAntigravityCurrentAccount,
} from "../antigravity/hub-auth-client";

import {
    findManagedAccount,
} from "../antigravity/account-registry";

const COMMAND_ID =
    "boygr.antigravityAccountSwitcher.currentAccount";

export function registerCurrentAccountCommand(
    context: vscode.ExtensionContext,
): void {
    const disposable =
        vscode.commands.registerCommand(
            COMMAND_ID,
            async () => {
                try {
                    const current =
                        await getAntigravityCurrentAccount();

                    const managed =
                        findManagedAccount(
                            context,
                            current.email,
                        );

                    const label =
                        managed?.label || "Not saved";

                    const lines = [
                        `Account: ${current.email}`,
                        `Label: ${label}`,
                    ];

                    if (current.displayName) {
                        lines.push(
                            `Name: ${current.displayName}`,
                        );
                    }

                    await vscode.window.showInformationMessage(
                        lines.join(" | "),
                    );
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    vscode.window.showErrorMessage(
                        `Antigravity Account Switcher current account failed: ${message}`,
                    );
                }
            },
        );

    context.subscriptions.push(disposable);
}

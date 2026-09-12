import * as vscode from "vscode";

import {
    getAntigravityCurrentAccount,
} from "../antigravity/hub-auth-client";

import {
    findManagedAccount,
    saveCurrentAccountMetadata,
} from "../antigravity/account-registry";

const COMMAND_ID =
    "boygr.antigravityAccountSwitcher.saveCurrentAccount";

export function registerSaveCurrentAccountCommand(
    context: vscode.ExtensionContext,
): void {
    const disposable =
        vscode.commands.registerCommand(
            COMMAND_ID,
            async () => {
                try {
                    const current =
                        await getAntigravityCurrentAccount();

                    const existing =
                        findManagedAccount(
                            context,
                            current.email,
                        );

                    const label =
                        await vscode.window.showInputBox({
                            title:
                                "Save Antigravity Account",
                            prompt:
                                "Optional local label for this account",
                            value:
                                existing?.label || "",
                            placeHolder:
                                "Personal, Work, Client, etc.",
                            ignoreFocusOut: true,
                        });

                    if (label === undefined) {
                        return;
                    }

                    const saved =
                        await saveCurrentAccountMetadata(
                            context,
                            current,
                            label,
                        );

                    const display =
                        saved.label
                            ? `${saved.label} (${saved.email})`
                            : saved.email;

                    vscode.window.showInformationMessage(
                        `Saved Antigravity account: ${display}`,
                    );
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    vscode.window.showErrorMessage(
                        `BoyGR AG save account failed: ${message}`,
                    );
                }
            },
        );

    context.subscriptions.push(disposable);
}

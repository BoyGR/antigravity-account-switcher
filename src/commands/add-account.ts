import * as vscode from "vscode";

import {
    addOrSwitchGoogleAccount,
} from "./manage-accounts";
import { TokenVaultService } from "../antigravity/token-vault-service";

export const ADD_ACCOUNT_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.addAccount";

export function registerAddAccountCommand(
    context: vscode.ExtensionContext,
    tokenVault?: TokenVaultService,
): void {
    const disposable =
        vscode.commands.registerCommand(
            ADD_ACCOUNT_COMMAND_ID,
            async () => {
                try {
                    await addOrSwitchGoogleAccount(
                        context,
                        tokenVault,
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

                    await vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.refreshAccountsView",
                    );
                }
            },
        );

    context.subscriptions.push(disposable);
}

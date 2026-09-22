import * as vscode from "vscode";
import { TokenVaultService } from "../antigravity/token-vault-service";

export const CLEAR_TOKEN_VAULT_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.clearTokenVault";

export function registerTokenVaultCommands(
    context: vscode.ExtensionContext,
    tokenVault: TokenVaultService,
    onVaultChanged?: () => Promise<void> | void,
): vscode.Disposable[] {
    const clearDisposable = vscode.commands.registerCommand(
        CLEAR_TOKEN_VAULT_COMMAND_ID,
        async (options?: { skipConfirm?: boolean }) => {
            const emails = await tokenVault.getVaultedEmails();
            if (emails.length === 0) {
                vscode.window.showInformationMessage(
                    "Token Vault is currently empty. No cached credentials to clear.",
                );
                return;
            }

            if (!options?.skipConfirm) {
                const confirm = await vscode.window.showWarningMessage(
                    `Are you sure you want to clear ${emails.length} cached account token(s) from Token Vault? Next account switches will require browser login.`,
                    { modal: true },
                    "Clear Token Vault",
                );

                if (confirm !== "Clear Token Vault") {
                    return;
                }
            }

            await tokenVault.clearAllCredentials();

            if (onVaultChanged) {
                await onVaultChanged();
            }

            vscode.window.showInformationMessage(
                "All account credentials have been securely cleared from Token Vault.",
            );
        },
    );

    context.subscriptions.push(clearDisposable);
    return [clearDisposable];
}


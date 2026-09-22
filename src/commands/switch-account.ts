import * as vscode from "vscode";

import {
    switchAntigravityAccount,
} from "../antigravity/account-switcher";
import { getManagedAccounts } from "../antigravity/account-registry";
import { getAntigravityCurrentAccount } from "../antigravity/hub-auth-client";
import { syncAntigravityUi } from "../antigravity/ui-sync";
import { TokenVaultService } from "../antigravity/token-vault-service";
import { Logger } from "../antigravity/logger";

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
    tokenVault?: TokenVaultService,
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
                        const items = await Promise.all(savedAccounts.map(async account => {
                            const isCurrent =
                                currentAccount?.email?.toLowerCase() === account.email.toLowerCase();
                            const isVaulted = tokenVault
                                ? await tokenVault.hasCredential(account.email).catch(() => false)
                                : false;
                            return {
                                label: account.label
                                    ? `${account.label} (${account.email})`
                                    : account.email,
                                description: [
                                    isCurrent ? "(Active)" : undefined,
                                    isVaulted ? "Instant" : undefined,
                                ].filter(Boolean).join(" · ") || undefined,
                                account: {
                                    email: account.email,
                                    label: account.label,
                                },
                            };
                        }));

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

                    const config = vscode.workspace.getConfiguration("boygr.antigravityAccountSwitcher");
                    const enableInstantSwitch = config.get<boolean>("enableInstantSwitch", true);

                    const isVaulted = tokenVault
                        ? await tokenVault.hasCredential(targetEmail).catch(() => false)
                        : false;

                    const canInstantSwitch =
                        isVaulted &&
                        enableInstantSwitch &&
                        tokenVault?.isSupported() === true;

                    // If NOT instant switch, inform user that official browser chooser will open
                    if (!canInstantSwitch) {
                        const confirmation =
                            await vscode.window.showWarningMessage(
                                `Switch Antigravity account to ${displayName}?`,
                                {
                                    modal: true,
                                    detail:
                                        "Antigravity's official Google account chooser will open. " +
                                        `Select ${targetEmail} to complete the switch. ` +
                                        "Once verified, future switches to this account will be instant without browser login.",
                                },
                                "Switch Account",
                            );

                        if (confirmation !== "Switch Account") {
                            return;
                        }
                    }

                    Logger.info(`Switching account to: ${displayName} (canInstantSwitch: ${canInstantSwitch})`);

                    const result = await vscode.window.withProgress(
                        {
                            location: vscode.ProgressLocation.Notification,
                            title: canInstantSwitch
                                ? `Switching to ${displayName} instantly...`
                                : `Switching to ${displayName}...`,
                            cancellable: false,
                        },
                        async () => {
                            return await switchAntigravityAccount(
                                targetEmail,
                                {
                                    tokenVault,
                                    enableInstantSwitch,
                                    extensionContext: context,
                                },
                            );
                        },
                    );

                    if (!result.verified) {
                        Logger.error(`Account switch to ${targetEmail} could not be verified.`);
                        throw new Error(
                            `The account switch to ${targetEmail} could not be verified.`,
                        );
                    }

                    Logger.info(`Account switch verified. Syncing UI... (changed: ${result.changed}, swappedInstantly: ${result.swappedInstantly})`);
                    const syncResult = await syncAntigravityUi();

                    if (!result.changed) {
                        vscode.window.showInformationMessage(
                            `${displayName} is already the active Antigravity account.`,
                        );
                    } else if (result.requiresReload) {
                        const choice =
                            await vscode.window.showInformationMessage(
                                `Antigravity switched to ${displayName}. Reload window now to activate the account?`,
                                "Reload Window",
                                "Later",
                            );

                        if (choice === "Reload Window") {
                            await vscode.commands.executeCommand(
                                "workbench.action.reloadWindow",
                            );
                        }
                    } else if (result.swappedInstantly) {
                        vscode.window.showInformationMessage(
                            `Antigravity switched to ${displayName} instantly (no browser login).`,
                        );
                    } else if (syncResult.syncedOfficialPanel) {
                        vscode.window.showInformationMessage(
                            `Antigravity switched to ${displayName}. Saved to Token Vault for instant switching.`,
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

                    Logger.error(`Error during account switch: ${message}`, error);

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

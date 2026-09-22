import * as vscode from "vscode";

import {
    getAntigravityCurrentAccount,
} from "../antigravity/hub-auth-client";

import {
    reauthenticateAndDetectAccount,
} from "../antigravity/account-switcher";

import {
    ManagedAntigravityAccount,
    findManagedAccount,
    getManagedAccounts,
    removeManagedAccount,
    saveCurrentAccountMetadata,
    updateManagedAccountLabel,
} from "../antigravity/account-registry";

import { TokenVaultService } from "../antigravity/token-vault-service";
import { OAuthService } from "../antigravity/oauth-service";
import { IdeStateService } from "../antigravity/ide-state-service";
import { AntigravityAccountWebviewProvider } from "../views/account-webview-provider";
import { Logger } from "../antigravity/logger";

const COMMAND_ID =
    "boygr.antigravityAccountSwitcher.manageAccounts";

interface AccountQuickPickItem
    extends vscode.QuickPickItem {
    action:
        | "account"
        | "add-account"
        | "save-current"
        | "refresh";

    account?: ManagedAntigravityAccount;
}

interface AccountActionQuickPickItem
    extends vscode.QuickPickItem {
    action:
        | "switch"
        | "rename"
        | "remove"
        | "close";
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function accountTitle(
    account: ManagedAntigravityAccount,
): string {
    return (
        account.label?.trim() ||
        account.email
    );
}

async function saveDetectedAccount(
    context: vscode.ExtensionContext,
    email: string,
    displayName?: string,
): Promise<boolean> {
    const existing =
        findManagedAccount(
            context,
            email,
        );

    if (existing) {
        await saveCurrentAccountMetadata(
            context,
            {
                email,
                displayName,
            },
            existing.label,
        );

        vscode.window.showInformationMessage(
            `${accountTitle(existing)} is active.`,
        );

        return true;
    }

    const save =
        await vscode.window.showInformationMessage(
            `Antigravity is now authenticated as ${email}. Save this account?`,
            {
                modal:
                    true,

                detail:
                    "Antigravity Account Switcher stores only non-secret account metadata. " +
                    "Google credentials, tokens, cookies and CSRF values are not stored.",
            },
            "Save Account",
            "Not Now",
        );

    if (save !== "Save Account") {
        return false;
    }

    const label =
        await vscode.window.showInputBox({
            title:
                "Save Antigravity Account",

            prompt:
                `Optional local label for ${email}`,

            placeHolder:
                "Personal, Work, Account A, etc.",

            ignoreFocusOut:
                true,
        });

    if (label === undefined) {
        return false;
    }

    const saved =
        await saveCurrentAccountMetadata(
            context,
            {
                email,
                displayName,
            },
            label,
        );

    vscode.window.showInformationMessage(
        saved.label
            ? `Saved ${saved.label} (${saved.email}).`
            : `Saved ${saved.email}.`,
    );

    return true;
}

export async function addOrSwitchGoogleAccount(
    context: vscode.ExtensionContext,
    tokenVault?: TokenVaultService,
): Promise<void> {
    let currentEmail = "";
    try {
        const current = await getAntigravityCurrentAccount();
        currentEmail = normalizeEmail(current.email);
    } catch {
        // Safe fallback if not signed in yet
    }

    const detailText = currentEmail
        ? `Currently signed in as: ${currentEmail}\n\nA browser window will open to sign in with Google. You can select any Google account to add.`
        : "A browser window will open to sign in with Google. You can select any Google account to add.";

    const confirmation = await vscode.window.showInformationMessage(
        "Add Antigravity Google Account",
        {
            modal: true,
            detail: detailText,
        },
        "Sign In with Google",
    );

    if (confirmation !== "Sign In with Google") {
        return;
    }

    try {
        const result = await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Antigravity Google Sign-In",
                cancellable: true,
            },
            async (progress, token) => {
                progress.report({
                    message: "Waiting for Google sign-in in browser...",
                });

                return await OAuthService.login({ cancellationToken: token });
            },
        );

        const newEmail = normalizeEmail(result.profile.email);
        const displayName = result.profile.name;
        const profilePictureUrl = result.profile.picture;

        // 1. Save metadata into account registry
        const existing = findManagedAccount(context, newEmail);
        await saveCurrentAccountMetadata(
            context,
            {
                email: newEmail,
                displayName,
                profilePictureUrl,
            },
            existing?.label,
        );

        // 2. Save tokens directly to Token Vault (encrypted SecretStorage + state.vscdb entries)
        if (tokenVault?.isSupported()) {
            await tokenVault.saveAccountOAuthTokens(
                newEmail,
                {
                    accessToken: result.tokens.accessToken,
                    refreshToken: result.tokens.refreshToken,
                    expiresIn: result.tokens.expiresIn,
                    idToken: result.tokens.idToken,
                },
                profilePictureUrl,
                context,
            );
        }

        // 3. Immediately refresh views so newly added account appears in Saved Accounts right away
        await vscode.commands
            .executeCommand("boygr.antigravityAccountSwitcher.refreshAccountsView")
            .then(undefined, () => {});

        Logger.info(`Account ${newEmail} successfully registered and vaulted.`);

        // 4. Prompt user if they want to switch now or later (auto-selects Later after 10s)
        if (currentEmail && newEmail === currentEmail) {
            vscode.window.showInformationMessage(
                `Credentials refreshed and saved to vault for ${newEmail}.`,
            );
        } else {
            // Trigger live second-by-second countdown in sidebar webview
            const displayedInWebview = await AntigravityAccountWebviewProvider.promptSwitchInWebview(newEmail, 10);

            let switchChoice = "Later";

            if (displayedInWebview) {
                // User sees countdown banner in activity bar directly; no duplicate bottom-right toast needed!
                // Wait for either the user to click Switch Now in the webview or 10s timeout
                // Note: clicking Switch Now in webview dispatches boygr.antigravityAccountSwitcher.switchAccount directly
                let timer: NodeJS.Timeout | undefined;
                await new Promise<void>(resolve => {
                    timer = setTimeout(() => resolve(), 10_000);
                });
                if (timer) {
                    clearTimeout(timer);
                }
                await AntigravityAccountWebviewProvider.dismissSwitchPromptInWebview().catch(() => {});
                return;
            } else {
                // Webview is not active/visible, fallback to standard notification toast
                const choicePromise = vscode.window.showInformationMessage(
                    `Account ${newEmail} added successfully! Switch to this account now? (Auto-later in 10s)`,
                    "Switch Now",
                    "Later",
                );
                let timer: NodeJS.Timeout | undefined;
                const timeoutPromise = new Promise<string>(resolve => {
                    timer = setTimeout(() => resolve("Later"), 10_000);
                });
                const rawChoice = await Promise.race([choicePromise, timeoutPromise]).finally(() => {
                    if (timer) {
                        clearTimeout(timer);
                    }
                });
                switchChoice = rawChoice || "Later";

                await vscode.commands.executeCommand("notifications.hideToasts").then(undefined, () => {});
            }

            if (switchChoice === "Switch Now") {
                Logger.info(`Switching to newly added account: ${newEmail}`);
                if (IdeStateService.isAntigravityIde()) {
                    const ideTarget = tokenVault
                        ? await tokenVault.getIdeState(newEmail)
                        : null;

                    if (ideTarget?.oauthToken && ideTarget?.userStatus) {
                        await tokenVault?.applyCredential(newEmail).catch(() => false);
                        await IdeStateService.performIdeAccountSwitch(context, {
                            email: newEmail,
                            oauthToken: ideTarget.oauthToken,
                            userStatus: ideTarget.userStatus,
                            profileUrl: profilePictureUrl,
                        });
                        return;
                    }
                }

                await vscode.commands.executeCommand(
                    "boygr.antigravityAccountSwitcher.switchAccount",
                    { email: newEmail },
                );
            } else {
                Logger.info(`Switch prompt auto-dismissed / Later selected for ${newEmail}`);
                // Later or dismissed or timed out: refresh views again
                await vscode.commands
                    .executeCommand("boygr.antigravityAccountSwitcher.refreshAccountsView")
                    .then(undefined, () => {});
            }
        }
    } catch (error) {
        if (
            error instanceof Error &&
            error.message.includes("cancelled by user")
        ) {
            return;
        }
        throw error;
    }
}

async function switchToAccount(
    context: vscode.ExtensionContext,
    account: ManagedAntigravityAccount,
): Promise<void> {
    await vscode.commands.executeCommand(
        "boygr.antigravityAccountSwitcher.switchAccount",
        {
            email: account.email,
            label: account.label,
        },
    );
}

async function chooseAccountAction(
    context: vscode.ExtensionContext,
    account: ManagedAntigravityAccount,
    currentEmail: string,
): Promise<boolean> {
    const isCurrent =
        normalizeEmail(account.email) ===
        normalizeEmail(currentEmail);

    const actions:
        AccountActionQuickPickItem[] = [];

    if (!isCurrent) {
        actions.push({
            label:
                "$(arrow-swap) Switch to this account",

            description:
                account.email,

            detail:
                "Switch to this account (instant if token is saved, or via Google chooser).",

            action:
                "switch",
        });
    }

    actions.push({
        label:
            "$(edit) Rename label",

        description:
            "Change local display label",

        action:
            "rename",
    });

    if (!isCurrent) {
        actions.push({
            label:
                "$(trash) Remove saved metadata",

            description:
                "Does not sign out or remove Google credentials",

            action:
                "remove",
        });
    }

    actions.push({
        label:
            "$(close) Close",

        action:
            "close",
    });

    const selected =
        await vscode.window.showQuickPick(
            actions,
            {
                title:
                    `Antigravity Account: ${accountTitle(account)}`,

                placeHolder:
                    isCurrent
                        ? "This is the active Antigravity account"
                        : "Choose an action",
            },
        );

    if (!selected) {
        return false;
    }

    if (
        selected.action ===
        "close"
    ) {
        return false;
    }

    if (
        selected.action ===
        "switch"
    ) {
        await switchToAccount(
            context,
            account,
        );

        return true;
    }

    if (
        selected.action ===
        "rename"
    ) {
        const label =
            await vscode.window.showInputBox({
                title:
                    `Rename ${account.email}`,

                prompt:
                    "Local label only",

                value:
                    account.label || "",

                placeHolder:
                    "Personal, Work, Account A, etc.",

                ignoreFocusOut:
                    true,
            });

        if (label === undefined) {
            return false;
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

        return true;
    }

    if (
        selected.action ===
        "remove"
    ) {
        if (isCurrent) {
            vscode.window.showWarningMessage(
                "Cannot remove the currently active account. Please sign out first.",
            );
            return false;
        }

        const confirmation =
            await vscode.window.showWarningMessage(
                `Remove saved metadata for ${account.email}?`,
                {
                    modal:
                        true,

                    detail:
                        "This removes only Antigravity Account Switcher local metadata. " +
                        "It does not sign out or delete Google credentials.",
                },
                "Remove Metadata",
            );

        if (
            confirmation !==
            "Remove Metadata"
        ) {
            return false;
        }

        const removed =
            await removeManagedAccount(
                context,
                account.email,
            );

        if (removed) {
            vscode.window.showInformationMessage(
                `Removed local metadata for ${account.email}.`,
            );
        }

        return removed;
    }

    return false;
}

async function showAccountManager(
    context: vscode.ExtensionContext,
    tokenVault?: TokenVaultService,
): Promise<void> {
    while (true) {
        const current =
            await getAntigravityCurrentAccount();

        const managedCurrent =
            findManagedAccount(
                context,
                current.email,
            );

        const accounts =
            getManagedAccounts(
                context,
            );

        const items:
            AccountQuickPickItem[] = [];

        for (const account of accounts) {
            const isCurrent =
                normalizeEmail(account.email) ===
                normalizeEmail(current.email);

            const label =
                account.label?.trim() ||
                account.email;

            items.push({
                action:
                    "account",

                account,

                label:
                    isCurrent
                        ? `$(check) ${label}`
                        : `$(account) ${label}`,

                description:
                    isCurrent
                        ? "Current"
                        : "Saved",

                detail:
                    account.label
                        ? account.email
                        : account.displayName ||
                          undefined,
            });
        }

        if (!managedCurrent) {
            items.unshift({
                action:
                    "save-current",

                label:
                    "$(save) Save current active account",

                description:
                    current.email,

                detail:
                    current.displayName
                        ? `Current: ${current.displayName}`
                        : "Add current account to local registry",
            });
        }

        items.push({
            action:
                "add-account",

            label:
                "$(person-add) Add / switch Google account",

            description:
                "Open Antigravity's Google account chooser",

            detail:
                "Detect the resulting active account with GetUserStatus.",
        });

        items.push({
            action:
                "refresh",

            label:
                "$(refresh) Refresh",

            description:
                "Read current Antigravity identity again",
        });

        const selected =
            await vscode.window.showQuickPick(
                items,
                {
                    placeHolder:
                        "Manage Antigravity Accounts",
                },
            );

        if (!selected) {
            return;
        }

        if (
            selected.action ===
            "refresh"
        ) {
            continue;
        }

        if (
            selected.action ===
            "add-account"
        ) {
            await addOrSwitchGoogleAccount(
                context,
                tokenVault,
            );

            continue;
        }

        if (
            selected.action ===
            "save-current"
        ) {
            const label =
                await vscode.window.showInputBox({
                    title:
                        "Save Current Antigravity Account",

                    prompt:
                        "Optional local label",

                    placeHolder:
                        "Personal, Work, Account B, etc.",

                    ignoreFocusOut:
                        true,
                });

            if (label === undefined) {
                continue;
            }

            const saved =
                await saveCurrentAccountMetadata(
                    context,
                    current,
                    label,
                );

            vscode.window.showInformationMessage(
                saved.label
                    ? `Saved ${saved.label} (${saved.email}).`
                    : `Saved ${saved.email}.`,
            );

            continue;
        }

        if (
            selected.action ===
                "account" &&
            selected.account
        ) {
            const changed =
                await chooseAccountAction(
                    context,
                    selected.account,
                    current.email,
                );

            if (changed) {
                continue;
            }

            return;
        }
    }
}

export function registerManageAccountsCommand(
    context: vscode.ExtensionContext,
    tokenVault?: TokenVaultService,
): void {
    const disposable =
        vscode.commands.registerCommand(
            COMMAND_ID,
            async () => {
                try {
                    await showAccountManager(
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
                }
            },
        );

    context.subscriptions.push(
        disposable,
    );
}

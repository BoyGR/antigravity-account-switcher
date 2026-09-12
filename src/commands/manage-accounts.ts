import * as vscode from "vscode";

import {
    getAntigravityCurrentAccount,
} from "../antigravity/hub-auth-client";

import {
    reauthenticateAndDetectAccount,
    switchAntigravityAccount,
} from "../antigravity/account-switcher";

import {
    ManagedAntigravityAccount,
    findManagedAccount,
    getManagedAccounts,
    removeManagedAccount,
    saveCurrentAccountMetadata,
    updateManagedAccountLabel,
} from "../antigravity/account-registry";

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
                    "BoyGR AG stores only non-secret account metadata. " +
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

async function addOrSwitchGoogleAccount(
    context: vscode.ExtensionContext,
): Promise<void> {
    const current =
        await getAntigravityCurrentAccount();

    const confirmation =
        await vscode.window.showWarningMessage(
            "Add or switch Antigravity Google account?",
            {
                modal:
                    true,

                detail:
                    `Current account: ${current.email}\n\n` +
                    "Antigravity will open its existing Google authentication flow. " +
                    "Choose the account you want Antigravity to use.\n\n" +
                    "After authentication, BoyGR AG will verify the active account " +
                    "using GetUserStatus.",
            },
            "Open Google Chooser",
        );

    if (
        confirmation !==
        "Open Google Chooser"
    ) {
        return;
    }

    const result =
        await vscode.window.withProgress(
            {
                location:
                    vscode.ProgressLocation.Notification,

                title:
                    "Antigravity Google Account",

                cancellable:
                    false,
            },
            async progress => {
                progress.report({
                    message:
                        "Waiting for Google / Antigravity authentication...",
                });

                return await reauthenticateAndDetectAccount();
            },
        );

    const beforeEmail =
        normalizeEmail(
            result.before.email,
        );

    const afterEmail =
        normalizeEmail(
            result.after.email,
        );

    if (beforeEmail === afterEmail) {
        vscode.window.showInformationMessage(
            `No account change detected. Antigravity remains signed in as ${result.after.email}.`,
        );

        if (
            !findManagedAccount(
                context,
                result.after.email,
            )
        ) {
            await saveDetectedAccount(
                context,
                result.after.email,
                result.after.displayName,
            );
        }

        return;
    }

    vscode.window.showInformationMessage(
        `Antigravity switched from ${result.before.email} to ${result.after.email}.`,
    );

    await saveDetectedAccount(
        context,
        result.after.email,
        result.after.displayName,
    );
}

async function switchToAccount(
    context: vscode.ExtensionContext,
    account: ManagedAntigravityAccount,
): Promise<void> {
    const confirmation =
        await vscode.window.showWarningMessage(
            `Switch Antigravity to ${accountTitle(account)}?`,
            {
                modal:
                    true,

                detail:
                    `Target: ${account.email}\n\n` +
                    "Antigravity will open its Google authentication flow. " +
                    "Select this exact account in the Google chooser.\n\n" +
                    "The switch is accepted only when GetUserStatus confirms " +
                    "the target email.",
            },
            "Start Switch",
        );

    if (
        confirmation !==
        "Start Switch"
    ) {
        return;
    }

    const result =
        await vscode.window.withProgress(
            {
                location:
                    vscode.ProgressLocation.Notification,

                title:
                    `Switching Antigravity to ${accountTitle(account)}`,

                cancellable:
                    false,
            },
            async progress => {
                progress.report({
                    message:
                        "Waiting for Google / Antigravity authentication...",
                });

                return await switchAntigravityAccount(
                    account.email,
                );
            },
        );

    const current =
        await getAntigravityCurrentAccount();

    await saveCurrentAccountMetadata(
        context,
        current,
        account.label,
    );

    if (
        result.verified &&
        normalizeEmail(result.afterEmail) ===
            normalizeEmail(account.email)
    ) {
        vscode.window.showInformationMessage(
            result.changed
                ? `Antigravity switched to ${accountTitle(account)} (${result.afterEmail}).`
                : `${accountTitle(account)} is already active.`,
        );

        return;
    }

    throw new Error(
        `Account switch could not be verified for ${account.email}.`,
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
                "Open Google's account chooser and verify the active Antigravity account.",

            action:
                "switch",
        });
    }

    actions.push(
        {
            label:
                "$(edit) Rename label",

            description:
                "Change local display label",

            action:
                "rename",
        },
        {
            label:
                "$(trash) Remove saved metadata",

            description:
                "Does not sign out or remove Google credentials",

            action:
                "remove",
        },
        {
            label:
                "$(close) Close",

            action:
                "close",
        },
    );

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
        const confirmation =
            await vscode.window.showWarningMessage(
                `Remove saved metadata for ${account.email}?`,
                {
                    modal:
                        true,

                    detail:
                        "This removes only BoyGR AG local metadata. " +
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
                    "$(add) Save current account",

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
                    title:
                        "BoyGR Antigravity Account Manager",

                    placeHolder:
                        `Current: ${current.email}`,

                    matchOnDescription:
                        true,

                    matchOnDetail:
                        true,

                    ignoreFocusOut:
                        true,
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
): void {
    const disposable =
        vscode.commands.registerCommand(
            COMMAND_ID,
            async () => {
                try {
                    await showAccountManager(
                        context,
                    );
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    vscode.window.showErrorMessage(
                        `BoyGR AG: ${message}`,
                    );
                }
            },
        );

    context.subscriptions.push(
        disposable,
    );
}

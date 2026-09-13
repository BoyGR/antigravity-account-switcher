import * as vscode from "vscode";

import { getManagedAccounts } from "../antigravity/account-registry";
import { getAntigravityCurrentAccount } from "../antigravity/hub-auth-client";
import {
    getAccountRemainingPercent,
    getManagedAccountUsageSnapshots,
} from "../antigravity/quota-summary-store";

interface StatusBarQuickPickItem extends vscode.QuickPickItem {
    actionType: "switch" | "add" | "openDashboard" | "refresh" | "settings";
    accountEmail?: string;
}

export function registerStatusBarMenuCommand(
    context: vscode.ExtensionContext,
    onRefreshTriggered?: () => Promise<void> | void,
): vscode.Disposable {
    return vscode.commands.registerCommand(
        "boygr.antigravityAccountSwitcher.statusBarMenu",
        async () => {
            const current = await getAntigravityCurrentAccount().catch(
                () => undefined,
            );
            const savedAccounts = getManagedAccounts(context);
            const usageSnapshots = getManagedAccountUsageSnapshots(context);

            const items: (StatusBarQuickPickItem | vscode.QuickPickItem)[] = [];

            // 1. Saved Accounts list (sorted by quota, active account first)
            if (savedAccounts.length > 0) {
                items.push({
                    label: "Saved Antigravity Accounts",
                    kind: vscode.QuickPickItemKind.Separator,
                });

                const sortedAccounts = [...savedAccounts].sort((a, b) => {
                    const aIsActive = current?.email?.toLowerCase() === a.email.toLowerCase();
                    const bIsActive = current?.email?.toLowerCase() === b.email.toLowerCase();
                    if (aIsActive !== bIsActive) {
                        return aIsActive ? -1 : 1;
                    }

                    const aPercent = getAccountRemainingPercent(
                        usageSnapshots[a.email.toLowerCase()],
                    );
                    const bPercent = getAccountRemainingPercent(
                        usageSnapshots[b.email.toLowerCase()],
                    );

                    if (aPercent !== undefined && bPercent !== undefined) {
                        if (bPercent !== aPercent) {
                            return bPercent - aPercent;
                        }
                    } else if (aPercent !== undefined) {
                        return -1;
                    } else if (bPercent !== undefined) {
                        return 1;
                    }

                    return (a.label || a.email).localeCompare(b.label || b.email);
                });

                for (const acc of sortedAccounts) {
                    const isActive =
                        current?.email?.toLowerCase() ===
                        acc.email.toLowerCase();
                    const label = acc.label
                        ? `${acc.label} (${acc.email})`
                        : acc.email;

                    const percent = getAccountRemainingPercent(
                        usageSnapshots[acc.email.toLowerCase()],
                    );
                    const quotaTag =
                        percent !== undefined ? `$(dashboard) ${percent}% quota` : "";

                    const descParts = [
                        isActive ? "Active Account" : undefined,
                        quotaTag || undefined,
                    ].filter(Boolean);

                    items.push({
                        label: isActive
                            ? `$(check) ${label}`
                            : `$(account) ${label}`,
                        description: descParts.join(" · ") || undefined,
                        detail: isActive
                            ? "Currently active in Antigravity"
                            : "Click to switch to this account",
                        actionType: "switch",
                        accountEmail: acc.email,
                    });
                }
            }

            // 2. Action items
            items.push({
                label: "Actions",
                kind: vscode.QuickPickItemKind.Separator,
            });

            items.push({
                label: "$(add) Add / Switch Google Account",
                description: "Sign in with a new or different Google account",
                actionType: "add",
            });

            items.push({
                label: "$(layout-sidebar-left) Open Dashboard",
                description: "Open full Antigravity Account Switcher sidebar",
                actionType: "openDashboard",
            });

            items.push({
                label: "$(refresh) Refresh Quota Now",
                description: "Fetch the latest quota and runtime status",
                actionType: "refresh",
            });

            items.push({
                label: "$(gear) Settings",
                description: "Customize auto-refresh, notifications, and theme",
                actionType: "settings",
            });

            const selected = await vscode.window.showQuickPick(
                items as (StatusBarQuickPickItem | vscode.QuickPickItem)[],
                {
                    placeHolder: current?.email
                        ? `Antigravity: ${current.email} (Select an action or account)`
                        : "Antigravity Account Switcher Menu",
                    matchOnDescription: true,
                    matchOnDetail: true,
                },
            );

            if (!selected || !("actionType" in selected)) {
                return;
            }

            const actionItem = selected as StatusBarQuickPickItem;

            switch (actionItem.actionType) {
                case "switch":
                    if (actionItem.accountEmail) {
                        await vscode.commands.executeCommand(
                            "boygr.antigravityAccountSwitcher.switchAccount",
                            { email: actionItem.accountEmail },
                        );
                    }
                    break;
                case "add":
                    await vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.addAccount",
                    );
                    break;
                case "openDashboard":
                    await vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.accountsView.focus",
                    );
                    break;
                case "refresh":
                    if (onRefreshTriggered) {
                        await onRefreshTriggered();
                    } else {
                        await vscode.commands.executeCommand(
                            "boygr.antigravityAccountSwitcher.refreshAccountsView",
                        );
                    }
                    break;
                case "settings":
                    await vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.openSettings",
                    );
                    break;
            }
        },
    );
}

import * as vscode from "vscode";

import { getManagedAccounts } from "../antigravity/account-registry";
import { getAntigravityCurrentAccount } from "../antigravity/hub-auth-client";

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

            const items: (StatusBarQuickPickItem | vscode.QuickPickItem)[] = [];

            // 1. Saved Accounts list
            if (savedAccounts.length > 0) {
                items.push({
                    label: "Saved Antigravity Accounts",
                    kind: vscode.QuickPickItemKind.Separator,
                });

                for (const acc of savedAccounts) {
                    const isActive =
                        current?.email?.toLowerCase() ===
                        acc.email.toLowerCase();
                    const label = acc.label
                        ? `${acc.label} (${acc.email})`
                        : acc.email;

                    items.push({
                        label: isActive
                            ? `$(check) ${label}`
                            : `$(account) ${label}`,
                        description: isActive ? "Active Account" : undefined,
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

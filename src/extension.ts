import * as vscode from "vscode";

import { registerAccountContextCommands } from "./commands/account-context";

import { registerAddAccountCommand } from "./commands/add-account";
import { diagnoseAntigravity } from "./commands/diagnose";
import { registerAuthStatusCommand } from "./commands/auth-status";
import { registerCurrentAccountCommand } from "./commands/current-account";
import { registerInspectBridgeCommand } from "./commands/inspect-bridge";
import { registerManageAccountsCommand } from "./commands/manage-accounts";
import { registerReAuthCommand } from "./commands/re-auth";
import { registerSaveCurrentAccountCommand } from "./commands/save-current-account";
import { registerSignInCommand } from "./commands/sign-in";
import { registerSignOutCommand } from "./commands/sign-out";
import { registerStatusCommand } from "./commands/status";
import { registerSwitchAccountCommand } from "./commands/switch-account";
import { AntigravityAccountsTreeProvider } from "./views/account-tree-provider";

export function activate(
    context: vscode.ExtensionContext,
): void {
    registerAddAccountCommand(context);
    registerAccountContextCommands(context);
    registerManageAccountsCommand(context);
    registerCurrentAccountCommand(context);
    registerSaveCurrentAccountCommand(context);
    registerAuthStatusCommand(context);
    registerSignInCommand(context);
    registerReAuthCommand(context);
    registerSignOutCommand(context);
    registerInspectBridgeCommand(context);
    registerStatusCommand(context);
    registerSwitchAccountCommand(context);

    const diagnoseCommand =
        vscode.commands.registerCommand(
            "boygr.antigravityAccountSwitcher.diagnose",
            diagnoseAntigravity,
        );

    const treeProvider =
        new AntigravityAccountsTreeProvider(context);

    const treeView =
        vscode.window.createTreeView(
            "boygr.antigravityAccountSwitcher.accountsView",
            {
                treeDataProvider: treeProvider,
                showCollapseAll: false,
            },
        );

    const refreshCommand =
        vscode.commands.registerCommand(
            "boygr.antigravityAccountSwitcher.refreshAccountsView",
            async () => {
                await treeProvider.refresh();
            },
        );

    context.subscriptions.push(
        diagnoseCommand,
        treeProvider,
        treeView,
        refreshCommand,
    );
}

export function deactivate(): void {
    // Nothing else to clean up.
}

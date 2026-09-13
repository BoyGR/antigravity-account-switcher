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
import { registerStatusBarMenuCommand } from "./commands/status-bar-menu";
import { registerBackupAccountsCommands } from "./commands/backup-accounts";
import { registerRecoveryCommands } from "./commands/recovery";
import { AntigravityStatusBarManager } from "./status-bar/status-bar-manager";
import { registerAntigravityAccountWebview } from "./views/account-webview-provider";
import {
    checkAndPromptWorkspaceAccount,
    registerWorkspaceAssociationCommands,
} from "./antigravity/workspace-association";

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

    const statusBarManager =
        new AntigravityStatusBarManager();

    const accountWebview =
        registerAntigravityAccountWebview(
            context,
            statusBarManager,
        );

    const statusBarMenuCommand =
        registerStatusBarMenuCommand(
            context,
            async () => {
                await accountWebview.refresh();
            },
        );

    const refreshCommand =
        vscode.commands.registerCommand(
            "boygr.antigravityAccountSwitcher.refreshAccountsView",
            async () => {
                await accountWebview.refresh();
            },
        );

    const backupCommands = registerBackupAccountsCommands(
        context,
        async () => {
            await accountWebview.refresh();
        },
    );

    const recoveryCommands = registerRecoveryCommands(
        context,
        async () => {
            await accountWebview.refresh();
        },
    );

    const workspaceCommands = registerWorkspaceAssociationCommands(
        context,
        async () => {
            await accountWebview.refresh();
        },
    );

    context.subscriptions.push(
        statusBarManager,
        statusBarMenuCommand,
        diagnoseCommand,
        refreshCommand,
        ...backupCommands,
        ...recoveryCommands,
        ...workspaceCommands,
    );

    // Prompt user if current workspace folder has a linked account
    void checkAndPromptWorkspaceAccount(context);
}

export function deactivate(): void {
    // Nothing else to clean up.
}

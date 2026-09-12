import { registerManageAccountsCommand } from "./commands/manage-accounts";
import { registerCurrentAccountCommand } from "./commands/current-account";
import { registerSaveCurrentAccountCommand } from "./commands/save-current-account";
import { registerSignOutCommand } from "./commands/sign-out";
import { registerReAuthCommand } from "./commands/re-auth";
import { registerSignInCommand } from "./commands/sign-in";
import { registerAuthStatusCommand } from "./commands/auth-status";
import { registerInspectBridgeCommand } from './commands/inspect-bridge';
import { registerStatusCommand } from './commands/status';
import * as vscode from "vscode";
import { diagnoseAntigravity } from "./commands/diagnose";

export function activate(context: vscode.ExtensionContext): void {
    registerManageAccountsCommand(context);
    registerCurrentAccountCommand(context);
    registerSaveCurrentAccountCommand(context);
    registerAuthStatusCommand(context);
    registerSignInCommand(context);
    registerReAuthCommand(context);
    registerSignOutCommand(context);
    registerInspectBridgeCommand(context);
    registerStatusCommand(context);
  const diagnoseCommand = vscode.commands.registerCommand(
    "boygrAg.diagnose",
    diagnoseAntigravity
  );

  context.subscriptions.push(diagnoseCommand);
}

export function deactivate(): void {
  // Nothing to clean up yet.
}




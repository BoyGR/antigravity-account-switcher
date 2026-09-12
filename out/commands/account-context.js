"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMOVE_SAVED_ACCOUNT_COMMAND_ID = exports.EDIT_ACCOUNT_LABEL_COMMAND_ID = void 0;
exports.registerAccountContextCommands = registerAccountContextCommands;
const vscode = __importStar(require("vscode"));
const account_registry_1 = require("../antigravity/account-registry");
exports.EDIT_ACCOUNT_LABEL_COMMAND_ID = "boygr.antigravityAccountSwitcher.editAccountLabel";
exports.REMOVE_SAVED_ACCOUNT_COMMAND_ID = "boygr.antigravityAccountSwitcher.removeSavedAccount";
function getAccount(argument) {
    /*
     * v0.2 Tree View commands receive:
     *
     *     { account: ManagedAntigravityAccount }
     *
     * v0.3 Webview commands receive:
     *
     *     ManagedAntigravityAccount
     *
     * Accept both forms so command handlers remain independent
     * from a particular VS Code view implementation.
     */
    const account = argument &&
        "email" in argument
        ? argument
        : argument?.account;
    if (!account?.email?.trim()) {
        throw new Error("No saved Antigravity account was provided.");
    }
    return account;
}
function registerAccountContextCommands(context) {
    const editLabel = vscode.commands.registerCommand(exports.EDIT_ACCOUNT_LABEL_COMMAND_ID, async (argument) => {
        try {
            const account = getAccount(argument);
            const label = await vscode.window.showInputBox({
                title: `Edit Label — ${account.email}`,
                prompt: "Local label only. Leave empty to remove the label.",
                value: account.label || "",
                placeHolder: "Personal, Work, Account A, etc.",
                ignoreFocusOut: true,
            });
            if (label === undefined) {
                return;
            }
            const updated = await (0, account_registry_1.updateManagedAccountLabel)(context, account.email, label);
            vscode.window.showInformationMessage(updated.label
                ? `Account label changed to "${updated.label}".`
                : `Local label removed from ${updated.email}.`);
            await vscode.commands.executeCommand("boygr.antigravityAccountSwitcher.refreshAccountsView");
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            vscode.window.showErrorMessage(`Antigravity Account Switcher: ${message}`);
        }
    });
    const removeAccount = vscode.commands.registerCommand(exports.REMOVE_SAVED_ACCOUNT_COMMAND_ID, async (argument) => {
        try {
            const account = getAccount(argument);
            const confirmation = await vscode.window.showWarningMessage(`Remove ${account.email} from Saved Accounts?`, {
                modal: true,
                detail: "This removes only local Antigravity Account Switcher metadata. " +
                    "It does not sign out, change the active account, or delete Google credentials.",
            }, "Remove");
            if (confirmation !== "Remove") {
                return;
            }
            const removed = await (0, account_registry_1.removeManagedAccount)(context, account.email);
            if (removed) {
                vscode.window.showInformationMessage(`Removed ${account.email} from Saved Accounts.`);
            }
            else {
                vscode.window.showInformationMessage(`${account.email} was not present in Saved Accounts.`);
            }
            await vscode.commands.executeCommand("boygr.antigravityAccountSwitcher.refreshAccountsView");
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            vscode.window.showErrorMessage(`Antigravity Account Switcher: ${message}`);
        }
    });
    context.subscriptions.push(editLabel, removeAccount);
}
//# sourceMappingURL=account-context.js.map
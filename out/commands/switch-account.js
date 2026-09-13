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
exports.SWITCH_ACCOUNT_COMMAND_ID = void 0;
exports.registerSwitchAccountCommand = registerSwitchAccountCommand;
const vscode = __importStar(require("vscode"));
const account_switcher_1 = require("../antigravity/account-switcher");
const account_registry_1 = require("../antigravity/account-registry");
const hub_auth_client_1 = require("../antigravity/hub-auth-client");
const ui_sync_1 = require("../antigravity/ui-sync");
exports.SWITCH_ACCOUNT_COMMAND_ID = "boygr.antigravityAccountSwitcher.switchAccount";
function getDisplayName(argument) {
    const label = argument.label?.trim();
    if (label) {
        return `${label} (${argument.email})`;
    }
    return argument.email;
}
function registerSwitchAccountCommand(context) {
    const disposable = vscode.commands.registerCommand(exports.SWITCH_ACCOUNT_COMMAND_ID, async (argument) => {
        try {
            let targetAccount = argument;
            if (!targetAccount ||
                typeof targetAccount.email !== "string" ||
                !targetAccount.email.trim()) {
                const savedAccounts = (0, account_registry_1.getManagedAccounts)(context);
                if (savedAccounts.length === 0) {
                    vscode.window.showInformationMessage("No saved Antigravity accounts found. Use 'Add / Switch Google Account' first.");
                    return;
                }
                const currentAccount = await (0, hub_auth_client_1.getAntigravityCurrentAccount)().catch(() => undefined);
                const items = savedAccounts.map(account => {
                    const isCurrent = currentAccount?.email?.toLowerCase() === account.email.toLowerCase();
                    return {
                        label: account.label
                            ? `${account.label} (${account.email})`
                            : account.email,
                        description: isCurrent ? "(Active)" : undefined,
                        account: {
                            email: account.email,
                            label: account.label,
                        },
                    };
                });
                const selected = await vscode.window.showQuickPick(items, {
                    placeHolder: "Select an Antigravity account to switch to",
                });
                if (!selected) {
                    return;
                }
                targetAccount = selected.account;
            }
            const targetEmail = targetAccount.email.trim();
            const displayName = getDisplayName({
                ...targetAccount,
                email: targetEmail,
            });
            const confirmation = await vscode.window.showWarningMessage(`Switch Antigravity account to ${displayName}?`, {
                modal: true,
                detail: "Antigravity's official Google account chooser will open. " +
                    `Select ${targetEmail} to complete the switch.`,
            }, "Switch Account");
            if (confirmation !== "Switch Account") {
                return;
            }
            const result = await (0, account_switcher_1.switchAntigravityAccount)(targetEmail);
            if (!result.verified) {
                throw new Error(`The account switch to ${targetEmail} could not be verified.`);
            }
            const syncResult = await (0, ui_sync_1.syncAntigravityUi)();
            if (!result.changed) {
                vscode.window.showInformationMessage(`${displayName} is already the active Antigravity account.`);
            }
            else if (syncResult.syncedOfficialPanel) {
                vscode.window.showInformationMessage(`Antigravity switched to ${displayName}.`);
            }
            else {
                const choice = await vscode.window.showInformationMessage(`Antigravity switched to ${displayName}. Reload window to update the official Antigravity panel?`, "Reload Window", "Later");
                if (choice === "Reload Window") {
                    await vscode.commands.executeCommand("workbench.action.reloadWindow");
                }
            }
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            vscode.window.showErrorMessage(`Antigravity Account Switcher: ${message}`);
            try {
                await (0, ui_sync_1.syncAntigravityUi)();
            }
            catch {
                // Safely ignore secondary sync issues on failure path
            }
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=switch-account.js.map
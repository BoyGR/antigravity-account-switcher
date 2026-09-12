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
            if (!argument ||
                typeof argument.email !== "string" ||
                !argument.email.trim()) {
                throw new Error("No target Antigravity account was provided.");
            }
            const targetEmail = argument.email.trim();
            const displayName = getDisplayName({
                ...argument,
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
            if (!result.changed) {
                vscode.window.showInformationMessage(`${displayName} is already the active Antigravity account.`);
            }
            else {
                vscode.window.showInformationMessage(`Antigravity switched to ${displayName}.`);
            }
            await vscode.commands.executeCommand("boygr.antigravityAccountSwitcher.refreshAccountsView");
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            vscode.window.showErrorMessage(`Antigravity Account Switcher: ${message}`);
            await vscode.commands.executeCommand("boygr.antigravityAccountSwitcher.refreshAccountsView");
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=switch-account.js.map
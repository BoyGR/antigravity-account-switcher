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
exports.ADD_ACCOUNT_COMMAND_ID = void 0;
exports.registerAddAccountCommand = registerAddAccountCommand;
const vscode = __importStar(require("vscode"));
const manage_accounts_1 = require("./manage-accounts");
exports.ADD_ACCOUNT_COMMAND_ID = "boygr.antigravityAccountSwitcher.addAccount";
function registerAddAccountCommand(context) {
    const disposable = vscode.commands.registerCommand(exports.ADD_ACCOUNT_COMMAND_ID, async () => {
        try {
            await (0, manage_accounts_1.addOrSwitchGoogleAccount)(context);
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
//# sourceMappingURL=add-account.js.map
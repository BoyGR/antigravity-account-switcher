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
exports.registerCurrentAccountCommand = registerCurrentAccountCommand;
const vscode = __importStar(require("vscode"));
const hub_auth_client_1 = require("../antigravity/hub-auth-client");
const account_registry_1 = require("../antigravity/account-registry");
const COMMAND_ID = "boygr.antigravityAccountSwitcher.currentAccount";
function registerCurrentAccountCommand(context) {
    const disposable = vscode.commands.registerCommand(COMMAND_ID, async () => {
        try {
            const current = await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
            const managed = (0, account_registry_1.findManagedAccount)(context, current.email);
            const label = managed?.label || "Not saved";
            const lines = [
                `Account: ${current.email}`,
                `Label: ${label}`,
            ];
            if (current.displayName) {
                lines.push(`Name: ${current.displayName}`);
            }
            await vscode.window.showInformationMessage(lines.join(" | "));
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            vscode.window.showErrorMessage(`BoyGR AG current account failed: ${message}`);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=current-account.js.map
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const account_context_1 = require("./commands/account-context");
const add_account_1 = require("./commands/add-account");
const diagnose_1 = require("./commands/diagnose");
const auth_status_1 = require("./commands/auth-status");
const current_account_1 = require("./commands/current-account");
const inspect_bridge_1 = require("./commands/inspect-bridge");
const manage_accounts_1 = require("./commands/manage-accounts");
const re_auth_1 = require("./commands/re-auth");
const save_current_account_1 = require("./commands/save-current-account");
const sign_in_1 = require("./commands/sign-in");
const sign_out_1 = require("./commands/sign-out");
const status_1 = require("./commands/status");
const switch_account_1 = require("./commands/switch-account");
const account_webview_provider_1 = require("./views/account-webview-provider");
function activate(context) {
    (0, add_account_1.registerAddAccountCommand)(context);
    (0, account_context_1.registerAccountContextCommands)(context);
    (0, manage_accounts_1.registerManageAccountsCommand)(context);
    (0, current_account_1.registerCurrentAccountCommand)(context);
    (0, save_current_account_1.registerSaveCurrentAccountCommand)(context);
    (0, auth_status_1.registerAuthStatusCommand)(context);
    (0, sign_in_1.registerSignInCommand)(context);
    (0, re_auth_1.registerReAuthCommand)(context);
    (0, sign_out_1.registerSignOutCommand)(context);
    (0, inspect_bridge_1.registerInspectBridgeCommand)(context);
    (0, status_1.registerStatusCommand)(context);
    (0, switch_account_1.registerSwitchAccountCommand)(context);
    const diagnoseCommand = vscode.commands.registerCommand("boygr.antigravityAccountSwitcher.diagnose", diagnose_1.diagnoseAntigravity);
    const accountWebview = (0, account_webview_provider_1.registerAntigravityAccountWebview)(context);
    const refreshCommand = vscode.commands.registerCommand("boygr.antigravityAccountSwitcher.refreshAccountsView", async () => {
        await accountWebview.refresh();
    });
    context.subscriptions.push(diagnoseCommand, refreshCommand);
}
function deactivate() {
    // Nothing else to clean up.
}
//# sourceMappingURL=extension.js.map
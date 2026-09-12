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
exports.registerSignOutCommand = registerSignOutCommand;
const vscode = __importStar(require("vscode"));
const hub_auth_client_1 = require("../antigravity/hub-auth-client");
const COMMAND_ID = "boygr.antigravityAccountSwitcher.signOut";
const OUTPUT_CHANNEL = "BoyGR Antigravity Sign Out";
function registerSignOutCommand(context) {
    const disposable = vscode.commands.registerCommand(COMMAND_ID, async () => {
        const output = vscode.window.createOutputChannel(OUTPUT_CHANNEL);
        context.subscriptions.push(output);
        output.clear();
        output.show(true);
        output.appendLine("=== BoyGR Antigravity Sign Out ===");
        output.appendLine("");
        try {
            // ================================================
            // Preflight
            // ================================================
            const before = await (0, hub_auth_client_1.getAntigravityAuthStatus)();
            output.appendLine("## Current Authentication");
            output.appendLine("");
            output.appendLine(`Token : ${before.hasToken
                ? "Present"
                : "Not present"}`);
            output.appendLine(`Valid : ${before.hasValidAuth === true
                ? "Yes"
                : before.hasValidAuth === false
                    ? "No"
                    : "Unknown"}`);
            if (!before.hasToken) {
                output.appendLine("");
                output.appendLine("Sign Out was NOT started.");
                output.appendLine("Reason: Antigravity has no authentication token.");
                vscode.window.showInformationMessage("Antigravity is already signed out.");
                return;
            }
            // ================================================
            // Explicit confirmation
            // ================================================
            const confirmation = await vscode.window.showWarningMessage("Sign out from the active Antigravity Google session?", {
                modal: true,
                detail: "This calls Antigravity's own AuthLogout backend. " +
                    "You may need to sign in again afterward."
            }, "Sign Out");
            if (confirmation !== "Sign Out") {
                output.appendLine("");
                output.appendLine("Cancelled by user.");
                return;
            }
            output.appendLine("");
            output.appendLine("## Sign Out");
            output.appendLine("");
            output.appendLine("Calling Antigravity AuthLogout RPC...");
            // ================================================
            // Mutation
            // ================================================
            await vscode.window.withProgress({
                location: vscode.ProgressLocation
                    .Notification,
                title: "Antigravity: signing out...",
                cancellable: false,
            }, async () => (0, hub_auth_client_1.signOutFromAntigravity)());
            // ================================================
            // Read-only verification
            // ================================================
            const after = await (0, hub_auth_client_1.getAntigravityAuthStatus)();
            output.appendLine("");
            output.appendLine("## Result");
            output.appendLine("");
            output.appendLine(`Verified token : ${after.hasToken
                ? "Present"
                : "Not present"}`);
            output.appendLine(`Verified auth  : ${after.hasValidAuth === true
                ? "Valid"
                : after.hasValidAuth === false
                    ? "Invalid"
                    : "Unknown"}`);
            output.appendLine("");
            output.appendLine("## Security");
            output.appendLine("");
            output.appendLine("Backend              : Antigravity AuthLogout RPC");
            output.appendLine("CSRF                  : Memory only");
            output.appendLine("Access token          : Never read");
            output.appendLine("Refresh token         : Never read");
            output.appendLine("Credentials persisted : No");
            output.appendLine("state.vscdb modified  : No");
            if (!after.hasToken) {
                output.appendLine("");
                output.appendLine("=== Sign Out successful ===");
                vscode.window.showInformationMessage("Antigravity sign-out completed successfully.");
            }
            else {
                output.appendLine("");
                output.appendLine("=== AuthLogout returned but token is still present ===");
                vscode.window.showWarningMessage("Antigravity AuthLogout returned, but authentication is still present.");
            }
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            output.appendLine("");
            output.appendLine("## Error");
            output.appendLine("");
            output.appendLine(message);
            vscode.window.showErrorMessage(`BoyGR Antigravity Sign Out failed: ${message}`);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=sign-out.js.map
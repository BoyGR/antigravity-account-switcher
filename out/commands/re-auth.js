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
exports.registerReAuthCommand = registerReAuthCommand;
const vscode = __importStar(require("vscode"));
const hub_auth_client_1 = require("../antigravity/hub-auth-client");
const ui_sync_1 = require("../antigravity/ui-sync");
const COMMAND_ID = "boygr.antigravityAccountSwitcher.reAuth";
const OUTPUT_CHANNEL = "Antigravity Re-auth";
function registerReAuthCommand(context) {
    const disposable = vscode.commands.registerCommand(COMMAND_ID, async () => {
        const output = vscode.window.createOutputChannel(OUTPUT_CHANNEL);
        context.subscriptions.push(output);
        output.clear();
        output.show(true);
        output.appendLine("=== Antigravity Re-auth ===");
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
            if (!before.hasToken ||
                before.hasValidAuth !== true) {
                output.appendLine("");
                output.appendLine("Re-auth was NOT started.");
                output.appendLine("Reason: there is no currently valid Antigravity session.");
                output.appendLine("");
                output.appendLine("Use Antigravity Account Switcher: Sign In instead.");
                vscode.window.showInformationMessage("Antigravity is not currently signed in with valid authentication.");
                return;
            }
            // ================================================
            // Explicit confirmation
            // ================================================
            const confirmation = await vscode.window.showWarningMessage("Re-authenticate the active Antigravity Google session? " +
                "Antigravity may open your browser or Google account chooser, " +
                "and the active Antigravity account may change.", {
                modal: true,
                detail: "No credentials will be copied or stored by Antigravity Account Switcher. " +
                    "This uses Antigravity's own Login backend."
            }, "Start Re-auth");
            if (confirmation !==
                "Start Re-auth") {
                output.appendLine("");
                output.appendLine("Cancelled by user.");
                return;
            }
            output.appendLine("");
            output.appendLine("## Re-auth");
            output.appendLine("");
            output.appendLine("Calling Antigravity Login RPC for the existing authenticated session...");
            // ================================================
            // Mutation
            // ================================================
            const result = await vscode.window.withProgress({
                location: vscode.ProgressLocation
                    .Notification,
                title: "Antigravity: re-authentication in progress...",
                cancellable: false,
            }, async () => (0, hub_auth_client_1.reauthenticateAntigravity)());
            // ================================================
            // Read-only verification
            // ================================================
            const after = await (0, hub_auth_client_1.getAntigravityAuthStatus)();
            output.appendLine("");
            output.appendLine("## Result");
            output.appendLine("");
            output.appendLine(`Login response valid : ${result.hasValidAuth === true
                ? "Yes"
                : result.hasValidAuth === false
                    ? "No"
                    : "Unknown"}`);
            output.appendLine(`Verified token       : ${after.hasToken
                ? "Present"
                : "Not present"}`);
            output.appendLine(`Verified auth        : ${after.hasValidAuth === true
                ? "Valid"
                : after.hasValidAuth === false
                    ? "Invalid"
                    : "Unknown"}`);
            output.appendLine("");
            output.appendLine("## Security");
            output.appendLine("");
            output.appendLine("Backend              : Antigravity Login RPC");
            output.appendLine("AuthLogout            : Not called");
            output.appendLine("OAuth implementation  : Antigravity");
            output.appendLine("CSRF                  : Memory only");
            output.appendLine("Access token          : Never read");
            output.appendLine("Refresh token         : Never read");
            output.appendLine("Credentials persisted : No");
            output.appendLine("state.vscdb modified  : No");
            if (after.hasToken &&
                after.hasValidAuth === true) {
                output.appendLine("");
                output.appendLine("=== Re-auth returned with valid authentication ===");
                vscode.window.showInformationMessage("Antigravity Re-auth returned with valid authentication.");
            }
            else {
                output.appendLine("");
                output.appendLine("=== Re-auth did not finish with valid authentication ===");
                vscode.window.showWarningMessage("Antigravity Re-auth returned, but valid authentication was not confirmed.");
            }
            const syncResult = await (0, ui_sync_1.syncAntigravityUi)();
            if (!syncResult.syncedOfficialPanel) {
                const reloadChoice = await vscode.window.showInformationMessage("Antigravity Re-auth completed. Reload window to update the official Antigravity panel?", "Reload Window", "Later");
                if (reloadChoice === "Reload Window") {
                    await vscode.commands.executeCommand("workbench.action.reloadWindow");
                }
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
            vscode.window.showErrorMessage(`Antigravity Re-auth failed: ${message}`);
            try {
                await (0, ui_sync_1.syncAntigravityUi)();
            }
            catch {
                // Safely ignore secondary sync error
            }
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=re-auth.js.map
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
exports.registerAuthStatusCommand = registerAuthStatusCommand;
const vscode = __importStar(require("vscode"));
const hub_auth_client_1 = require("../antigravity/hub-auth-client");
const COMMAND_ID = "boygr.antigravityAccountSwitcher.authStatus";
const OUTPUT_CHANNEL = "Antigravity Auth Status";
function registerAuthStatusCommand(context) {
    const disposable = vscode.commands.registerCommand(COMMAND_ID, async () => {
        const output = vscode.window.createOutputChannel(OUTPUT_CHANNEL);
        context.subscriptions.push(output);
        output.clear();
        output.show(true);
        output.appendLine("=== Antigravity Auth Status ===");
        output.appendLine("");
        try {
            const status = await vscode.window.withProgress({
                location: vscode.ProgressLocation
                    .Notification,
                title: "Reading Antigravity auth status...",
                cancellable: false,
            }, async () => (0, hub_auth_client_1.getAntigravityAuthStatus)());
            output.appendLine("## AGY Backend");
            output.appendLine("");
            output.appendLine(`Running   : Yes`);
            output.appendLine(`PID       : ${status.agyPid}`);
            output.appendLine("");
            output.appendLine("## Transport");
            output.appendLine("");
            output.appendLine(`Hub Port  : ${status.hubPort}`);
            output.appendLine(`LS Port   : ${status.lsPort}`);
            output.appendLine(`Service   : ${status.serviceName}`);
            output.appendLine("");
            output.appendLine("## Authentication");
            output.appendLine("");
            output.appendLine(`Token     : ${status.hasToken
                ? "Present"
                : "Not present"}`);
            const validity = status.hasValidAuth === true
                ? "Yes"
                : status.hasValidAuth ===
                    false
                    ? "No"
                    : "Not queried";
            output.appendLine(`Valid     : ${validity}`);
            output.appendLine("");
            output.appendLine("## Granted Scopes");
            output.appendLine("");
            if (status.grantedScopes.length ===
                0) {
                output.appendLine("(none)");
            }
            else {
                for (const scope of status.grantedScopes) {
                    output.appendLine(`- ${scope}`);
                }
            }
            output.appendLine("");
            output.appendLine("## Security");
            output.appendLine("");
            output.appendLine("CSRF      : Memory only");
            output.appendLine("Tokens    : Never displayed");
            output.appendLine("Mutation  : None");
            output.appendLine("");
            output.appendLine("=== Read-only auth status complete ===");
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            output.appendLine("## Error");
            output.appendLine("");
            output.appendLine(message);
            vscode.window.showErrorMessage(`Antigravity Auth Status failed: ${message}`);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=auth-status.js.map
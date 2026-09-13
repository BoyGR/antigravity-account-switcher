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
exports.syncAntigravityUi = syncAntigravityUi;
exports.promptReloadFallback = promptReloadFallback;
const vscode = __importStar(require("vscode"));
/**
 * Synchronizes Antigravity's official UI and sidebar after authentication state changes
 * (account switch, re-auth, sign-in, sign-out).
 *
 * It uses Antigravity's built-in reconnection mechanisms without requiring a full window reload:
 * 1. 'antigravity.reconnect' (calls provider.refresh() inside the official extension)
 * 2. 'antigravity.triggerUpdate' (calls forceUpdate + provider.refresh())
 * 3. 'boygr.antigravityAccountSwitcher.refreshAccountsView' (refreshes our switcher dashboard)
 */
async function syncAntigravityUi(options) {
    const result = {
        syncedOfficialPanel: false,
    };
    try {
        const config = vscode.workspace.getConfiguration("boygr.antigravityAccountSwitcher");
        const autoSync = config.get("autoSyncOfficialUi", true);
        if (autoSync) {
            try {
                const commands = await vscode.commands.getCommands(true);
                if (commands.includes("antigravity.reconnect")) {
                    await vscode.commands.executeCommand("antigravity.reconnect");
                    result.syncedOfficialPanel = true;
                    result.officialCommandExecuted = "antigravity.reconnect";
                }
                else if (commands.includes("antigravity.triggerUpdate")) {
                    await vscode.commands.executeCommand("antigravity.triggerUpdate");
                    result.syncedOfficialPanel = true;
                    result.officialCommandExecuted = "antigravity.triggerUpdate";
                }
            }
            catch (err) {
                result.error = err instanceof Error ? err.message : String(err);
            }
        }
    }
    catch (configErr) {
        result.error = configErr instanceof Error ? configErr.message : String(configErr);
    }
    // Always refresh our own account switcher view safely
    try {
        await vscode.commands.executeCommand("boygr.antigravityAccountSwitcher.refreshAccountsView");
    }
    catch {
        // Silently ignore if view is not yet registered or ready
    }
    if (options?.promptReloadOnFailure && !result.syncedOfficialPanel) {
        await promptReloadFallback("Official Antigravity panel could not be auto-synced. Reload window to update?");
    }
    return result;
}
/**
 * Fallback prompt allowing the user to reload the VS Code window as a last resort
 * if the official Antigravity extension panel does not update.
 */
async function promptReloadFallback(customMessage) {
    try {
        const message = customMessage ||
            "If the official Antigravity panel does not update, reload the window to synchronize.";
        const choice = await vscode.window.showInformationMessage(message, "Reload Window", "Later");
        if (choice === "Reload Window") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
            return true;
        }
    }
    catch {
        // Gracefully ignore dialog or execution issues
    }
    return false;
}
//# sourceMappingURL=ui-sync.js.map
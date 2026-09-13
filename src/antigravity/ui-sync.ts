import * as vscode from "vscode";

export interface UiSyncResult {
    syncedOfficialPanel: boolean;
    officialCommandExecuted?: string;
    error?: string;
}

/**
 * Synchronizes Antigravity's official UI and sidebar after authentication state changes
 * (account switch, re-auth, sign-in, sign-out).
 *
 * It uses Antigravity's built-in reconnection mechanisms without requiring a full window reload:
 * 1. 'antigravity.reconnect' (calls provider.refresh() inside the official extension)
 * 2. 'antigravity.triggerUpdate' (calls forceUpdate + provider.refresh())
 * 3. 'boygr.antigravityAccountSwitcher.refreshAccountsView' (refreshes our switcher dashboard)
 */
export async function syncAntigravityUi(options?: {
    promptReloadOnFailure?: boolean;
}): Promise<UiSyncResult> {
    const result: UiSyncResult = {
        syncedOfficialPanel: false,
    };

    try {
        const config = vscode.workspace.getConfiguration(
            "boygr.antigravityAccountSwitcher",
        );
        const autoSync = config.get<boolean>("autoSyncOfficialUi", true);

        if (autoSync) {
            try {
                const commands = await vscode.commands.getCommands(true);

                if (commands.includes("antigravity.reconnect")) {
                    await vscode.commands.executeCommand("antigravity.reconnect");
                    result.syncedOfficialPanel = true;
                    result.officialCommandExecuted = "antigravity.reconnect";
                } else if (commands.includes("antigravity.triggerUpdate")) {
                    await vscode.commands.executeCommand("antigravity.triggerUpdate");
                    result.syncedOfficialPanel = true;
                    result.officialCommandExecuted = "antigravity.triggerUpdate";
                }
            } catch (err) {
                result.error = err instanceof Error ? err.message : String(err);
            }
        }
    } catch (configErr) {
        result.error = configErr instanceof Error ? configErr.message : String(configErr);
    }

    // Always refresh our own account switcher view safely
    try {
        await vscode.commands.executeCommand(
            "boygr.antigravityAccountSwitcher.refreshAccountsView",
        );
    } catch {
        // Silently ignore if view is not yet registered or ready
    }

    if (options?.promptReloadOnFailure && !result.syncedOfficialPanel) {
        await promptReloadFallback(
            "Official Antigravity panel could not be auto-synced. Reload window to update?",
        );
    }

    return result;
}

/**
 * Fallback prompt allowing the user to reload the VS Code window as a last resort
 * if the official Antigravity extension panel does not update.
 */
export async function promptReloadFallback(customMessage?: string): Promise<boolean> {
    try {
        const message =
            customMessage ||
            "If the official Antigravity panel does not update, reload the window to synchronize.";

        const choice = await vscode.window.showInformationMessage(
            message,
            "Reload Window",
            "Later",
        );

        if (choice === "Reload Window") {
            await vscode.commands.executeCommand("workbench.action.reloadWindow");
            return true;
        }
    } catch {
        // Gracefully ignore dialog or execution issues
    }

    return false;
}

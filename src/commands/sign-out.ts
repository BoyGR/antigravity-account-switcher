import * as vscode from "vscode";

import {
    getAntigravityAuthStatus,
    signOutFromAntigravity,
} from "../antigravity/hub-auth-client";
import { syncAntigravityUi } from "../antigravity/ui-sync";

const COMMAND_ID =
    "boygr.antigravityAccountSwitcher.signOut";

const OUTPUT_CHANNEL =
    "Antigravity Sign Out";

export function registerSignOutCommand(
    context: vscode.ExtensionContext
): void {
    const disposable =
        vscode.commands.registerCommand(
            COMMAND_ID,
            async () => {
                const output =
                    vscode.window.createOutputChannel(
                        OUTPUT_CHANNEL
                    );

                context.subscriptions.push(output);

                output.clear();
                output.show(true);

                output.appendLine(
                    "=== Antigravity Sign Out ==="
                );

                output.appendLine("");

                try {
                    // ================================================
                    // Preflight
                    // ================================================

                    const before =
                        await getAntigravityAuthStatus();

                    output.appendLine(
                        "## Current Authentication"
                    );

                    output.appendLine("");

                    output.appendLine(
                        `Token : ${
                            before.hasToken
                                ? "Present"
                                : "Not present"
                        }`
                    );

                    output.appendLine(
                        `Valid : ${
                            before.hasValidAuth === true
                                ? "Yes"
                                : before.hasValidAuth === false
                                ? "No"
                                : "Unknown"
                        }`
                    );

                    if (!before.hasToken) {
                        output.appendLine("");
                        output.appendLine(
                            "Sign Out was NOT started."
                        );

                        output.appendLine(
                            "Reason: Antigravity has no authentication token."
                        );

                        vscode.window.showInformationMessage(
                            "Antigravity is already signed out."
                        );

                        return;
                    }

                    // ================================================
                    // Explicit confirmation
                    // ================================================

                    const confirmation =
                        await vscode.window.showWarningMessage(
                            "Sign out from the active Antigravity Google session?",
                            {
                                modal: true,
                                detail:
                                    "This calls Antigravity's own AuthLogout backend. " +
                                    "You may need to sign in again afterward."
                            },
                            "Sign Out"
                        );

                    if (confirmation !== "Sign Out") {
                        output.appendLine("");
                        output.appendLine(
                            "Cancelled by user."
                        );

                        return;
                    }

                    output.appendLine("");
                    output.appendLine(
                        "## Sign Out"
                    );

                    output.appendLine("");
                    output.appendLine(
                        "Calling Antigravity AuthLogout RPC..."
                    );

                    // ================================================
                    // Mutation
                    // ================================================

                    await vscode.window.withProgress(
                        {
                            location:
                                vscode.ProgressLocation
                                    .Notification,

                            title:
                                "Antigravity: signing out...",

                            cancellable: false,
                        },

                        async () =>
                            signOutFromAntigravity()
                    );

                    // ================================================
                    // Read-only verification
                    // ================================================

                    const after =
                        await getAntigravityAuthStatus();

                    output.appendLine("");
                    output.appendLine(
                        "## Result"
                    );

                    output.appendLine("");

                    output.appendLine(
                        `Verified token : ${
                            after.hasToken
                                ? "Present"
                                : "Not present"
                        }`
                    );

                    output.appendLine(
                        `Verified auth  : ${
                            after.hasValidAuth === true
                                ? "Valid"
                                : after.hasValidAuth === false
                                ? "Invalid"
                                : "Unknown"
                        }`
                    );

                    output.appendLine("");

                    output.appendLine(
                        "## Security"
                    );

                    output.appendLine("");

                    output.appendLine(
                        "Backend              : Antigravity AuthLogout RPC"
                    );

                    output.appendLine(
                        "CSRF                  : Memory only"
                    );

                    output.appendLine(
                        "Access token          : Never read"
                    );

                    output.appendLine(
                        "Refresh token         : Never read"
                    );

                    output.appendLine(
                        "Credentials persisted : No"
                    );

                    output.appendLine(
                        "state.vscdb modified  : No"
                    );

                    if (!after.hasToken) {
                        output.appendLine("");
                        output.appendLine(
                            "=== Sign Out successful ==="
                        );

                        vscode.window.showInformationMessage(
                            "Antigravity sign-out completed successfully."
                        );
                    } else {
                        output.appendLine("");
                        output.appendLine(
                            "=== AuthLogout returned but token is still present ==="
                        );

                        vscode.window.showWarningMessage(
                            "Antigravity AuthLogout returned, but authentication is still present."
                        );
                    }

                    try {
                        const syncResult = await syncAntigravityUi();
                        if (!syncResult.syncedOfficialPanel) {
                            const choice = await vscode.window.showInformationMessage(
                                "Antigravity sign-out completed. Reload window to update the official Antigravity panel?",
                                "Reload Window",
                                "Later",
                            );
                            if (choice === "Reload Window") {
                                await vscode.commands.executeCommand(
                                    "workbench.action.reloadWindow",
                                );
                            }
                        }
                    } catch {
                        // Safely ignore sync failure
                    }
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    output.appendLine("");
                    output.appendLine(
                        "## Error"
                    );

                    output.appendLine("");
                    output.appendLine(message);

                    vscode.window.showErrorMessage(
                        `Antigravity Sign Out failed: ${message}`
                    );

                    try {
                        await syncAntigravityUi();
                    } catch {
                        // Safely ignore secondary sync error
                    }
                }
            }
        );

    context.subscriptions.push(disposable);
}

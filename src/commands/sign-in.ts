import * as vscode from "vscode";

import {
    getAntigravityAuthStatus,
    signInToAntigravity,
} from "../antigravity/hub-auth-client";

const COMMAND_ID =
    "boygr.antigravityAccountSwitcher.signIn";

const OUTPUT_CHANNEL =
    "BoyGR Antigravity Sign In";

export function registerSignInCommand(
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
                    "=== BoyGR Antigravity Sign In ==="
                );

                output.appendLine("");

                try {
                    // ------------------------------------------------
                    // Safety preflight.
                    //
                    // Sign In is deliberately NOT used as Re-auth.
                    // ------------------------------------------------

                    const current =
                        await getAntigravityAuthStatus();

                    output.appendLine(
                        "## Current Authentication"
                    );

                    output.appendLine("");

                    output.appendLine(
                        `Token : ${
                            current.hasToken
                                ? "Present"
                                : "Not present"
                        }`
                    );

                    const currentValidity =
                        current.hasValidAuth === true
                            ? "Yes"
                            : current.hasValidAuth ===
                              false
                            ? "No"
                            : "Not queried";

                    output.appendLine(
                        `Valid : ${currentValidity}`
                    );

                    if (
                        current.hasToken &&
                        current.hasValidAuth === true
                    ) {
                        output.appendLine("");
                        output.appendLine(
                            "Sign In was NOT started."
                        );

                        output.appendLine(
                            "Reason: Antigravity already has valid authentication."
                        );

                        output.appendLine("");
                        output.appendLine(
                            "Use the future Re-auth command when intentionally changing/re-authenticating the active Google account."
                        );

                        vscode.window.showInformationMessage(
                            "Antigravity is already signed in. Sign In was not started."
                        );

                        return;
                    }

                    // ------------------------------------------------
                    // Explicit mutation confirmation.
                    // ------------------------------------------------

                    const confirmation =
                        await vscode.window.showWarningMessage(
                            "Start Antigravity's Google sign-in flow? " +
                                "This can open your browser and change " +
                                "Antigravity authentication.",
                            {
                                modal: true,
                            },
                            "Sign In"
                        );

                    if (confirmation !== "Sign In") {
                        output.appendLine("");
                        output.appendLine(
                            "Cancelled by user."
                        );

                        return;
                    }

                    output.appendLine("");
                    output.appendLine(
                        "## Sign In"
                    );

                    output.appendLine("");
                    output.appendLine(
                        "Starting Antigravity's own login flow..."
                    );

                    const loginResult =
                        await vscode.window.withProgress(
                            {
                                location:
                                    vscode.ProgressLocation
                                        .Notification,
                                title:
                                    "Antigravity: waiting for sign-in...",
                                cancellable: false,
                            },
                            async () =>
                                signInToAntigravity()
                        );

                    // ------------------------------------------------
                    // Verify final state through the already proven
                    // read-only auth status RPC.
                    // ------------------------------------------------

                    const verified =
                        await getAntigravityAuthStatus();

                    output.appendLine("");
                    output.appendLine(
                        "## Result"
                    );

                    output.appendLine("");

                    output.appendLine(
                        `Login response valid : ${
                            loginResult.hasValidAuth ===
                            true
                                ? "Yes"
                                : loginResult.hasValidAuth ===
                                  false
                                ? "No"
                                : "Unknown"
                        }`
                    );

                    output.appendLine(
                        `Verified token       : ${
                            verified.hasToken
                                ? "Present"
                                : "Not present"
                        }`
                    );

                    output.appendLine(
                        `Verified auth        : ${
                            verified.hasValidAuth ===
                            true
                                ? "Valid"
                                : verified.hasValidAuth ===
                                  false
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
                        "OAuth implementation : Antigravity"
                    );
                    output.appendLine(
                        "CSRF                 : Memory only"
                    );
                    output.appendLine(
                        "Access token         : Never read"
                    );
                    output.appendLine(
                        "Refresh token        : Never read"
                    );
                    output.appendLine(
                        "Credentials persisted: No"
                    );

                    if (
                        verified.hasToken &&
                        verified.hasValidAuth === true
                    ) {
                        output.appendLine("");
                        output.appendLine(
                            "=== Sign In successful ==="
                        );

                        vscode.window.showInformationMessage(
                            "Antigravity sign-in completed successfully."
                        );
                    } else {
                        output.appendLine("");
                        output.appendLine(
                            "=== Sign In did not reach valid authentication ==="
                        );

                        vscode.window.showWarningMessage(
                            "Antigravity login returned, but valid authentication was not confirmed."
                        );
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
                        `BoyGR Antigravity Sign In failed: ${message}`
                    );
                }
            }
        );

    context.subscriptions.push(disposable);
}
import * as vscode from "vscode";

import {
    getAntigravityAuthStatus,
    reauthenticateAntigravity,
} from "../antigravity/hub-auth-client";

const COMMAND_ID =
    "boygr.antigravityAccountSwitcher.reAuth";

const OUTPUT_CHANNEL =
    "BoyGR Antigravity Re-auth";

export function registerReAuthCommand(
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
                    "=== BoyGR Antigravity Re-auth ==="
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

                    if (
                        !before.hasToken ||
                        before.hasValidAuth !== true
                    ) {
                        output.appendLine("");
                        output.appendLine(
                            "Re-auth was NOT started."
                        );

                        output.appendLine(
                            "Reason: there is no currently valid Antigravity session."
                        );

                        output.appendLine("");
                        output.appendLine(
                            "Use BoyGR AG: Sign In instead."
                        );

                        vscode.window.showInformationMessage(
                            "Antigravity is not currently signed in with valid authentication."
                        );

                        return;
                    }

                    // ================================================
                    // Explicit confirmation
                    // ================================================

                    const confirmation =
                        await vscode.window.showWarningMessage(
                            "Re-authenticate the active Antigravity Google session? " +
                                "Antigravity may open your browser or Google account chooser, " +
                                "and the active Antigravity account may change.",
                            {
                                modal: true,
                                detail:
                                    "No credentials will be copied or stored by BoyGR AG. " +
                                    "This uses Antigravity's own Login backend."
                            },
                            "Start Re-auth"
                        );

                    if (
                        confirmation !==
                        "Start Re-auth"
                    ) {
                        output.appendLine("");
                        output.appendLine(
                            "Cancelled by user."
                        );

                        return;
                    }

                    output.appendLine("");
                    output.appendLine(
                        "## Re-auth"
                    );

                    output.appendLine("");
                    output.appendLine(
                        "Calling Antigravity Login RPC for the existing authenticated session..."
                    );

                    // ================================================
                    // Mutation
                    // ================================================

                    const result =
                        await vscode.window.withProgress(
                            {
                                location:
                                    vscode.ProgressLocation
                                        .Notification,

                                title:
                                    "Antigravity: re-authentication in progress...",

                                cancellable: false,
                            },

                            async () =>
                                reauthenticateAntigravity()
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
                        `Login response valid : ${
                            result.hasValidAuth === true
                                ? "Yes"
                                : result.hasValidAuth === false
                                ? "No"
                                : "Unknown"
                        }`
                    );

                    output.appendLine(
                        `Verified token       : ${
                            after.hasToken
                                ? "Present"
                                : "Not present"
                        }`
                    );

                    output.appendLine(
                        `Verified auth        : ${
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
                        "Backend              : Antigravity Login RPC"
                    );

                    output.appendLine(
                        "AuthLogout            : Not called"
                    );

                    output.appendLine(
                        "OAuth implementation  : Antigravity"
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

                    if (
                        after.hasToken &&
                        after.hasValidAuth === true
                    ) {
                        output.appendLine("");
                        output.appendLine(
                            "=== Re-auth returned with valid authentication ==="
                        );

                        vscode.window.showInformationMessage(
                            "Antigravity Re-auth returned with valid authentication."
                        );
                    } else {
                        output.appendLine("");
                        output.appendLine(
                            "=== Re-auth did not finish with valid authentication ==="
                        );

                        vscode.window.showWarningMessage(
                            "Antigravity Re-auth returned, but valid authentication was not confirmed."
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
                        `BoyGR Antigravity Re-auth failed: ${message}`
                    );
                }
            }
        );

    context.subscriptions.push(disposable);
}
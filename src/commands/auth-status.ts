import * as vscode from "vscode";
import {
    getAntigravityAuthStatus,
} from "../antigravity/hub-auth-client";

const COMMAND_ID =
    "boygr.antigravityAccountSwitcher.authStatus";

const OUTPUT_CHANNEL =
    "Antigravity Auth Status";

export function registerAuthStatusCommand(
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
                    "=== Antigravity Auth Status ==="
                );
                output.appendLine("");

                try {
                    const status =
                        await vscode.window.withProgress(
                            {
                                location:
                                    vscode.ProgressLocation
                                        .Notification,
                                title:
                                    "Reading Antigravity auth status...",
                                cancellable: false,
                            },
                            async () =>
                                getAntigravityAuthStatus()
                        );

                    output.appendLine(
                        "## AGY Backend"
                    );
                    output.appendLine("");
                    output.appendLine(
                        `Running   : Yes`
                    );
                    output.appendLine(
                        `PID       : ${status.agyPid}`
                    );

                    output.appendLine("");
                    output.appendLine(
                        "## Transport"
                    );
                    output.appendLine("");
                    output.appendLine(
                        `Hub Port  : ${status.hubPort}`
                    );
                    output.appendLine(
                        `LS Port   : ${status.lsPort}`
                    );
                    output.appendLine(
                        `Service   : ${status.serviceName}`
                    );

                    output.appendLine("");
                    output.appendLine(
                        "## Authentication"
                    );
                    output.appendLine("");

                    output.appendLine(
                        `Token     : ${
                            status.hasToken
                                ? "Present"
                                : "Not present"
                        }`
                    );

                    const validity =
                        status.hasValidAuth === true
                            ? "Yes"
                            : status.hasValidAuth ===
                              false
                            ? "No"
                            : "Not queried";

                    output.appendLine(
                        `Valid     : ${validity}`
                    );

                    output.appendLine("");
                    output.appendLine(
                        "## Granted Scopes"
                    );
                    output.appendLine("");

                    if (
                        status.grantedScopes.length ===
                        0
                    ) {
                        output.appendLine(
                            "(none)"
                        );
                    } else {
                        for (
                            const scope of
                            status.grantedScopes
                        ) {
                            output.appendLine(
                                `- ${scope}`
                            );
                        }
                    }

                    output.appendLine("");
                    output.appendLine(
                        "## Security"
                    );
                    output.appendLine("");
                    output.appendLine(
                        "CSRF      : Memory only"
                    );
                    output.appendLine(
                        "Tokens    : Never displayed"
                    );
                    output.appendLine(
                        "Mutation  : None"
                    );

                    output.appendLine("");
                    output.appendLine(
                        "=== Read-only auth status complete ==="
                    );
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    output.appendLine(
                        "## Error"
                    );
                    output.appendLine("");
                    output.appendLine(message);

                    vscode.window.showErrorMessage(
                        `Antigravity Auth Status failed: ${message}`
                    );
                }
            }
        );

    context.subscriptions.push(disposable);
}

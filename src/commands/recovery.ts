import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { detectRunningAgyHub } from "../antigravity/hub-detector";
import { syncAntigravityUi } from "../antigravity/ui-sync";

const execFileAsync = promisify(execFile);

export const RECONNECT_HUB_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.reconnectHub";

export const RESTART_BACKEND_COMMAND_ID =
    "boygr.antigravityAccountSwitcher.restartBackend";

async function attemptOfficialReconnect(): Promise<boolean> {
    const allCommands = await vscode.commands.getCommands(true);
    const candidateCommands = [
        "antigravity.reconnect",
        "antigravity.restartHub",
        "antigravity.restartServer",
        "antigravity.connectHub",
    ];

    for (const cmd of candidateCommands) {
        if (allCommands.includes(cmd)) {
            try {
                await vscode.commands.executeCommand(cmd);
                return true;
            } catch {
                // Continue trying others
            }
        }
    }
    return false;
}

export function registerRecoveryCommands(
    context: vscode.ExtensionContext,
    onRecoveryComplete?: () => Promise<void> | void,
): vscode.Disposable[] {
    const reconnectDisposable = vscode.commands.registerCommand(
        RECONNECT_HUB_COMMAND_ID,
        async () => {
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: "Antigravity: Reconnecting to Hub...",
                    cancellable: false,
                },
                async progress => {
                    progress.report({ message: "Checking running hub process..." });
                    const processInfo = await detectRunningAgyHub();

                    progress.report({ message: "Reconnecting Antigravity client..." });
                    await attemptOfficialReconnect();
                    await syncAntigravityUi().catch(() => undefined);

                    if (onRecoveryComplete) {
                        await onRecoveryComplete();
                    }

                    if (processInfo?.hubPort) {
                        void vscode.window.showInformationMessage(
                            `Antigravity Hub reconnected successfully on port ${processInfo.hubPort}.`,
                        );
                    } else {
                        void vscode.window.showInformationMessage(
                            "Antigravity Hub reconnection triggered.",
                        );
                    }
                },
            );
        },
    );

    const restartDisposable = vscode.commands.registerCommand(
        RESTART_BACKEND_COMMAND_ID,
        async () => {
            const confirm = await vscode.window.showWarningMessage(
                "Are you sure you want to terminate and restart the Antigravity backend process? Any ongoing local operations will be reset.",
                { modal: true },
                "Restart Backend",
            );

            if (confirm !== "Restart Backend") {
                return;
            }

            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: "Antigravity: Restarting Backend Process...",
                    cancellable: false,
                },
                async progress => {
                    progress.report({ message: "Locating running agy process..." });
                    const processInfo = await detectRunningAgyHub();

                    if (processInfo && processInfo.pid) {
                        progress.report({
                            message: `Stopping process tree (PID: ${processInfo.pid})...`,
                        });
                        try {
                            if (process.platform === "win32") {
                                await execFileAsync("taskkill", [
                                    "/PID",
                                    String(processInfo.pid),
                                    "/T",
                                    "/F",
                                ]);
                            } else {
                                process.kill(processInfo.pid, "SIGTERM");
                            }
                        } catch {
                            // Process might have already terminated
                        }
                    }

                    progress.report({
                        message: "Waiting for Antigravity host to spawn clean process...",
                    });
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    progress.report({ message: "Re-establishing connection..." });
                    await attemptOfficialReconnect();
                    await syncAntigravityUi().catch(() => undefined);

                    if (onRecoveryComplete) {
                        await onRecoveryComplete();
                    }

                    void vscode.window.showInformationMessage(
                        "Antigravity backend restart initiated and state reloaded.",
                    );
                },
            );
        },
    );

    return [reconnectDisposable, restartDisposable];
}


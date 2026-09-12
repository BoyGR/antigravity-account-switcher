import * as vscode from 'vscode';
import {
    inspectAntigravityHub,
    AntigravityHubStatus,
} from '../antigravity/hub-detector';

export const STATUS_COMMAND_ID =
    'boygr.antigravityAccountSwitcher.status';

let outputChannel: vscode.OutputChannel | undefined;

function getOutputChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel(
            'Antigravity Account Switcher',
        );
    }

    return outputChannel;
}

function yesNo(value: boolean): string {
    return value ? 'Yes' : 'No';
}

function formatStatus(
    status: AntigravityHubStatus,
): string[] {
    const lines: string[] = [];

    lines.push('=== Antigravity Account Switcher ===');
    lines.push('');
    lines.push('Official Extension');
    lines.push('------------------');
    lines.push(
        `Installed : ${yesNo(status.extension.installed)}`,
    );
    lines.push(
        `Active    : ${yesNo(status.extension.active)}`,
    );
    lines.push(
        `Version   : ${status.extension.version ?? 'Unknown'}`,
    );

    if (status.extension.extensionPath) {
        lines.push(
            `Path      : ${status.extension.extensionPath}`,
        );
    }

    lines.push('');
    lines.push('AGY Backend');
    lines.push('-----------');

    if (!status.process) {
        lines.push('Running   : No');
        lines.push('');
        lines.push(
            'Antigravity Hub is not currently running.',
        );

        return lines;
    }

    lines.push('Running   : Yes');
    lines.push(`PID       : ${status.process.pid}`);
    lines.push(
        `Version   : ${status.agyVersion ?? 'Unknown'}`,
    );

    if (status.process.executablePath) {
        lines.push(
            `Executable: ${status.process.executablePath}`,
        );
    }

    lines.push('');
    lines.push('Hub');
    lines.push('---');
    lines.push(
        `Port      : ${status.process.hubPort ?? 'Unknown'}`,
    );
    lines.push(
        `URL       : ${status.hubUrl ?? 'Unknown'}`,
    );

    if (status.health) {
        lines.push(
            `Reachable : ${yesNo(status.health.reachable)}`,
        );

        if (status.health.statusCode !== undefined) {
            lines.push(
                `HTTP      : ${status.health.statusCode}`,
            );
        }

        if (status.health.contentType) {
            lines.push(
                `Content   : ${status.health.contentType}`,
            );
        }

        if (status.health.error) {
            lines.push(
                `Error     : ${status.health.error}`,
            );
        }
    }

    lines.push('');
    lines.push('Auth');
    lines.push('----');
    lines.push(
        'Status    : Use "Antigravity Account Switcher: Auth Status" for detailed read-only authentication status',
    );

    return lines;
}

export function registerStatusCommand(
    context: vscode.ExtensionContext,
): void {
    const disposable = vscode.commands.registerCommand(
        STATUS_COMMAND_ID,
        async () => {
            const channel = getOutputChannel();

            channel.clear();
            channel.appendLine(
                'Inspecting Antigravity runtime...',
            );
            channel.appendLine('');

            try {
                const status =
                    await inspectAntigravityHub();

                channel.clear();

                for (const line of formatStatus(status)) {
                    channel.appendLine(line);
                }

                channel.show(true);

                if (
                    status.process &&
                    status.health?.reachable
                ) {
                    void vscode.window.showInformationMessage(
                        `Antigravity Hub detected on port ${
                            status.process.hubPort ?? '?'
                        }${
                            status.agyVersion
                                ? ` (AGY ${status.agyVersion})`
                                : ''
                        }.`,
                    );
                }
                else if (status.extension.installed) {
                    void vscode.window.showWarningMessage(
                        'Google Antigravity is installed, but its Hub is not currently reachable.',
                    );
                }
                else {
                    void vscode.window.showWarningMessage(
                        'Google Antigravity extension is not installed.',
                    );
                }
            }
            catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : String(error);

                channel.appendLine('');
                channel.appendLine(`Error: ${message}`);
                channel.show(true);

                void vscode.window.showErrorMessage(
                    `Antigravity Account Switcher status failed: ${message}`,
                );
            }
        },
    );

    context.subscriptions.push(
        disposable,
        {
            dispose: () => {
                outputChannel?.dispose();
                outputChannel = undefined;
            },
        },
    );
}

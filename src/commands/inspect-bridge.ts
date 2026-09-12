import * as vscode from 'vscode';
import {
    inspectAntigravityBridge,
} from '../antigravity/bridge-inspector';

export const INSPECT_BRIDGE_COMMAND_ID =
    'boygr.antigravityAccountSwitcher.inspectBridge';

let outputChannel:
    vscode.OutputChannel | undefined;

function getOutputChannel():
    vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel =
            vscode.window.createOutputChannel(
                'Antigravity Bridge Inspector',
            );
    }

    return outputChannel;
}

function yesNo(value: boolean): string {
    return value ? 'Yes' : 'No';
}

export function registerInspectBridgeCommand(
    context: vscode.ExtensionContext,
): void {
    const disposable =
        vscode.commands.registerCommand(
            INSPECT_BRIDGE_COMMAND_ID,
            async () => {
                const output =
                    getOutputChannel();

                output.clear();

                output.appendLine(
                    '=== Antigravity Bridge Inspector ===',
                );
                output.appendLine(
                    'READ-ONLY MODE',
                );
                output.appendLine('');

                try {
                    const result =
                        await inspectAntigravityBridge();

                    output.appendLine(
                        'Official Extension',
                    );
                    output.appendLine(
                        '------------------',
                    );

                    output.appendLine(
                        `Installed : ${
                            yesNo(
                                result.extensionInstalled,
                            )
                        }`,
                    );

                    output.appendLine(
                        `Active    : ${
                            yesNo(
                                result.extensionActive,
                            )
                        }`,
                    );

                    output.appendLine(
                        `Version   : ${
                            result.extensionVersion ??
                            'Unknown'
                        }`,
                    );

                    output.appendLine('');
                    output.appendLine(
                        'Extension API Exports',
                    );
                    output.appendLine(
                        '---------------------',
                    );

                    output.appendLine(
                        `Available : ${
                            yesNo(
                                result.exportsAvailable,
                            )
                        }`,
                    );

                    output.appendLine(
                        `Type      : ${
                            result.exportsType
                        }`,
                    );

                    if (
                        result.exportMembers.length === 0
                    ) {
                        output.appendLine(
                            'Members   : None',
                        );
                    }
                    else {
                        output.appendLine(
                            'Members:',
                        );

                        for (
                            const member
                            of result.exportMembers
                        ) {
                            output.appendLine(
                                `  - ${member.path} [${member.kind}]`,
                            );
                        }
                    }

                    output.appendLine('');
                    output.appendLine(
                        'Package Commands',
                    );
                    output.appendLine(
                        '----------------',
                    );

                    if (
                        result.packageCommands.length
                        === 0
                    ) {
                        output.appendLine(
                            'None found.',
                        );
                    }
                    else {
                        for (
                            const command
                            of result.packageCommands
                        ) {
                            output.appendLine(
                                `- ${command.id}`,
                            );
                        }
                    }

                    output.appendLine('');
                    output.appendLine(
                        'Runtime Commands',
                    );
                    output.appendLine(
                        '----------------',
                    );

                    if (
                        result.runtimeCommands.length
                        === 0
                    ) {
                        output.appendLine(
                            'None found.',
                        );
                    }
                    else {
                        for (
                            const command
                            of result.runtimeCommands
                        ) {
                            output.appendLine(
                                `- ${command.id}`,
                            );
                        }
                    }

                    output.appendLine('');
                    output.appendLine(
                        'Views / Containers',
                    );
                    output.appendLine(
                        '------------------',
                    );

                    if (
                        result.packageViews.length
                        === 0
                    ) {
                        output.appendLine(
                            'None found.',
                        );
                    }
                    else {
                        for (
                            const id
                            of result.packageViews
                        ) {
                            output.appendLine(
                                `- ${id}`,
                            );
                        }
                    }

                    output.appendLine('');
                    output.appendLine(
                        'Relevant Configuration',
                    );
                    output.appendLine(
                        '----------------------',
                    );

                    if (
                        result
                            .packageConfigurationKeys
                            .length === 0
                    ) {
                        output.appendLine(
                            'None found.',
                        );
                    }
                    else {
                        for (
                            const key
                            of result
                                .packageConfigurationKeys
                        ) {
                            output.appendLine(
                                `- ${key}`,
                            );
                        }
                    }

                    output.appendLine('');
                    output.appendLine(
                        'Safety',
                    );
                    output.appendLine(
                        '------',
                    );
                    output.appendLine(
                        '- No command was invoked on Google Antigravity.',
                    );
                    output.appendLine(
                        '- No auth RPC was called.',
                    );
                    output.appendLine(
                        '- No login/logout operation was performed.',
                    );
                    output.appendLine(
                        '- No credential/token value was read.',
                    );
                    output.appendLine(
                        '- Getters on extension exports were not executed.',
                    );

                    output.show(true);

                    void vscode.window
                        .showInformationMessage(
                            'Antigravity bridge inspection completed.',
                        );
                }
                catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    output.appendLine('');
                    output.appendLine(
                        `ERROR: ${message}`,
                    );

                    output.show(true);

                    void vscode.window
                        .showErrorMessage(
                            `Bridge inspection failed: ${message}`,
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

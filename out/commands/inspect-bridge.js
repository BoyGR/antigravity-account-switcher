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
exports.INSPECT_BRIDGE_COMMAND_ID = void 0;
exports.registerInspectBridgeCommand = registerInspectBridgeCommand;
const vscode = __importStar(require("vscode"));
const bridge_inspector_1 = require("../antigravity/bridge-inspector");
exports.INSPECT_BRIDGE_COMMAND_ID = 'boygr.antigravityAccountSwitcher.inspectBridge';
let outputChannel;
function getOutputChannel() {
    if (!outputChannel) {
        outputChannel =
            vscode.window.createOutputChannel('Antigravity Bridge Inspector');
    }
    return outputChannel;
}
function yesNo(value) {
    return value ? 'Yes' : 'No';
}
function registerInspectBridgeCommand(context) {
    const disposable = vscode.commands.registerCommand(exports.INSPECT_BRIDGE_COMMAND_ID, async () => {
        const output = getOutputChannel();
        output.clear();
        output.appendLine('=== Antigravity Bridge Inspector ===');
        output.appendLine('READ-ONLY MODE');
        output.appendLine('');
        try {
            const result = await (0, bridge_inspector_1.inspectAntigravityBridge)();
            output.appendLine('Official Extension');
            output.appendLine('------------------');
            output.appendLine(`Installed : ${yesNo(result.extensionInstalled)}`);
            output.appendLine(`Active    : ${yesNo(result.extensionActive)}`);
            output.appendLine(`Version   : ${result.extensionVersion ??
                'Unknown'}`);
            output.appendLine('');
            output.appendLine('Extension API Exports');
            output.appendLine('---------------------');
            output.appendLine(`Available : ${yesNo(result.exportsAvailable)}`);
            output.appendLine(`Type      : ${result.exportsType}`);
            if (result.exportMembers.length === 0) {
                output.appendLine('Members   : None');
            }
            else {
                output.appendLine('Members:');
                for (const member of result.exportMembers) {
                    output.appendLine(`  - ${member.path} [${member.kind}]`);
                }
            }
            output.appendLine('');
            output.appendLine('Package Commands');
            output.appendLine('----------------');
            if (result.packageCommands.length
                === 0) {
                output.appendLine('None found.');
            }
            else {
                for (const command of result.packageCommands) {
                    output.appendLine(`- ${command.id}`);
                }
            }
            output.appendLine('');
            output.appendLine('Runtime Commands');
            output.appendLine('----------------');
            if (result.runtimeCommands.length
                === 0) {
                output.appendLine('None found.');
            }
            else {
                for (const command of result.runtimeCommands) {
                    output.appendLine(`- ${command.id}`);
                }
            }
            output.appendLine('');
            output.appendLine('Views / Containers');
            output.appendLine('------------------');
            if (result.packageViews.length
                === 0) {
                output.appendLine('None found.');
            }
            else {
                for (const id of result.packageViews) {
                    output.appendLine(`- ${id}`);
                }
            }
            output.appendLine('');
            output.appendLine('Relevant Configuration');
            output.appendLine('----------------------');
            if (result
                .packageConfigurationKeys
                .length === 0) {
                output.appendLine('None found.');
            }
            else {
                for (const key of result
                    .packageConfigurationKeys) {
                    output.appendLine(`- ${key}`);
                }
            }
            output.appendLine('');
            output.appendLine('Safety');
            output.appendLine('------');
            output.appendLine('- No command was invoked on Google Antigravity.');
            output.appendLine('- No auth RPC was called.');
            output.appendLine('- No login/logout operation was performed.');
            output.appendLine('- No credential/token value was read.');
            output.appendLine('- Getters on extension exports were not executed.');
            output.show(true);
            void vscode.window
                .showInformationMessage('Antigravity bridge inspection completed.');
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            output.appendLine('');
            output.appendLine(`ERROR: ${message}`);
            output.show(true);
            void vscode.window
                .showErrorMessage(`Bridge inspection failed: ${message}`);
        }
    });
    context.subscriptions.push(disposable, {
        dispose: () => {
            outputChannel?.dispose();
            outputChannel = undefined;
        },
    });
}
//# sourceMappingURL=inspect-bridge.js.map
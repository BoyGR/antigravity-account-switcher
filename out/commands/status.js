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
exports.STATUS_COMMAND_ID = void 0;
exports.registerStatusCommand = registerStatusCommand;
const vscode = __importStar(require("vscode"));
const hub_detector_1 = require("../antigravity/hub-detector");
exports.STATUS_COMMAND_ID = 'boygr.antigravityAccountSwitcher.status';
let outputChannel;
function getOutputChannel() {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('Antigravity Account Switcher');
    }
    return outputChannel;
}
function yesNo(value) {
    return value ? 'Yes' : 'No';
}
function formatStatus(status) {
    const lines = [];
    lines.push('=== Antigravity Account Switcher ===');
    lines.push('');
    lines.push('Official Extension');
    lines.push('------------------');
    lines.push(`Installed : ${yesNo(status.extension.installed)}`);
    lines.push(`Active    : ${yesNo(status.extension.active)}`);
    lines.push(`Version   : ${status.extension.version ?? 'Unknown'}`);
    if (status.extension.extensionPath) {
        lines.push(`Path      : ${status.extension.extensionPath}`);
    }
    lines.push('');
    lines.push('AGY Backend');
    lines.push('-----------');
    if (!status.process) {
        lines.push('Running   : No');
        lines.push('');
        lines.push('Antigravity Hub is not currently running.');
        return lines;
    }
    lines.push('Running   : Yes');
    lines.push(`PID       : ${status.process.pid}`);
    lines.push(`Version   : ${status.agyVersion ?? 'Unknown'}`);
    if (status.process.executablePath) {
        lines.push(`Executable: ${status.process.executablePath}`);
    }
    lines.push('');
    lines.push('Hub');
    lines.push('---');
    lines.push(`Port      : ${status.process.hubPort ?? 'Unknown'}`);
    lines.push(`URL       : ${status.hubUrl ?? 'Unknown'}`);
    if (status.health) {
        lines.push(`Reachable : ${yesNo(status.health.reachable)}`);
        if (status.health.statusCode !== undefined) {
            lines.push(`HTTP      : ${status.health.statusCode}`);
        }
        if (status.health.contentType) {
            lines.push(`Content   : ${status.health.contentType}`);
        }
        if (status.health.error) {
            lines.push(`Error     : ${status.health.error}`);
        }
    }
    lines.push('');
    lines.push('Auth');
    lines.push('----');
    lines.push('Status    : Use "Antigravity Account Switcher: Auth Status" for detailed read-only authentication status');
    return lines;
}
function registerStatusCommand(context) {
    const disposable = vscode.commands.registerCommand(exports.STATUS_COMMAND_ID, async () => {
        const channel = getOutputChannel();
        channel.clear();
        channel.appendLine('Inspecting Antigravity runtime...');
        channel.appendLine('');
        try {
            const status = await (0, hub_detector_1.inspectAntigravityHub)();
            channel.clear();
            for (const line of formatStatus(status)) {
                channel.appendLine(line);
            }
            channel.show(true);
            if (status.process &&
                status.health?.reachable) {
                void vscode.window.showInformationMessage(`Antigravity Hub detected on port ${status.process.hubPort ?? '?'}${status.agyVersion
                    ? ` (AGY ${status.agyVersion})`
                    : ''}.`);
            }
            else if (status.extension.installed) {
                void vscode.window.showWarningMessage('Google Antigravity is installed, but its Hub is not currently reachable.');
            }
            else {
                void vscode.window.showWarningMessage('Google Antigravity extension is not installed.');
            }
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : String(error);
            channel.appendLine('');
            channel.appendLine(`Error: ${message}`);
            channel.show(true);
            void vscode.window.showErrorMessage(`Antigravity Account Switcher status failed: ${message}`);
        }
    });
    context.subscriptions.push(disposable, {
        dispose: () => {
            outputChannel?.dispose();
            outputChannel = undefined;
        },
    });
}
//# sourceMappingURL=status.js.map
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
exports.detectOfficialExtension = detectOfficialExtension;
exports.detectRunningAgyHub = detectRunningAgyHub;
exports.probeHub = probeHub;
exports.inspectAntigravityHub = inspectAntigravityHub;
const vscode = __importStar(require("vscode"));
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
const OFFICIAL_EXTENSION_ID = 'google.google-antigravity';
function detectOfficialExtension() {
    const extension = vscode.extensions.getExtension(OFFICIAL_EXTENSION_ID);
    if (!extension) {
        return {
            installed: false,
            active: false,
        };
    }
    return {
        installed: true,
        active: extension.isActive,
        version: typeof extension.packageJSON?.version === 'string'
            ? extension.packageJSON.version
            : undefined,
        extensionPath: extension.extensionPath,
    };
}
function parseHubPort(commandLine) {
    if (!commandLine) {
        return undefined;
    }
    const match = commandLine.match(/--hub-port=(\d+)/i);
    if (!match) {
        return undefined;
    }
    const port = Number(match[1]);
    if (!Number.isInteger(port) ||
        port <= 0 ||
        port > 65535) {
        return undefined;
    }
    return port;
}
async function detectRunningAgyHub() {
    if (process.platform !== 'win32') {
        return undefined;
    }
    /*
     * Intentionally avoid PowerShell backtick line
     * continuations here because this script itself lives
     * inside a TypeScript template literal.
     */
    const ps = [
        '$processes = @(',
        '    Get-CimInstance Win32_Process |',
        "        Where-Object { $_.Name -ieq 'agy.exe' -and $_.CommandLine -match '(?i)--hub(?:\\s|$)' } |",
        '        Select-Object ProcessId, ParentProcessId, ExecutablePath, CommandLine',
        ')',
        '',
        'if ($processes.Count -eq 0) {',
        "    '[]'",
        '}',
        'else {',
        '    $processes | ConvertTo-Json -Compress -Depth 4',
        '}',
    ].join('\n');
    try {
        const { stdout } = await execFileAsync('powershell.exe', [
            '-NoLogo',
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            ps,
        ], {
            windowsHide: true,
            timeout: 5000,
            maxBuffer: 1024 * 1024,
        });
        const raw = stdout.trim();
        if (!raw) {
            return undefined;
        }
        const parsed = JSON.parse(raw);
        const records = Array.isArray(parsed)
            ? parsed
            : [parsed];
        const record = records.find((item) => /--hub(?:\s|$)/i.test(item.CommandLine ?? ''));
        if (!record?.ProcessId) {
            return undefined;
        }
        return {
            pid: Number(record.ProcessId),
            parentPid: record.ParentProcessId !== undefined
                ? Number(record.ParentProcessId)
                : undefined,
            executablePath: record.ExecutablePath || undefined,
            commandLine: record.CommandLine || undefined,
            hubPort: parseHubPort(record.CommandLine),
        };
    }
    catch {
        return undefined;
    }
}
async function getAgyVersion(executablePath) {
    const candidates = [
        executablePath,
        path.join(os.homedir(), '.gemini', 'bin', 'agy.exe'),
    ].filter((value) => typeof value === 'string' &&
        value.length > 0);
    for (const candidate of [...new Set(candidates)]) {
        try {
            const { stdout } = await execFileAsync(candidate, ['--version'], {
                windowsHide: true,
                timeout: 3000,
                maxBuffer: 64 * 1024,
            });
            const version = stdout.trim();
            if (version) {
                return version;
            }
        }
        catch {
            // Try the next candidate.
        }
    }
    return undefined;
}
function probeHub(port) {
    return new Promise((resolve) => {
        const request = http.get({
            hostname: '127.0.0.1',
            port,
            path: '/',
            timeout: 3000,
            headers: {
                Accept: 'text/html,*/*;q=0.1',
            },
        }, (response) => {
            /*
             * We only inspect response metadata.
             * The body is discarded.
             */
            response.resume();
            resolve({
                reachable: true,
                statusCode: response.statusCode,
                contentType: typeof response.headers['content-type'] === 'string'
                    ? response.headers['content-type']
                    : undefined,
            });
        });
        request.once('timeout', () => {
            request.destroy(new Error('Hub health request timed out.'));
        });
        request.once('error', (error) => {
            resolve({
                reachable: false,
                error: error.message,
            });
        });
    });
}
async function inspectAntigravityHub() {
    const extension = detectOfficialExtension();
    const processInfo = await detectRunningAgyHub();
    const result = {
        extension,
        process: processInfo,
    };
    if (!processInfo) {
        return result;
    }
    result.agyVersion =
        await getAgyVersion(processInfo.executablePath);
    if (!processInfo.hubPort) {
        return result;
    }
    result.hubUrl =
        'http://127.0.0.1:' +
            processInfo.hubPort;
    result.health =
        await probeHub(processInfo.hubPort);
    return result;
}
//# sourceMappingURL=hub-detector.js.map
import * as vscode from 'vscode';
import * as http from 'http';
import * as path from 'path';
import * as os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const OFFICIAL_EXTENSION_ID = 'google.google-antigravity';

export interface AntigravityExtensionInfo {
    installed: boolean;
    active: boolean;
    version?: string;
    extensionPath?: string;
}

export interface AgyProcessInfo {
    pid: number;
    parentPid?: number;
    executablePath?: string;
    commandLine?: string;
    hubPort?: number;
    backendType?: 'agy' | 'language_server';
    csrfToken?: string;
}

export interface HubHealthInfo {
    reachable: boolean;
    statusCode?: number;
    contentType?: string;
    error?: string;
}

export interface AntigravityHubStatus {
    extension: AntigravityExtensionInfo;
    process?: AgyProcessInfo;
    agyVersion?: string;
    hubUrl?: string;
    health?: HubHealthInfo;
}

interface CimProcessRecord {
    ProcessId?: number;
    ParentProcessId?: number;
    ExecutablePath?: string;
    CommandLine?: string;
}

export function isAntigravityIde(): boolean {
    const appName = vscode.env.appName || '';
    if (/antigravity/i.test(appName)) {
        return true;
    }
    const execPath = process.execPath || '';
    if (/antigravity/i.test(execPath)) {
        return true;
    }
    return false;
}

export function detectOfficialExtension(): AntigravityExtensionInfo {
    const extension =
        vscode.extensions.getExtension('google.antigravity') ||
        vscode.extensions.getExtension(OFFICIAL_EXTENSION_ID);

    if (!extension) {
        return {
            installed: false,
            active: false,
        };
    }

    return {
        installed: true,
        active: extension.isActive,
        version:
            typeof extension.packageJSON?.version === 'string'
                ? extension.packageJSON.version
                : undefined,
        extensionPath: extension.extensionPath,
    };
}

function parseHubPort(
    commandLine?: string,
): number | undefined {
    if (!commandLine) {
        return undefined;
    }

    const match = commandLine.match(
        /--hub-port=(\d+)/i,
    );

    if (!match) {
        return undefined;
    }

    const port = Number(match[1]);

    if (
        !Number.isInteger(port) ||
        port <= 0 ||
        port > 65535
    ) {
        return undefined;
    }

    return port;
}

export async function detectRunningAgyHub(): Promise<
    AgyProcessInfo | undefined
> {
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
        "        Where-Object {",
        "            ($_.Name -ieq 'agy.exe' -and $_.CommandLine -match '(?i)--hub(?:\\s|$)') -or",
        "            ($_.Name -match '(?i)^language_server_' -and $_.CommandLine -match '(?i)--csrf_token\\s+([a-f0-9\\-]+)')",
        "        } |",
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
        const { stdout } = await execFileAsync(
            'powershell.exe',
            [
                '-NoLogo',
                '-NoProfile',
                '-NonInteractive',
                '-Command',
                ps,
            ],
            {
                windowsHide: true,
                timeout: 5000,
                maxBuffer: 1024 * 1024,
            },
        );

        const raw = stdout.trim();

        if (!raw) {
            return undefined;
        }

        const parsed = JSON.parse(raw) as
            | CimProcessRecord
            | CimProcessRecord[];

        const records = Array.isArray(parsed)
            ? parsed
            : [parsed];

        const inIde = isAntigravityIde();
        let record: CimProcessRecord | undefined;

        if (inIde) {
            // In Antigravity IDE, prefer main language_server (not --enable_lsp)
            record =
                records.find(
                    (item) =>
                        /language_server/i.test(item.CommandLine ?? '') &&
                        !/--enable_lsp/i.test(item.CommandLine ?? ''),
                ) ||
                records.find((item) =>
                    /language_server/i.test(item.CommandLine ?? ''),
                ) ||
                records.find((item) =>
                    /--hub(?:\s|$)/i.test(item.CommandLine ?? ''),
                );
        } else {
            // In VS Code, prefer agy.exe
            record =
                records.find((item) =>
                    /--hub(?:\s|$)/i.test(item.CommandLine ?? ''),
                ) ||
                records.find(
                    (item) =>
                        /language_server/i.test(item.CommandLine ?? '') &&
                        !/--enable_lsp/i.test(item.CommandLine ?? ''),
                ) ||
                records.find((item) =>
                    /language_server/i.test(item.CommandLine ?? ''),
                );
        }

        if (!record?.ProcessId) {
            return undefined;
        }

        const isLanguageServer = /language_server/i.test(
            record.ExecutablePath || record.CommandLine || '',
        );

        let csrfToken: string | undefined;
        if (isLanguageServer && record.CommandLine) {
            const csrfMatch = /--csrf_token\s+([a-f0-9\-]+)/i.exec(
                record.CommandLine,
            );
            if (csrfMatch) {
                csrfToken = csrfMatch[1];
            }
        }

        return {
            pid: Number(record.ProcessId),
            parentPid:
                record.ParentProcessId !== undefined
                    ? Number(record.ParentProcessId)
                    : undefined,
            executablePath:
                record.ExecutablePath || undefined,
            commandLine:
                record.CommandLine || undefined,
            hubPort:
                parseHubPort(record.CommandLine),
            backendType: isLanguageServer ? 'language_server' : 'agy',
            csrfToken,
        };
    }
    catch {
        return undefined;
    }
}

async function getAgyVersion(
    executablePath?: string,
): Promise<string | undefined> {
    const candidates = [
        executablePath,
        path.join(
            os.homedir(),
            '.gemini',
            'bin',
            'agy.exe',
        ),
    ].filter(
        (value): value is string =>
            typeof value === 'string' &&
            value.length > 0,
    );

    for (
        const candidate of [...new Set(candidates)]
    ) {
        try {
            const { stdout } = await execFileAsync(
                candidate,
                ['--version'],
                {
                    windowsHide: true,
                    timeout: 3000,
                    maxBuffer: 64 * 1024,
                },
            );

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

export function probeHub(
    port: number,
): Promise<HubHealthInfo> {
    return new Promise((resolve) => {
        const request = http.get(
            {
                hostname: '127.0.0.1',
                port,
                path: '/',
                timeout: 3000,
                headers: {
                    Accept: 'text/html,*/*;q=0.1',
                },
            },
            (response) => {
                /*
                 * We only inspect response metadata.
                 * The body is discarded.
                 */
                response.resume();

                resolve({
                    reachable: true,
                    statusCode:
                        response.statusCode,
                    contentType:
                        typeof response.headers[
                            'content-type'
                        ] === 'string'
                            ? response.headers[
                                'content-type'
                            ]
                            : undefined,
                });
            },
        );

        request.once('timeout', () => {
            request.destroy(
                new Error(
                    'Hub health request timed out.',
                ),
            );
        });

        request.once('error', (error) => {
            resolve({
                reachable: false,
                error: error.message,
            });
        });
    });
}

export async function inspectAntigravityHub():
    Promise<AntigravityHubStatus> {
    const extension =
        detectOfficialExtension();

    const processInfo =
        await detectRunningAgyHub();

    const result: AntigravityHubStatus = {
        extension,
        process: processInfo,
    };

    if (!processInfo) {
        return result;
    }

    result.agyVersion =
        await getAgyVersion(
            processInfo.executablePath,
        );

    if (processInfo.backendType === 'language_server') {
        result.health = {
            reachable: true,
            statusCode: 200,
            contentType: 'application/json',
        };
        return result;
    }

    if (!processInfo.hubPort) {
        return result;
    }

    result.hubUrl =
        'http://127.0.0.1:' +
        processInfo.hubPort;

    result.health =
        await probeHub(
            processInfo.hubPort,
        );

    return result;
}
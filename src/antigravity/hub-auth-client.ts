import * as vscode from "vscode";
import * as http from "node:http";
import * as https from "node:https";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import * as path from "node:path";
import { isAntigravityIde, extractExecutablePath, parsePosixCommandLine } from "./hub-detector";

const execFileAsync = promisify(execFile);

const LANGUAGE_SERVER_SERVICE =
    "exa.language_server_pb.LanguageServerService";

export interface AntigravityAuthStatus {
    agyPid: number;
    hubPort: number;
    lsPort: number;
    serviceName: string;
    hasToken: boolean;
    hasValidAuth: boolean | null;
    grantedScopes: string[];
}

export interface AntigravityBackendSession {
    pid: number;
    backendType: "agy" | "language_server";
    hubPort: number;
    lsPort: number;
    csrfToken: string;
}

interface AgyProcessInfo {
    ProcessId: number;
    CommandLine: string;
    Name?: string;
    ExecutablePath?: string;
}

interface TcpListenerInfo {
    LocalPort: number;
    OwningProcess: number;
}

interface HasAuthTokenResponse {
    hasToken?: boolean;
    hasAuthToken?: boolean;
    has_token?: boolean;
    has_auth_token?: boolean;
}

interface GetAuthStatusResponse {
    authResult?: {
        hasValidAuth?: boolean;
        grantedScopes?: string[];
    };
}

async function runPowerShell(
    script: string
): Promise<string> {
    const { stdout } = await execFileAsync(
        "powershell.exe",
        [
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            script,
        ],
        {
            windowsHide: true,
            maxBuffer: 4 * 1024 * 1024,
        }
    );

    return stdout.trim();
}

function parsePowerShellJson<T>(
    value: string
): T[] {
    if (!value) {
        return [];
    }

    const parsed = JSON.parse(value) as T | T[];

    return Array.isArray(parsed)
        ? parsed
        : [parsed];
}

async function detectAgyProcess(): Promise<{
    pid: number;
    hubPort: number;
}> {
    const session = await detectAntigravityBackend();
    return {
        pid: session.pid,
        hubPort: session.hubPort,
    };
}

async function getAgyListeners(
    pid: number
): Promise<number[]> {
    if (process.platform === 'win32') {
        const script = `
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object {
        $_.OwningProcess -eq ${pid}
    } |
    Select-Object LocalPort, OwningProcess |
    Sort-Object LocalPort -Unique |
    ConvertTo-Json -Compress
`;

        const output = await runPowerShell(script);

        if (!output) {
            return [];
        }

        const listeners =
            parsePowerShellJson<TcpListenerInfo>(output);

        return [
            ...new Set(
                listeners
                    .map((item) => Number(item.LocalPort))
                    .filter(
                        (port) =>
                            Number.isInteger(port) &&
                            port > 0
                    )
            ),
        ].sort((a, b) => a - b);
    }

    // POSIX listener resolution (macOS / Linux)
    // 1. Try lsof (standard on macOS and most Linux distros)
    try {
        const { stdout } = await execFileAsync(
            'lsof',
            ['-nP', '-iTCP', '-sTCP:LISTEN', '-a', '-p', String(pid)],
            { timeout: 4000, maxBuffer: 1024 * 1024 }
        );

        const ports: number[] = [];
        for (const line of stdout.split('\n')) {
            const match = /(?:[:\]])(\d+)\s+\(LISTEN\)/i.exec(line);
            if (match) {
                const port = parseInt(match[1], 10);
                if (Number.isInteger(port) && port > 0) {
                    ports.push(port);
                }
            }
        }

        if (ports.length > 0) {
            return [...new Set(ports)].sort((a, b) => a - b);
        }
    } catch {
        // Fall through to ss if lsof is not available
    }

    // 2. Try ss (modern Linux systems without lsof)
    try {
        const { stdout } = await execFileAsync(
            'ss',
            ['-tlnp'],
            { timeout: 4000, maxBuffer: 1024 * 1024 }
        );

        const ports: number[] = [];
        for (const line of stdout.split('\n')) {
            if (line.includes(`pid=${pid},`) || line.includes(`pid=${pid})`)) {
                const match = /(?:[:\]])(\d+)\s+/i.exec(line);
                if (match) {
                    const port = parseInt(match[1], 10);
                    if (Number.isInteger(port) && port > 0) {
                        ports.push(port);
                    }
                }
            }
        }

        if (ports.length > 0) {
            return [...new Set(ports)].sort((a, b) => a - b);
        }
    } catch {
        // Ignore and return empty
    }

    return [];
}

function requestHttpText(
    url: URL
): Promise<{
    statusCode: number;
    body: string;
}> {
    return new Promise((resolve, reject) => {
        const request = http.request(
            url,
            {
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache",
                },
                agent: undefined,
            },
            (response) => {
                const chunks: Buffer[] = [];

                response.on(
                    "data",
                    (chunk: Buffer | string) => {
                        chunks.push(
                            Buffer.isBuffer(chunk)
                                ? chunk
                                : Buffer.from(chunk)
                        );
                    }
                );

                response.on("end", () => {
                    resolve({
                        statusCode:
                            response.statusCode ?? 0,
                        body: Buffer.concat(
                            chunks
                        ).toString("utf8"),
                    });
                });
            }
        );

        request.setTimeout(10_000, () => {
            request.destroy(
                new Error("HTTP request timed out.")
            );
        });

        request.on("error", reject);
        request.end();
    });
}

function probeHttpsPort(
    port: number
): Promise<boolean> {
    return new Promise((resolve) => {
        const request = https.request(
            {
                hostname: "127.0.0.1",
                port,
                path: "/",
                method: "GET",

                // AGY uses its own localhost TLS certificate.
                // This client is restricted to 127.0.0.1 only.
                rejectUnauthorized: false,
                agent: undefined,
            },
            (response) => {
                response.resume();

                response.on("end", () => {
                    resolve(true);
                });
            }
        );

        request.setTimeout(5_000, () => {
            request.destroy();
            resolve(false);
        });

        request.on("error", () => {
            resolve(false);
        });

        request.end();
    });
}

function probeConnectRpcPort(
    port: number,
    csrfToken: string,
    timeoutMs = 1500
): Promise<boolean> {
    return new Promise((resolve) => {
        const body = "{}";
        const req = https.request(
            {
                hostname: "127.0.0.1",
                port,
                path: `/${LANGUAGE_SERVER_SERVICE}/GetUserStatus`,
                method: "POST",
                rejectUnauthorized: false,
                agent: undefined,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Connect-Protocol-Version": "1",
                    "x-codeium-csrf-token": csrfToken,
                    "Content-Length": Buffer.byteLength(body),
                },
                timeout: timeoutMs,
            },
            (res) => {
                const isMatch = res.statusCode === 200;
                res.resume();
                resolve(isMatch);
            }
        );

        req.on("timeout", () => {
            req.destroy();
            resolve(false);
        });

        req.on("error", () => {
            resolve(false);
        });

        req.write(body);
        req.end();
    });
}

async function detectLanguageServerPort(
    listeners: number[],
    hubPort: number
): Promise<number> {
    const candidates: number[] = [];

    for (const port of listeners) {
        if (port === hubPort) {
            continue;
        }

        if (await probeHttpsPort(port)) {
            candidates.push(port);
        }
    }

    if (candidates.length === 0) {
        throw new Error(
            "No Antigravity HTTPS Language Server listener was found."
        );
    }

    if (candidates.length > 1) {
        throw new Error(
            `Multiple Antigravity HTTPS listeners were found: ${candidates.join(
                ", "
            )}. Refusing to guess the Language Server port.`
        );
    }

    return candidates[0];
}

function extractCsrfToken(
    html: string
): string {
    const patterns = [
        /csrfToken"\s*:\s*"([^"]+)"/i,
        /csrfToken\s*:\s*"([^"]+)"/i,
    ];

    for (const pattern of patterns) {
        const match = pattern.exec(html);

        if (match?.[1]) {
            return match[1];
        }
    }

    throw new Error(
        "Antigravity Hub bootstrap did not contain a CSRF token."
    );
}

function invokeConnectJson<T>(
    port: number,
    method: string,
    csrfToken: string,
    payload: unknown = {}
): Promise<T> {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(payload);

        const request = https.request(
            {
                hostname: "127.0.0.1",
                port,
                path:
                    `/${LANGUAGE_SERVER_SERVICE}` +
                    `/${method}`,
                method: "POST",

                // AGY's localhost certificate is not trusted by
                // the Windows public CA store.
                rejectUnauthorized: false,
                agent: undefined,

                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Connect-Protocol-Version": "1",
                    "x-codeium-csrf-token":
                        csrfToken,
                    "Content-Length":
                        Buffer.byteLength(body),
                },
            },
            (response) => {
                const chunks: Buffer[] = [];

                response.on(
                    "data",
                    (chunk: Buffer | string) => {
                        chunks.push(
                            Buffer.isBuffer(chunk)
                                ? chunk
                                : Buffer.from(chunk)
                        );
                    }
                );

                response.on("end", () => {
                    const responseBody =
                        Buffer.concat(
                            chunks
                        ).toString("utf8");

                    const statusCode =
                        response.statusCode ?? 0;

                    if (
                        statusCode < 200 ||
                        statusCode >= 300
                    ) {
                        let detail = "";
                        try {
                            const parsed = JSON.parse(responseBody);
                            if (parsed && typeof parsed === "object") {
                                detail = parsed.message || parsed.error || "";
                            }
                        } catch {
                            // Non-JSON response
                        }
                        const detailSuffix = detail ? `: ${detail}` : "";
                        reject(
                            new Error(
                                `${method} failed with HTTP ${statusCode}.${detailSuffix}`
                            )
                        );

                        return;
                    }

                    try {
                        resolve(
                            JSON.parse(
                                responseBody
                            ) as T
                        );
                    } catch {
                        reject(
                            new Error(
                                `${method} returned invalid JSON.`
                            )
                        );
                    }
                });
            }
        );

        // Login is interactive and may wait for the user to complete
        // the Google account chooser/browser authentication flow.
        //
        // Ordinary local Connect RPCs should stay fast, while
        // Login receives a longer interactive timeout.
        const timeoutMs =
            method === "Login"
                ? 300_000
                : 10_000;

        request.setTimeout(timeoutMs, () => {
            request.destroy(
                new Error(
                    `${method} request timed out.`
                )
            );
        });

        request.on("error", reject);

        request.write(body);
        request.end();
    });
}

function readHasToken(
    response: HasAuthTokenResponse
): boolean {
    const candidates = [
        response.hasToken,
        response.hasAuthToken,
        response.has_token,
        response.has_auth_token,
    ];

    for (const value of candidates) {
        if (typeof value === "boolean") {
            return value;
        }
    }

    throw new Error(
        "HasAuthToken response did not contain a recognized boolean field."
    );
}

/**
 * Cached backend session to avoid repeated PowerShell process scans.
 * Validated with a quick RPC probe before reuse.
 */
let cachedBackendSession: AntigravityBackendSession | undefined;
let cachedBackendSessionTime = 0;
const BACKEND_SESSION_CACHE_TTL_MS = 30_000;

/**
 * Invalidate the cached backend session (e.g. after switching accounts).
 */
export function invalidateBackendSessionCache(): void {
    cachedBackendSession = undefined;
    cachedBackendSessionTime = 0;
}

export async function detectAntigravityBackend(): Promise<AntigravityBackendSession> {
    // Fast path: try cached session with a quick RPC probe
    if (
        cachedBackendSession &&
        Date.now() - cachedBackendSessionTime < BACKEND_SESSION_CACHE_TTL_MS
    ) {
        const ok = await probeConnectRpcPort(
            cachedBackendSession.lsPort,
            cachedBackendSession.csrfToken,
            300,
        );
        if (ok) {
            return cachedBackendSession;
        }
        // Cache is stale — fall through to full detection
        cachedBackendSession = undefined;
        cachedBackendSessionTime = 0;
    }

    let output = '';

    if (process.platform === 'win32') {
        const script = `
$processes = @(
    Get-CimInstance Win32_Process |
        Where-Object {
            ($_.Name -ieq 'agy.exe' -and $_.CommandLine -match '--hub(?:\\s|$)' -and $_.CommandLine -match '--hub-port=(\\d+)') -or
            ($_.Name -match '(?i)^language_server(?:\\.exe|_|\\b)' -and $_.CommandLine -match '(?i)--csrf_token\\s+([a-f0-9\\-]+)')
        } |
        Select-Object ProcessId, Name, ExecutablePath, CommandLine
)

if ($processes.Count -eq 0) {
    '[]'
} else {
    $processes | ConvertTo-Json -Compress
}
`;
        output = await runPowerShell(script);
    } else {
        try {
            const { stdout } = await execFileAsync('ps', ['-eo', 'pid,command'], { timeout: 5000, maxBuffer: 1024 * 1024 });
            const lines = stdout.split('\n');
            const processes: AgyProcessInfo[] = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                const match = line.match(/^(\d+)\s+(.+)$/);
                if (match) {
                    const pid = parseInt(match[1], 10);
                    const cmd = match[2];
                    if (cmd.includes('--hub') || cmd.includes('language_server')) {
                        const parsed = parsePosixCommandLine(cmd);
                        processes.push({
                            ProcessId: pid,
                            Name: parsed.name,
                            ExecutablePath: parsed.executablePath,
                            CommandLine: cmd
                        });
                    }
                }
            }
            output = processes.length > 0 ? JSON.stringify(processes) : '';
        } catch {
            output = '';
        }
    }

    if (!output) {
        throw new Error(
            "No running Antigravity backend process (agy.exe or language_server) was found."
        );
    }

    const rawList = parsePowerShellJson<AgyProcessInfo>(output);
    if (!rawList || rawList.length === 0) {
        throw new Error(
            "Unable to inspect the running Antigravity backend."
        );
    }

    const execPath = process.execPath || '';
    const appDir = execPath ? path.dirname(execPath) : '';

    let selected: AgyProcessInfo | undefined;

    // 1. Prefer backend hosted inside the current editor's directory (disambiguates multiple concurrent IDEs)
    if (appDir && !appDir.toLowerCase().endsWith('nodejs')) {
        selected = rawList.find(p => {
            const itemPath = extractExecutablePath(p);
            if (!itemPath) return false;
            const rel = path.relative(appDir.toLowerCase(), itemPath.toLowerCase());
            return !rel.startsWith('..') && !path.isAbsolute(rel);
        });
    }

    // 2. Fallback heuristic based on whether host environment is Antigravity
    if (!selected) {
        const inIde = isAntigravityIde();
        if (inIde) {
            selected =
                rawList.find(
                    p => /language_server/i.test(p.Name || p.CommandLine || "")
                ) ||
                rawList.find(
                    p => /--hub(?:\s|$)/i.test(p.CommandLine || "")
                );
        } else {
            selected =
                rawList.find(
                    p => /--hub(?:\s|$)/i.test(p.CommandLine || "")
                ) ||
                rawList.find(
                    p => /language_server/i.test(p.Name || p.CommandLine || "")
                );
        }
    }

    if (!selected) {
        throw new Error(
            "No active Antigravity backend process could be matched."
        );
    }

    const pid = Number(selected.ProcessId);
    const isLanguageServer = /language_server/i.test(
        selected.Name || selected.CommandLine || ""
    );

    if (isLanguageServer) {
        const csrfMatch = /--csrf_token\s+([a-f0-9\-]+)/i.exec(
            selected.CommandLine || ""
        );
        if (!csrfMatch) {
            throw new Error(
                "Running Antigravity language_server does not expose --csrf_token."
            );
        }
        const csrfToken = csrfMatch[1];

        // 1. Direct extraction: if --https_server_port is present in CommandLine, test it first
        const httpsMatch = /--https_server_port\s+(\d+)/i.exec(
            selected.CommandLine || ""
        );
        let resolvedLsPort: number | undefined;
        if (httpsMatch) {
            const parsedPort = Number(httpsMatch[1]);
            if (Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
                if (await probeConnectRpcPort(parsedPort, csrfToken, 1000)) {
                    resolvedLsPort = parsedPort;
                }
            }
        }

        // 2. If not specified in CommandLine or unresponsive, probe all listening ports in parallel (<50ms)
        if (!resolvedLsPort) {
            const listeners = await getAgyListeners(pid);
            if (listeners.length === 0) {
                throw new Error(
                    `Antigravity language_server (PID ${pid}) has no listening ports.`
                );
            }

            const probeResults = await Promise.all(
                listeners.map(async (port) => {
                    const ok = await probeConnectRpcPort(port, csrfToken, 1500);
                    return ok ? port : null;
                })
            );

            resolvedLsPort = probeResults.find((port): port is number => port !== null);
        }

        if (!resolvedLsPort) {
            throw new Error(
                "No Antigravity HTTPS Language Server listener was found for language_server process."
            );
        }

        const lsSession: AntigravityBackendSession = {
            pid,
            backendType: "language_server",
            hubPort: resolvedLsPort,
            lsPort: resolvedLsPort,
            csrfToken,
        };
        cachedBackendSession = lsSession;
        cachedBackendSessionTime = Date.now();
        return lsSession;
    }

    const match = /--hub-port=(\d+)/i.exec(selected.CommandLine);
    if (!match) {
        throw new Error(
            "Running agy process does not expose --hub-port."
        );
    }
    const hubPort = Number(match[1]);

    const listeners = await getAgyListeners(pid);
    if (!listeners.includes(hubPort)) {
        throw new Error(
            `AGY Hub port ${hubPort} is not owned by PID ${pid}.`
        );
    }

    const lsPort = await detectLanguageServerPort(listeners, hubPort);

    const hub = await requestHttpText(
        new URL(`http://127.0.0.1:${hubPort}/`)
    );

    if (hub.statusCode < 200 || hub.statusCode >= 300) {
        throw new Error(
            `Antigravity Hub returned HTTP ${hub.statusCode}.`
        );
    }

    const csrfToken = extractCsrfToken(hub.body);

    const agySession: AntigravityBackendSession = {
        pid,
        backendType: "agy",
        hubPort,
        lsPort,
        csrfToken,
    };
    cachedBackendSession = agySession;
    cachedBackendSessionTime = Date.now();
    return agySession;
}

export async function getAntigravityAuthStatus():
    Promise<AntigravityAuthStatus> {
    const session = await detectAntigravityBackend();

    if (session.backendType === "language_server") {
        try {
            const userResponse = await invokeConnectJson<GetUserStatusResponse>(
                session.lsPort,
                "GetUserStatus",
                session.csrfToken,
                {}
            );
            const email = safeExtractString(userResponse.userStatus?.email)?.toLowerCase();
            const hasValidAuth = Boolean(email);

            return {
                agyPid: session.pid,
                hubPort: session.hubPort,
                lsPort: session.lsPort,
                serviceName: LANGUAGE_SERVER_SERVICE,
                hasToken: hasValidAuth,
                hasValidAuth,
                grantedScopes: [],
            };
        } catch {
            return {
                agyPid: session.pid,
                hubPort: session.hubPort,
                lsPort: session.lsPort,
                serviceName: LANGUAGE_SERVER_SERVICE,
                hasToken: false,
                hasValidAuth: false,
                grantedScopes: [],
            };
        }
    }

    try {
        const tokenResponse =
            await invokeConnectJson<HasAuthTokenResponse>(
                session.lsPort,
                "HasAuthToken",
                session.csrfToken
            );

        const hasToken =
            readHasToken(tokenResponse);

        if (!hasToken) {
            return {
                agyPid: session.pid,
                hubPort: session.hubPort,
                lsPort: session.lsPort,
                serviceName:
                    LANGUAGE_SERVER_SERVICE,
                hasToken: false,
                hasValidAuth: null,
                grantedScopes: [],
            };
        }

        const authResponse =
            await invokeConnectJson<GetAuthStatusResponse>(
                session.lsPort,
                "GetAuthStatus",
                session.csrfToken
            );

        const authResult =
            authResponse.authResult;

        return {
            agyPid: session.pid,
            hubPort: session.hubPort,
            lsPort: session.lsPort,
            serviceName:
                LANGUAGE_SERVER_SERVICE,
            hasToken: true,
            hasValidAuth:
                typeof authResult?.hasValidAuth ===
                "boolean"
                    ? authResult.hasValidAuth
                    : null,
            grantedScopes:
                Array.isArray(
                    authResult?.grantedScopes
                )
                    ? authResult.grantedScopes.filter(
                          (
                              scope
                          ): scope is string =>
                              typeof scope ===
                              "string"
                      )
                    : [],
        };
    } finally {
        // Do not retain or expose the runtime CSRF value.
    }
}

export interface AntigravityLoginResult {
    hasValidAuth: boolean | null;
    grantedScopes: string[];
}

interface LoginResponse {
    authResult?: {
        hasValidAuth?: boolean;
        grantedScopes?: string[];
    };
}

/**
 * Triggers the host editor's Google OAuth sign-in flow.
 * - In Antigravity IDE (Code OSS fork), uses 'workbench.action.loginWithRedirect'.
 * - In VS Code with the Google Antigravity extension, uses 'antigravity.login'.
 */
export async function executeAntigravityEditorLogin(): Promise<void> {
    let lastError: unknown;
    let commands: string[] = [];
    try {
        commands = await vscode.commands.getCommands(true);
    } catch {
        commands = [];
    }

    if (commands.includes("antigravity.login")) {
        try {
            await vscode.commands.executeCommand("antigravity.login");
            return;
        } catch (error) {
            lastError = error;
        }
    }

    try {
        await vscode.commands.executeCommand("antigravity.login");
        return;
    } catch (error) {
        lastError = error;
    }

    const message = lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(
        `Unable to trigger Antigravity editor sign-in: ${message}`
    );
}

/**
 * Starts Antigravity's own Google sign-in flow.
 *
 * Security properties:
 * - Uses the existing local AGY Language Server.
 * - Does not implement Google OAuth itself.
 * - Does not read or return access/refresh tokens.
 * - CSRF exists only in local function memory.
 *
 * This is a MUTATING operation and must only be called
 * after explicit user confirmation.
 */
export async function signInToAntigravity():
    Promise<AntigravityLoginResult> {
    const session = await detectAntigravityBackend();

    if (session.backendType === "language_server") {
        await executeAntigravityEditorLogin();
        return {
            hasValidAuth: true,
            grantedScopes: [],
        };
    }

    const current =
        await getAntigravityAuthStatus();

    if (
        current.hasToken &&
        current.hasValidAuth === true
    ) {
        throw new Error(
            "Antigravity is already signed in with valid authentication. " +
            "Use Re-auth instead of Sign In."
        );
    }

    const hub = await requestHttpText(
        new URL(
            `http://127.0.0.1:${session.hubPort}/`
        )
    );

    if (
        hub.statusCode < 200 ||
        hub.statusCode >= 300
    ) {
        throw new Error(
            `Antigravity Hub returned HTTP ${hub.statusCode}.`
        );
    }

    let csrfToken =
        extractCsrfToken(hub.body);

    try {
        const response =
            await invokeConnectJson<LoginResponse>(
                session.lsPort,
                "Login",
                csrfToken,
                {
                    isGcpTos: false,
                    additionalScopes: [],
                    enableBusinessLogin: false,
                }
            );

        const authResult =
            response.authResult;

        return {
            hasValidAuth:
                typeof authResult?.hasValidAuth ===
                "boolean"
                    ? authResult.hasValidAuth
                    : null,

            grantedScopes:
                Array.isArray(
                    authResult?.grantedScopes
                )
                    ? authResult.grantedScopes.filter(
                          (
                              scope
                          ): scope is string =>
                              typeof scope ===
                              "string"
                      )
                    : [],
        };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (
            errorMsg.includes("interactive auth is only supported in antigravity-hub mode") ||
            errorMsg.includes("deprecated and no longer supported")
        ) {
            await executeAntigravityEditorLogin();
            return {
                hasValidAuth: true,
                grantedScopes: [],
            };
        }
        throw error;
    } finally {
        csrfToken = "";
    }
}

/**
 * Re-authenticates the currently authenticated Antigravity session
 * using Antigravity's own Login RPC.
 *
 * The official Antigravity frontend uses the same Login backend
 * operation while its UI enters RE_SIGN_IN state.
 *
 * Security properties:
 * - Requires a currently valid auth session.
 * - Does not implement Google OAuth itself.
 * - Does not read access/refresh tokens.
 * - Does not persist credentials.
 * - Does not call AuthLogout.
 * - CSRF remains local to this function.
 *
 * This is a MUTATING operation and must only be called after
 * explicit user confirmation.
 */
export async function reauthenticateAntigravity():
    Promise<AntigravityLoginResult> {
    const session = await detectAntigravityBackend();

    if (session.backendType === "language_server") {
        await executeAntigravityEditorLogin();
        return {
            hasValidAuth: true,
            grantedScopes: [],
        };
    }

    const current =
        await getAntigravityAuthStatus();

    if (
        !current.hasToken ||
        current.hasValidAuth !== true
    ) {
        throw new Error(
            "Antigravity does not currently have valid authentication. " +
            "Use Sign In instead of Re-auth."
        );
    }

    const hub = await requestHttpText(
        new URL(
            `http://127.0.0.1:${session.hubPort}/`
        )
    );

    if (
        hub.statusCode < 200 ||
        hub.statusCode >= 300
    ) {
        throw new Error(
            `Antigravity Hub returned HTTP ${hub.statusCode}.`
        );
    }

    let csrfToken =
        extractCsrfToken(hub.body);

    try {
        const response =
            await invokeConnectJson<LoginResponse>(
                session.lsPort,
                "Login",
                csrfToken,
                {
                    isGcpTos: false,
                    additionalScopes: [],
                    enableBusinessLogin: false,
                }
            );

        const authResult =
            response.authResult;

        return {
            hasValidAuth:
                typeof authResult?.hasValidAuth ===
                "boolean"
                    ? authResult.hasValidAuth
                    : null,

            grantedScopes:
                Array.isArray(
                    authResult?.grantedScopes
                )
                    ? authResult.grantedScopes.filter(
                          (
                              scope
                          ): scope is string =>
                              typeof scope ===
                              "string"
                      )
                    : [],
        };
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (
            errorMsg.includes("interactive auth is only supported in antigravity-hub mode") ||
            errorMsg.includes("deprecated and no longer supported")
        ) {
            await executeAntigravityEditorLogin();
            return {
                hasValidAuth: true,
                grantedScopes: [],
            };
        }
        throw error;
    } finally {
        csrfToken = "";
    }
}

/**
 * Signs out the currently authenticated Antigravity session
 * using Antigravity's own AuthLogout RPC.
 *
 * Security properties:
 * - Requires an existing auth token/session.
 * - Does not read access/refresh tokens.
 * - Does not persist credentials.
 * - Does not manipulate state.vscdb.
 * - CSRF remains local to this function.
 *
 * This is a MUTATING operation and must only be called
 * after explicit user confirmation.
 */
export async function signOutFromAntigravity():
    Promise<void> {
    const session = await detectAntigravityBackend();

    if (session.backendType === "language_server") {
        try {
            await invokeConnectJson<Record<string, never>>(
                session.lsPort,
                "AuthLogout",
                session.csrfToken,
                {}
            );
        } catch {
            // Ignore if standalone mode does not support AuthLogout
        }
        return;
    }

    const current =
        await getAntigravityAuthStatus();

    if (!current.hasToken) {
        throw new Error(
            "Antigravity does not currently have an authentication token."
        );
    }

    const hub = await requestHttpText(
        new URL(
            `http://127.0.0.1:${session.hubPort}/`
        )
    );

    if (
        hub.statusCode < 200 ||
        hub.statusCode >= 300
    ) {
        throw new Error(
            `Antigravity Hub returned HTTP ${hub.statusCode}.`
        );
    }

    let csrfToken =
        extractCsrfToken(hub.body);

    try {
        await invokeConnectJson<Record<string, never>>(
            session.lsPort,
            "AuthLogout",
            csrfToken,
            {}
        );
    } finally {
        csrfToken = "";
    }
}

export interface AntigravityCurrentAccount {
    email: string;
    displayName?: string;
    g1Tier?: string;
    isPro?: boolean;
    plan?: string;
    hasUsedAntigravity?: boolean;
    profilePictureUrl?: string;
}

export function safeExtractString(value: unknown): string | undefined {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
        const obj = value as Record<string, unknown>;
        for (const key of ["tier", "name", "id", "displayName", "plan", "code", "value"]) {
            if (typeof obj[key] === "string" && (obj[key] as string).trim()) {
                return (obj[key] as string).trim();
            }
        }
    }
    return undefined;
}

export function formatAccountPlan(
    g1Tier?: unknown,
    isPro?: unknown,
    rawPlan?: unknown,
): string | undefined {
    const cleanPlan = safeExtractString(rawPlan);
    const cleanTier = safeExtractString(g1Tier);
    const proFlag = isPro === true;

    if (cleanPlan) {
        const upper = cleanPlan.toUpperCase();
        if (upper.includes("ULTRA")) {
            return "Google AI Ultra";
        }
        if (
            upper.includes("PLUS") ||
            upper.includes("AI_PREMIUM") ||
            upper.includes("PREMIUM")
        ) {
            return "Google AI Plus";
        }
        if (upper.includes("PRO")) {
            return "Google AI Pro";
        }
        if (upper.includes("ENTERPRISE")) {
            return "Google AI Enterprise";
        }
        if (upper.includes("FREE") || upper.includes("STANDARD")) {
            return "Google AI Free";
        }
        return cleanPlan;
    }

    if (proFlag) {
        return "Google AI Pro";
    }

    if (cleanTier) {
        const upper = cleanTier.toUpperCase();
        if (upper.includes("ULTRA")) {
            return "Google AI Ultra";
        }
        if (
            upper.includes("PLUS") ||
            upper.includes("AI_PREMIUM") ||
            upper.includes("PREMIUM")
        ) {
            return "Google AI Plus";
        }
        if (upper.includes("PRO")) {
            return "Google AI Pro";
        }
        if (upper.includes("ENTERPRISE")) {
            return "Google AI Enterprise";
        }
        if (upper.includes("FREE") || upper.includes("STANDARD")) {
            return "Google AI Free";
        }
        return cleanTier.replace(/^G1_TIER_/, "").replace(/_/g, " ");
    }

    // Fallback: Jika tidak ada data tier/plan yang terdeteksi, jangan kembalikan label palsu
    // Kembalikan undefined agar UI tidak menampilkan badge yang salah atau memaksa label Free
    return undefined;
}

interface GetUserStatusResponse {
    userStatus?: {
        email?: unknown;
        name?: unknown;
        g1Tier?: unknown;
        tier?: unknown;
        userTier?: unknown;
        subscriptionTier?: unknown;
        plan?: unknown;
        pro?: unknown;
        hasUsedAntigravity?: unknown;
        profilePictureUrl?: unknown;
        [key: string]: unknown;
    };
}

/**
 * Returns the identity of the account currently authenticated by
 * Antigravity.
 *
 * GetUserStatus is read-only. Credential material, tokens and the
 * Antigravity CSRF value are never returned from this function.
 */

export async function getAntigravityCurrentAccount():
    Promise<AntigravityCurrentAccount> {
    const session = await detectAntigravityBackend();

    if (session.backendType === "agy") {
        const current = await getAntigravityAuthStatus();
        if (!current.hasToken || current.hasValidAuth !== true) {
            throw new Error(
                "Antigravity does not currently have valid authentication.",
            );
        }
    }

    const response =
        await invokeConnectJson<GetUserStatusResponse>(
            session.lsPort,
            "GetUserStatus",
            session.csrfToken,
            {},
        );

        const userStatus =
            response.userStatus;

        if (!userStatus) {
            throw new Error(
                "Antigravity GetUserStatus returned no userStatus.",
            );
        }

        const email = safeExtractString(userStatus.email)?.toLowerCase();

        if (!email) {
            throw new Error(
                "Antigravity GetUserStatus returned no account email.",
            );
        }

        const rawTier =
            safeExtractString(userStatus.g1Tier) ||
            safeExtractString(userStatus.tier) ||
            safeExtractString(userStatus.userTier) ||
            safeExtractString(userStatus.subscriptionTier) ||
            undefined;

        const isPro =
            typeof userStatus.pro === "boolean"
                ? userStatus.pro
                : undefined;

        const rawPlan = safeExtractString(userStatus.plan);

        let plan: string | undefined;
        try {
            plan = formatAccountPlan(rawTier, isPro, rawPlan);
        } catch {
            plan = undefined;
        }

        return {
            email,

            displayName:
                safeExtractString(userStatus.name),

            g1Tier: rawTier,

            isPro,

            plan,

            hasUsedAntigravity:
                typeof userStatus.hasUsedAntigravity === "boolean"
                    ? userStatus.hasUsedAntigravity
                    : undefined,

            profilePictureUrl:
                safeExtractString(userStatus.profilePictureUrl) ||
                safeExtractString(userStatus.profile_picture_url) ||
                safeExtractString(userStatus.picture) ||
                safeExtractString(userStatus.avatarUrl) ||
                safeExtractString(userStatus.photoUrl) ||
                undefined,
        };
    }
/* ============================================================
 * Antigravity quota / profile snapshot
 *
 * Runtime source:
 *   LanguageServerService/GetUserStatus
 *
 * Descriptor-backed fields:
 *   UserStatus.profile_picture_url
 *   UserStatus.cascade_model_config_data
 *   CascadeModelConfigData.client_model_configs
 *   ClientModelConfig.model_id
 *   ClientModelConfig.model_or_alias
 *   ClientModelConfig.quota_info
 *   QuotaInfo.remaining_fraction
 *   QuotaInfo.reset_time
 *
 * Security:
 * - Read-only RPC.
 * - No credentials or tokens returned.
 * - CSRF never leaves function scope.
 * - Email and profile-picture URL are intentionally excluded
 *   from the quota snapshot returned by this function.
 * ============================================================
 */

type AntigravityProtoTimestamp =
    | string
    | {
          seconds?:
              | string
              | number;
          nanos?: number;
      };

interface AntigravityQuotaInfoResponse {
    remainingFraction?: number;
    resetTime?: AntigravityProtoTimestamp;
}

interface AntigravityModelOrAliasResponse {
    model?:
        | string
        | number;
}

interface AntigravityClientModelConfigResponse {
    label?: string;
    modelId?: string;
    tagTitle?: string;
    tagDescription?: string;
    modelOrAlias?: AntigravityModelOrAliasResponse;
    quotaInfo?: AntigravityQuotaInfoResponse;
}

interface AntigravityQuotaUserStatusResponse {
    profilePictureUrl?: string;
    profile_picture_url?: string;
    picture?: string;
    avatarUrl?: string;
    photoUrl?: string;
    userTier?: {
        id?: string;
        name?: string;
        description?: string;
    };
    [key: string]: unknown;

    cascadeModelConfigData?: {
        clientModelConfigs?:
            AntigravityClientModelConfigResponse[];
    };
}

interface AntigravityQuotaGetUserStatusResponse {
    userStatus?:
        AntigravityQuotaUserStatusResponse;
}

export interface AntigravityModelQuota {
    index: number;

    modelId?: string;

    /**
     * Enum/string value exposed by ModelOrAlias.model when present.
     * modelId remains the preferred stable identifier.
     */
    model?: string | number;

    remainingFraction?: number;

    /**
     * Normalized ISO timestamp when Antigravity exposes a valid
     * google.protobuf.Timestamp.
     */
    resetTime?: string;
}

export interface AntigravityQuotaSnapshot {
    fetchedAt: string;

    profilePictureAvailable: boolean;

    modelConfigCount: number;

    quotaModelCount: number;

    models: AntigravityModelQuota[];
}

function normalizeAntigravityTimestamp(
    value: AntigravityProtoTimestamp | undefined,
): string | undefined {
    if (typeof value === "string") {
        const parsed =
            new Date(value);

        if (
            Number.isFinite(
                parsed.getTime(),
            )
        ) {
            return parsed.toISOString();
        }

        return undefined;
    }

    if (
        !value ||
        typeof value !== "object"
    ) {
        return undefined;
    }

    const seconds =
        typeof value.seconds === "string"
            ? Number(value.seconds)
            : value.seconds;

    if (
        typeof seconds !== "number" ||
        !Number.isFinite(seconds)
    ) {
        return undefined;
    }

    const nanos =
        typeof value.nanos === "number" &&
        Number.isFinite(value.nanos)
            ? value.nanos
            : 0;

    const milliseconds =
        seconds * 1000 +
        Math.trunc(
            nanos / 1_000_000,
        );

    const parsed =
        new Date(milliseconds);

    if (
        !Number.isFinite(
            parsed.getTime(),
        )
    ) {
        return undefined;
    }

    return parsed.toISOString();
}

/**
 * Reads Antigravity's current per-model quota metadata from
 * GetUserStatus.
 *
 * This function intentionally returns only quota metadata and a
 * boolean indicating whether a Google profile picture exists.
 *
 * It does NOT return:
 * - account email
 * - profile-picture URL
 * - OAuth credentials
 * - tokens
 * - cookies
 * - CSRF values
 */
export async function getAntigravityQuotaSnapshot():
    Promise<AntigravityQuotaSnapshot> {
    const session = await detectAntigravityBackend();

    if (session.backendType === "agy") {
        const current = await getAntigravityAuthStatus();
        if (!current.hasToken || current.hasValidAuth !== true) {
            throw new Error(
                "Antigravity does not currently have valid authentication.",
            );
        }
    }

    const response =
        await invokeConnectJson<
            AntigravityQuotaGetUserStatusResponse
        >(
            session.lsPort,
            "GetUserStatus",
            session.csrfToken,
            {},
        );

        const userStatus =
            response.userStatus;

        if (!userStatus) {
            throw new Error(
                "Antigravity GetUserStatus returned no userStatus.",
            );
        }

        const configs =
            Array.isArray(
                userStatus
                    .cascadeModelConfigData
                    ?.clientModelConfigs,
            )
                ? userStatus
                      .cascadeModelConfigData!
                      .clientModelConfigs!
                : [];

        const models: AntigravityModelQuota[] =
            [];

        for (
            let index = 0;
            index < configs.length;
            index += 1
        ) {
            const config =
                configs[index];

            if (!config) {
                continue;
            }

            const quota =
                config.quotaInfo;

            if (!quota) {
                continue;
            }

            const remainingFraction =
                typeof quota.remainingFraction ===
                    "number" &&
                Number.isFinite(
                    quota.remainingFraction,
                )
                    ? quota.remainingFraction
                    : undefined;

            const modelId =
                typeof config.modelId === "string"
                    ? config.modelId.trim() ||
                      undefined
                    : undefined;

            const model =
                typeof config.modelOrAlias?.model ===
                    "string" ||
                typeof config.modelOrAlias?.model ===
                    "number"
                    ? config.modelOrAlias.model
                    : undefined;

            models.push({
                index,
                modelId,
                model,
                remainingFraction,

                resetTime:
                    normalizeAntigravityTimestamp(
                        quota.resetTime,
                    ),
            });
        }

        return {
            fetchedAt:
                new Date().toISOString(),

            profilePictureAvailable:
                Boolean(
                    safeExtractString(userStatus.profilePictureUrl) ||
                    safeExtractString(userStatus.profile_picture_url) ||
                    safeExtractString(userStatus.picture) ||
                    safeExtractString(userStatus.avatarUrl) ||
                    safeExtractString(userStatus.photoUrl)
                ),

            modelConfigCount:
                configs.length,

            quotaModelCount:
                models.length,

            models,
        };
    }
/* ============================================================
 * Official Antigravity quota summary
 *
 * Runtime source:
 *   LanguageServerService/RetrieveUserQuotaSummary
 *
 * The server owns the grouping and window semantics. Do not infer
 * "weekly" or "5h" from reset duration.
 *
 * Security:
 * - Read-only RPC.
 * - No credential/token values are returned.
 * - CSRF remains memory-only.
 * - Response is allowlisted into product quota metadata only.
 * ============================================================
 */

interface AntigravityQuotaSummaryBucketResponse {
    bucketId?: unknown;
    displayName?: unknown;
    description?: unknown;
    window?: unknown;
    remainingFraction?: unknown;
    remainingAmount?: unknown;
    disabled?: unknown;
    resetTime?: AntigravityProtoTimestamp;
}

interface AntigravityQuotaSummaryGroupResponse {
    displayName?: unknown;
    description?: unknown;
    buckets?: unknown[];
}

interface AntigravityQuotaSummaryResponsePayload {
    description?: unknown;
    buckets?: unknown[];
    groups?: AntigravityQuotaSummaryGroupResponse[];
}

interface AntigravityQuotaSummaryEnvelope {
    response?: AntigravityQuotaSummaryResponsePayload;
}

export interface AntigravityQuotaSummaryBucket {
    bucketId?: string;
    displayName?: string;
    groupDisplayName?: string;
    description?: string;

    /**
     * Backend-defined quota window identifier.
     *
     * Runtime examples confirmed:
     * - "weekly"
     * - "5h"
     */
    window?: string;

    remainingFraction?: number;

    remainingAmount?:
        | number
        | string;

    disabled?: boolean;

    resetTime?: string;
}

export interface AntigravityQuotaSummaryGroup {
    displayName?: string;
    description?: string;
    buckets: AntigravityQuotaSummaryBucket[];
}

export interface AntigravityQuotaSummarySnapshot {
    fetchedAt: string;

    description?: string;

    buckets: AntigravityQuotaSummaryBucket[];

    groups: AntigravityQuotaSummaryGroup[];
}

function normalizeQuotaSummaryString(
    value: unknown,
): string | undefined {
    return typeof value === "string"
        ? value.trim() || undefined
        : undefined;
}

function normalizeQuotaSummaryNumber(
    value: unknown,
): number | string | undefined {
    if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {
        return value;
    }

    if (
        typeof value === "string" &&
        /^-?\d+(?:\.\d+)?$/.test(
            value,
        )
    ) {
        return value;
    }

    return undefined;
}

function normalizeQuotaSummaryBucket(
    value: unknown,
    groupDisplayName?: string,
): AntigravityQuotaSummaryBucket | undefined {
    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return undefined;
    }

    const bucket =
        value as AntigravityQuotaSummaryBucketResponse;

    const remainingFraction =
        typeof bucket.remainingFraction === "number" &&
        Number.isFinite(
            bucket.remainingFraction,
        )
            ? bucket.remainingFraction
            : undefined;

    return {
        bucketId:
            normalizeQuotaSummaryString(
                bucket.bucketId,
            ),

        displayName:
            normalizeQuotaSummaryString(
                bucket.displayName,
            ),

        groupDisplayName:
            normalizeQuotaSummaryString(
                groupDisplayName,
            ),

        description:
            normalizeQuotaSummaryString(
                bucket.description,
            ),

        window:
            normalizeQuotaSummaryString(
                bucket.window,
            ),

        remainingFraction,

        remainingAmount:
            normalizeQuotaSummaryNumber(
                bucket.remainingAmount,
            ),

        disabled:
            typeof bucket.disabled === "boolean"
                ? bucket.disabled
                : undefined,

        resetTime:
            normalizeAntigravityTimestamp(
                bucket.resetTime,
            ),
    };
}

async function getAntigravityQuotaSummaryFromUserStatus(
    session: AntigravityBackendSession,
): Promise<AntigravityQuotaSummarySnapshot> {
    const response = await invokeConnectJson<AntigravityQuotaGetUserStatusResponse>(
        session.lsPort,
        "GetUserStatus",
        session.csrfToken,
        {},
    );

    const userStatus = response.userStatus;
    if (!userStatus) {
        throw new Error("Antigravity GetUserStatus returned no userStatus.");
    }

    const configs = Array.isArray(userStatus.cascadeModelConfigData?.clientModelConfigs)
        ? userStatus.cascadeModelConfigData!.clientModelConfigs!
        : [];

    const buckets: AntigravityQuotaSummaryBucket[] = [];

    for (let index = 0; index < configs.length; index += 1) {
        const config = configs[index];
        if (!config || !config.quotaInfo) {
            continue;
        }

        const remainingFraction =
            typeof config.quotaInfo.remainingFraction === "number" &&
            Number.isFinite(config.quotaInfo.remainingFraction)
                ? config.quotaInfo.remainingFraction
                : undefined;

        const displayName =
            safeExtractString(config.label) ||
            safeExtractString(config.modelId) ||
            `Model ${index + 1}`;

        const descParts: string[] = [];
        if (config.tagTitle) descParts.push(config.tagTitle);
        if (config.tagDescription) descParts.push(config.tagDescription);

        buckets.push({
            bucketId: config.modelId || `model-${index}`,
            displayName,
            groupDisplayName: "Model Quota",
            description: descParts.length > 0 ? descParts.join(" - ") : undefined,
            remainingFraction,
            resetTime: normalizeAntigravityTimestamp(config.quotaInfo.resetTime),
            window: "standard",
        });
    }

    const groupDisplayName = "Model Quotas";
    const groups: AntigravityQuotaSummaryGroup[] = [
        {
            displayName: groupDisplayName,
            description: "Quotas extracted from Language Server GetUserStatus",
            buckets,
        },
    ];

    const description =
        safeExtractString(userStatus.userTier?.name) ||
        safeExtractString(userStatus.userTier?.id) ||
        "Standard Quota";

    return {
        fetchedAt: new Date().toISOString(),
        description,
        buckets,
        groups,
    };
}

export async function getAntigravityQuotaSummary(
    forceRefresh = true,
): Promise<AntigravityQuotaSummarySnapshot> {
    const session = await detectAntigravityBackend();

    if (session.backendType === "agy") {
        const current = await getAntigravityAuthStatus();
        if (!current.hasToken || current.hasValidAuth !== true) {
            throw new Error(
                "Antigravity does not currently have valid authentication.",
            );
        }
    }

    let envelope: AntigravityQuotaSummaryEnvelope | undefined;
    try {
        envelope =
            await invokeConnectJson<
                AntigravityQuotaSummaryEnvelope
            >(
                session.lsPort,
                "RetrieveUserQuotaSummary",
                session.csrfToken,
                {
                    forceRefresh,
                },
            );
    } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        // If RetrieveUserQuotaSummary returns 404 (endpoint not supported on this language_server version),
        // gracefully fallback to constructing the quota matrix from GetUserStatus!
        if (errMsg.includes("HTTP 404") || errMsg.includes("404")) {
            return await getAntigravityQuotaSummaryFromUserStatus(session);
        }
        throw err;
    }

    const response =
        envelope?.response;

    if (!response) {
        return await getAntigravityQuotaSummaryFromUserStatus(session);
    }

        const buckets =
            Array.isArray(
                response.buckets,
            )
                ? response.buckets
                      .map(
                          bucket =>
                              normalizeQuotaSummaryBucket(
                                  bucket,
                              ),
                      )
                      .filter(
                          (
                              bucket,
                          ): bucket is AntigravityQuotaSummaryBucket =>
                              Boolean(
                                  bucket,
                              ),
                      )
                : [];

        const groups =
            Array.isArray(
                response.groups,
            )
                ? response.groups.map(
                      group => {
                          const groupDisplayName =
                              normalizeQuotaSummaryString(
                                  group.displayName,
                              );
                          return {
                              displayName: groupDisplayName,

                              description:
                                  normalizeQuotaSummaryString(
                                      group.description,
                                  ),

                              buckets:
                                  Array.isArray(
                                      group.buckets,
                                  )
                                      ? group.buckets
                                            .map(
                                                bucket =>
                                                    normalizeQuotaSummaryBucket(
                                                        bucket,
                                                        groupDisplayName,
                                                    ),
                                            )
                                            .filter(
                                                (
                                                    bucket,
                                                ): bucket is AntigravityQuotaSummaryBucket =>
                                                    Boolean(
                                                        bucket,
                                                    ),
                                            )
                                      : [],
                          };
                      },
                  )
                : [];

        const effectiveBuckets =
            buckets.length > 0
                ? buckets.map(b => {
                      if (b.groupDisplayName) {
                          return b;
                      }
                      const matchedGroup = groups.find(g =>
                          g.buckets.some(
                              gb =>
                                  (gb.bucketId && gb.bucketId === b.bucketId) ||
                                  (gb.displayName && gb.displayName === b.displayName),
                          ),
                      );
                      return matchedGroup?.displayName
                          ? { ...b, groupDisplayName: matchedGroup.displayName }
                          : b;
                  })
                : groups.flatMap(group => group.buckets);

        return {
            fetchedAt:
                new Date().toISOString(),

            description:
                normalizeQuotaSummaryString(
                    response.description,
                ),

            buckets: effectiveBuckets,

            groups,
        };
    }

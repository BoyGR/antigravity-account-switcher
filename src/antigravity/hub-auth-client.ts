import * as http from "node:http";
import * as https from "node:https";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

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

interface AgyProcessInfo {
    ProcessId: number;
    CommandLine: string;
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
    const script = `
$process = Get-CimInstance Win32_Process |
    Where-Object {
        $_.Name -ieq 'agy.exe' -and
        $_.CommandLine -match '--hub(?:\\s|$)' -and
        $_.CommandLine -match '--hub-port=(\\d+)'
    } |
    Select-Object -First 1 ProcessId, CommandLine

if ($null -ne $process) {
    $process | ConvertTo-Json -Compress
}
`;

    const output = await runPowerShell(script);

    if (!output) {
        throw new Error(
            "No running Antigravity agy --hub process was found."
        );
    }

    const processes =
        parsePowerShellJson<AgyProcessInfo>(output);

    const process = processes[0];

    if (!process) {
        throw new Error(
            "Unable to inspect the running Antigravity backend."
        );
    }

    const match =
        /--hub-port=(\d+)/i.exec(process.CommandLine);

    if (!match) {
        throw new Error(
            "Running agy process does not expose --hub-port."
        );
    }

    return {
        pid: Number(process.ProcessId),
        hubPort: Number(match[1]),
    };
}

async function getAgyListeners(
    pid: number
): Promise<number[]> {
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
                        reject(
                            new Error(
                                `${method} failed with HTTP ${statusCode}.`
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

export async function getAntigravityAuthStatus():
    Promise<AntigravityAuthStatus> {
    const { pid, hubPort } =
        await detectAgyProcess();

    const listeners =
        await getAgyListeners(pid);

    if (!listeners.includes(hubPort)) {
        throw new Error(
            `AGY Hub port ${hubPort} is not owned by PID ${pid}.`
        );
    }

    const lsPort =
        await detectLanguageServerPort(
            listeners,
            hubPort
        );

    const hub = await requestHttpText(
        new URL(
            `http://127.0.0.1:${hubPort}/`
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

    // Sensitive value remains local to this function.
    let csrfToken = extractCsrfToken(
        hub.body
    );

    try {
        const tokenResponse =
            await invokeConnectJson<HasAuthTokenResponse>(
                lsPort,
                "HasAuthToken",
                csrfToken
            );

        const hasToken =
            readHasToken(tokenResponse);

        if (!hasToken) {
            return {
                agyPid: pid,
                hubPort,
                lsPort,
                serviceName:
                    LANGUAGE_SERVER_SERVICE,
                hasToken: false,
                hasValidAuth: null,
                grantedScopes: [],
            };
        }

        const authResponse =
            await invokeConnectJson<GetAuthStatusResponse>(
                lsPort,
                "GetAuthStatus",
                csrfToken
            );

        const authResult =
            authResponse.authResult;

        return {
            agyPid: pid,
            hubPort,
            lsPort,
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
        csrfToken = "";
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
            `http://127.0.0.1:${current.hubPort}/`
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
                current.lsPort,
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
            `http://127.0.0.1:${current.hubPort}/`
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
                current.lsPort,
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
    const current =
        await getAntigravityAuthStatus();

    if (!current.hasToken) {
        throw new Error(
            "Antigravity does not currently have an authentication token."
        );
    }

    const hub = await requestHttpText(
        new URL(
            `http://127.0.0.1:${current.hubPort}/`
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
            current.lsPort,
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
    hasUsedAntigravity?: boolean;
    profilePictureUrl?: string;
}

interface GetUserStatusResponse {
    userStatus?: {
        email?: string;
        name?: string;
        g1Tier?: string;
        pro?: boolean;
        hasUsedAntigravity?: boolean;
        profilePictureUrl?: string;
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
    // Reuse the already proven runtime discovery and
    // authentication validation path.
    const current =
        await getAntigravityAuthStatus();

    if (
        !current.hasToken ||
        current.hasValidAuth !== true
    ) {
        throw new Error(
            "Antigravity does not currently have valid authentication.",
        );
    }

    // Fetch the current Hub bootstrap so the CSRF value is always
    // paired with the active AGY runtime discovered above.
    const hub =
        await requestHttpText(
            new URL(
                `http://127.0.0.1:${current.hubPort}/`,
            ),
        );

    if (
        hub.statusCode < 200 ||
        hub.statusCode >= 300
    ) {
        throw new Error(
            `Antigravity Hub returned HTTP ${hub.statusCode}.`,
        );
    }

    // Sensitive value remains local to this function.
    let csrfToken =
        extractCsrfToken(hub.body);

    try {
        const response =
            await invokeConnectJson<GetUserStatusResponse>(
                current.lsPort,
                "GetUserStatus",
                csrfToken,
                {},
            );

        const userStatus =
            response.userStatus;

        if (!userStatus) {
            throw new Error(
                "Antigravity GetUserStatus returned no userStatus.",
            );
        }

        const email =
            userStatus.email
                ?.trim()
                .toLowerCase();

        if (!email) {
            throw new Error(
                "Antigravity GetUserStatus returned no account email.",
            );
        }

        return {
            email,

            displayName:
                userStatus.name?.trim() ||
                undefined,

            g1Tier:
                userStatus.g1Tier?.trim() ||
                undefined,

            isPro:
                typeof userStatus.pro === "boolean"
                    ? userStatus.pro
                    : undefined,

            hasUsedAntigravity:
                typeof userStatus.hasUsedAntigravity === "boolean"
                    ? userStatus.hasUsedAntigravity
                    : undefined,

            profilePictureUrl:
                userStatus.profilePictureUrl?.trim() ||
                undefined,
        };
    } finally {
        // Never retain the runtime CSRF value longer than needed.
        csrfToken = "";
    }
}


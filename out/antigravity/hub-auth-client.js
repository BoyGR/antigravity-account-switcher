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
exports.getAntigravityAuthStatus = getAntigravityAuthStatus;
exports.signInToAntigravity = signInToAntigravity;
exports.reauthenticateAntigravity = reauthenticateAntigravity;
exports.signOutFromAntigravity = signOutFromAntigravity;
exports.getAntigravityCurrentAccount = getAntigravityCurrentAccount;
exports.getAntigravityQuotaSnapshot = getAntigravityQuotaSnapshot;
exports.getAntigravityQuotaSummary = getAntigravityQuotaSummary;
const http = __importStar(require("node:http"));
const https = __importStar(require("node:https"));
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
const LANGUAGE_SERVER_SERVICE = "exa.language_server_pb.LanguageServerService";
async function runPowerShell(script) {
    const { stdout } = await execFileAsync("powershell.exe", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        script,
    ], {
        windowsHide: true,
        maxBuffer: 4 * 1024 * 1024,
    });
    return stdout.trim();
}
function parsePowerShellJson(value) {
    if (!value) {
        return [];
    }
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
        ? parsed
        : [parsed];
}
async function detectAgyProcess() {
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
        throw new Error("No running Antigravity agy --hub process was found.");
    }
    const processes = parsePowerShellJson(output);
    const process = processes[0];
    if (!process) {
        throw new Error("Unable to inspect the running Antigravity backend.");
    }
    const match = /--hub-port=(\d+)/i.exec(process.CommandLine);
    if (!match) {
        throw new Error("Running agy process does not expose --hub-port.");
    }
    return {
        pid: Number(process.ProcessId),
        hubPort: Number(match[1]),
    };
}
async function getAgyListeners(pid) {
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
    const listeners = parsePowerShellJson(output);
    return [
        ...new Set(listeners
            .map((item) => Number(item.LocalPort))
            .filter((port) => Number.isInteger(port) &&
            port > 0)),
    ].sort((a, b) => a - b);
}
function requestHttpText(url) {
    return new Promise((resolve, reject) => {
        const request = http.request(url, {
            method: "GET",
            headers: {
                "Cache-Control": "no-cache",
            },
        }, (response) => {
            const chunks = [];
            response.on("data", (chunk) => {
                chunks.push(Buffer.isBuffer(chunk)
                    ? chunk
                    : Buffer.from(chunk));
            });
            response.on("end", () => {
                resolve({
                    statusCode: response.statusCode ?? 0,
                    body: Buffer.concat(chunks).toString("utf8"),
                });
            });
        });
        request.setTimeout(10_000, () => {
            request.destroy(new Error("HTTP request timed out."));
        });
        request.on("error", reject);
        request.end();
    });
}
function probeHttpsPort(port) {
    return new Promise((resolve) => {
        const request = https.request({
            hostname: "127.0.0.1",
            port,
            path: "/",
            method: "GET",
            // AGY uses its own localhost TLS certificate.
            // This client is restricted to 127.0.0.1 only.
            rejectUnauthorized: false,
        }, (response) => {
            response.resume();
            response.on("end", () => {
                resolve(true);
            });
        });
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
async function detectLanguageServerPort(listeners, hubPort) {
    const candidates = [];
    for (const port of listeners) {
        if (port === hubPort) {
            continue;
        }
        if (await probeHttpsPort(port)) {
            candidates.push(port);
        }
    }
    if (candidates.length === 0) {
        throw new Error("No Antigravity HTTPS Language Server listener was found.");
    }
    if (candidates.length > 1) {
        throw new Error(`Multiple Antigravity HTTPS listeners were found: ${candidates.join(", ")}. Refusing to guess the Language Server port.`);
    }
    return candidates[0];
}
function extractCsrfToken(html) {
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
    throw new Error("Antigravity Hub bootstrap did not contain a CSRF token.");
}
function invokeConnectJson(port, method, csrfToken, payload = {}) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(payload);
        const request = https.request({
            hostname: "127.0.0.1",
            port,
            path: `/${LANGUAGE_SERVER_SERVICE}` +
                `/${method}`,
            method: "POST",
            // AGY's localhost certificate is not trusted by
            // the Windows public CA store.
            rejectUnauthorized: false,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Connect-Protocol-Version": "1",
                "x-codeium-csrf-token": csrfToken,
                "Content-Length": Buffer.byteLength(body),
            },
        }, (response) => {
            const chunks = [];
            response.on("data", (chunk) => {
                chunks.push(Buffer.isBuffer(chunk)
                    ? chunk
                    : Buffer.from(chunk));
            });
            response.on("end", () => {
                const responseBody = Buffer.concat(chunks).toString("utf8");
                const statusCode = response.statusCode ?? 0;
                if (statusCode < 200 ||
                    statusCode >= 300) {
                    reject(new Error(`${method} failed with HTTP ${statusCode}.`));
                    return;
                }
                try {
                    resolve(JSON.parse(responseBody));
                }
                catch {
                    reject(new Error(`${method} returned invalid JSON.`));
                }
            });
        });
        // Login is interactive and may wait for the user to complete
        // the Google account chooser/browser authentication flow.
        //
        // Ordinary local Connect RPCs should stay fast, while
        // Login receives a longer interactive timeout.
        const timeoutMs = method === "Login"
            ? 300_000
            : 10_000;
        request.setTimeout(timeoutMs, () => {
            request.destroy(new Error(`${method} request timed out.`));
        });
        request.on("error", reject);
        request.write(body);
        request.end();
    });
}
function readHasToken(response) {
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
    throw new Error("HasAuthToken response did not contain a recognized boolean field.");
}
async function getAntigravityAuthStatus() {
    const { pid, hubPort } = await detectAgyProcess();
    const listeners = await getAgyListeners(pid);
    if (!listeners.includes(hubPort)) {
        throw new Error(`AGY Hub port ${hubPort} is not owned by PID ${pid}.`);
    }
    const lsPort = await detectLanguageServerPort(listeners, hubPort);
    const hub = await requestHttpText(new URL(`http://127.0.0.1:${hubPort}/`));
    if (hub.statusCode < 200 ||
        hub.statusCode >= 300) {
        throw new Error(`Antigravity Hub returned HTTP ${hub.statusCode}.`);
    }
    // Sensitive value remains local to this function.
    let csrfToken = extractCsrfToken(hub.body);
    try {
        const tokenResponse = await invokeConnectJson(lsPort, "HasAuthToken", csrfToken);
        const hasToken = readHasToken(tokenResponse);
        if (!hasToken) {
            return {
                agyPid: pid,
                hubPort,
                lsPort,
                serviceName: LANGUAGE_SERVER_SERVICE,
                hasToken: false,
                hasValidAuth: null,
                grantedScopes: [],
            };
        }
        const authResponse = await invokeConnectJson(lsPort, "GetAuthStatus", csrfToken);
        const authResult = authResponse.authResult;
        return {
            agyPid: pid,
            hubPort,
            lsPort,
            serviceName: LANGUAGE_SERVER_SERVICE,
            hasToken: true,
            hasValidAuth: typeof authResult?.hasValidAuth ===
                "boolean"
                ? authResult.hasValidAuth
                : null,
            grantedScopes: Array.isArray(authResult?.grantedScopes)
                ? authResult.grantedScopes.filter((scope) => typeof scope ===
                    "string")
                : [],
        };
    }
    finally {
        // Do not retain or expose the runtime CSRF value.
        csrfToken = "";
    }
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
async function signInToAntigravity() {
    const current = await getAntigravityAuthStatus();
    if (current.hasToken &&
        current.hasValidAuth === true) {
        throw new Error("Antigravity is already signed in with valid authentication. " +
            "Use Re-auth instead of Sign In.");
    }
    const hub = await requestHttpText(new URL(`http://127.0.0.1:${current.hubPort}/`));
    if (hub.statusCode < 200 ||
        hub.statusCode >= 300) {
        throw new Error(`Antigravity Hub returned HTTP ${hub.statusCode}.`);
    }
    let csrfToken = extractCsrfToken(hub.body);
    try {
        const response = await invokeConnectJson(current.lsPort, "Login", csrfToken, {
            isGcpTos: false,
            additionalScopes: [],
            enableBusinessLogin: false,
        });
        const authResult = response.authResult;
        return {
            hasValidAuth: typeof authResult?.hasValidAuth ===
                "boolean"
                ? authResult.hasValidAuth
                : null,
            grantedScopes: Array.isArray(authResult?.grantedScopes)
                ? authResult.grantedScopes.filter((scope) => typeof scope ===
                    "string")
                : [],
        };
    }
    finally {
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
async function reauthenticateAntigravity() {
    const current = await getAntigravityAuthStatus();
    if (!current.hasToken ||
        current.hasValidAuth !== true) {
        throw new Error("Antigravity does not currently have valid authentication. " +
            "Use Sign In instead of Re-auth.");
    }
    const hub = await requestHttpText(new URL(`http://127.0.0.1:${current.hubPort}/`));
    if (hub.statusCode < 200 ||
        hub.statusCode >= 300) {
        throw new Error(`Antigravity Hub returned HTTP ${hub.statusCode}.`);
    }
    let csrfToken = extractCsrfToken(hub.body);
    try {
        const response = await invokeConnectJson(current.lsPort, "Login", csrfToken, {
            isGcpTos: false,
            additionalScopes: [],
            enableBusinessLogin: false,
        });
        const authResult = response.authResult;
        return {
            hasValidAuth: typeof authResult?.hasValidAuth ===
                "boolean"
                ? authResult.hasValidAuth
                : null,
            grantedScopes: Array.isArray(authResult?.grantedScopes)
                ? authResult.grantedScopes.filter((scope) => typeof scope ===
                    "string")
                : [],
        };
    }
    finally {
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
async function signOutFromAntigravity() {
    const current = await getAntigravityAuthStatus();
    if (!current.hasToken) {
        throw new Error("Antigravity does not currently have an authentication token.");
    }
    const hub = await requestHttpText(new URL(`http://127.0.0.1:${current.hubPort}/`));
    if (hub.statusCode < 200 ||
        hub.statusCode >= 300) {
        throw new Error(`Antigravity Hub returned HTTP ${hub.statusCode}.`);
    }
    let csrfToken = extractCsrfToken(hub.body);
    try {
        await invokeConnectJson(current.lsPort, "AuthLogout", csrfToken, {});
    }
    finally {
        csrfToken = "";
    }
}
/**
 * Returns the identity of the account currently authenticated by
 * Antigravity.
 *
 * GetUserStatus is read-only. Credential material, tokens and the
 * Antigravity CSRF value are never returned from this function.
 */
async function getAntigravityCurrentAccount() {
    // Reuse the already proven runtime discovery and
    // authentication validation path.
    const current = await getAntigravityAuthStatus();
    if (!current.hasToken ||
        current.hasValidAuth !== true) {
        throw new Error("Antigravity does not currently have valid authentication.");
    }
    // Fetch the current Hub bootstrap so the CSRF value is always
    // paired with the active AGY runtime discovered above.
    const hub = await requestHttpText(new URL(`http://127.0.0.1:${current.hubPort}/`));
    if (hub.statusCode < 200 ||
        hub.statusCode >= 300) {
        throw new Error(`Antigravity Hub returned HTTP ${hub.statusCode}.`);
    }
    // Sensitive value remains local to this function.
    let csrfToken = extractCsrfToken(hub.body);
    try {
        const response = await invokeConnectJson(current.lsPort, "GetUserStatus", csrfToken, {});
        const userStatus = response.userStatus;
        if (!userStatus) {
            throw new Error("Antigravity GetUserStatus returned no userStatus.");
        }
        const email = userStatus.email
            ?.trim()
            .toLowerCase();
        if (!email) {
            throw new Error("Antigravity GetUserStatus returned no account email.");
        }
        return {
            email,
            displayName: userStatus.name?.trim() ||
                undefined,
            g1Tier: userStatus.g1Tier?.trim() ||
                undefined,
            isPro: typeof userStatus.pro === "boolean"
                ? userStatus.pro
                : undefined,
            hasUsedAntigravity: typeof userStatus.hasUsedAntigravity === "boolean"
                ? userStatus.hasUsedAntigravity
                : undefined,
            profilePictureUrl: userStatus.profilePictureUrl?.trim() ||
                undefined,
        };
    }
    finally {
        // Never retain the runtime CSRF value longer than needed.
        csrfToken = "";
    }
}
function normalizeAntigravityTimestamp(value) {
    if (typeof value === "string") {
        const parsed = new Date(value);
        if (Number.isFinite(parsed.getTime())) {
            return parsed.toISOString();
        }
        return undefined;
    }
    if (!value ||
        typeof value !== "object") {
        return undefined;
    }
    const seconds = typeof value.seconds === "string"
        ? Number(value.seconds)
        : value.seconds;
    if (typeof seconds !== "number" ||
        !Number.isFinite(seconds)) {
        return undefined;
    }
    const nanos = typeof value.nanos === "number" &&
        Number.isFinite(value.nanos)
        ? value.nanos
        : 0;
    const milliseconds = seconds * 1000 +
        Math.trunc(nanos / 1_000_000);
    const parsed = new Date(milliseconds);
    if (!Number.isFinite(parsed.getTime())) {
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
async function getAntigravityQuotaSnapshot() {
    const current = await getAntigravityAuthStatus();
    if (!current.hasToken ||
        current.hasValidAuth !== true) {
        throw new Error("Antigravity does not currently have valid authentication.");
    }
    const hub = await requestHttpText(new URL(`http://127.0.0.1:${current.hubPort}/`));
    if (hub.statusCode < 200 ||
        hub.statusCode >= 300) {
        throw new Error(`Antigravity Hub returned HTTP ${hub.statusCode}.`);
    }
    let csrfToken = extractCsrfToken(hub.body);
    try {
        const response = await invokeConnectJson(current.lsPort, "GetUserStatus", csrfToken, {});
        const userStatus = response.userStatus;
        if (!userStatus) {
            throw new Error("Antigravity GetUserStatus returned no userStatus.");
        }
        const configs = Array.isArray(userStatus
            .cascadeModelConfigData
            ?.clientModelConfigs)
            ? userStatus
                .cascadeModelConfigData
                .clientModelConfigs
            : [];
        const models = [];
        for (let index = 0; index < configs.length; index += 1) {
            const config = configs[index];
            if (!config) {
                continue;
            }
            const quota = config.quotaInfo;
            if (!quota) {
                continue;
            }
            const remainingFraction = typeof quota.remainingFraction ===
                "number" &&
                Number.isFinite(quota.remainingFraction)
                ? quota.remainingFraction
                : undefined;
            const modelId = typeof config.modelId === "string"
                ? config.modelId.trim() ||
                    undefined
                : undefined;
            const model = typeof config.modelOrAlias?.model ===
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
                resetTime: normalizeAntigravityTimestamp(quota.resetTime),
            });
        }
        return {
            fetchedAt: new Date().toISOString(),
            profilePictureAvailable: Boolean(userStatus
                .profilePictureUrl
                ?.trim()),
            modelConfigCount: configs.length,
            quotaModelCount: models.length,
            models,
        };
    }
    finally {
        /*
         * Sensitive runtime value is never retained after the
         * read-only request.
         */
        csrfToken = "";
    }
}
function normalizeQuotaSummaryString(value) {
    return typeof value === "string"
        ? value.trim() || undefined
        : undefined;
}
function normalizeQuotaSummaryNumber(value) {
    if (typeof value === "number" &&
        Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" &&
        /^-?\d+(?:\.\d+)?$/.test(value)) {
        return value;
    }
    return undefined;
}
function normalizeQuotaSummaryBucket(value) {
    if (!value ||
        typeof value !== "object" ||
        Array.isArray(value)) {
        return undefined;
    }
    const bucket = value;
    const remainingFraction = typeof bucket.remainingFraction === "number" &&
        Number.isFinite(bucket.remainingFraction)
        ? bucket.remainingFraction
        : undefined;
    return {
        bucketId: normalizeQuotaSummaryString(bucket.bucketId),
        displayName: normalizeQuotaSummaryString(bucket.displayName),
        description: normalizeQuotaSummaryString(bucket.description),
        window: normalizeQuotaSummaryString(bucket.window),
        remainingFraction,
        remainingAmount: normalizeQuotaSummaryNumber(bucket.remainingAmount),
        disabled: typeof bucket.disabled === "boolean"
            ? bucket.disabled
            : undefined,
        resetTime: normalizeAntigravityTimestamp(bucket.resetTime),
    };
}
async function getAntigravityQuotaSummary(forceRefresh = true) {
    const current = await getAntigravityAuthStatus();
    if (!current.hasToken ||
        current.hasValidAuth !== true) {
        throw new Error("Antigravity does not currently have valid authentication.");
    }
    const hub = await requestHttpText(new URL(`http://127.0.0.1:${current.hubPort}/`));
    if (hub.statusCode < 200 ||
        hub.statusCode >= 300) {
        throw new Error(`Antigravity Hub returned HTTP ${hub.statusCode}.`);
    }
    let csrfToken = extractCsrfToken(hub.body);
    try {
        const envelope = await invokeConnectJson(current.lsPort, "RetrieveUserQuotaSummary", csrfToken, {
            forceRefresh,
        });
        const response = envelope.response;
        if (!response) {
            throw new Error("Antigravity RetrieveUserQuotaSummary returned no response.");
        }
        const buckets = Array.isArray(response.buckets)
            ? response.buckets
                .map(normalizeQuotaSummaryBucket)
                .filter((bucket) => Boolean(bucket))
            : [];
        const groups = Array.isArray(response.groups)
            ? response.groups.map(group => ({
                displayName: normalizeQuotaSummaryString(group.displayName),
                description: normalizeQuotaSummaryString(group.description),
                buckets: Array.isArray(group.buckets)
                    ? group.buckets
                        .map(normalizeQuotaSummaryBucket)
                        .filter((bucket) => Boolean(bucket))
                    : [],
            }))
            : [];
        return {
            fetchedAt: new Date().toISOString(),
            description: normalizeQuotaSummaryString(response.description),
            buckets,
            groups,
        };
    }
    finally {
        csrfToken = "";
    }
}
//# sourceMappingURL=hub-auth-client.js.map
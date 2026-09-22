import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { IdeStateService, ProtobufUtils } from "./ide-state-service";

const execFileAsync = promisify(execFile);

export interface VaultCredentialRecord {
    userName: string;
    blobBase64: string;
    persist: number;
    updatedAt: number;
    picture?: string;
    ideState?: {
        oauthToken?: string;
        userStatus?: string;
    };
}

const VAULT_KEY_PREFIX = "antigravity.vault.token.";
const VAULT_INDEX_KEY = "antigravity.vault.index";
const TARGET_CREDENTIAL_NAME = "gemini:antigravity";

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export function extractEmailFromJwt(jwtToken?: string): string | undefined {
    if (!jwtToken || typeof jwtToken !== "string") {
        return undefined;
    }
    try {
        const parts = jwtToken.split(".");
        if (parts.length >= 2) {
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payload = Buffer.from(base64, "base64").toString("utf-8");
            const data = JSON.parse(payload);
            if (data?.email && typeof data.email === "string") {
                return normalizeEmail(data.email);
            }
        }
    } catch {
        // Ignore
    }
    return undefined;
}

export function extractEmailFromCredentialBlob(blobBase64?: string): string | undefined {
    if (!blobBase64 || typeof blobBase64 !== "string") {
        return undefined;
    }
    try {
        const jsonText = Buffer.from(blobBase64, "base64").toString("utf-8");
        const cred = JSON.parse(jsonText);
        if (cred?.id_token) {
            const email = extractEmailFromJwt(cred.id_token);
            if (email) {
                return email;
            }
        }
        if (cred?.email && typeof cred.email === "string") {
            return normalizeEmail(cred.email);
        }
    } catch {
        // Ignore
    }
    return undefined;
}

export function extractEmailFromIdeState(ideState?: { oauthToken?: string; userStatus?: string }): string | undefined {
    if (!ideState) {
        return undefined;
    }
    if (ideState.userStatus) {
        try {
            const raw = Buffer.from(ideState.userStatus, "base64").toString("utf-8");
            const match = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.exec(raw);
            if (match) {
                return normalizeEmail(match[0]);
            }
        } catch {
            // Ignore
        }
    }
    if (ideState.oauthToken) {
        try {
            const raw = Buffer.from(ideState.oauthToken, "base64").toString("utf-8");
            const jwtMatch = /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]*/.exec(raw);
            if (jwtMatch) {
                const email = extractEmailFromJwt(jwtMatch[0]);
                if (email) {
                    return email;
                }
            }
            const match = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.exec(raw);
            if (match) {
                return normalizeEmail(match[0]);
            }
        } catch {
            // Ignore
        }
    }
    return undefined;
}


/**
 * C# definition for Win32 CredReadW and CredWriteW via Advapi32.dll
 */
const WIN_CRED_CS_DEFINITION = `
using System;
using System.Runtime.InteropServices;

public class WinCredVaultInterop {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    [DllImport("Advapi32.dll", SetLastError = true, EntryPoint = "CredReadW", CharSet = CharSet.Unicode)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("Advapi32.dll", SetLastError = true, EntryPoint = "CredWriteW", CharSet = CharSet.Unicode)]
    public static extern bool CredWrite([In] ref CREDENTIAL credential, int flags);

    [DllImport("Advapi32.dll", SetLastError = true, EntryPoint = "CredDeleteW", CharSet = CharSet.Unicode)]
    public static extern bool CredDelete(string target, int type, int flags);

    [DllImport("Advapi32.dll", SetLastError = true, EntryPoint = "CredFree")]
    public static extern void CredFree(IntPtr buffer);
}
`;

export class TokenVaultService {
    private readonly secrets: vscode.SecretStorage;

    constructor(secrets: vscode.SecretStorage) {
        this.secrets = secrets;
    }

    /**
     * Token swapping currently supports Windows (Windows Credential Manager).
     */
    public isSupported(): boolean {
        return process.platform === "win32";
    }

    private getVaultKey(email: string): string {
        return `${VAULT_KEY_PREFIX}${normalizeEmail(email)}`;
    }

    private async runPowerShell(script: string): Promise<string> {
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
                timeout: 10000,
            },
        );

        return stdout.trim();
    }

    /**
     * Reads the current raw credential blob directly from OS Credential Store (gemini:antigravity).
     */
    public async readSystemCredential(): Promise<{
        userName: string;
        blobBase64: string;
        persist: number;
    } | null> {
        if (!this.isSupported()) {
            return null;
        }

        const script = `
$def = @'
${WIN_CRED_CS_DEFINITION}
'@
if (-not ([System.Management.Automation.PSTypeName]'WinCredVaultInterop').Type) {
    Add-Type -TypeDefinition $def
}

$ptr = [IntPtr]::Zero
if ([WinCredVaultInterop]::CredRead('${TARGET_CREDENTIAL_NAME}', 1, 0, [ref]$ptr) -and $ptr -ne [IntPtr]::Zero) {
    $c = [System.Runtime.InteropServices.Marshal]::PtrToStructure($ptr, [type][WinCredVaultInterop+CREDENTIAL])
    $bytes = New-Object byte[] $c.CredentialBlobSize
    [System.Runtime.InteropServices.Marshal]::Copy($c.CredentialBlob, $bytes, 0, $c.CredentialBlobSize)
    $b64 = [Convert]::ToBase64String($bytes)
    $out = @{
        userName = $c.UserName
        blobBase64 = $b64
        persist = $c.Persist
    }
    [WinCredVaultInterop]::CredFree($ptr)
    $out | ConvertTo-Json -Compress
} else {
    Write-Output "NULL"
}
`;

        try {
            const output = await this.runPowerShell(script);
            if (!output || output === "NULL") {
                return null;
            }

            const parsed = JSON.parse(output) as {
                userName?: string;
                blobBase64?: string;
                persist?: number;
            };

            if (!parsed.blobBase64) {
                return null;
            }

            return {
                userName: parsed.userName || "antigravity",
                blobBase64: parsed.blobBase64,
                persist: typeof parsed.persist === "number" ? parsed.persist : 2,
            };
        } catch {
            return null;
        }
    }

    /**
     * Writes a credential blob directly into OS Credential Store (gemini:antigravity).
     */
    public async writeSystemCredential(
        userName: string,
        blobBase64: string,
        persist = 2,
    ): Promise<boolean> {
        if (!this.isSupported()) {
            return false;
        }

        const script = `
$def = @'
${WIN_CRED_CS_DEFINITION}
'@
if (-not ([System.Management.Automation.PSTypeName]'WinCredVaultInterop').Type) {
    Add-Type -TypeDefinition $def
}

$b64 = '${blobBase64}'
$userName = '${userName}'
$persist = ${persist}

$bytes = [Convert]::FromBase64String($b64)
$blobPtr = [System.Runtime.InteropServices.Marshal]::AllocHGlobal($bytes.Length)
[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $blobPtr, $bytes.Length)

$c = New-Object WinCredVaultInterop+CREDENTIAL
$c.Type = 1 # CRED_TYPE_GENERIC
$c.TargetName = '${TARGET_CREDENTIAL_NAME}'
$c.UserName = $userName
$c.CredentialBlobSize = $bytes.Length
$c.CredentialBlob = $blobPtr
$c.Persist = $persist

$success = [WinCredVaultInterop]::CredWrite([ref]$c, 0)
[System.Runtime.InteropServices.Marshal]::FreeHGlobal($blobPtr)

if ($success) {
    Write-Output "OK"
} else {
    Write-Output "FAIL"
}
`;

        try {
            const output = await this.runPowerShell(script);
            return output.includes("OK");
        } catch {
            return false;
        }
    }

    /**
     * Captures the active credential from the system and encrypts it in SecretStorage for the specified email.
     * Verifies that the internal token identity matches the requested email to prevent cross-contamination.
     */
    public async captureActiveCredential(
        email: string,
        context?: vscode.ExtensionContext,
    ): Promise<boolean> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return false;
        }

        const existingRecord = await this.getCredentialRecord(normalized).catch(() => null);

        // 1. Read and validate system credential (gemini:antigravity)
        const systemCred = await this.readSystemCredential();
        let validBlobBase64: string | undefined;
        let userName = "antigravity";
        let persist = 2;

        if (systemCred?.blobBase64) {
            const systemEmail = extractEmailFromCredentialBlob(systemCred.blobBase64);
            // Only capture systemCred if its token payload specifically matches the target email
            if (systemEmail && systemEmail === normalized) {
                validBlobBase64 = systemCred.blobBase64;
                userName = systemCred.userName || "antigravity";
                persist = systemCred.persist;
            }
        }

        // 2. Read and validate IDE state if running in Antigravity IDE
        let validIdeState: { oauthToken?: string; userStatus?: string } | undefined;
        if (context && IdeStateService.isAntigravityIde()) {
            const ideState = (await IdeStateService.captureCurrentIdeState(context)) || undefined;
            if (ideState) {
                const ideEmail = extractEmailFromIdeState(ideState);
                if (ideEmail && ideEmail === normalized) {
                    validIdeState = ideState;
                }
            }
        }

        // Preserve existing valid vault fields if current live state belongs to another account
        if (!validBlobBase64 && existingRecord?.blobBase64) {
            const existingEmail = extractEmailFromCredentialBlob(existingRecord.blobBase64);
            if (existingEmail === normalized) {
                validBlobBase64 = existingRecord.blobBase64;
                userName = existingRecord.userName || "antigravity";
                persist = existingRecord.persist;
            }
        }

        if (!validIdeState && existingRecord?.ideState) {
            const existingIdeEmail = extractEmailFromIdeState(existingRecord.ideState);
            if (existingIdeEmail === normalized) {
                validIdeState = existingRecord.ideState;
            }
        }

        // If neither system credential nor IDE state belongs to the requested account,
        // abort saving to avoid contaminating the vault
        if (!validBlobBase64 && !validIdeState) {
            return false;
        }

        const record: VaultCredentialRecord = {
            userName,
            blobBase64: validBlobBase64 || "",
            persist,
            updatedAt: Date.now(),
            picture: existingRecord?.picture,
            ideState: validIdeState,
        };

        await this.secrets.store(
            this.getVaultKey(normalized),
            JSON.stringify(record),
        );

        await this.addToIndex(normalized);
        return true;
    }

    /**
     * Directly saves OAuth tokens received from OAuth flow into SecretStorage,
     * formatting both the Windows Credential blob (gemini:antigravity) and
     * Protobuf entries (state.vscdb) for Antigravity IDE.
     */
    public async saveAccountOAuthTokens(
        email: string,
        tokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
            idToken?: string;
        },
        picture?: string,
        context?: vscode.ExtensionContext,
    ): Promise<boolean> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return false;
        }

        const expiryDate = new Date(Date.now() + tokens.expiresIn * 1000).toISOString();
        const systemCredJson = {
            token: {
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken,
                token_type: "Bearer",
                expiry: expiryDate,
            },
            id_token: tokens.idToken || "",
        };

        const blobBase64 = Buffer.from(JSON.stringify(systemCredJson), "utf-8").toString("base64");

        const expirySeconds = Math.floor((Date.now() + tokens.expiresIn * 1000) / 1000);
        const oauthToken = ProtobufUtils.createUnifiedOAuthToken(
            tokens.accessToken,
            tokens.refreshToken,
            expirySeconds,
            false,
            tokens.idToken,
            normalized,
        );
        const userStatus = ProtobufUtils.createUnifiedUserStatus(normalized);

        const record: VaultCredentialRecord = {
            userName: "antigravity",
            blobBase64,
            persist: 2,
            updatedAt: Date.now(),
            picture: picture || undefined,
            ideState: {
                oauthToken,
                userStatus,
            },
        };

        await this.secrets.store(
            this.getVaultKey(normalized),
            JSON.stringify(record),
        );

        await this.addToIndex(normalized);
        return true;
    }

    /**
     * Retrieves the cached picture URL from a vaulted account record.
     */
    public async getAccountPicture(email: string): Promise<string | undefined> {
        const record = await this.getCredentialRecord(email);
        return record?.picture;
    }

    /**
     * Alias for captureActiveCredential.
     */
    public async saveActiveCredential(
        email: string,
        context?: vscode.ExtensionContext,
    ): Promise<boolean> {
        return this.captureActiveCredential(email, context);
    }

    /**
     * Retrieves the parsed VaultCredentialRecord for an email.
     * Includes an anti-corruption integrity check to guarantee the stored tokens belong to this email.
     */
    public async getCredentialRecord(
        email: string,
    ): Promise<VaultCredentialRecord | null> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return null;
        }

        const storedJson = await this.secrets.get(this.getVaultKey(normalized));
        if (!storedJson) {
            return null;
        }

        try {
            const record = JSON.parse(storedJson) as VaultCredentialRecord;

            // Anti-corruption check: Ensure internal tokens/identities belong to this email
            let isCorrupt = false;
            if (record.blobBase64) {
                const blobEmail = extractEmailFromCredentialBlob(record.blobBase64);
                if (blobEmail && blobEmail !== normalized) {
                    isCorrupt = true;
                }
            }
            if (record.ideState) {
                const ideEmail = extractEmailFromIdeState(record.ideState);
                if (ideEmail && ideEmail !== normalized) {
                    isCorrupt = true;
                }
            }

            if (isCorrupt) {
                // Auto-purge corrupted record to heal the vault
                await this.secrets.delete(this.getVaultKey(normalized));
                await this.removeFromIndex(normalized);
                return null;
            }

            return record;
        } catch {
            return null;
        }
    }

    /**
     * Retrieves or reconstructs the Protobuf state.vscdb entries for Antigravity IDE.
     */
    public async getIdeState(
        email: string,
    ): Promise<{ oauthToken: string; userStatus: string } | null> {
        const record = await this.getCredentialRecord(email);
        if (!record) {
            return null;
        }

        if (record.ideState?.oauthToken && record.ideState?.userStatus) {
            return {
                oauthToken: record.ideState.oauthToken,
                userStatus: record.ideState.userStatus,
            };
        }

        // Synthesize ideState from blobBase64 if not directly captured
        if (record.blobBase64) {
            try {
                const text = Buffer.from(record.blobBase64, "base64").toString("utf-8");
                const credJson = JSON.parse(text);
                const tokenObj = credJson.token;
                if (tokenObj?.access_token && tokenObj?.refresh_token) {
                    const expiryDate = tokenObj.expiry
                        ? new Date(tokenObj.expiry)
                        : new Date(Date.now() + 3600 * 1000);
                    const expirySeconds = Math.floor(expiryDate.getTime() / 1000);
                    const oauthToken = ProtobufUtils.createUnifiedOAuthToken(
                        tokenObj.access_token,
                        tokenObj.refresh_token,
                        expirySeconds,
                        false,
                        credJson.id_token,
                        email,
                    );
                    const userStatus = ProtobufUtils.createUnifiedUserStatus(email);
                    return { oauthToken, userStatus };
                }
            } catch {
                // Ignore parse errors
            }
        }

        return null;
    }

    /**
     * Applies a vaulted credential for targetEmail by writing it to OS Credential Store (gemini:antigravity).
     */
    public async applyCredential(email: string): Promise<boolean> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return false;
        }

        const record = await this.getCredentialRecord(normalized);
        if (!record || !record.blobBase64) {
            return false;
        }

        const blobEmail = extractEmailFromCredentialBlob(record.blobBase64);
        if (blobEmail && blobEmail !== normalized) {
            return false;
        }

        return await this.writeSystemCredential(
            record.userName || "antigravity",
            record.blobBase64,
            record.persist || 2,
        );
    }

    /**
     * Checks whether a valid, non-corrupted encrypted credential is saved in the vault for the given email.
     */
    public async hasCredential(email: string): Promise<boolean> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return false;
        }

        const record = await this.getCredentialRecord(normalized);
        if (!record) {
            return false;
        }

        return Boolean(record.blobBase64 || (record.ideState?.oauthToken && record.ideState?.userStatus));
    }

    /**
     * Removes a specific account from the vault.
     */
    public async removeCredential(email: string): Promise<void> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return;
        }

        await this.secrets.delete(this.getVaultKey(normalized));
        await this.removeFromIndex(normalized);
    }

    /**
     * Clears all vaulted credentials.
     */
    public async clearAllCredentials(): Promise<void> {
        const emails = await this.getVaultedEmails();
        for (const email of emails) {
            await this.secrets.delete(this.getVaultKey(email));
        }
        await this.secrets.delete(VAULT_INDEX_KEY);
    }

    /**
     * Returns a list of all emails currently saved in the vault.
     */
    public async getVaultedEmails(): Promise<string[]> {
        const raw = await this.secrets.get(VAULT_INDEX_KEY);
        if (!raw) {
            return [];
        }

        try {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
                return list.filter((e): e is string => typeof e === "string");
            }
        } catch {
            // Ignore parse error
        }

        return [];
    }

    private async addToIndex(email: string): Promise<void> {
        const current = await this.getVaultedEmails();
        if (!current.includes(email)) {
            current.push(email);
            await this.secrets.store(VAULT_INDEX_KEY, JSON.stringify(current));
        }
    }

    private async removeFromIndex(email: string): Promise<void> {
        const current = await this.getVaultedEmails();
        const filtered = current.filter(e => e !== email);
        await this.secrets.store(VAULT_INDEX_KEY, JSON.stringify(filtered));
    }
}

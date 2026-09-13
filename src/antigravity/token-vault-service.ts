import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface VaultCredentialRecord {
    userName: string;
    blobBase64: string;
    persist: number;
    updatedAt: number;
}

const VAULT_KEY_PREFIX = "antigravity.vault.token.";
const VAULT_INDEX_KEY = "antigravity.vault.index";
const TARGET_CREDENTIAL_NAME = "gemini:antigravity";

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
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
     */
    public async captureActiveCredential(email: string): Promise<boolean> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return false;
        }

        const systemCred = await this.readSystemCredential();
        if (!systemCred) {
            return false;
        }

        const record: VaultCredentialRecord = {
            userName: systemCred.userName,
            blobBase64: systemCred.blobBase64,
            persist: systemCred.persist,
            updatedAt: Date.now(),
        };

        await this.secrets.store(
            this.getVaultKey(normalized),
            JSON.stringify(record),
        );

        await this.addToIndex(normalized);
        return true;
    }

    /**
     * Alias for captureActiveCredential.
     */
    public async saveActiveCredential(email: string): Promise<boolean> {
        return this.captureActiveCredential(email);
    }

    /**
     * Applies a vaulted credential for targetEmail by writing it to OS Credential Store (gemini:antigravity).
     */
    public async applyCredential(email: string): Promise<boolean> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return false;
        }

        const storedJson = await this.secrets.get(this.getVaultKey(normalized));
        if (!storedJson) {
            return false;
        }

        try {
            const record = JSON.parse(storedJson) as VaultCredentialRecord;
            if (!record.blobBase64) {
                return false;
            }

            return await this.writeSystemCredential(
                record.userName || "antigravity",
                record.blobBase64,
                record.persist || 2,
            );
        } catch {
            return false;
        }
    }

    /**
     * Checks whether an encrypted credential is saved in the vault for the given email.
     */
    public async hasCredential(email: string): Promise<boolean> {
        const normalized = normalizeEmail(email);
        if (!normalized) {
            return false;
        }

        const stored = await this.secrets.get(this.getVaultKey(normalized));
        return typeof stored === "string" && stored.length > 0;
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

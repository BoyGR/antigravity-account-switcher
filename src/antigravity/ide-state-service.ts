import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { spawn } from "child_process";

export interface AntigravityProductInfo {
    isIde: boolean;
    displayName: string;
    executablePath: string;
    processName: string;
    dataPath: string;
    stateDbPath: string;
}

export interface IdeAccountTokens {
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresAt?: number;
    idToken?: string;
}

export interface CapturedIdeState {
    oauthToken?: string;
    userStatus?: string;
    profileUrl?: string;
}

/**
 * Bit-exact Protocol Buffer encoder for Antigravity IDE state.vscdb entries.
 */
export class ProtobufUtils {
    private static concatBytes(...parts: Uint8Array[]): Uint8Array {
        const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
        const merged = new Uint8Array(totalLength);
        let offset = 0;
        for (const part of parts) {
            merged.set(part, offset);
            offset += part.length;
        }
        return merged;
    }

    static encodeVarint(value: number | bigint): Uint8Array {
        const buf: number[] = [];
        let val = BigInt(value);
        while (val >= 128n) {
            buf.push(Number((val & 127n) | 128n));
            val >>= 7n;
        }
        buf.push(Number(val));
        return new Uint8Array(buf);
    }

    static encodeVarintField(fieldNum: number, value: number): Uint8Array {
        const tag = (fieldNum << 3) | 0;
        return this.concatBytes(this.encodeVarint(tag), this.encodeVarint(value));
    }

    static encodeLenDelimField(fieldNum: number, data: Uint8Array): Uint8Array {
        const tag = (fieldNum << 3) | 2;
        const tagBytes = this.encodeVarint(tag);
        const lenBytes = this.encodeVarint(data.length);
        const result = new Uint8Array(tagBytes.length + lenBytes.length + data.length);
        result.set(tagBytes, 0);
        result.set(lenBytes, tagBytes.length);
        result.set(data, tagBytes.length + lenBytes.length);
        return result;
    }

    static encodeStringField(fieldNum: number, value: string): Uint8Array {
        const utf8 = Buffer.from(value, "utf-8");
        return this.encodeLenDelimField(fieldNum, utf8);
    }

    static createOAuthInfo(
        accessToken: string,
        refreshToken: string,
        expirySeconds: number,
        isGcpTos = false,
        idToken?: string,
        email?: string,
    ): Uint8Array {
        if (isGcpTos && email) {
            const lower = email.toLowerCase();
            if (
                lower.endsWith("@gmail.com") ||
                lower.endsWith("@googlemail.com")
            ) {
                isGcpTos = false;
            }
        }

        const field1 = this.encodeStringField(1, accessToken);
        const field2 = this.encodeStringField(2, "Bearer");
        const field3 = this.encodeStringField(3, refreshToken);

        const timestampTag = (1 << 3) | 0;
        const tagBytes = this.encodeVarint(timestampTag);
        const secondsBytes = this.encodeVarint(expirySeconds);
        const timestampMsg = new Uint8Array(tagBytes.length + secondsBytes.length);
        timestampMsg.set(tagBytes, 0);
        timestampMsg.set(secondsBytes, tagBytes.length);
        const field4 = this.encodeLenDelimField(4, timestampMsg);

        const field5 = idToken
            ? this.encodeStringField(5, idToken)
            : new Uint8Array();
        const field6 = isGcpTos
            ? this.encodeVarintField(6, 1)
            : new Uint8Array();

        return this.concatBytes(field1, field2, field3, field4, field5, field6);
    }

    static createUnifiedStateEntry(
        sentinelKey: string,
        payload: Uint8Array,
    ): string {
        const payloadBase64 = Buffer.from(payload).toString("base64");
        const row = this.encodeStringField(1, payloadBase64);
        const dataEntry = this.concatBytes(
            this.encodeStringField(1, sentinelKey),
            this.encodeLenDelimField(2, row),
        );
        const topic = this.encodeLenDelimField(1, dataEntry);
        return Buffer.from(topic).toString("base64");
    }

    static createUnifiedOAuthToken(
        accessToken: string,
        refreshToken: string,
        expirySeconds: number,
        isGcpTos = false,
        idToken?: string,
        email?: string,
    ): string {
        const oauthInfo = this.createOAuthInfo(
            accessToken,
            refreshToken,
            expirySeconds,
            isGcpTos,
            idToken,
            email,
        );
        return this.createUnifiedStateEntry(
            "oauthTokenInfoSentinelKey",
            oauthInfo,
        );
    }

    static createMinimalUserStatusPayload(email: string): Uint8Array {
        return this.concatBytes(
            this.encodeStringField(3, email),
            this.encodeStringField(7, email),
        );
    }

    static createUnifiedUserStatus(email: string): string {
        const payload = this.createMinimalUserStatusPayload(email);
        return this.createUnifiedStateEntry("userStatusSentinelKey", payload);
    }
}

export class IdeStateService {
    /**
     * Determines whether the current running environment is Google Antigravity IDE.
     */
    public static isAntigravityIde(): boolean {
        const appName = vscode.env.appName.toLowerCase();
        const execName = path.basename(process.execPath).toLowerCase();
        return (
            appName.includes("antigravity") ||
            execName.includes("antigravity")
        );
    }

    /**
     * Resolves the product information and file locations for Antigravity IDE.
     */
    public static getProductInfo(): AntigravityProductInfo {
        const homeDir = os.homedir();
        const isIde = this.isAntigravityIde();

        let dataPath = "";
        let processName = "Antigravity IDE.exe";
        let executablePath = process.execPath;

        if (process.platform === "win32") {
            const appData =
                process.env.APPDATA || path.join(homeDir, "AppData", "Roaming");
            const localAppData =
                process.env.LOCALAPPDATA || path.join(homeDir, "AppData", "Local");
            const programFiles =
                process.env.PROGRAMFILES || "C:\\Program Files";

            dataPath = path.join(appData, "Antigravity IDE");
            if (!fs.existsSync(dataPath)) {
                const legacyData = path.join(appData, "Antigravity");
                if (fs.existsSync(legacyData)) {
                    dataPath = legacyData;
                    processName = "Antigravity.exe";
                }
            }

            const candidates = [
                process.execPath,
                path.join(localAppData, "Programs", "Antigravity IDE", "Antigravity IDE.exe"),
                path.join(programFiles, "Antigravity IDE", "Antigravity IDE.exe"),
                path.join(localAppData, "Programs", "Antigravity", "Antigravity.exe"),
            ];

            for (const candidate of candidates) {
                if (fs.existsSync(candidate)) {
                    executablePath = candidate;
                    processName = path.basename(candidate);
                    break;
                }
            }
        } else if (process.platform === "darwin") {
            dataPath = path.join(homeDir, "Library", "Application Support", "Antigravity IDE");
            if (!fs.existsSync(dataPath)) {
                dataPath = path.join(homeDir, "Library", "Application Support", "Antigravity");
            }
            processName = "Antigravity IDE";
        } else {
            const configHome =
                process.env.XDG_CONFIG_HOME || path.join(homeDir, ".config");
            dataPath = path.join(configHome, "Antigravity IDE");
            if (!fs.existsSync(dataPath)) {
                dataPath = path.join(configHome, "Antigravity");
            }
            processName = "Antigravity IDE";
        }

        const stateDbPath = path.join(
            dataPath,
            "User",
            "globalStorage",
            "state.vscdb",
        );

        return {
            isIde,
            displayName: isIde ? "Antigravity IDE" : "Antigravity",
            executablePath,
            processName,
            dataPath,
            stateDbPath,
        };
    }

    /**
     * Resolves the path to the bundled sql-asm.js file.
     */
    private static getSqlAsmPath(context: vscode.ExtensionContext): string {
        const candidateInDist = path.join(context.extensionPath, "dist", "sql-asm.js");
        if (fs.existsSync(candidateInDist)) {
            return candidateInDist;
        }

        const candidateInNodeModules = path.join(
            context.extensionPath,
            "node_modules",
            "sql.js",
            "dist",
            "sql-asm.js",
        );
        if (fs.existsSync(candidateInNodeModules)) {
            return candidateInNodeModules;
        }

        return candidateInDist;
    }

    /**
     * Reads the current active state snapshots directly from state.vscdb.
     */
    public static async captureCurrentIdeState(
        context: vscode.ExtensionContext,
    ): Promise<CapturedIdeState | null> {
        const product = this.getProductInfo();
        if (!fs.existsSync(product.stateDbPath)) {
            return null;
        }

        try {
            const sqlAsmPath = this.getSqlAsmPath(context);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const initSqlJs = require(sqlAsmPath);
            const SQL = await initSqlJs();
            const buffer = fs.readFileSync(product.stateDbPath);
            const db = new SQL.Database(buffer);

            try {
                let oauthToken: string | undefined;
                let userStatus: string | undefined;
                let profileUrl: string | undefined;

                const tokenRes = db.exec(
                    "SELECT value FROM ItemTable WHERE key = 'antigravityUnifiedStateSync.oauthToken'",
                );
                if (tokenRes.length && tokenRes[0].values.length) {
                    oauthToken = tokenRes[0].values[0][0] as string;
                }

                const statusRes = db.exec(
                    "SELECT value FROM ItemTable WHERE key = 'antigravityUnifiedStateSync.userStatus'",
                );
                if (statusRes.length && statusRes[0].values.length) {
                    userStatus = statusRes[0].values[0][0] as string;
                }

                const profileRes = db.exec(
                    "SELECT value FROM ItemTable WHERE key = 'antigravity.profileUrl'",
                );
                if (profileRes.length && profileRes[0].values.length) {
                    profileUrl = profileRes[0].values[0][0] as string;
                }

                return { oauthToken, userStatus, profileUrl };
            } finally {
                db.close();
            }
        } catch {
            return null;
        }
    }

    /**
     * Reads all available avatar URLs stored in state.vscdb (such as antigravity.profileUrl).
     */
    public static async getStoredAvatars(
        context: vscode.ExtensionContext,
    ): Promise<Record<string, string>> {
        const avatars: Record<string, string> = {};
        const product = this.getProductInfo();
        if (!fs.existsSync(product.stateDbPath)) {
            return avatars;
        }

        try {
            const sqlAsmPath = this.getSqlAsmPath(context);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const initSqlJs = require(sqlAsmPath);
            const SQL = await initSqlJs();
            const buffer = fs.readFileSync(product.stateDbPath);
            const db = new SQL.Database(buffer);

            try {
                // Active profileUrl
                const profRes = db.exec(
                    "SELECT value FROM ItemTable WHERE key = 'antigravity.profileUrl'",
                );
                if (profRes.length && profRes[0].values.length) {
                    const url = profRes[0].values[0][0] as string;
                    if (url && typeof url === "string") {
                        avatars["__active__"] = url;
                    }
                }
            } finally {
                db.close();
            }
        } catch {
            // Ignore
        }

        return avatars;
    }

    /**
     * Returns the standalone JavaScript code for the detached worker process.
     */
    private static getWorkerScriptContent(): string {
        return `
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const payloadPath = process.argv[2];
if (!payloadPath || !fs.existsSync(payloadPath)) {
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf-8'));
const { dbPath, rows, jetskiTokenPath, jetskiTokenJson, executablePath, processName, sqlAsmPath, workspacePath } = payload;
const ownPid = process.pid;
const logPath = process.platform === 'win32'
  ? path.join(process.env.TEMP || process.env.TMP || 'C:\\\\Windows\\\\Temp', 'antigravity-switcher.log')
  : '/tmp/antigravity-switcher.log';
function log(msg) {
  try {
    fs.appendFileSync(logPath, '[' + new Date().toISOString() + '] ' + msg + '\\n');
  } catch {}
}

function getOtherIdePids() {
  try {
    if (process.platform === 'win32') {
      const safeProcessName = String(processName || 'Antigravity.exe').replace(/"/g, '');
      const out = execSync('tasklist /FI "IMAGENAME eq ' + safeProcessName + '" /FO CSV /NH', {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const pids = [];
      for (const line of out.split('\\n')) {
        const match = line.match(/^"([^"]+)","(\\d+)"/);
        if (match && match[1].toLowerCase() === safeProcessName.toLowerCase()) {
          const pid = parseInt(match[2], 10);
          if (pid !== ownPid) pids.push(pid);
        }
      }
      return pids;
    } else if (process.platform === 'darwin') {
      const out = execSync('ps -ax -o pid,command || true', {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const pids = [];
      for (const line of out.split('\\n')) {
        if (line.toLowerCase().includes('antigravity') &&
            (line.includes('/Contents/MacOS/Electron') || line.includes('/Contents/MacOS/Antigravity')) &&
            !line.includes('/Frameworks/') &&
            !line.includes('--type=') &&
            !line.includes('.inject-worker.js') &&
            !line.includes('grep')) {
          const m = line.trim().match(/^(\\d+)/);
          if (m) {
            const p = parseInt(m[1], 10);
            if (!isNaN(p) && p !== ownPid) pids.push(p);
          }
        }
      }
      return pids;
    } else {
      const safeProcessName = String(processName || 'antigravity').replace(/"/g, '');
      const out = execSync('pgrep -x "' + safeProcessName + '" || true', {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      return out.trim().split('\\n').map(p => parseInt(p, 10)).filter(p => !isNaN(p) && p !== ownPid);
    }
  } catch {
    return [];
  }
}

async function waitForIdeExit(timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const pids = getOtherIdePids();
    if (pids.length === 0) return true;
    await new Promise(r => setTimeout(r, 200));
  }
  return false;
}

function forceKillRemainingPids() {
  const pids = getOtherIdePids();
  for (const pid of pids) {
    try {
      if (process.platform === 'win32') {
        execSync('taskkill /F /PID ' + pid, { stdio: 'ignore', windowsHide: true });
      } else {
        process.kill(pid, 'SIGKILL');
      }
    } catch {}
  }
}

async function run() {
  log('Worker started. Waiting for main Antigravity IDE process to exit...');

  // Phase 1: Wait up to 5s for main Antigravity IDE process to exit
  const exited = await waitForIdeExit(5000);
  if (!exited) {
    log('Timeout waiting for exit. Force killing remaining main process...');
    forceKillRemainingPids();
  } else {
    log('Main Antigravity IDE process exited cleanly.');
  }

  // Phase 2: Brief pause to ensure file handles are released
  await new Promise(r => setTimeout(r, 400));

  // Phase 3: Update SQLite state.vscdb
  log('Updating SQLite state.vscdb...');
  const initSqlJs = require(sqlAsmPath);
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  try {
    for (const { key, value } of rows) {
      if (value === null) {
        db.run('DELETE FROM ItemTable WHERE key = ?', [key]);
      } else {
        db.run('INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)', [key, value]);
      }
    }
    const out = db.export();
    fs.writeFileSync(dbPath, Buffer.from(out));

    const backupDb = dbPath + '.backup';
    if (fs.existsSync(backupDb)) {
      try {
        fs.writeFileSync(backupDb, Buffer.from(out));
      } catch {}
    }
    log('SQLite state.vscdb updated successfully.');
  } finally {
    db.close();
  }

  // Phase 3b: Write ~/.gemini/jetski-standalone-oauth-token if provided
  if (jetskiTokenPath && jetskiTokenJson) {
    try {
      fs.mkdirSync(path.dirname(jetskiTokenPath), { recursive: true });
      fs.writeFileSync(jetskiTokenPath, jetskiTokenJson, { encoding: 'utf-8', mode: 0o600 });
      log('jetski-standalone-oauth-token written successfully.');
    } catch (e) {
      log('Error writing jetski token: ' + e);
    }
  }

  // Clean up payload file
  try { fs.unlinkSync(payloadPath); } catch {}

  // Phase 4: Relaunch Antigravity IDE
  log('Phase 4: Relaunching Antigravity IDE...');
  if (process.platform === 'darwin') {
    const shPath = path.join(path.dirname(payloadPath), '.relaunch-antigravity.sh');
    const ws = workspacePath ? String(workspacePath) : '';
    const shLines = [
      '#!/bin/bash',
      'echo "[$(date -u +\\"%Y-%m-%dT%H:%M:%SZ\\")] Relaunch script started, waiting 0.8s..." >> ' + logPath,
      'sleep 0.8',
      'unset ELECTRON_RUN_AS_NODE',
      'export VSCODE_CLI=',
      'TARGET="$1"',
      'echo "[$(date -u +\\"%Y-%m-%dT%H:%M:%SZ\\")] Executing open for target: \\"$TARGET\\"" >> ' + logPath,
      'if [ -n "$TARGET" ]; then',
      '  /usr/bin/open -b com.google.antigravity-ide "$TARGET" >> ' + logPath + ' 2>&1 || \\\\',
      '  /usr/bin/open -a "Antigravity IDE" "$TARGET" >> ' + logPath + ' 2>&1 || \\\\',
      '  /usr/bin/open -n -b com.google.antigravity-ide "$TARGET" >> ' + logPath + ' 2>&1 || \\\\',
      '  "/Applications/Antigravity IDE.app/Contents/Resources/app/bin/antigravity-ide" "$TARGET" >> ' + logPath + ' 2>&1 || \\\\',
      '  /usr/bin/open "$TARGET" >> ' + logPath + ' 2>&1',
      'else',
      '  /usr/bin/open -b com.google.antigravity-ide >> ' + logPath + ' 2>&1 || \\\\',
      '  /usr/bin/open -a "Antigravity IDE" >> ' + logPath + ' 2>&1 || \\\\',
      '  /usr/bin/open -n -b com.google.antigravity-ide >> ' + logPath + ' 2>&1 || \\\\',
      '  "/Applications/Antigravity IDE.app/Contents/Resources/app/bin/antigravity-ide" >> ' + logPath + ' 2>&1',
      'fi',
      'echo "[$(date -u +\\"%Y-%m-%dT%H:%M:%SZ\\")] Relaunch script completed." >> ' + logPath,
      'rm -f "$0"'
    ];
    fs.writeFileSync(shPath, shLines.join('\\n'), { encoding: 'utf-8', mode: 0o755 });
    log('Spawning detached relaunch script: ' + shPath + ' with workspace: ' + ws);
    try {
      const child = spawn('/bin/bash', [shPath, ws], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
      log('Detached relaunch script spawned successfully.');
    } catch (e1) {
      log('Detached launch spawn failed: ' + e1);
    }
  } else if (process.platform === 'win32') {
    const batPath = path.join(path.dirname(payloadPath), '.relaunch-antigravity.bat');
    const wsArg = workspacePath ? (' "' + String(workspacePath).replace(/"/g, '""') + '"') : '';
    const batLines = [
      '@echo off',
      'timeout /t 1 /nobreak >nul',
      'set ELECTRON_RUN_AS_NODE=',
      'start "" "' + executablePath + '"' + wsArg,
      'del "%~f0"'
    ];
    fs.writeFileSync(batPath, batLines.join(String.fromCharCode(13, 10)) + String.fromCharCode(13, 10), 'utf-8');
    try {
      const child = spawn('cmd.exe', ['/c', batPath], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      });
      child.unref();
    } catch {
      const psCmd = 'powershell -NoProfile -Command "Start-Sleep -Seconds 1; Remove-Item Env:ELECTRON_RUN_AS_NODE -EA SilentlyContinue; Start-Process ' + JSON.stringify(executablePath) + '"';
      execSync(psCmd, { stdio: 'ignore' });
    }
  } else {
    const envCopy = { ...process.env };
    delete envCopy.ELECTRON_RUN_AS_NODE;
    const args = workspacePath ? [workspacePath] : [];
    const child = spawn(executablePath, args, {
      detached: true,
      stdio: 'ignore',
      env: envCopy,
    });
    child.unref();
  }

  log('Worker finished. Exiting.');
  process.exit(0);
}

run().catch((e) => {
  log('Worker top-level error: ' + e);
  process.exit(1);
});
`;
    }

    /**
     * Executes the detached worker process to inject the target state and restart Antigravity IDE.
     */
    public static async performIdeAccountSwitch(
        context: vscode.ExtensionContext,
        target: {
            email: string;
            oauthToken: string;
            userStatus: string;
            profileUrl?: string;
            tokenJson?: string;
        },
    ): Promise<boolean> {
        const product = this.getProductInfo();
        if (!fs.existsSync(product.stateDbPath)) {
            throw new Error(
                `Antigravity IDE state database not found at ${product.stateDbPath}`,
            );
        }

        const sqlAsmPath = this.getSqlAsmPath(context);
        if (!fs.existsSync(sqlAsmPath)) {
            throw new Error(
                `sql-asm.js not found at ${sqlAsmPath}. Please reinstall the extension.`,
            );
        }

        // Save all open editor files before restart
        try {
            await vscode.workspace.saveAll(false);
        } catch {
            // Best effort
        }

        const rows: Array<{ key: string; value: string | null }> = [
            {
                key: "antigravityUnifiedStateSync.oauthToken",
                value: target.oauthToken,
            },
            {
                key: "antigravityUnifiedStateSync.userStatus",
                value: target.userStatus,
            },
            {
                key: "antigravityOnboarding",
                value: "true",
            },
        ];

        if (target.profileUrl) {
            rows.push({
                key: "antigravity.profileUrl",
                value: target.profileUrl,
            });
        }

        const storageDir = context.globalStorageUri.fsPath;
        fs.mkdirSync(storageDir, { recursive: true });

        const payloadPath = path.join(storageDir, ".inject-payload.json");
        const workerPath = path.join(storageDir, ".inject-worker.js");

        const jetskiTokenPath = path.join(os.homedir(), ".gemini", "jetski-standalone-oauth-token");
        const currentWorkspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

        const payloadObj = {
            dbPath: product.stateDbPath,
            rows,
            jetskiTokenPath,
            jetskiTokenJson: target.tokenJson,
            executablePath: product.executablePath,
            processName: product.processName,
            sqlAsmPath,
            workspacePath: currentWorkspace,
        };

        fs.writeFileSync(
            payloadPath,
            JSON.stringify(payloadObj, null, 2),
            "utf-8",
        );
        fs.writeFileSync(
            workerPath,
            this.getWorkerScriptContent(),
            "utf-8",
        );

        const workerEnv = { ...process.env, ELECTRON_RUN_AS_NODE: "1" };

        const child = spawn(process.execPath, [workerPath, payloadPath], {
            detached: true,
            stdio: "ignore",
            windowsHide: true,
            cwd: storageDir,
            env: workerEnv,
        });
        child.unref();

        // Gracefully quit Antigravity IDE so in-memory state flushes and exits cleanly
        if (process.platform === "darwin") {
            await vscode.commands.executeCommand("workbench.action.quit");
        } else {
            await vscode.commands.executeCommand("workbench.action.closeWindow");
        }
        return true;
    }
}


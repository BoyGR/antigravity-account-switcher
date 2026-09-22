import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface CandidatePath {
  path: string;
  exists: boolean;
  type: "file" | "directory" | "missing";
}

function inspect(target: string): CandidatePath {
  try {
    const stat = fs.statSync(target);

    return {
      path: target,
      exists: true,
      type: stat.isDirectory() ? "directory" : "file"
    };
  } catch {
    return {
      path: target,
      exists: false,
      type: "missing"
    };
  }
}

export function getCandidateStoragePaths(): CandidatePath[] {
  const home = os.homedir();
  const platform = process.platform;

  const candidates: string[] = [];

  if (platform === "win32") {
    const appData =
      process.env.APPDATA ??
      path.join(home, "AppData", "Roaming");
    const userProfile =
      process.env.USERPROFILE ??
      home;

    candidates.push(
      path.join(appData, "Code", "User", "globalStorage"),
      path.join(appData, "Code", "User", "workspaceStorage"),
      path.join(appData, "Code", "User", "globalStorage", "state.vscdb"),
      path.join(appData, "Code", "User", "globalStorage", "state.vscdb.backup"),
      path.join(userProfile, ".gemini"),
      path.join(userProfile, ".gemini", "antigravity"),
      path.join(userProfile, ".gemini", "antigravity-ide"),
      path.join(appData, "Antigravity IDE", "User", "globalStorage"),
      path.join(appData, "Cursor", "User", "globalStorage"),
      path.join(appData, "Cursor", "User", "workspaceStorage"),
      path.join(userProfile, "AppData", "Roaming", "Antigravity"),
    );
  } else if (platform === "darwin") {
    const appSupport = path.join(home, "Library", "Application Support");

    candidates.push(
      path.join(appSupport, "Code", "User", "globalStorage"),
      path.join(appSupport, "Code", "User", "workspaceStorage"),
      path.join(appSupport, "Code", "User", "globalStorage", "state.vscdb"),
      path.join(appSupport, "Antigravity IDE", "User", "globalStorage"),
      path.join(appSupport, "Antigravity IDE", "User", "workspaceStorage"),
      path.join(appSupport, "Cursor", "User", "globalStorage"),
      path.join(appSupport, "Cursor", "User", "workspaceStorage"),
      path.join(home, ".gemini"),
      path.join(home, ".gemini", "antigravity"),
      path.join(home, ".gemini", "antigravity-ide"),
    );
  } else {
    // Linux / POSIX
    const configHome = process.env.XDG_CONFIG_HOME ?? path.join(home, ".config");

    candidates.push(
      path.join(configHome, "Code", "User", "globalStorage"),
      path.join(configHome, "Code", "User", "workspaceStorage"),
      path.join(configHome, "Code", "User", "globalStorage", "state.vscdb"),
      path.join(configHome, "Antigravity IDE", "User", "globalStorage"),
      path.join(configHome, "Cursor", "User", "globalStorage"),
      path.join(home, ".gemini"),
      path.join(home, ".gemini", "antigravity"),
      path.join(home, ".gemini", "antigravity-ide"),
    );
  }

  return candidates.map(inspect);
}

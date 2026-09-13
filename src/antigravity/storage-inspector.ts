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

  const appData =
    process.env.APPDATA ??
    path.join(home, "AppData", "Roaming");

  const userProfile =
    process.env.USERPROFILE ??
    home;

  const candidates = [
    path.join(appData, "Code", "User", "globalStorage"),
    path.join(appData, "Code", "User", "workspaceStorage"),
    path.join(appData, "Code", "User", "globalStorage", "state.vscdb"),
    path.join(appData, "Code", "User", "globalStorage", "state.vscdb.backup"),

    path.join(userProfile, ".gemini"),
    path.join(userProfile, ".gemini", "antigravity"),
    path.join(userProfile, ".gemini", "antigravity-ide"),

    path.join(appData, "Antigravity IDE", "User", "globalStorage"),
    path.join(
      userProfile,
      "AppData",
      "Roaming",
      "Antigravity"
    )
  ];

  return candidates.map(inspect);
}

import * as vscode from "vscode";

export interface ExtensionInfo {
  id: string;
  displayName?: string;
  version?: string;
  extensionPath?: string;
}

export function findAntigravityExtensions(): ExtensionInfo[] {
  const matches: ExtensionInfo[] = [];

  for (const ext of vscode.extensions.all) {
    const id = ext.id.toLowerCase();

    const packageJson = ext.packageJSON ?? {};
    const displayName = String(packageJson.displayName ?? "");
    const description = String(packageJson.description ?? "");

    const haystack = [
      id,
      displayName.toLowerCase(),
      description.toLowerCase()
    ].join(" ");

    if (haystack.includes("antigravity")) {
      matches.push({
        id: ext.id,
        displayName: packageJson.displayName,
        version: packageJson.version,
        extensionPath: ext.extensionPath
      });
    }
  }

  return matches;
}

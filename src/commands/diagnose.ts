import * as vscode from "vscode";
import { findAntigravityExtensions } from "../antigravity/detector";
import { getCandidateStoragePaths } from "../antigravity/storage-inspector";

export async function diagnoseAntigravity(): Promise<void> {
  const output = vscode.window.createOutputChannel(
    "Antigravity Diagnostics"
  );

  output.clear();
  output.show(true);

  output.appendLine("==================================================");
  output.appendLine("Antigravity Diagnostics");
  output.appendLine("READ-ONLY MODE");
  output.appendLine("==================================================");
  output.appendLine("");

  output.appendLine("VS Code");
  output.appendLine(`  Version: ${vscode.version}`);
  output.appendLine(`  Platform: ${process.platform}`);
  output.appendLine(`  Architecture: ${process.arch}`);
  output.appendLine("");

  const extensions = findAntigravityExtensions();

  output.appendLine("Antigravity-related extensions");

  if (extensions.length === 0) {
    output.appendLine("  No Antigravity-related extension detected.");
  } else {
    for (const ext of extensions) {
      output.appendLine("");
      output.appendLine(`  ID: ${ext.id}`);
      output.appendLine(`  Name: ${ext.displayName ?? "Unknown"}`);
      output.appendLine(`  Version: ${ext.version ?? "Unknown"}`);
      output.appendLine(`  Path: ${ext.extensionPath ?? "Unknown"}`);
    }
  }

  output.appendLine("");
  output.appendLine("Candidate storage locations");

  for (const candidate of getCandidateStoragePaths()) {
    const marker = candidate.exists ? "[FOUND]" : "[----]";
    output.appendLine(
      `  ${marker} ${candidate.type.padEnd(9)} ${candidate.path}`
    );
  }

  output.appendLine("");
  output.appendLine("Security notes");
  output.appendLine("  - No authentication data was modified.");
  output.appendLine("  - No credential was copied.");
  output.appendLine("  - SecretStorage is not accessed.");
  output.appendLine("  - state.vscdb is not opened or modified.");
  output.appendLine("");
  output.appendLine("Diagnosis completed.");
}

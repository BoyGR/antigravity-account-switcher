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
exports.diagnoseAntigravity = diagnoseAntigravity;
const vscode = __importStar(require("vscode"));
const detector_1 = require("../antigravity/detector");
const storage_inspector_1 = require("../antigravity/storage-inspector");
async function diagnoseAntigravity() {
    const output = vscode.window.createOutputChannel("Antigravity Diagnostics");
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
    const extensions = (0, detector_1.findAntigravityExtensions)();
    output.appendLine("Antigravity-related extensions");
    if (extensions.length === 0) {
        output.appendLine("  No Antigravity-related extension detected.");
    }
    else {
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
    for (const candidate of (0, storage_inspector_1.getCandidateStoragePaths)()) {
        const marker = candidate.exists ? "[FOUND]" : "[----]";
        output.appendLine(`  ${marker} ${candidate.type.padEnd(9)} ${candidate.path}`);
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
//# sourceMappingURL=diagnose.js.map
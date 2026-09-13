import * as vscode from "vscode";
import { getManagedAccounts } from "./account-registry";
import { getAntigravityCurrentAccount } from "./hub-auth-client";

const WORKSPACE_STORAGE_KEY = "boygr.antigravity.workspaceAccounts.v1";

interface WorkspaceAccountsState {
    version: 1;
    folders: Record<string, string>; // folderPath (normalized lower-case) -> email
}

function normalizePath(folderPath: string): string {
    return folderPath.trim().replace(/[\\/]+$/, "").toLowerCase();
}

export function getCurrentWorkspacePath(): string | undefined {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        return undefined;
    }
    return folders[0].uri.fsPath;
}

export function getWorkspaceAccount(
    context: vscode.ExtensionContext,
    folderPath: string,
): string | undefined {
    const state = context.globalState.get<WorkspaceAccountsState>(
        WORKSPACE_STORAGE_KEY,
    );
    if (!state || state.version !== 1) {
        return undefined;
    }
    return state.folders[normalizePath(folderPath)];
}

export async function setWorkspaceAccount(
    context: vscode.ExtensionContext,
    folderPath: string,
    email: string,
): Promise<void> {
    const existing = context.globalState.get<WorkspaceAccountsState>(
        WORKSPACE_STORAGE_KEY,
    );
    const state: WorkspaceAccountsState =
        existing && existing.version === 1
            ? { version: 1, folders: { ...existing.folders } }
            : { version: 1, folders: {} };

    state.folders[normalizePath(folderPath)] = email.trim().toLowerCase();
    await context.globalState.update(WORKSPACE_STORAGE_KEY, state);
}

export async function removeWorkspaceAccount(
    context: vscode.ExtensionContext,
    folderPath: string,
): Promise<void> {
    const existing = context.globalState.get<WorkspaceAccountsState>(
        WORKSPACE_STORAGE_KEY,
    );
    if (!existing || existing.version !== 1) {
        return;
    }
    const folders = { ...existing.folders };
    delete folders[normalizePath(folderPath)];
    await context.globalState.update(WORKSPACE_STORAGE_KEY, {
        version: 1,
        folders,
    });
}

export async function checkAndPromptWorkspaceAccount(
    context: vscode.ExtensionContext,
): Promise<void> {
    const config = vscode.workspace.getConfiguration(
        "boygr.antigravityAccountSwitcher",
    );
    const shouldPrompt = config.get<boolean>(
        "autoPromptWorkspaceAccount",
        true,
    );
    if (!shouldPrompt) {
        return;
    }

    const currentPath = getCurrentWorkspacePath();
    if (!currentPath) {
        return;
    }

    const targetEmail = getWorkspaceAccount(context, currentPath);
    if (!targetEmail) {
        return;
    }

    // Wait briefly for Antigravity backend to be ready on startup
    let current = await getAntigravityCurrentAccount().catch(() => undefined);
    if (!current) {
        for (let i = 0; i < 5; i++) {
            await new Promise(r => setTimeout(r, 1500));
            current = await getAntigravityCurrentAccount().catch(() => undefined);
            if (current?.email) {
                break;
            }
        }
    }

    // If current account cannot be determined, do not show false prompt
    if (!current?.email) {
        return;
    }

    if (current.email.toLowerCase() === targetEmail.toLowerCase()) {
        return;
    }

    const savedAccounts = getManagedAccounts(context);
    const targetAccount = savedAccounts.find(
        a => a.email.toLowerCase() === targetEmail.toLowerCase(),
    );
    const displayName = targetAccount?.label || targetAccount?.email || targetEmail;
    const folderName = vscode.workspace.name || "workspace";

    const switchBtn = `Switch to ${displayName}`;
    void vscode.window
        .showInformationMessage(
            `Workspace "${folderName}" is linked to ${displayName}. Switch accounts now?`,
            switchBtn,
            "Dismiss",
        )
        .then(selection => {
            if (selection === switchBtn) {
                void vscode.commands.executeCommand(
                    "boygr.antigravityAccountSwitcher.switchAccount",
                    {
                        email: targetAccount ? targetAccount.email : targetEmail,
                        label: targetAccount?.label,
                    },
                );
            }
        });
}

export function registerWorkspaceAssociationCommands(
    context: vscode.ExtensionContext,
    onUpdated?: () => Promise<void> | void,
): vscode.Disposable[] {
    const setCommand = vscode.commands.registerCommand(
        "boygr.antigravityAccountSwitcher.setWorkspaceAccount",
        async () => {
            const currentPath = getCurrentWorkspacePath();
            if (!currentPath) {
                void vscode.window.showWarningMessage(
                    "No active folder or workspace open to associate an account with.",
                );
                return;
            }

            const savedAccounts = getManagedAccounts(context);
            if (savedAccounts.length === 0) {
                void vscode.window.showWarningMessage(
                    "No saved Antigravity accounts found. Add an account first.",
                );
                return;
            }

            const currentLinked = getWorkspaceAccount(context, currentPath);
            const items = savedAccounts.map(a => ({
                label: a.label ? `${a.label} (${a.email})` : a.email,
                description:
                    a.email.toLowerCase() === currentLinked?.toLowerCase()
                        ? "Currently linked"
                        : undefined,
                email: a.email,
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: `Select default Antigravity account for workspace "${vscode.workspace.name || currentPath}"`,
            });

            if (!selected) {
                return;
            }

            await setWorkspaceAccount(context, currentPath, selected.email);
            if (onUpdated) {
                await onUpdated();
            }

            void vscode.window.showInformationMessage(
                `Workspace "${vscode.workspace.name || currentPath}" is now linked to ${selected.label}.`,
            );

            // Check if user wants to switch now
            const current = await getAntigravityCurrentAccount().catch(() => undefined);
            if (current?.email?.toLowerCase() !== selected.email.toLowerCase()) {
                const switchNow = await vscode.window.showInformationMessage(
                    `Switch active account to ${selected.email} now?`,
                    "Switch Now",
                    "Keep Current",
                );
                if (switchNow === "Switch Now") {
                    void vscode.commands.executeCommand(
                        "boygr.antigravityAccountSwitcher.switchAccount",
                        { email: selected.email },
                    );
                }
            }
        },
    );

    const clearCommand = vscode.commands.registerCommand(
        "boygr.antigravityAccountSwitcher.clearWorkspaceAccount",
        async () => {
            const currentPath = getCurrentWorkspacePath();
            if (!currentPath) {
                return;
            }
            await removeWorkspaceAccount(context, currentPath);
            if (onUpdated) {
                await onUpdated();
            }
            void vscode.window.showInformationMessage(
                `Cleared account link for workspace "${vscode.workspace.name || currentPath}".`,
            );
        },
    );

    return [setCommand, clearCommand];
}


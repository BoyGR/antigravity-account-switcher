import * as vscode from "vscode";

import {
    getManagedAccounts,
    ManagedAntigravityAccount,
} from "../antigravity/account-registry";

import {
    AntigravityCurrentAccount,
    getAntigravityCurrentAccount,
} from "../antigravity/hub-auth-client";

import {
    AntigravityHubStatus,
    inspectAntigravityHub,
} from "../antigravity/hub-detector";

type WebviewMessage =
    | { type: "ready" }
    | { type: "refresh" }
    | { type: "addAccount" }
    | { type: "saveCurrent" }
    | { type: "reauth" }
    | { type: "signout" }
    | {
          type: "switchAccount";
          account: ManagedAntigravityAccount;
      }
    | {
          type: "accountMenu";
          account: ManagedAntigravityAccount;
      };

interface AccountSwitcherViewState {
    loading: boolean;

    current?: AntigravityCurrentAccount;

    accounts: ManagedAntigravityAccount[];

    runtime?: AntigravityHubStatus;

    error?: string;
}

const VIEW_ID =
    "boygr.antigravityAccountSwitcher.accountsView";

export class AntigravityAccountWebviewProvider
    implements vscode.WebviewViewProvider, vscode.Disposable
{
    private view?: vscode.WebviewView;

    private retryTimer?: ReturnType<typeof setTimeout>;

    private retryIndex = 0;

    private readonly retryDelaysMs = [
        1000,
        2000,
        3000,
        5000,
        8000,
        10000,
    ];

    constructor(
        private readonly context: vscode.ExtensionContext,
    ) {}

    dispose(): void {
        this.cancelRetry();
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
    ): void {
        this.view =
            webviewView;

        const { webview } =
            webviewView;

        webview.options = {
            enableScripts:
                true,

            localResourceRoots: [
                vscode.Uri.joinPath(
                    this.context.extensionUri,
                    "media",
                ),
            ],
        };

        webview.html =
            this.getHtml(webview);

        const messageSubscription =
            webview.onDidReceiveMessage(
                async (message: WebviewMessage) => {
                    await this.handleMessage(message);
                },
            );

        const visibilitySubscription =
            webviewView.onDidChangeVisibility(
                () => {
                    if (webviewView.visible) {
                        void this.refresh();
                    }
                },
            );

        const disposeSubscription =
            webviewView.onDidDispose(
                () => {
                    this.view =
                        undefined;

                    this.cancelRetry();
                },
            );

        this.context.subscriptions.push(
            messageSubscription,
            visibilitySubscription,
            disposeSubscription,
        );
    }

    async refresh(): Promise<void> {
        this.resetRetry();

        await this.postState(true);

        const success =
            await this.loadAndPostState();

        if (!success) {
            this.scheduleRetry();
        }
    }

    private async loadAndPostState(): Promise<boolean> {
        const accounts =
            getManagedAccounts(
                this.context,
            );

        let current:
            | AntigravityCurrentAccount
            | undefined;

        let runtime:
            | AntigravityHubStatus
            | undefined;

        let error:
            | string
            | undefined;

        try {
            runtime =
                await inspectAntigravityHub();
        } catch (runtimeError) {
            error =
                runtimeError instanceof Error
                    ? runtimeError.message
                    : String(runtimeError);
        }

        try {
            current =
                await getAntigravityCurrentAccount();

            error =
                undefined;
        } catch (accountError) {
            error =
                accountError instanceof Error
                    ? accountError.message
                    : String(accountError);
        }

        await this.postState(
            false,
            {
                current,
                accounts,
                runtime,
                error,
            },
        );

        return Boolean(current);
    }

    private async postState(
        loading: boolean,
        partial?: Partial<AccountSwitcherViewState>,
    ): Promise<void> {
        if (!this.view) {
            return;
        }

        const state:
            AccountSwitcherViewState = {
                loading,
                current:
                    partial?.current,

                accounts:
                    partial?.accounts ??
                    getManagedAccounts(
                        this.context,
                    ),

                runtime:
                    partial?.runtime,

                error:
                    partial?.error,
            };

        await this.view.webview.postMessage({
            type: "state",
            state,
        });
    }

    private cancelRetry(): void {
        if (!this.retryTimer) {
            return;
        }

        clearTimeout(
            this.retryTimer,
        );

        this.retryTimer =
            undefined;
    }

    private resetRetry(): void {
        this.cancelRetry();

        this.retryIndex =
            0;
    }

    private scheduleRetry(): void {
        if (
            this.retryTimer ||
            this.retryIndex >=
                this.retryDelaysMs.length
        ) {
            return;
        }

        const delay =
            this.retryDelaysMs[
                this.retryIndex
            ];

        this.retryIndex += 1;

        this.retryTimer =
            setTimeout(
                () => {
                    this.retryTimer =
                        undefined;

                    void this.retry();
                },
                delay,
            );
    }

    private async retry(): Promise<void> {
        const success =
            await this.loadAndPostState();

        if (success) {
            this.cancelRetry();
            return;
        }

        this.scheduleRetry();
    }

    private async handleMessage(
        message: WebviewMessage,
    ): Promise<void> {
        switch (message.type) {
            case "ready":
            case "refresh":
                await this.refresh();
                return;

            case "addAccount":
                await this.executeAndRefresh(
                    "boygr.antigravityAccountSwitcher.addAccount",
                );
                return;

            case "saveCurrent":
                await this.executeAndRefresh(
                    "boygr.antigravityAccountSwitcher.saveCurrentAccount",
                );
                return;

            case "reauth":
                await this.executeAndRefresh(
                    "boygr.antigravityAccountSwitcher.reAuth",
                );
                return;

            case "signout":
                await this.executeAndRefresh(
                    "boygr.antigravityAccountSwitcher.signOut",
                );
                return;

            case "switchAccount":
                await this.executeAndRefresh(
                    "boygr.antigravityAccountSwitcher.switchAccount",
                    message.account,
                );
                return;

            case "accountMenu":
                await this.showAccountMenu(
                    message.account,
                );
                return;
        }
    }

    private async executeAndRefresh(
        command: string,
        ...args: unknown[]
    ): Promise<void> {
        try {
            await vscode.commands.executeCommand(
                command,
                ...args,
            );
        } finally {
            await this.refresh();
        }
    }

    private async showAccountMenu(
        account: ManagedAntigravityAccount,
    ): Promise<void> {
        const current =
            await this.tryGetCurrentAccount();

        const isCurrent =
            current?.email
                .trim()
                .toLowerCase() ===
            account.email
                .trim()
                .toLowerCase();

        const options:
            vscode.QuickPickItem[] = [
                {
                    label:
                        "$(edit) Edit Label",
                    description:
                        "Change the local account label",
                },
            ];

        if (!isCurrent) {
            options.unshift({
                label:
                    "$(arrow-swap) Switch Account",
                description:
                    account.email,
            });
        }

        options.push({
            label:
                "$(trash) Remove Saved Account",
            description:
                "Remove local metadata only",
        });

        const selected =
            await vscode.window.showQuickPick(
                options,
                {
                    title:
                        account.label ||
                        account.displayName ||
                        account.email,

                    placeHolder:
                        "Choose an account action",
                },
            );

        if (!selected) {
            return;
        }

        if (
            selected.label.includes(
                "Switch Account",
            )
        ) {
            await this.executeAndRefresh(
                "boygr.antigravityAccountSwitcher.switchAccount",
                account,
            );

            return;
        }

        if (
            selected.label.includes(
                "Edit Label",
            )
        ) {
            await this.executeAndRefresh(
                "boygr.antigravityAccountSwitcher.editAccountLabel",
                account,
            );

            return;
        }

        if (
            selected.label.includes(
                "Remove Saved Account",
            )
        ) {
            await this.executeAndRefresh(
                "boygr.antigravityAccountSwitcher.removeSavedAccount",
                account,
            );
        }
    }

    private async tryGetCurrentAccount():
        Promise<
            AntigravityCurrentAccount |
            undefined
        >
    {
        try {
            return await getAntigravityCurrentAccount();
        } catch {
            return undefined;
        }
    }

    private getHtml(
        webview: vscode.Webview,
    ): string {
        const nonce =
            getNonce();

        const cssUri =
            webview.asWebviewUri(
                vscode.Uri.joinPath(
                    this.context.extensionUri,
                    "media",
                    "account-switcher.css",
                ),
            );

        const scriptUri =
            webview.asWebviewUri(
                vscode.Uri.joinPath(
                    this.context.extensionUri,
                    "media",
                    "account-switcher.js",
                ),
            );

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        http-equiv="Content-Security-Policy"
        content="
            default-src 'none';
            style-src ${webview.cspSource};
            script-src 'nonce-${nonce}';
        "
    >

    <link
        rel="stylesheet"
        href="${cssUri}"
    >

    <title>
        Antigravity Account Switcher
    </title>
</head>

<body>
    <main
        id="app"
    ></main>

    <script
        nonce="${nonce}"
        src="${scriptUri}"
    ></script>
</body>
</html>`;
    }
}

export function registerAntigravityAccountWebview(
    context: vscode.ExtensionContext,
): AntigravityAccountWebviewProvider {
    const provider =
        new AntigravityAccountWebviewProvider(
            context,
        );

    const registration =
        vscode.window.registerWebviewViewProvider(
            VIEW_ID,
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden:
                        true,
                },
            },
        );

    context.subscriptions.push(
        provider,
        registration,
    );

    return provider;
}

function getNonce(): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let value =
        "";

    for (
        let index = 0;
        index < 32;
        index += 1
    ) {
        value +=
            chars.charAt(
                Math.floor(
                    Math.random() *
                    chars.length,
                ),
            );
    }

    return value;
}

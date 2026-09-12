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
exports.AntigravityAccountWebviewProvider = void 0;
exports.registerAntigravityAccountWebview = registerAntigravityAccountWebview;
const vscode = __importStar(require("vscode"));
const account_registry_1 = require("../antigravity/account-registry");
const hub_auth_client_1 = require("../antigravity/hub-auth-client");
const hub_detector_1 = require("../antigravity/hub-detector");
const VIEW_ID = "boygr.antigravityAccountSwitcher.accountsView";
class AntigravityAccountWebviewProvider {
    context;
    view;
    retryTimer;
    retryIndex = 0;
    retryDelaysMs = [
        1000,
        2000,
        3000,
        5000,
        8000,
        10000,
    ];
    constructor(context) {
        this.context = context;
    }
    dispose() {
        this.cancelRetry();
    }
    resolveWebviewView(webviewView) {
        this.view =
            webviewView;
        const { webview } = webviewView;
        webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, "media"),
            ],
        };
        webview.html =
            this.getHtml(webview);
        const messageSubscription = webview.onDidReceiveMessage(async (message) => {
            await this.handleMessage(message);
        });
        const visibilitySubscription = webviewView.onDidChangeVisibility(() => {
            if (webviewView.visible) {
                void this.refresh();
            }
        });
        const disposeSubscription = webviewView.onDidDispose(() => {
            this.view =
                undefined;
            this.cancelRetry();
        });
        this.context.subscriptions.push(messageSubscription, visibilitySubscription, disposeSubscription);
    }
    async refresh() {
        this.resetRetry();
        await this.postState(true);
        const success = await this.loadAndPostState();
        if (!success) {
            this.scheduleRetry();
        }
    }
    async loadAndPostState() {
        const accounts = (0, account_registry_1.getManagedAccounts)(this.context);
        let current;
        let runtime;
        let error;
        try {
            runtime =
                await (0, hub_detector_1.inspectAntigravityHub)();
        }
        catch (runtimeError) {
            error =
                runtimeError instanceof Error
                    ? runtimeError.message
                    : String(runtimeError);
        }
        try {
            current =
                await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
            error =
                undefined;
        }
        catch (accountError) {
            error =
                accountError instanceof Error
                    ? accountError.message
                    : String(accountError);
        }
        await this.postState(false, {
            current,
            accounts,
            runtime,
            error,
        });
        return Boolean(current);
    }
    async postState(loading, partial) {
        if (!this.view) {
            return;
        }
        const state = {
            loading,
            current: partial?.current,
            accounts: partial?.accounts ??
                (0, account_registry_1.getManagedAccounts)(this.context),
            runtime: partial?.runtime,
            error: partial?.error,
        };
        await this.view.webview.postMessage({
            type: "state",
            state,
        });
    }
    cancelRetry() {
        if (!this.retryTimer) {
            return;
        }
        clearTimeout(this.retryTimer);
        this.retryTimer =
            undefined;
    }
    resetRetry() {
        this.cancelRetry();
        this.retryIndex =
            0;
    }
    scheduleRetry() {
        if (this.retryTimer ||
            this.retryIndex >=
                this.retryDelaysMs.length) {
            return;
        }
        const delay = this.retryDelaysMs[this.retryIndex];
        this.retryIndex += 1;
        this.retryTimer =
            setTimeout(() => {
                this.retryTimer =
                    undefined;
                void this.retry();
            }, delay);
    }
    async retry() {
        const success = await this.loadAndPostState();
        if (success) {
            this.cancelRetry();
            return;
        }
        this.scheduleRetry();
    }
    async handleMessage(message) {
        switch (message.type) {
            case "ready":
            case "refresh":
                await this.refresh();
                return;
            case "addAccount":
                await this.executeAndRefresh("boygr.antigravityAccountSwitcher.addAccount");
                return;
            case "saveCurrent":
                await this.executeAndRefresh("boygr.antigravityAccountSwitcher.saveCurrentAccount");
                return;
            case "reauth":
                await this.executeAndRefresh("boygr.antigravityAccountSwitcher.reAuth");
                return;
            case "signout":
                await this.executeAndRefresh("boygr.antigravityAccountSwitcher.signOut");
                return;
            case "switchAccount":
                await this.executeAndRefresh("boygr.antigravityAccountSwitcher.switchAccount", message.account);
                return;
            case "accountMenu":
                await this.showAccountMenu(message.account);
                return;
        }
    }
    async executeAndRefresh(command, ...args) {
        try {
            await vscode.commands.executeCommand(command, ...args);
        }
        finally {
            await this.refresh();
        }
    }
    async showAccountMenu(account) {
        const current = await this.tryGetCurrentAccount();
        const isCurrent = current?.email
            .trim()
            .toLowerCase() ===
            account.email
                .trim()
                .toLowerCase();
        const options = [
            {
                label: "$(edit) Edit Label",
                description: "Change the local account label",
            },
        ];
        if (!isCurrent) {
            options.unshift({
                label: "$(arrow-swap) Switch Account",
                description: account.email,
            });
        }
        options.push({
            label: "$(trash) Remove Saved Account",
            description: "Remove local metadata only",
        });
        const selected = await vscode.window.showQuickPick(options, {
            title: account.label ||
                account.displayName ||
                account.email,
            placeHolder: "Choose an account action",
        });
        if (!selected) {
            return;
        }
        if (selected.label.includes("Switch Account")) {
            await this.executeAndRefresh("boygr.antigravityAccountSwitcher.switchAccount", account);
            return;
        }
        if (selected.label.includes("Edit Label")) {
            await this.executeAndRefresh("boygr.antigravityAccountSwitcher.editAccountLabel", account);
            return;
        }
        if (selected.label.includes("Remove Saved Account")) {
            await this.executeAndRefresh("boygr.antigravityAccountSwitcher.removeSavedAccount", account);
        }
    }
    async tryGetCurrentAccount() {
        try {
            return await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
        }
        catch {
            return undefined;
        }
    }
    getHtml(webview) {
        const nonce = getNonce();
        const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "media", "account-switcher.css"));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "media", "account-switcher.js"));
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
exports.AntigravityAccountWebviewProvider = AntigravityAccountWebviewProvider;
function registerAntigravityAccountWebview(context) {
    const provider = new AntigravityAccountWebviewProvider(context);
    const registration = vscode.window.registerWebviewViewProvider(VIEW_ID, provider, {
        webviewOptions: {
            retainContextWhenHidden: true,
        },
    });
    context.subscriptions.push(provider, registration);
    return provider;
}
function getNonce() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let value = "";
    for (let index = 0; index < 32; index += 1) {
        value +=
            chars.charAt(Math.floor(Math.random() *
                chars.length));
    }
    return value;
}
//# sourceMappingURL=account-webview-provider.js.map
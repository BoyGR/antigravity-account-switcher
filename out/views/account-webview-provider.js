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
const quota_summary_store_1 = require("../antigravity/quota-summary-store");
const hub_auth_client_1 = require("../antigravity/hub-auth-client");
const hub_detector_1 = require("../antigravity/hub-detector");
const quota_monitor_service_1 = require("../antigravity/quota-monitor-service");
const ui_sync_1 = require("../antigravity/ui-sync");
const VIEW_ID = "boygr.antigravityAccountSwitcher.accountsView";
const PREFERENCES_KEY = "boygr.antigravity.ui.v1";
const DEFAULT_PREFERENCES = {
    version: 1,
    theme: "vscode",
    language: "auto",
    showCurrent: true,
    showSaved: true,
    showRuntime: true,
    autoRefreshIntervalMinutes: 5,
    enableLowQuotaReminder: true,
    lowQuotaThresholdPercent: 20,
};
class AntigravityAccountWebviewProvider {
    context;
    view;
    retryTimer;
    retryIndex = 0;
    quotaMonitor;
    snapshot = {
        accounts: [],
        usageSnapshots: {},
    };
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
        const prefs = this.getStoredPreferences();
        this.quotaMonitor = new quota_monitor_service_1.QuotaMonitorService(this.context, {
            intervalMinutes: prefs.autoRefreshIntervalMinutes,
            reminderEnabled: prefs.enableLowQuotaReminder,
            thresholdPercent: prefs.lowQuotaThresholdPercent,
        }, async (usage) => {
            this.snapshot = {
                ...this.snapshot,
                usage,
            };
            if (this.view) {
                await this.postState(false);
            }
        });
        this.context.subscriptions.push(this.quotaMonitor);
    }
    dispose() {
        this.cancelRetry();
        this.quotaMonitor?.dispose();
        this.quotaMonitor = undefined;
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
            try {
                await this.handleMessage(message);
            }
            catch (error) {
                const text = error instanceof Error
                    ? error.message
                    : String(error);
                vscode.window.showErrorMessage(`Antigravity Account Switcher: ${text}`);
                await this.postState(false);
            }
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
    async openSettings() {
        if (!this.view) {
            await vscode.commands.executeCommand(`${VIEW_ID}.focus`);
        }
        if (!this.view) {
            return;
        }
        await this.view.webview.postMessage({
            type: "openSettings",
        });
    }
    async refresh() {
        this.resetRetry();
        this.quotaMonitor?.clearDeduplicationCache();
        await this.postState(true);
        const success = await this.loadAndPostState(true);
        if (!success) {
            this.scheduleRetry();
        }
    }
    async loadAndPostState(keepLoadingOnFailure = false) {
        const accounts = (0, account_registry_1.getManagedAccounts)(this.context);
        let current;
        let runtime;
        let usage;
        let usageError;
        let usageSnapshots = (0, quota_summary_store_1.getManagedAccountUsageSnapshots)(this.context);
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
        if (current) {
            try {
                /*
                 * Official server-defined quota summary.
                 *
                 * No account switching is performed here.
                 */
                usage =
                    await (0, hub_auth_client_1.getAntigravityQuotaSummary)(true);
                const normalizedCurrentEmail = current.email
                    .trim()
                    .toLowerCase();
                const currentIsManaged = accounts.some(account => account.email
                    .trim()
                    .toLowerCase() ===
                    normalizedCurrentEmail);
                /*
                 * Persist only last-known quota information for
                 * accounts explicitly saved by the user.
                 */
                if (currentIsManaged) {
                    await (0, quota_summary_store_1.saveManagedAccountUsageSnapshot)(this.context, current.email, usage);
                    usageSnapshots =
                        (0, quota_summary_store_1.getManagedAccountUsageSnapshots)(this.context);
                }
            }
            catch (usageReadError) {
                usageError =
                    usageReadError instanceof Error
                        ? usageReadError.message
                        : String(usageReadError);
            }
        }
        this.snapshot = {
            current,
            accounts,
            runtime,
            usage,
            usageSnapshots,
            usageError,
            error,
        };
        const success = Boolean(current);
        await this.postState(keepLoadingOnFailure &&
            !success);
        return success;
    }
    async postState(loading) {
        if (!this.view) {
            return;
        }
        const state = {
            loading,
            ...this.snapshot,
            accounts: this.snapshot.accounts.length > 0
                ? this.snapshot.accounts
                : (0, account_registry_1.getManagedAccounts)(this.context),
            preferences: this.getResolvedPreferences(),
            meta: {
                version: String(this.context.extension.packageJSON.version ??
                    "0.4.0"),
                developer: "BoyGR",
                website: "https://boygr.com",
                iconUri: this.view
                    ? this.view.webview
                        .asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "media", "antigravity.svg"))
                        .toString()
                    : "",
            },
        };
        await this.view.webview.postMessage({
            type: "state",
            state,
        });
    }
    async refreshLocalAccounts() {
        this.snapshot = {
            ...this.snapshot,
            accounts: (0, account_registry_1.getManagedAccounts)(this.context),
            usageSnapshots: (0, quota_summary_store_1.getManagedAccountUsageSnapshots)(this.context),
        };
        await this.postState(false);
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
        const hasMoreRetries = this.retryIndex <
            this.retryDelaysMs.length;
        const success = await this.loadAndPostState(hasMoreRetries);
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
            case "removeAccount":
                await (0, account_registry_1.removeManagedAccount)(this.context, message.email);
                await (0, quota_summary_store_1.removeManagedAccountUsageSnapshot)(this.context, message.email);
                /*
                 * Remove the superseded M7.3A.1 per-model
                 * snapshot too.
                 */
                await (0, account_registry_1.removeManagedAccountQuotaSnapshot)(this.context, message.email);
                await this.refreshLocalAccounts();
                return;
            case "openExternal": {
                const uri = vscode.Uri.parse(message.url);
                if (uri.scheme !== "https" ||
                    uri.authority.toLowerCase() !==
                        "boygr.com") {
                    throw new Error("External URL is not allowed.");
                }
                await vscode.env.openExternal(uri);
                return;
            }
            case "updateLabel":
                await (0, account_registry_1.updateManagedAccountLabel)(this.context, message.email, message.label);
                await this.refreshLocalAccounts();
                return;
            case "saveSettings":
                await this.savePreferences(message.preferences);
                await this.postState(false);
                return;
        }
    }
    async executeAndRefresh(command, ...args) {
        try {
            await vscode.commands.executeCommand(command, ...args);
        }
        finally {
            try {
                await (0, ui_sync_1.syncAntigravityUi)();
            }
            catch {
                // Ignore sync failures
            }
            try {
                await this.refresh();
            }
            catch {
                // Ignore refresh failures
            }
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
    getStoredPreferences() {
        const stored = this.context.globalState.get(PREFERENCES_KEY);
        return this.normalizePreferences(stored);
    }
    normalizePreferences(value) {
        if (!value ||
            typeof value !== "object") {
            return {
                ...DEFAULT_PREFERENCES,
            };
        }
        const input = value;
        const allowedThemes = [
            "vscode",
            "light",
            "dark",
            "system",
        ];
        const allowedLanguages = [
            "auto",
            "en",
            "id",
        ];
        const theme = allowedThemes.includes(input.theme)
            ? input.theme
            : DEFAULT_PREFERENCES.theme;
        const language = allowedLanguages.includes(input.language)
            ? input.language
            : DEFAULT_PREFERENCES.language;
        const autoRefreshIntervalMinutes = typeof input.autoRefreshIntervalMinutes === "number" &&
            input.autoRefreshIntervalMinutes >= 0
            ? input.autoRefreshIntervalMinutes
            : DEFAULT_PREFERENCES.autoRefreshIntervalMinutes;
        const enableLowQuotaReminder = typeof input.enableLowQuotaReminder === "boolean"
            ? input.enableLowQuotaReminder
            : DEFAULT_PREFERENCES.enableLowQuotaReminder;
        const lowQuotaThresholdPercent = typeof input.lowQuotaThresholdPercent === "number" &&
            input.lowQuotaThresholdPercent > 0
            ? input.lowQuotaThresholdPercent
            : DEFAULT_PREFERENCES.lowQuotaThresholdPercent;
        return {
            version: 1,
            theme,
            language,
            showCurrent: typeof input.showCurrent === "boolean"
                ? input.showCurrent
                : true,
            showSaved: typeof input.showSaved === "boolean"
                ? input.showSaved
                : true,
            showRuntime: typeof input.showRuntime === "boolean"
                ? input.showRuntime
                : true,
            autoRefreshIntervalMinutes,
            enableLowQuotaReminder,
            lowQuotaThresholdPercent,
        };
    }
    getResolvedPreferences() {
        const preferences = this.getStoredPreferences();
        let effectiveLanguage;
        if (preferences.language === "id") {
            effectiveLanguage =
                "id";
        }
        else if (preferences.language === "en") {
            effectiveLanguage =
                "en";
        }
        else {
            effectiveLanguage =
                vscode.env.language
                    .toLowerCase()
                    .startsWith("id")
                    ? "id"
                    : "en";
        }
        return {
            ...preferences,
            effectiveLanguage,
        };
    }
    async savePreferences(input) {
        const preferences = this.normalizePreferences({
            version: 1,
            ...input,
        });
        await this.context.globalState.update(PREFERENCES_KEY, preferences);
        this.quotaMonitor?.updateConfig({
            intervalMinutes: preferences.autoRefreshIntervalMinutes,
            reminderEnabled: preferences.enableLowQuotaReminder,
            thresholdPercent: preferences.lowQuotaThresholdPercent,
        });
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
            img-src ${webview.cspSource} https://googleusercontent.com https://*.googleusercontent.com;
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
    const settingsCommand = vscode.commands.registerCommand("boygr.antigravityAccountSwitcher.openSettings", async () => {
        await provider.openSettings();
    });
    context.subscriptions.push(provider, registration, settingsCommand);
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
import * as fs from "fs";
import * as vscode from "vscode";

import {
    getManagedAccounts,
    ManagedAntigravityAccount,
    removeManagedAccount,
    removeManagedAccountQuotaSnapshot,
    saveCurrentAccountMetadata,
    updateManagedAccountColorTag,
    updateManagedAccountGroup,
    updateManagedAccountLabel,
} from "../antigravity/account-registry";

import {
    getManagedAccountUsageSnapshots,
    ManagedAccountUsageSnapshot,
    removeManagedAccountUsageSnapshot,
    saveManagedAccountUsageSnapshot,
} from "../antigravity/quota-summary-store";

import {
    AntigravityCurrentAccount,
    AntigravityQuotaSummarySnapshot,
    getAntigravityCurrentAccount,
    getAntigravityQuotaSummary,
} from "../antigravity/hub-auth-client";
import {
    AntigravityHubStatus,
    inspectAntigravityHub,
} from "../antigravity/hub-detector";
import { QuotaMonitorService } from "../antigravity/quota-monitor-service";
import { syncAntigravityUi } from "../antigravity/ui-sync";
import { AntigravityStatusBarManager } from "../status-bar/status-bar-manager";
import {
    DailyQuotaRecord,
    getAllAccountsQuotaHistory,
    recordUsageSnapshotIfAvailable,
} from "../antigravity/quota-history-store";
import { TokenVaultService } from "../antigravity/token-vault-service";

type ThemePreference =
    | "vscode"
    | "light"
    | "dark"
    | "system";

type LanguagePreference =
    | "auto"
    | "en"
    | "id";

type ProxyMode =
    | "system"
    | "manual"
    | "direct";

interface AccountSwitcherPreferences {
    version: 1;

    theme: ThemePreference;

    language: LanguagePreference;

    hideCurrent: boolean;

    hideSaved: boolean;

    hideRuntime: boolean;

    showCurrent?: boolean;

    showSaved?: boolean;

    showRuntime?: boolean;

    showQuotaAnalytics?: boolean;

    autoRefreshIntervalMinutes: number;

    enableLowQuotaReminder: boolean;

    lowQuotaThresholdPercent: number;

    smartQuotaFallback: boolean;

    autoRoundRobin?: boolean;

    enableQuotaAudio?: boolean;

    enableInstantSwitch?: boolean;

    proxyMode?: ProxyMode;

    proxyUrl?: string;

    proxyStrictSSL?: boolean;
}

interface ResolvedAccountSwitcherPreferences
    extends AccountSwitcherPreferences {
    effectiveLanguage: "en" | "id";
}

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
          type: "removeAccount";
          email: string;
      }
    | {
          type: "openExternal";
          url: string;
      }
    | {
          type: "updateLabel";
          email: string;
          label: string;
          colorTag?: string;
          group?: string;
          plan?: string;
      }
    | {
          type: "updateColorTag";
          email: string;
          colorTag?: string;
      }
    | {
          type: "updateGroup";
          email: string;
          group?: string;
      }
    | { type: "exportAccounts" }
    | { type: "importAccounts" }
    | { type: "reconnectHub" }
    | { type: "restartBackend" }
    | { type: "exportQuotaAnalytics" }
    | { type: "clearTokenVault" }
    | {
          type: "saveSettings";
          preferences: {
              theme: ThemePreference;
              language: LanguagePreference;
              showCurrent: boolean;
              showSaved: boolean;
              showRuntime: boolean;
              autoRefreshIntervalMinutes?: number;
              enableLowQuotaReminder?: boolean;
              lowQuotaThresholdPercent?: number;
              smartQuotaFallback?: boolean;
              autoRoundRobin?: boolean;
              enableQuotaAudio?: boolean;
              enableInstantSwitch?: boolean;
              proxyMode?: ProxyMode;
              proxyUrl?: string;
              proxyStrictSSL?: boolean;
          };
      };

interface AccountSwitcherSnapshot {
    current?: AntigravityCurrentAccount;

    accounts: ManagedAntigravityAccount[];

    runtime?: AntigravityHubStatus;

    usage?: AntigravityQuotaSummarySnapshot;

    usageSnapshots:
        Record<
            string,
            ManagedAccountUsageSnapshot
        >;

    usageError?: string;

    error?: string;

    quotaHistory?: Record<string, DailyQuotaRecord[]>;

    vaultedEmails?: string[];

    isVaultSupported?: boolean;
}

export type AntigravityConnectionState =
    | "connecting"
    | "connected"
    | "disconnected"
    | "not_installed"
    | "offline";

interface AccountSwitcherViewState
    extends AccountSwitcherSnapshot {
    loading: boolean;

    connectionState: AntigravityConnectionState;

    preferences: ResolvedAccountSwitcherPreferences;

    meta: {
        version: string;
        developer: string;
        website: string;
        iconUri: string;
    };
}

const VIEW_ID =
    "boygr.antigravityAccountSwitcher.accountsView";

const PREFERENCES_KEY =
    "boygr.antigravity.ui.v1";

const DEFAULT_PREFERENCES: AccountSwitcherPreferences = {
    version: 1,
    theme: "vscode",
    language: "auto",
    hideCurrent: false,
    hideSaved: false,
    hideRuntime: false,
    showCurrent: true,
    showSaved: true,
    showRuntime: true,
    showQuotaAnalytics: false,
    autoRefreshIntervalMinutes: 5,
    enableLowQuotaReminder: true,
    lowQuotaThresholdPercent: 20,
    smartQuotaFallback: true,
    autoRoundRobin: false,
    enableQuotaAudio: true,
    enableInstantSwitch: true,
    proxyMode: "system",
    proxyUrl: "",
    proxyStrictSSL: true,
};

export class AntigravityAccountWebviewProvider
    implements vscode.WebviewViewProvider, vscode.Disposable
{
    private view?: vscode.WebviewView;

    private retryTimer?: ReturnType<typeof setTimeout>;

    private retryIndex = 0;

    private isProbing = false;

    private quotaMonitor?: QuotaMonitorService;

    private snapshot: AccountSwitcherSnapshot = {
        accounts: [],
        usageSnapshots: {},
    };

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
        private readonly statusBarManager?: AntigravityStatusBarManager,
        private readonly tokenVault?: TokenVaultService,
    ) {
        this.snapshot = {
            accounts: getManagedAccounts(this.context),
            usageSnapshots: getManagedAccountUsageSnapshots(this.context),
            quotaHistory: getAllAccountsQuotaHistory(this.context, 7),
        };

        const prefs = this.getStoredPreferences();
        this.quotaMonitor = new QuotaMonitorService(
            this.context,
            {
                intervalMinutes: prefs.autoRefreshIntervalMinutes,
                reminderEnabled: prefs.enableLowQuotaReminder,
                thresholdPercent: prefs.lowQuotaThresholdPercent,
                smartQuotaFallback: prefs.smartQuotaFallback,
                autoRoundRobin: prefs.autoRoundRobin,
                enableQuotaAudio: prefs.enableQuotaAudio,
            },
            async usage => {
                this.snapshot = {
                    ...this.snapshot,
                    usage,
                    usageSnapshots: getManagedAccountUsageSnapshots(this.context),
                    quotaHistory: getAllAccountsQuotaHistory(this.context, 7),
                };
                this.statusBarManager?.update(
                    this.snapshot.current,
                    usage,
                    Boolean(this.snapshot.runtime?.process),
                );
                if (this.view) {
                    await this.postState(false);
                }
            },
        );
        this.quotaMonitor.onAudioChime = async (chime: "restored" | "warning") => {
            if (this.view) {
                await this.view.webview.postMessage({
                    type: "playChime",
                    chime,
                });
            }
        };
        this.context.subscriptions.push(this.quotaMonitor);
    }

    dispose(): void {
        this.cancelRetry();
        this.quotaMonitor?.dispose();
        this.quotaMonitor = undefined;
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
    ): void {
        this.view =
            webviewView;

        const { webview } =
            webviewView;

        const distMediaUri =
            vscode.Uri.joinPath(
                this.context.extensionUri,
                "dist",
                "media",
            );

        const sourceMediaUri =
            vscode.Uri.joinPath(
                this.context.extensionUri,
                "media",
            );

        webview.options = {
            enableScripts: true,

            localResourceRoots: [
                distMediaUri,
                sourceMediaUri,
            ],
        };

        webview.html =
            this.getHtml(webview);

        const messageSubscription =
            webview.onDidReceiveMessage(
                async (message: WebviewMessage) => {
                    try {
                        await this.handleMessage(message);
                    } catch (error) {
                        const text =
                            error instanceof Error
                                ? error.message
                                : String(error);

                        vscode.window.showErrorMessage(
                            `Antigravity Account Switcher: ${text}`,
                        );

                        await this.postState(false);
                    }
                },
            );

        const visibilitySubscription =
            webviewView.onDidChangeVisibility(
                () => {
                    if (webviewView.visible) {
                        void this.refresh(true);
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

    async openSettings(): Promise<void> {
        if (!this.view) {
            await vscode.commands.executeCommand(
                `${VIEW_ID}.focus`,
            );
        }

        if (!this.view) {
            return;
        }

        await this.view.webview.postMessage({
            type: "openSettings",
        });
    }

    async openQuotaMatrix(): Promise<void> {
        if (!this.view) {
            await vscode.commands.executeCommand(
                `${VIEW_ID}.focus`,
            );
        }

        if (!this.view) {
            return;
        }

        await this.view.webview.postMessage({
            type: "openQuotaMatrix",
        });
    }

    async refresh(background = false): Promise<void> {
        this.resetRetry();
        this.quotaMonitor?.clearDeduplicationCache();
        this.isProbing = true;

        if (!background) {
            await this.postState(true);
        }

        const success =
            await this.loadAndPostState(
                !background,
            );

        if (!success && !background) {
            this.scheduleRetry();
        } else {
            this.isProbing = false;
            await this.postState(false);
        }
    }

    private async loadAndPostState(
        keepLoadingOnFailure = false,
    ): Promise<boolean> {
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

        let usage:
            | AntigravityQuotaSummarySnapshot
            | undefined;

        let usageError:
            | string
            | undefined;

        let usageSnapshots =
            getManagedAccountUsageSnapshots(
                this.context,
            );

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

        if (current) {
            try {
                /*
                 * Official server-defined quota summary.
                 *
                 * No account switching is performed here.
                 */
                usage =
                    await getAntigravityQuotaSummary(
                        true,
                    );

                const normalizedCurrentEmail =
                    current.email
                        .trim()
                        .toLowerCase();

                const currentIsManaged =
                    accounts.some(
                        account =>
                            account.email
                                .trim()
                                .toLowerCase() ===
                            normalizedCurrentEmail,
                    );

                /*
                 * Persist only last-known quota information for
                 * accounts explicitly saved by the user.
                 */
                if (currentIsManaged) {
                    await saveManagedAccountUsageSnapshot(
                        this.context,
                        current.email,
                        usage,
                    );

                    await saveCurrentAccountMetadata(
                        this.context,
                        current,
                    );

                    usageSnapshots =
                        getManagedAccountUsageSnapshots(
                            this.context,
                        );
                }

                await recordUsageSnapshotIfAvailable(
                    this.context,
                    current.email,
                    usage,
                );
            } catch (usageReadError) {
                usageError =
                    usageReadError instanceof Error
                        ? usageReadError.message
                        : String(usageReadError);
            }
        }

        let vaultedEmails: string[] = [];
        if (this.tokenVault) {
            if (current?.email && this.tokenVault.isSupported()) {
                await this.tokenVault.saveActiveCredential(current.email).catch(() => false);
            }
            vaultedEmails = await this.tokenVault.getVaultedEmails().catch(() => []);
        }

        if (current && !current.profilePictureUrl) {
            const normalizedCurrent = current.email.trim().toLowerCase();
            const savedWithPhoto = accounts.find(
                account =>
                    account.email.trim().toLowerCase() === normalizedCurrent &&
                    account.profilePictureUrl
            );
            if (savedWithPhoto?.profilePictureUrl) {
                current = {
                    ...current,
                    profilePictureUrl: savedWithPhoto.profilePictureUrl,
                };
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
            quotaHistory: getAllAccountsQuotaHistory(this.context, 7),
            vaultedEmails,
            isVaultSupported: this.tokenVault?.isSupported() === true,
        };

        this.statusBarManager?.update(
            current,
            usage,
            Boolean(runtime?.process),
        );

        const reachable = Boolean(runtime?.health?.reachable);
        const success =
            Boolean(current || reachable);

        this.isProbing = false;

        await this.postState(
            false,
        );

        return success;
    }
    private resolveConnectionState(loading: boolean): AntigravityConnectionState {
        if (this.snapshot.current) {
            return "connected";
        }

        const extension = this.snapshot.runtime?.extension;
        if (extension && !extension.installed) {
            return "not_installed";
        }

        const reachable = this.snapshot.runtime?.health?.reachable;
        const isRetrying =
            Boolean(this.retryTimer) ||
            (this.retryIndex > 0 && this.retryIndex < this.retryDelaysMs.length);

        if (loading || isRetrying) {
            return "connecting";
        }

        if (reachable) {
            return "disconnected";
        }

        return "offline";
    }

    private async postState(
        loading: boolean,
    ): Promise<void> {
        if (!this.view) {
            return;
        }

        const state: AccountSwitcherViewState = {
            loading,
            connectionState: this.resolveConnectionState(loading),
            ...this.snapshot,
            accounts:
                this.snapshot.accounts.length > 0
                    ? this.snapshot.accounts
                    : getManagedAccounts(
                          this.context,
                      ),
            preferences:
                this.getResolvedPreferences(),

            meta: {
                version:
                    String(
                        this.context.extension.packageJSON.version ??
                        "0.4.1",
                    ),

                developer:
                    "Boy Gilang Ramadhan (BoyGR)",

                website:
                    "https://boygr.com",

                iconUri:
                    this.view
                        ? this.view.webview
                              .asWebviewUri(
                                  vscode.Uri.joinPath(
                                      this.context.extensionUri,
                                      "media",
                                      "icon.png",
                                  ),
                              )
                              .toString()
                        : "",
            },
        };

        await this.view.webview.postMessage({
            type: "state",
            state,
        });
    }

    private async refreshLocalAccounts(): Promise<void> {
        this.snapshot = {
            ...this.snapshot,

            accounts:
                getManagedAccounts(
                    this.context,
                ),

            usageSnapshots:
                getManagedAccountUsageSnapshots(
                    this.context,
                ),

            quotaHistory: getAllAccountsQuotaHistory(this.context, 7),
        };

        await this.postState(
            false,
        );
    }
    private cancelRetry(): void {
        this.isProbing = false;

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
        const hasMoreRetries =
            this.retryIndex <
            this.retryDelaysMs.length;

        const success =
            await this.loadAndPostState(
                hasMoreRetries,
            );

        if (success) {
            this.cancelRetry();
            await this.postState(false);
            return;
        }

        if (hasMoreRetries) {
            this.scheduleRetry();
        } else {
            this.isProbing = false;
            await this.postState(false);
        }
    }

    private async handleMessage(
        message: WebviewMessage,
    ): Promise<void> {
        switch (message.type) {
            case "ready":
                if (this.snapshot.current !== undefined) {
                    await this.postState(false);
                    void this.refresh(true);
                } else {
                    void this.refresh(false);
                }
                return;

            case "refresh":
                await this.refresh(false);
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

            case "removeAccount": {
                const currentEmail = this.snapshot.current?.email;
                if (
                    currentEmail &&
                    message.email &&
                    currentEmail.trim().toLowerCase() === message.email.trim().toLowerCase()
                ) {
                    vscode.window.showWarningMessage(
                        "Cannot remove the currently active account. Please sign out first.",
                    );
                    return;
                }

                await removeManagedAccount(
                    this.context,
                    message.email,
                );

                await removeManagedAccountUsageSnapshot(
                    this.context,
                    message.email,
                );

                /*
                 * Remove the superseded M7.3A.1 per-model
                 * snapshot too.
                 */
                await removeManagedAccountQuotaSnapshot(
                    this.context,
                    message.email,
                );

                if (this.tokenVault) {
                    await this.tokenVault.removeCredential(message.email).catch(() => undefined);
                }

                await this.refreshLocalAccounts();
                return;
            }

            case "openExternal": {
                const uri =
                    vscode.Uri.parse(
                        message.url,
                    );

                if (
                    uri.scheme !== "https" ||
                    uri.authority.toLowerCase() !==
                        "boygr.com"
                ) {
                    throw new Error(
                        "External URL is not allowed.",
                    );
                }

                await vscode.env.openExternal(
                    uri,
                );

                return;
            }

            case "updateLabel":
                await updateManagedAccountLabel(
                    this.context,
                    message.email,
                    message.label,
                    message.colorTag,
                    message.group,
                );

                await this.refreshLocalAccounts();
                return;

            case "updateColorTag":
                await updateManagedAccountColorTag(
                    this.context,
                    message.email,
                    message.colorTag,
                );

                await this.refreshLocalAccounts();
                return;

            case "updateGroup":
                await updateManagedAccountGroup(
                    this.context,
                    message.email,
                    message.group,
                );

                await this.refreshLocalAccounts();
                return;

            case "clearTokenVault":
                await vscode.commands.executeCommand(
                    "boygr.antigravityAccountSwitcher.clearTokenVault",
                );
                await this.refresh(false);
                return;

            case "saveSettings":
                await this.savePreferences(
                    message.preferences,
                );

                await this.postState(false);
                return;

            case "exportAccounts":
                await vscode.commands.executeCommand(
                    "boygr.antigravityAccountSwitcher.exportAccounts",
                );
                return;

            case "exportQuotaAnalytics":
                await vscode.commands.executeCommand(
                    "boygr.antigravityAccountSwitcher.exportQuotaAnalytics",
                );
                return;

            case "importAccounts":
                await vscode.commands.executeCommand(
                    "boygr.antigravityAccountSwitcher.importAccounts",
                );
                await this.refreshLocalAccounts();
                return;

            case "reconnectHub":
                await vscode.commands.executeCommand(
                    "boygr.antigravityAccountSwitcher.reconnectHub",
                );
                await this.refresh();
                return;

            case "restartBackend":
                await vscode.commands.executeCommand(
                    "boygr.antigravityAccountSwitcher.restartBackend",
                );
                await this.refresh();
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
            try {
                await syncAntigravityUi();
            } catch {
                // Ignore sync failures
            }
            try {
                await this.refresh();
            } catch {
                // Ignore refresh failures
            }
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

    private getStoredPreferences():
        AccountSwitcherPreferences
    {
        const stored =
            this.context.globalState.get<unknown>(
                PREFERENCES_KEY,
            );

        return this.normalizePreferences(
            stored,
        );
    }

    private normalizePreferences(
        value: unknown,
    ): AccountSwitcherPreferences {
        if (
            !value ||
            typeof value !== "object"
        ) {
            return {
                ...DEFAULT_PREFERENCES,
            };
        }

        const input =
            value as Partial<AccountSwitcherPreferences>;

        const allowedThemes:
            ThemePreference[] = [
                "vscode",
                "light",
                "dark",
                "system",
            ];

        const allowedLanguages:
            LanguagePreference[] = [
                "auto",
                "en",
                "id",
            ];

        const theme =
            allowedThemes.includes(
                input.theme as ThemePreference,
            )
                ? input.theme as ThemePreference
                : DEFAULT_PREFERENCES.theme;

        const language =
            allowedLanguages.includes(
                input.language as LanguagePreference,
            )
                ? input.language as LanguagePreference
                : DEFAULT_PREFERENCES.language;

        const autoRefreshIntervalMinutes =
            typeof input.autoRefreshIntervalMinutes === "number" &&
            input.autoRefreshIntervalMinutes >= 0
                ? input.autoRefreshIntervalMinutes
                : DEFAULT_PREFERENCES.autoRefreshIntervalMinutes;

        const enableLowQuotaReminder =
            typeof input.enableLowQuotaReminder === "boolean"
                ? input.enableLowQuotaReminder
                : DEFAULT_PREFERENCES.enableLowQuotaReminder;

        const lowQuotaThresholdPercent =
            typeof input.lowQuotaThresholdPercent === "number" &&
            input.lowQuotaThresholdPercent > 0
                ? input.lowQuotaThresholdPercent
                : DEFAULT_PREFERENCES.lowQuotaThresholdPercent;

        const smartQuotaFallback =
            typeof input.smartQuotaFallback === "boolean"
                ? input.smartQuotaFallback
                : DEFAULT_PREFERENCES.smartQuotaFallback;

        const autoRoundRobin =
            typeof input.autoRoundRobin === "boolean"
                ? input.autoRoundRobin
                : DEFAULT_PREFERENCES.autoRoundRobin;

        const enableQuotaAudio =
            typeof input.enableQuotaAudio === "boolean"
                ? input.enableQuotaAudio
                : DEFAULT_PREFERENCES.enableQuotaAudio;

        const enableInstantSwitch =
            typeof input.enableInstantSwitch === "boolean"
                ? input.enableInstantSwitch
                : DEFAULT_PREFERENCES.enableInstantSwitch;

        const hideCurrent =
            typeof input.hideCurrent === "boolean"
                ? input.hideCurrent
                : (typeof input.showCurrent === "boolean" ? !input.showCurrent : false);

        const hideSaved =
            typeof input.hideSaved === "boolean"
                ? input.hideSaved
                : (typeof input.showSaved === "boolean" ? !input.showSaved : false);

        const hideRuntime =
            typeof input.hideRuntime === "boolean"
                ? input.hideRuntime
                : (typeof input.showRuntime === "boolean" ? !input.showRuntime : false);

        const showQuotaAnalytics =
            typeof input.showQuotaAnalytics === "boolean"
                ? input.showQuotaAnalytics
                : false;

        const proxyMode =
            ["system", "manual", "direct"].includes(input.proxyMode as string)
                ? (input.proxyMode as ProxyMode)
                : (DEFAULT_PREFERENCES.proxyMode ?? "system");

        const proxyUrl =
            typeof input.proxyUrl === "string"
                ? input.proxyUrl.trim()
                : (DEFAULT_PREFERENCES.proxyUrl ?? "");

        const proxyStrictSSL =
            typeof input.proxyStrictSSL === "boolean"
                ? input.proxyStrictSSL
                : (DEFAULT_PREFERENCES.proxyStrictSSL ?? true);

        return {
            version: 1,
            theme,
            language,
            hideCurrent,
            hideSaved,
            hideRuntime,
            showCurrent: !hideCurrent,
            showSaved: !hideSaved,
            showRuntime: !hideRuntime,
            showQuotaAnalytics,
            autoRefreshIntervalMinutes,
            enableLowQuotaReminder,
            lowQuotaThresholdPercent,
            smartQuotaFallback,
            autoRoundRobin,
            enableQuotaAudio,
            enableInstantSwitch,
            proxyMode,
            proxyUrl,
            proxyStrictSSL,
        };
    }

    private getResolvedPreferences():
        ResolvedAccountSwitcherPreferences
    {
        const preferences =
            this.getStoredPreferences();

        let effectiveLanguage:
            "en" | "id";

        if (preferences.language === "id") {
            effectiveLanguage =
                "id";
        } else if (preferences.language === "en") {
            effectiveLanguage =
                "en";
        } else {
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

    private async savePreferences(
        input: {
            theme: ThemePreference;
            language: LanguagePreference;
            hideCurrent?: boolean;
            hideSaved?: boolean;
            hideRuntime?: boolean;
            showCurrent?: boolean;
            showSaved?: boolean;
            showRuntime?: boolean;
            showQuotaAnalytics?: boolean;
            autoRefreshIntervalMinutes?: number;
            enableLowQuotaReminder?: boolean;
            lowQuotaThresholdPercent?: number;
            smartQuotaFallback?: boolean;
            autoRoundRobin?: boolean;
            enableQuotaAudio?: boolean;
            enableInstantSwitch?: boolean;
            proxyMode?: ProxyMode;
            proxyUrl?: string;
            proxyStrictSSL?: boolean;
        },
    ): Promise<void> {
        const preferences =
            this.normalizePreferences({
                version: 1,
                ...input,
            });

        await this.context.globalState.update(
            PREFERENCES_KEY,
            preferences,
        );

        this.quotaMonitor?.updateConfig({
            intervalMinutes: preferences.autoRefreshIntervalMinutes,
            reminderEnabled: preferences.enableLowQuotaReminder,
            thresholdPercent: preferences.lowQuotaThresholdPercent,
            smartQuotaFallback: preferences.smartQuotaFallback,
            autoRoundRobin: preferences.autoRoundRobin,
            enableQuotaAudio: preferences.enableQuotaAudio,
        });

        const config = vscode.workspace.getConfiguration("boygr.antigravityAccountSwitcher");
        await config.update("enableInstantSwitch", preferences.enableInstantSwitch, vscode.ConfigurationTarget.Global).then(undefined, () => undefined);
        if (typeof preferences.showQuotaAnalytics === "boolean") {
            await config.update("showQuotaAnalytics", preferences.showQuotaAnalytics, vscode.ConfigurationTarget.Global).then(undefined, () => undefined);
        }
        if (preferences.proxyMode) {
            await config.update("proxyMode", preferences.proxyMode, vscode.ConfigurationTarget.Global).then(undefined, () => undefined);
        }
        if (typeof preferences.proxyUrl === "string") {
            await config.update("proxyUrl", preferences.proxyUrl, vscode.ConfigurationTarget.Global).then(undefined, () => undefined);
        }
        if (typeof preferences.proxyStrictSSL === "boolean") {
            await config.update("proxyStrictSSL", preferences.proxyStrictSSL, vscode.ConfigurationTarget.Global).then(undefined, () => undefined);
        }
    }

    private getHtml(
        webview: vscode.Webview,
    ): string {
        const nonce =
            getNonce();

        const distJsPath =
            vscode.Uri.joinPath(
                this.context.extensionUri,
                "dist",
                "media",
                "account-switcher.js",
            ).fsPath;

        const mediaBaseUri =
            fs.existsSync(distJsPath)
                ? vscode.Uri.joinPath(
                    this.context.extensionUri,
                    "dist",
                    "media",
                )
                : vscode.Uri.joinPath(
                    this.context.extensionUri,
                    "media",
                );

        const cssUri =
            webview.asWebviewUri(
                vscode.Uri.joinPath(
                    mediaBaseUri,
                    "account-switcher.css",
                ),
            );

        const scriptUri =
            webview.asWebviewUri(
                vscode.Uri.joinPath(
                    mediaBaseUri,
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
            img-src ${webview.cspSource} https://*.googleusercontent.com https://googleusercontent.com https://*.ggpht.com https://*.gstatic.com https://*.google.com data:;
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
    statusBarManager?: AntigravityStatusBarManager,
    tokenVault?: TokenVaultService,
): AntigravityAccountWebviewProvider {
    const provider =
        new AntigravityAccountWebviewProvider(
            context,
            statusBarManager,
            tokenVault,
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

    const settingsCommand =
        vscode.commands.registerCommand(
            "boygr.antigravityAccountSwitcher.openSettings",
            async () => {
                await provider.openSettings();
            },
        );

    context.subscriptions.push(
        provider,
        registration,
        settingsCommand,
    );

    void provider.refresh();

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
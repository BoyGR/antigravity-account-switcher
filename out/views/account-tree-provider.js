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
exports.AntigravityAccountsTreeProvider = void 0;
const vscode = __importStar(require("vscode"));
const hub_detector_1 = require("../antigravity/hub-detector");
const account_registry_1 = require("../antigravity/account-registry");
const hub_auth_client_1 = require("../antigravity/hub-auth-client");
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
class AntigravityAccountsTreeProvider {
    context;
    changeEmitter = new vscode.EventEmitter();
    onDidChangeTreeData = this.changeEmitter.event;
    currentAccount;
    currentAccountError;
    runtimeStatus;
    runtimeStatusError;
    startupRetryTimer;
    startupRetryIndex = 0;
    startupRetryDelaysMs = [
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
        this.cancelStartupRetry();
        this.changeEmitter.dispose();
    }
    cancelStartupRetry() {
        if (this.startupRetryTimer) {
            clearTimeout(this.startupRetryTimer);
            this.startupRetryTimer = undefined;
        }
    }
    resetStartupRetry() {
        this.cancelStartupRetry();
        this.startupRetryIndex = 0;
    }
    scheduleStartupRetry() {
        if (this.currentAccount ||
            this.startupRetryTimer ||
            this.startupRetryIndex >= this.startupRetryDelaysMs.length) {
            return;
        }
        const delayMs = this.startupRetryDelaysMs[this.startupRetryIndex];
        this.startupRetryIndex += 1;
        this.startupRetryTimer = setTimeout(() => {
            this.startupRetryTimer = undefined;
            void this.retryStartupState();
        }, delayMs);
    }
    async retryStartupState() {
        if (this.currentAccount) {
            this.cancelStartupRetry();
            return;
        }
        this.currentAccountError = undefined;
        this.runtimeStatusError = undefined;
        try {
            this.runtimeStatus =
                await (0, hub_detector_1.inspectAntigravityHub)();
        }
        catch (error) {
            this.runtimeStatusError =
                error instanceof Error
                    ? error.message
                    : String(error);
        }
        try {
            this.currentAccount =
                await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
            this.currentAccountError = undefined;
        }
        catch (error) {
            this.currentAccountError =
                error instanceof Error
                    ? error.message
                    : String(error);
        }
        this.changeEmitter.fire();
        if (this.currentAccount) {
            this.cancelStartupRetry();
            return;
        }
        this.scheduleStartupRetry();
    }
    async refresh() {
        this.resetStartupRetry();
        this.currentAccount = undefined;
        this.currentAccountError = undefined;
        this.runtimeStatus = undefined;
        this.runtimeStatusError = undefined;
        try {
            this.runtimeStatus =
                await (0, hub_detector_1.inspectAntigravityHub)();
        }
        catch (error) {
            this.runtimeStatusError =
                error instanceof Error
                    ? error.message
                    : String(error);
        }
        try {
            this.currentAccount =
                await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
        }
        catch (error) {
            this.currentAccountError =
                error instanceof Error
                    ? error.message
                    : String(error);
        }
        this.changeEmitter.fire();
        if (!this.currentAccount) {
            this.scheduleStartupRetry();
        }
    }
    getTreeItem(element) {
        switch (element.kind) {
            case "section":
                return this.getSectionItem(element);
            case "currentAccount":
                return this.getCurrentAccountItem(element);
            case "savedAccount":
                return this.getSavedAccountItem(element);
            case "action":
                return this.getActionItem(element);
            case "runtimeStatus":
                return this.getRuntimeStatusItem(element);
            case "message":
                return this.getMessageItem(element);
        }
    }
    async getChildren(element) {
        if (!element) {
            if (!this.currentAccount &&
                !this.currentAccountError) {
                try {
                    this.currentAccount =
                        await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
                }
                catch (error) {
                    this.currentAccountError =
                        error instanceof Error
                            ? error.message
                            : String(error);
                }
            }
            if (!this.runtimeStatus &&
                !this.runtimeStatusError) {
                try {
                    this.runtimeStatus =
                        await (0, hub_detector_1.inspectAntigravityHub)();
                }
                catch (error) {
                    this.runtimeStatusError =
                        error instanceof Error
                            ? error.message
                            : String(error);
                }
            }
            if (!this.currentAccount) {
                this.scheduleStartupRetry();
            }
            return [
                { kind: "section", section: "current" },
                { kind: "section", section: "saved" },
                { kind: "section", section: "actions" },
                { kind: "section", section: "runtime" },
            ];
        }
        if (element.kind !== "section") {
            return [];
        }
        if (element.section === "current") {
            return this.getCurrentChildren();
        }
        if (element.section === "saved") {
            return this.getSavedChildren();
        }
        if (element.section === "actions") {
            return this.getActionChildren();
        }
        return this.getRuntimeChildren();
    }
    getCurrentChildren() {
        if (!this.currentAccount) {
            return [
                {
                    kind: "message",
                    label: "Current account unavailable",
                    description: "Use Refresh to try again",
                    icon: "warning",
                },
            ];
        }
        const currentEmail = normalizeEmail(this.currentAccount.email);
        const managed = (0, account_registry_1.getManagedAccounts)(this.context).find(account => normalizeEmail(account.email) === currentEmail);
        return [
            {
                kind: "currentAccount",
                account: this.currentAccount,
                managed,
            },
        ];
    }
    getSavedChildren() {
        const accounts = (0, account_registry_1.getManagedAccounts)(this.context);
        if (accounts.length === 0) {
            return [
                {
                    kind: "message",
                    label: "No saved accounts",
                    description: "Save the current account to get started",
                    icon: "info",
                },
            ];
        }
        const currentEmail = this.currentAccount
            ? normalizeEmail(this.currentAccount.email)
            : undefined;
        return accounts.map(account => ({
            kind: "savedAccount",
            account,
            current: currentEmail !== undefined &&
                normalizeEmail(account.email) === currentEmail,
        }));
    }
    getActionChildren() {
        return [
            {
                kind: "action",
                action: "addAccount",
            },
            {
                kind: "action",
                action: "saveCurrent",
            },
            {
                kind: "action",
                action: "manageAccounts",
            },
            {
                kind: "action",
                action: "refresh",
            },
        ];
    }
    getRuntimeChildren() {
        return [
            {
                kind: "runtimeStatus",
                runtime: "extension",
            },
            {
                kind: "runtimeStatus",
                runtime: "agy",
            },
            {
                kind: "runtimeStatus",
                runtime: "hub",
            },
        ];
    }
    getRuntimeStatusItem(element) {
        const status = this.runtimeStatus;
        if (element.runtime === "extension") {
            const installed = status?.extension.installed === true;
            const item = new vscode.TreeItem("Google Extension");
            item.description = installed
                ? status?.extension.version || "Installed"
                : "Not Installed";
            item.iconPath = new vscode.ThemeIcon(installed
                ? "pass-filled"
                : "warning");
            item.tooltip = installed
                ? `Google Antigravity ${status?.extension.version || ""}`.trim()
                : "Google Antigravity extension is not installed.";
            return item;
        }
        if (element.runtime === "agy") {
            const running = Boolean(status?.process);
            const item = new vscode.TreeItem("AGY Backend");
            item.description = running
                ? status?.agyVersion || "Running"
                : "Not Running";
            item.iconPath = new vscode.ThemeIcon(running
                ? "pass-filled"
                : "warning");
            item.tooltip = running
                ? `AGY backend PID ${status?.process?.pid ?? "?"}`
                : "Antigravity AGY backend is not running.";
            return item;
        }
        const connected = status?.health?.reachable === true;
        const item = new vscode.TreeItem("Hub");
        item.description = connected
            ? "Connected"
            : "Disconnected";
        item.iconPath = new vscode.ThemeIcon(connected
            ? "pass-filled"
            : "warning");
        if (connected) {
            item.tooltip =
                `Antigravity Hub connected` +
                    (status?.process?.hubPort
                        ? ` on port ${status.process.hubPort}`
                        : "");
        }
        else if (this.runtimeStatusError) {
            item.tooltip =
                `Runtime inspection failed: ${this.runtimeStatusError}`;
        }
        else {
            item.tooltip =
                "Antigravity Hub is not currently reachable.";
        }
        return item;
    }
    getSectionItem(element) {
        const titles = {
            current: "CURRENT ACCOUNT",
            saved: "SAVED ACCOUNTS",
            actions: "ACTIONS",
            runtime: "ANTIGRAVITY",
        };
        const item = new vscode.TreeItem(titles[element.section], vscode.TreeItemCollapsibleState.Expanded);
        item.contextValue =
            `antigravity.section.${element.section}`;
        return item;
    }
    getCurrentAccountItem(element) {
        const account = element.account;
        const label = element.managed?.label ||
            account.displayName ||
            account.email;
        const item = new vscode.TreeItem(label);
        item.description = account.email;
        item.tooltip = [
            label,
            account.displayName || "",
            account.email,
            "Current Antigravity account",
        ]
            .filter(Boolean)
            .join("\n");
        item.iconPath =
            new vscode.ThemeIcon("pass-filled", new vscode.ThemeColor("testing.iconPassed"));
        item.contextValue =
            "antigravity.currentAccount";
        return item;
    }
    getSavedAccountItem(element) {
        const account = element.account;
        const label = account.label ||
            account.displayName ||
            account.email;
        const item = new vscode.TreeItem(label);
        item.description =
            element.current
                ? `${account.email} • Current`
                : account.email;
        item.tooltip = [
            label,
            account.displayName || "",
            account.email,
            element.current
                ? "Current Antigravity account"
                : "Saved Antigravity account",
        ]
            .filter(Boolean)
            .join("\n");
        item.iconPath =
            element.current
                ? new vscode.ThemeIcon("pass-filled", new vscode.ThemeColor("testing.iconPassed"))
                : new vscode.ThemeIcon("account");
        item.contextValue =
            element.current
                ? "antigravity.savedAccount.current"
                : "antigravity.savedAccount";
        if (!element.current) {
            item.command = {
                command: "boygr.antigravityAccountSwitcher.switchAccount",
                title: "Switch Account",
                arguments: [
                    {
                        email: account.email,
                        label: account.label ||
                            account.displayName ||
                            undefined,
                    },
                ],
            };
        }
        return item;
    }
    getActionItem(element) {
        if (element.action === "addAccount") {
            const item = new vscode.TreeItem("Add / Switch Google Account");
            item.iconPath =
                new vscode.ThemeIcon("person-add");
            item.command = {
                command: "boygr.antigravityAccountSwitcher.addAccount",
                title: "Add / Switch Google Account",
            };
            return item;
        }
        if (element.action === "saveCurrent") {
            const item = new vscode.TreeItem("Save Current Account");
            item.iconPath =
                new vscode.ThemeIcon("save");
            item.command = {
                command: "boygr.antigravityAccountSwitcher.saveCurrentAccount",
                title: "Save Current Account",
            };
            return item;
        }
        if (element.action === "manageAccounts") {
            const item = new vscode.TreeItem("Manage Accounts");
            item.iconPath =
                new vscode.ThemeIcon("accounts-view-bar-icon");
            item.command = {
                command: "boygr.antigravityAccountSwitcher.manageAccounts",
                title: "Manage Accounts",
            };
            return item;
        }
        const item = new vscode.TreeItem("Refresh");
        item.iconPath =
            new vscode.ThemeIcon("refresh");
        item.command = {
            command: "boygr.antigravityAccountSwitcher.refreshAccountsView",
            title: "Refresh",
        };
        return item;
    }
    getMessageItem(element) {
        const item = new vscode.TreeItem(element.label);
        item.description = element.description;
        if (element.icon) {
            item.iconPath =
                new vscode.ThemeIcon(element.icon);
        }
        return item;
    }
}
exports.AntigravityAccountsTreeProvider = AntigravityAccountsTreeProvider;
//# sourceMappingURL=account-tree-provider.js.map
import * as vscode from "vscode";

import { AntigravityHubStatus, inspectAntigravityHub } from "../antigravity/hub-detector";

import {
    getManagedAccounts,
    ManagedAntigravityAccount,
} from "../antigravity/account-registry";

import {
    AntigravityCurrentAccount,
    getAntigravityCurrentAccount,
} from "../antigravity/hub-auth-client";

type RootSection = "current" | "saved" | "actions" | "runtime";

type AccountTreeNode =
    | {
          kind: "section";
          section: RootSection;
      }
    | {
          kind: "currentAccount";
          account: AntigravityCurrentAccount;
          managed?: ManagedAntigravityAccount;
      }
    | {
          kind: "savedAccount";
          account: ManagedAntigravityAccount;
          current: boolean;
      }
    | {
          kind: "action";
          action: "addAccount" | "saveCurrent" | "manageAccounts" | "refresh";
      }
    | {
          kind: "runtimeStatus";
          runtime:
              | "extension"
              | "agy"
              | "hub";
      }
    | {
          kind: "message";
          label: string;
          description?: string;
          icon?: string;
      };

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export class AntigravityAccountsTreeProvider
    implements vscode.TreeDataProvider<AccountTreeNode>, vscode.Disposable
{
    private readonly changeEmitter =
        new vscode.EventEmitter<AccountTreeNode | undefined | void>();

    readonly onDidChangeTreeData = this.changeEmitter.event;

    private currentAccount?: AntigravityCurrentAccount;
    private currentAccountError?: string;
    private runtimeStatus?: AntigravityHubStatus;
    private runtimeStatusError?: string;

    private startupRetryTimer?: NodeJS.Timeout;
    private startupRetryIndex = 0;
    private readonly startupRetryDelaysMs = [
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
        this.cancelStartupRetry();
        this.changeEmitter.dispose();
    }

    private cancelStartupRetry(): void {
        if (this.startupRetryTimer) {
            clearTimeout(this.startupRetryTimer);
            this.startupRetryTimer = undefined;
        }
    }

    private resetStartupRetry(): void {
        this.cancelStartupRetry();
        this.startupRetryIndex = 0;
    }

    private scheduleStartupRetry(): void {
        if (
            this.currentAccount ||
            this.startupRetryTimer ||
            this.startupRetryIndex >= this.startupRetryDelaysMs.length
        ) {
            return;
        }

        const delayMs =
            this.startupRetryDelaysMs[this.startupRetryIndex];

        this.startupRetryIndex += 1;

        this.startupRetryTimer = setTimeout(() => {
            this.startupRetryTimer = undefined;

            void this.retryStartupState();
        }, delayMs);
    }

    private async retryStartupState(): Promise<void> {
        if (this.currentAccount) {
            this.cancelStartupRetry();
            return;
        }

        this.currentAccountError = undefined;
        this.runtimeStatusError = undefined;

        try {
            this.runtimeStatus =
                await inspectAntigravityHub();
        } catch (error) {
            this.runtimeStatusError =
                error instanceof Error
                    ? error.message
                    : String(error);
        }

        try {
            this.currentAccount =
                await getAntigravityCurrentAccount();

            this.currentAccountError = undefined;
        } catch (error) {
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

    async refresh(): Promise<void> {
        this.resetStartupRetry();

        this.currentAccount = undefined;
        this.currentAccountError = undefined;
        this.runtimeStatus = undefined;
        this.runtimeStatusError = undefined;

        try {
            this.runtimeStatus =
                await inspectAntigravityHub();
        } catch (error) {
            this.runtimeStatusError =
                error instanceof Error
                    ? error.message
                    : String(error);
        }

        try {
            this.currentAccount =
                await getAntigravityCurrentAccount();
        } catch (error) {
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

    getTreeItem(
        element: AccountTreeNode,
    ): vscode.TreeItem {
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

    async getChildren(
        element?: AccountTreeNode,
    ): Promise<AccountTreeNode[]> {
        if (!element) {
            if (
                !this.currentAccount &&
                !this.currentAccountError
            ) {
                try {
                    this.currentAccount =
                        await getAntigravityCurrentAccount();
                } catch (error) {
                    this.currentAccountError =
                        error instanceof Error
                            ? error.message
                            : String(error);
                }
            }

            if (
                !this.runtimeStatus &&
                !this.runtimeStatusError
            ) {
                try {
                    this.runtimeStatus =
                        await inspectAntigravityHub();
                } catch (error) {
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

    private getCurrentChildren(): AccountTreeNode[] {
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

        const currentEmail =
            normalizeEmail(this.currentAccount.email);

        const managed =
            getManagedAccounts(this.context).find(
                account =>
                    normalizeEmail(account.email) === currentEmail,
            );

        return [
            {
                kind: "currentAccount",
                account: this.currentAccount,
                managed,
            },
        ];
    }

    private getSavedChildren(): AccountTreeNode[] {
        const accounts =
            getManagedAccounts(this.context);

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

        const currentEmail =
            this.currentAccount
                ? normalizeEmail(this.currentAccount.email)
                : undefined;

        return accounts.map(account => ({
            kind: "savedAccount" as const,
            account,
            current:
                currentEmail !== undefined &&
                normalizeEmail(account.email) === currentEmail,
        }));
    }

    private getActionChildren(): AccountTreeNode[] {
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

    private getRuntimeChildren(): AccountTreeNode[] {
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

    private getRuntimeStatusItem(
        element: Extract<
            AccountTreeNode,
            { kind: "runtimeStatus" }
        >,
    ): vscode.TreeItem {
        const status = this.runtimeStatus;

        if (element.runtime === "extension") {
            const installed =
                status?.extension.installed === true;

            const item = new vscode.TreeItem(
                "Google Extension",
            );

            item.description = installed
                ? status?.extension.version || "Installed"
                : "Not Installed";

            item.iconPath = new vscode.ThemeIcon(
                installed
                    ? "pass-filled"
                    : "warning",
            );

            item.tooltip = installed
                ? `Google Antigravity ${status?.extension.version || ""}`.trim()
                : "Google Antigravity extension is not installed.";

            return item;
        }

        if (element.runtime === "agy") {
            const running = Boolean(status?.process);

            const item = new vscode.TreeItem(
                "AGY Backend",
            );

            item.description = running
                ? status?.agyVersion || "Running"
                : "Not Running";

            item.iconPath = new vscode.ThemeIcon(
                running
                    ? "pass-filled"
                    : "warning",
            );

            item.tooltip = running
                ? `AGY backend PID ${status?.process?.pid ?? "?"}`
                : "Antigravity AGY backend is not running.";

            return item;
        }

        const connected =
            status?.health?.reachable === true;

        const item = new vscode.TreeItem("Hub");

        item.description = connected
            ? "Connected"
            : "Disconnected";

        item.iconPath = new vscode.ThemeIcon(
            connected
                ? "pass-filled"
                : "warning",
        );

        if (connected) {
            item.tooltip =
                `Antigravity Hub connected` +
                (
                    status?.process?.hubPort
                        ? ` on port ${status.process.hubPort}`
                        : ""
                );
        } else if (this.runtimeStatusError) {
            item.tooltip =
                `Runtime inspection failed: ${this.runtimeStatusError}`;
        } else {
            item.tooltip =
                "Antigravity Hub is not currently reachable.";
        }

        return item;
    }
    private getSectionItem(
        element: Extract<AccountTreeNode, { kind: "section" }>,
    ): vscode.TreeItem {
        const titles: Record<RootSection, string> = {
            current: "CURRENT ACCOUNT",
            saved: "SAVED ACCOUNTS",
            actions: "ACTIONS",
            runtime: "ANTIGRAVITY",
        };

        const item = new vscode.TreeItem(
            titles[element.section],
            vscode.TreeItemCollapsibleState.Expanded,
        );

        item.contextValue =
            `antigravity.section.${element.section}`;

        return item;
    }

    private getCurrentAccountItem(
        element: Extract<AccountTreeNode, { kind: "currentAccount" }>,
    ): vscode.TreeItem {
        const account = element.account;

        const label =
            element.managed?.label ||
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
            new vscode.ThemeIcon(
                "pass-filled",
                new vscode.ThemeColor("testing.iconPassed"),
            );

        item.contextValue =
            "antigravity.currentAccount";

        return item;
    }

    private getSavedAccountItem(
        element: Extract<AccountTreeNode, { kind: "savedAccount" }>,
    ): vscode.TreeItem {
        const account = element.account;

        const label =
            account.label ||
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
                ? new vscode.ThemeIcon(
                      "pass-filled",
                      new vscode.ThemeColor("testing.iconPassed"),
                  )
                : new vscode.ThemeIcon("account");

        item.contextValue =
            element.current
                ? "antigravity.savedAccount.current"
                : "antigravity.savedAccount";

        if (!element.current) {
            item.command = {
                command:
                    "boygr.antigravityAccountSwitcher.switchAccount",
                title: "Switch Account",
                arguments: [
                    {
                        email: account.email,
                        label:
                            account.label ||
                            account.displayName ||
                            undefined,
                    },
                ],
            };
        }

        return item;
    }

    private getActionItem(
        element: Extract<AccountTreeNode, { kind: "action" }>,
    ): vscode.TreeItem {
        if (element.action === "addAccount") {
            const item =
                new vscode.TreeItem("Add / Switch Google Account");

            item.iconPath =
                new vscode.ThemeIcon("person-add");

            item.command = {
                command:
                    "boygr.antigravityAccountSwitcher.addAccount",
                title: "Add / Switch Google Account",
            };

            return item;
        }

        if (element.action === "saveCurrent") {
            const item =
                new vscode.TreeItem("Save Current Account");

            item.iconPath =
                new vscode.ThemeIcon("save");

            item.command = {
                command:
                    "boygr.antigravityAccountSwitcher.saveCurrentAccount",
                title: "Save Current Account",
            };

            return item;
        }

        if (element.action === "manageAccounts") {
            const item =
                new vscode.TreeItem("Manage Accounts");

            item.iconPath =
                new vscode.ThemeIcon("accounts-view-bar-icon");

            item.command = {
                command:
                    "boygr.antigravityAccountSwitcher.manageAccounts",
                title: "Manage Accounts",
            };

            return item;
        }

        const item = new vscode.TreeItem("Refresh");

        item.iconPath =
            new vscode.ThemeIcon("refresh");

        item.command = {
            command:
                "boygr.antigravityAccountSwitcher.refreshAccountsView",
            title: "Refresh",
        };

        return item;
    }

    private getMessageItem(
        element: Extract<AccountTreeNode, { kind: "message" }>,
    ): vscode.TreeItem {
        const item =
            new vscode.TreeItem(element.label);

        item.description = element.description;

        if (element.icon) {
            item.iconPath =
                new vscode.ThemeIcon(element.icon);
        }

        return item;
    }
}

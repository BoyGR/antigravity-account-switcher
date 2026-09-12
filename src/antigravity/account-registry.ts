import * as vscode from "vscode";

import {
    AntigravityCurrentAccount,
} from "./hub-auth-client";

const STORAGE_KEY =
    "boygr.antigravity.accounts.v1";

export interface ManagedAntigravityAccount {
    email: string;
    label?: string;
    displayName?: string;
    firstSeenAt: string;
    lastSeenAt: string;
}

interface AccountRegistryState {
    version: 1;
    accounts: Record<string, ManagedAntigravityAccount>;
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function emptyRegistry(): AccountRegistryState {
    return {
        version: 1,
        accounts: {},
    };
}

export function getManagedAccounts(
    context: vscode.ExtensionContext,
): ManagedAntigravityAccount[] {
    const state =
        context.globalState.get<AccountRegistryState>(
            STORAGE_KEY,
        );

    if (!state || state.version !== 1) {
        return [];
    }

    return Object.values(state.accounts)
        .slice()
        .sort((left, right) =>
            left.email.localeCompare(right.email),
        );
}

export function findManagedAccount(
    context: vscode.ExtensionContext,
    email: string,
): ManagedAntigravityAccount | undefined {
    const normalized = normalizeEmail(email);

    return getManagedAccounts(context).find(
        account =>
            normalizeEmail(account.email) === normalized,
    );
}

export async function saveCurrentAccountMetadata(
    context: vscode.ExtensionContext,
    current: AntigravityCurrentAccount,
    label?: string,
): Promise<ManagedAntigravityAccount> {
    const email = normalizeEmail(current.email);

    if (!email) {
        throw new Error(
            "Cannot save an Antigravity account without an email.",
        );
    }

    const existingState =
        context.globalState.get<AccountRegistryState>(
            STORAGE_KEY,
        );

    const state: AccountRegistryState =
        existingState?.version === 1
            ? {
                  version: 1,
                  accounts: {
                      ...existingState.accounts,
                  },
              }
            : emptyRegistry();

    const existing = state.accounts[email];

    const now = new Date().toISOString();

    const normalizedLabel =
        label?.trim() || existing?.label || undefined;

    const account: ManagedAntigravityAccount = {
        email,
        label: normalizedLabel,
        displayName:
            current.displayName ||
            existing?.displayName ||
            undefined,
        firstSeenAt:
            existing?.firstSeenAt || now,
        lastSeenAt: now,
    };

    state.accounts[email] = account;

    await context.globalState.update(
        STORAGE_KEY,
        state,
    );

    return account;
}

export async function removeManagedAccount(
    context: vscode.ExtensionContext,
    email: string,
): Promise<boolean> {
    const normalized = normalizeEmail(email);

    const existingState =
        context.globalState.get<AccountRegistryState>(
            STORAGE_KEY,
        );

    if (
        !existingState ||
        existingState.version !== 1 ||
        !existingState.accounts[normalized]
    ) {
        return false;
    }

    const accounts = {
        ...existingState.accounts,
    };

    delete accounts[normalized];

    await context.globalState.update(
        STORAGE_KEY,
        {
            version: 1,
            accounts,
        } satisfies AccountRegistryState,
    );

    return true;
}

export async function updateManagedAccountLabel(
    context: vscode.ExtensionContext,
    email: string,
    label?: string,
): Promise<ManagedAntigravityAccount> {
    const normalized = normalizeEmail(email);

    const existingState =
        context.globalState.get<AccountRegistryState>(
            STORAGE_KEY,
        );

    if (
        !existingState ||
        existingState.version !== 1
    ) {
        throw new Error(
            "Antigravity account registry is empty.",
        );
    }

    const existing =
        existingState.accounts[normalized];

    if (!existing) {
        throw new Error(
            `Managed Antigravity account not found: ${normalized}`,
        );
    }

    const normalizedLabel =
        label?.trim() || undefined;

    const updated: ManagedAntigravityAccount = {
        ...existing,
        label: normalizedLabel,
    };

    await context.globalState.update(
        STORAGE_KEY,
        {
            version: 1,
            accounts: {
                ...existingState.accounts,
                [normalized]: updated,
            },
        } satisfies AccountRegistryState,
    );

    return updated;
}


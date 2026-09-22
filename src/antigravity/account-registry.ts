import * as vscode from "vscode";

import {
    AntigravityCurrentAccount,
    AntigravityQuotaSnapshot,
} from "./hub-auth-client";

const STORAGE_KEY =
    "boygr.antigravity.accounts.v1";

const QUOTA_STORAGE_KEY =
    "boygr.antigravity.quotaSnapshots.v1";

export interface ManagedAntigravityAccount {
    email: string;
    label?: string;
    displayName?: string;
    colorTag?: string;
    group?: string;
    plan?: string;
    g1Tier?: string;
    isPro?: boolean;
    profilePictureUrl?: string;
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
        colorTag: existing?.colorTag,
        group: existing?.group,
        plan: existing?.plan || current.plan,
        g1Tier: current.g1Tier || existing?.g1Tier,
        isPro: typeof current.isPro === "boolean" ? current.isPro : existing?.isPro,
        profilePictureUrl: current.profilePictureUrl || existing?.profilePictureUrl,
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

export async function updateManagedAccountPicture(
    context: vscode.ExtensionContext,
    email: string,
    profilePictureUrl: string,
): Promise<boolean> {
    const normalized = normalizeEmail(email);
    if (!normalized || !profilePictureUrl) {
        return false;
    }

    const existingState = context.globalState.get<AccountRegistryState>(STORAGE_KEY);
    if (!existingState || existingState.version !== 1 || !existingState.accounts[normalized]) {
        return false;
    }

    if (existingState.accounts[normalized].profilePictureUrl === profilePictureUrl) {
        return false;
    }

    existingState.accounts[normalized].profilePictureUrl = profilePictureUrl;
    await context.globalState.update(STORAGE_KEY, existingState);
    return true;
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
    colorTag?: string,
    group?: string,
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

    const normalizedColorTag =
        colorTag !== undefined
            ? (colorTag.trim() || undefined)
            : existing.colorTag;

    const normalizedGroup =
        group !== undefined
            ? (group.trim() || undefined)
            : existing.group;

    const updated: ManagedAntigravityAccount = {
        ...existing,
        label: normalizedLabel,
        colorTag: normalizedColorTag,
        group: normalizedGroup,
        plan: existing.plan,
        profilePictureUrl: existing.profilePictureUrl,
        lastSeenAt: new Date().toISOString(),
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

export async function updateManagedAccountGroup(
    context: vscode.ExtensionContext,
    email: string,
    group?: string,
): Promise<ManagedAntigravityAccount> {
    const normalized = normalizeEmail(email);

    const existingState =
        context.globalState.get<AccountRegistryState>(
            STORAGE_KEY,
        );

    if (!existingState || existingState.version !== 1) {
        throw new Error("Antigravity account registry is empty.");
    }

    const existing = existingState.accounts[normalized];
    if (!existing) {
        throw new Error(`Managed Antigravity account not found: ${normalized}`);
    }

    const updated: ManagedAntigravityAccount = {
        ...existing,
        group: group?.trim() || undefined,
    };

    await context.globalState.update(STORAGE_KEY, {
        version: 1,
        accounts: {
            ...existingState.accounts,
            [normalized]: updated,
        },
    } satisfies AccountRegistryState);

    return updated;
}

export async function updateManagedAccountColorTag(
    context: vscode.ExtensionContext,
    email: string,
    colorTag?: string,
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

    const updated: ManagedAntigravityAccount = {
        ...existing,
        colorTag: colorTag?.trim() || undefined,
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
/*
 * Quota snapshots intentionally contain only non-secret runtime
 * metadata. They never contain Google credentials, cookies,
 * OAuth tokens, CSRF values, or profile-picture URLs.
 */
export interface ManagedAccountQuotaSnapshot
    extends AntigravityQuotaSnapshot {
    email: string;
}

interface AccountQuotaSnapshotState {
    version: 1;
    accounts: Record<
        string,
        ManagedAccountQuotaSnapshot
    >;
}

function emptyQuotaSnapshotState():
    AccountQuotaSnapshotState {
    return {
        version: 1,
        accounts: {},
    };
}

export function getManagedAccountQuotaSnapshots(
    context: vscode.ExtensionContext,
): Record<string, ManagedAccountQuotaSnapshot> {
    const stored =
        context.globalState.get<AccountQuotaSnapshotState>(
            QUOTA_STORAGE_KEY,
        );

    if (
        !stored ||
        stored.version !== 1
    ) {
        return {};
    }

    return {
        ...stored.accounts,
    };
}

export function getManagedAccountQuotaSnapshot(
    context: vscode.ExtensionContext,
    email: string,
): ManagedAccountQuotaSnapshot | undefined {
    const normalized =
        normalizeEmail(email);

    return getManagedAccountQuotaSnapshots(
        context,
    )[normalized];
}

export async function saveManagedAccountQuotaSnapshot(
    context: vscode.ExtensionContext,
    email: string,
    snapshot: AntigravityQuotaSnapshot,
): Promise<ManagedAccountQuotaSnapshot> {
    const normalized =
        normalizeEmail(email);

    if (!normalized) {
        throw new Error(
            "Cannot save an Antigravity quota snapshot without an email.",
        );
    }

    const existing =
        context.globalState.get<AccountQuotaSnapshotState>(
            QUOTA_STORAGE_KEY,
        );

    const state:
        AccountQuotaSnapshotState =
        existing?.version === 1
            ? {
                  version: 1,
                  accounts: {
                      ...existing.accounts,
                  },
              }
            : emptyQuotaSnapshotState();

    const stored:
        ManagedAccountQuotaSnapshot = {
        email: normalized,

        fetchedAt:
            snapshot.fetchedAt,

        profilePictureAvailable:
            snapshot.profilePictureAvailable,

        modelConfigCount:
            snapshot.modelConfigCount,

        quotaModelCount:
            snapshot.quotaModelCount,

        models:
            snapshot.models.map(
                model => ({
                    index:
                        model.index,

                    modelId:
                        model.modelId,

                    model:
                        model.model,

                    remainingFraction:
                        model.remainingFraction,

                    resetTime:
                        model.resetTime,
                }),
            ),
    };

    state.accounts[normalized] =
        stored;

    await context.globalState.update(
        QUOTA_STORAGE_KEY,
        state,
    );

    return stored;
}

export async function removeManagedAccountQuotaSnapshot(
    context: vscode.ExtensionContext,
    email: string,
): Promise<boolean> {
    const normalized =
        normalizeEmail(email);

    const existing =
        context.globalState.get<AccountQuotaSnapshotState>(
            QUOTA_STORAGE_KEY,
        );

    if (
        !existing ||
        existing.version !== 1 ||
        !existing.accounts[normalized]
    ) {
        return false;
    }

    const accounts = {
        ...existing.accounts,
    };

    delete accounts[normalized];

    await context.globalState.update(
        QUOTA_STORAGE_KEY,
        {
            version: 1,
            accounts,
        } satisfies AccountQuotaSnapshotState,
    );

    return true;
}

export async function importManagedAccounts(
    context: vscode.ExtensionContext,
    accountsToImport: Array<{
        email: string;
        label?: string;
        displayName?: string;
        colorTag?: string;
        group?: string;
        plan?: string;
        g1Tier?: string;
        isPro?: boolean;
        profilePictureUrl?: string;
        firstSeenAt?: string;
        lastSeenAt?: string;
    }>,
): Promise<{ added: number; updated: number }> {
    const existingState =
        context.globalState.get<AccountRegistryState>(STORAGE_KEY);
    const state: AccountRegistryState =
        existingState?.version === 1
            ? {
                  version: 1,
                  accounts: { ...existingState.accounts },
              }
            : emptyRegistry();

    let added = 0;
    let updated = 0;
    const now = new Date().toISOString();

    for (const item of accountsToImport) {
        if (!item || typeof item.email !== "string" || !item.email.trim()) {
            continue;
        }
        const email = normalizeEmail(item.email);
        const existing = state.accounts[email];
        if (existing) {
            state.accounts[email] = {
                ...existing,
                label: typeof item.label === "string" ? item.label.trim() || undefined : existing.label,
                displayName: typeof item.displayName === "string" ? item.displayName.trim() || undefined : existing.displayName,
                colorTag: typeof item.colorTag === "string" ? item.colorTag.trim() || undefined : existing.colorTag,
                group: typeof item.group === "string" ? item.group.trim() || undefined : existing.group,
                plan: typeof item.plan === "string" ? item.plan.trim() || undefined : existing.plan,
                g1Tier: typeof item.g1Tier === "string" ? item.g1Tier.trim() || undefined : existing.g1Tier,
                isPro: typeof item.isPro === "boolean" ? item.isPro : existing.isPro,
                profilePictureUrl: typeof item.profilePictureUrl === "string" ? item.profilePictureUrl.trim() || undefined : existing.profilePictureUrl,
                lastSeenAt: item.lastSeenAt || existing.lastSeenAt || now,
            };
            updated++;
        } else {
            state.accounts[email] = {
                email,
                label: typeof item.label === "string" ? item.label.trim() || undefined : undefined,
                displayName: typeof item.displayName === "string" ? item.displayName.trim() || undefined : undefined,
                colorTag: typeof item.colorTag === "string" ? item.colorTag.trim() || undefined : undefined,
                group: typeof item.group === "string" ? item.group.trim() || undefined : undefined,
                plan: typeof item.plan === "string" ? item.plan.trim() || undefined : undefined,
                g1Tier: typeof item.g1Tier === "string" ? item.g1Tier.trim() || undefined : undefined,
                isPro: typeof item.isPro === "boolean" ? item.isPro : undefined,
                profilePictureUrl: typeof item.profilePictureUrl === "string" ? item.profilePictureUrl.trim() || undefined : undefined,
                firstSeenAt: item.firstSeenAt || now,
                lastSeenAt: item.lastSeenAt || now,
            };
            added++;
        }
    }

    await context.globalState.update(STORAGE_KEY, state);
    return { added, updated };
}

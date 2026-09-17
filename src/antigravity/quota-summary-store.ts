import * as vscode from "vscode";

import {
    AntigravityQuotaSummarySnapshot,
} from "./hub-auth-client";

const STORAGE_KEY =
    "boygr.antigravity.quotaSummary.v1";

export interface ManagedAccountUsageSnapshot
    extends AntigravityQuotaSummarySnapshot {
    email: string;
}

interface UsageSnapshotState {
    version: 1;

    accounts:
        Record<
            string,
            ManagedAccountUsageSnapshot
        >;
}

function normalizeEmail(
    email: string,
): string {
    return email
        .trim()
        .toLowerCase();
}

function emptyState():
    UsageSnapshotState {
    return {
        version: 1,
        accounts: {},
    };
}

export function getManagedAccountUsageSnapshots(
    context: vscode.ExtensionContext,
): Record<
    string,
    ManagedAccountUsageSnapshot
> {
    const state =
        context.globalState.get<UsageSnapshotState>(
            STORAGE_KEY,
        );

    if (
        !state ||
        state.version !== 1
    ) {
        return {};
    }

    return {
        ...state.accounts,
    };
}

export function getManagedAccountUsageSnapshot(
    context: vscode.ExtensionContext,
    email: string,
): ManagedAccountUsageSnapshot | undefined {
    return getManagedAccountUsageSnapshots(
        context,
    )[
        normalizeEmail(
            email,
        )
    ];
}

export async function saveManagedAccountUsageSnapshot(
    context: vscode.ExtensionContext,
    email: string,
    snapshot: AntigravityQuotaSummarySnapshot,
): Promise<ManagedAccountUsageSnapshot> {
    const normalized =
        normalizeEmail(
            email,
        );

    if (!normalized) {
        throw new Error(
            "Cannot save an Antigravity usage snapshot without an email.",
        );
    }

    const existing =
        context.globalState.get<UsageSnapshotState>(
            STORAGE_KEY,
        );

    const state =
        existing?.version === 1
            ? {
                  version: 1 as const,
                  accounts: {
                      ...existing.accounts,
                  },
              }
            : emptyState();

    const stored:
        ManagedAccountUsageSnapshot = {
        email:
            normalized,

        fetchedAt:
            snapshot.fetchedAt,

        description:
            snapshot.description,

        buckets:
            snapshot.buckets.map(
                bucket => ({
                    ...bucket,
                }),
            ),

        groups:
            snapshot.groups.map(
                group => ({
                    displayName:
                        group.displayName,

                    description:
                        group.description,

                    buckets:
                        group.buckets.map(
                            bucket => ({
                                ...bucket,
                            }),
                        ),
                }),
            ),
    };

    state.accounts[
        normalized
    ] =
        stored;

    await context.globalState.update(
        STORAGE_KEY,
        state,
    );

    return stored;
}

export async function removeManagedAccountUsageSnapshot(
    context: vscode.ExtensionContext,
    email: string,
): Promise<boolean> {
    const normalized =
        normalizeEmail(
            email,
        );

    const existing =
        context.globalState.get<UsageSnapshotState>(
            STORAGE_KEY,
        );

    if (
        !existing ||
        existing.version !== 1 ||
        !existing.accounts[
            normalized
        ]
    ) {
        return false;
    }

    const accounts = {
        ...existing.accounts,
    };

    delete accounts[
        normalized
    ];

    await context.globalState.update(
        STORAGE_KEY,
        {
            version: 1,
            accounts,
        } satisfies UsageSnapshotState,
    );

    return true;
}

export function getAccountRemainingPercent(
    snapshot?: ManagedAccountUsageSnapshot,
): number | undefined {
    if (!snapshot || !Array.isArray(snapshot.buckets) || snapshot.buckets.length === 0) {
        return undefined;
    }
    let minFraction: number | undefined;
    for (const b of snapshot.buckets) {
        if (typeof b.remainingFraction === "number" && !b.disabled) {
            if (minFraction === undefined || b.remainingFraction < minFraction) {
                minFraction = b.remainingFraction;
            }
        }
    }
    return minFraction !== undefined ? Math.max(0, Math.min(100, Math.round(minFraction * 100))) : undefined;
}

/**
 * Periodically checks saved non-active accounts to see if any quota resetTime has arrived.
 * If resetTime has passed, replenishes the snapshot to full (100%) and clears the reset window,
 * ensuring saved account quota cards stay realistic and up-to-date even without manual switching.
 */
export async function refreshExpiredManagedAccountUsageSnapshots(
    context: vscode.ExtensionContext,
    activeEmail?: string,
): Promise<boolean> {
    const rawState = context.globalState.get<UsageSnapshotState>(STORAGE_KEY);
    if (!rawState || rawState.version !== 1 || !rawState.accounts) {
        return false;
    }

    const normalizedActive = activeEmail ? normalizeEmail(activeEmail) : "";
    const now = Date.now();
    let anyChanged = false;
    const updatedAccounts: Record<string, ManagedAccountUsageSnapshot> = {
        ...rawState.accounts,
    };

    for (const [email, snapshot] of Object.entries(rawState.accounts)) {
        if (email === normalizedActive) {
            continue;
        }
        if (!snapshot || !Array.isArray(snapshot.buckets) || snapshot.buckets.length === 0) {
            continue;
        }

        let accountChanged = false;
        const newBuckets = snapshot.buckets.map(bucket => {
            if (bucket.resetTime) {
                const resetTs = new Date(bucket.resetTime).getTime();
                if (Number.isFinite(resetTs) && resetTs <= now) {
                    accountChanged = true;
                    return {
                        ...bucket,
                        remainingFraction: 1.0,
                        resetTime: undefined,
                    };
                }
            }
            return bucket;
        });

        if (accountChanged) {
            anyChanged = true;
            const newGroups = (snapshot.groups || []).map(group => ({
                ...group,
                buckets: (group.buckets || []).map(bucket => {
                    if (bucket.resetTime) {
                        const resetTs = new Date(bucket.resetTime).getTime();
                        if (Number.isFinite(resetTs) && resetTs <= now) {
                            return {
                                ...bucket,
                                remainingFraction: 1.0,
                                resetTime: undefined,
                            };
                        }
                    }
                    return bucket;
                }),
            }));

            updatedAccounts[email] = {
                ...snapshot,
                fetchedAt: new Date().toISOString(),
                buckets: newBuckets,
                groups: newGroups,
            };
        }
    }

    if (anyChanged) {
        await context.globalState.update(STORAGE_KEY, {
            version: 1,
            accounts: updatedAccounts,
        } satisfies UsageSnapshotState);
    }

    return anyChanged;
}

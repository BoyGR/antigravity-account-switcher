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
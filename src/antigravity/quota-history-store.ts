import * as vscode from "vscode";
import { AntigravityQuotaSummarySnapshot } from "./hub-auth-client";

export interface DailyQuotaRecord {
    date: string; // YYYY-MM-DD
    lowestRemainingPercent: number; // 0 - 100
    timestamp: number;
}

export interface QuotaHistoryState {
    version: 1;
    accounts: Record<string, DailyQuotaRecord[]>;
}

const QUOTA_HISTORY_KEY = "boygr.antigravity.quotaHistory.v1";

export function extractRemainingPercent(
    usage?: AntigravityQuotaSummarySnapshot,
): number | undefined {
    if (!usage || !usage.buckets || usage.buckets.length === 0) {
        return undefined;
    }

    const fiveHourBucket = usage.buckets.find(
        b =>
            !b.disabled &&
            (b.window?.toLowerCase().includes("5") ||
                b.displayName?.toLowerCase().includes("5-hour") ||
                b.description?.toLowerCase().includes("5-hour")),
    );

    const bucket =
        fiveHourBucket ??
        usage.buckets.find(
            b => !b.disabled && typeof b.remainingFraction === "number",
        );

    if (bucket && typeof bucket.remainingFraction === "number") {
        return Math.max(
            0,
            Math.min(100, Math.round(bucket.remainingFraction * 100)),
        );
    }

    return undefined;
}

export async function recordDailyQuotaSnapshot(
    context: vscode.ExtensionContext,
    email: string,
    remainingPercent: number,
): Promise<void> {
    if (
        !email ||
        typeof remainingPercent !== "number" ||
        Number.isNaN(remainingPercent)
    ) {
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing =
        context.globalState.get<QuotaHistoryState>(QUOTA_HISTORY_KEY);
    const state: QuotaHistoryState =
        existing && existing.version === 1
            ? { version: 1, accounts: { ...existing.accounts } }
            : { version: 1, accounts: {} };

    const records = [...(state.accounts[normalizedEmail] || [])];
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const pct = Math.max(0, Math.min(100, Math.round(remainingPercent)));

    const todayIndex = records.findIndex(r => r.date === todayStr);
    if (todayIndex >= 0) {
        records[todayIndex] = {
            date: todayStr,
            lowestRemainingPercent: Math.min(
                records[todayIndex].lowestRemainingPercent,
                pct,
            ),
            timestamp: Date.now(),
        };
    } else {
        records.push({
            date: todayStr,
            lowestRemainingPercent: pct,
            timestamp: Date.now(),
        });
    }

    records.sort((a, b) => a.date.localeCompare(b.date));
    if (records.length > 14) {
        records.splice(0, records.length - 14);
    }

    state.accounts[normalizedEmail] = records;
    await context.globalState.update(QUOTA_HISTORY_KEY, state);
}

export function getAllAccountsQuotaHistory(
    context: vscode.ExtensionContext,
    days = 7,
): Record<string, DailyQuotaRecord[]> {
    const existing =
        context.globalState.get<QuotaHistoryState>(QUOTA_HISTORY_KEY);
    if (!existing || existing.version !== 1 || !existing.accounts) {
        return {};
    }

    const result: Record<string, DailyQuotaRecord[]> = {};
    for (const [email, records] of Object.entries(existing.accounts)) {
        result[email] = (records || []).slice(-days);
    }
    return result;
}

export async function recordUsageSnapshotIfAvailable(
    context: vscode.ExtensionContext,
    email: string,
    usage?: AntigravityQuotaSummarySnapshot,
): Promise<void> {
    const pct = extractRemainingPercent(usage);
    if (pct !== undefined) {
        await recordDailyQuotaSnapshot(context, email, pct);
    }
}


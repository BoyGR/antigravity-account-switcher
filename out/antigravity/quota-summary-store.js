"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagedAccountUsageSnapshots = getManagedAccountUsageSnapshots;
exports.getManagedAccountUsageSnapshot = getManagedAccountUsageSnapshot;
exports.saveManagedAccountUsageSnapshot = saveManagedAccountUsageSnapshot;
exports.removeManagedAccountUsageSnapshot = removeManagedAccountUsageSnapshot;
const STORAGE_KEY = "boygr.antigravity.quotaSummary.v1";
function normalizeEmail(email) {
    return email
        .trim()
        .toLowerCase();
}
function emptyState() {
    return {
        version: 1,
        accounts: {},
    };
}
function getManagedAccountUsageSnapshots(context) {
    const state = context.globalState.get(STORAGE_KEY);
    if (!state ||
        state.version !== 1) {
        return {};
    }
    return {
        ...state.accounts,
    };
}
function getManagedAccountUsageSnapshot(context, email) {
    return getManagedAccountUsageSnapshots(context)[normalizeEmail(email)];
}
async function saveManagedAccountUsageSnapshot(context, email, snapshot) {
    const normalized = normalizeEmail(email);
    if (!normalized) {
        throw new Error("Cannot save an Antigravity usage snapshot without an email.");
    }
    const existing = context.globalState.get(STORAGE_KEY);
    const state = existing?.version === 1
        ? {
            version: 1,
            accounts: {
                ...existing.accounts,
            },
        }
        : emptyState();
    const stored = {
        email: normalized,
        fetchedAt: snapshot.fetchedAt,
        description: snapshot.description,
        buckets: snapshot.buckets.map(bucket => ({
            ...bucket,
        })),
        groups: snapshot.groups.map(group => ({
            displayName: group.displayName,
            description: group.description,
            buckets: group.buckets.map(bucket => ({
                ...bucket,
            })),
        })),
    };
    state.accounts[normalized] =
        stored;
    await context.globalState.update(STORAGE_KEY, state);
    return stored;
}
async function removeManagedAccountUsageSnapshot(context, email) {
    const normalized = normalizeEmail(email);
    const existing = context.globalState.get(STORAGE_KEY);
    if (!existing ||
        existing.version !== 1 ||
        !existing.accounts[normalized]) {
        return false;
    }
    const accounts = {
        ...existing.accounts,
    };
    delete accounts[normalized];
    await context.globalState.update(STORAGE_KEY, {
        version: 1,
        accounts,
    });
    return true;
}
//# sourceMappingURL=quota-summary-store.js.map
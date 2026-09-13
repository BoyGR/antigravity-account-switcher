"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagedAccounts = getManagedAccounts;
exports.findManagedAccount = findManagedAccount;
exports.saveCurrentAccountMetadata = saveCurrentAccountMetadata;
exports.removeManagedAccount = removeManagedAccount;
exports.updateManagedAccountLabel = updateManagedAccountLabel;
exports.getManagedAccountQuotaSnapshots = getManagedAccountQuotaSnapshots;
exports.getManagedAccountQuotaSnapshot = getManagedAccountQuotaSnapshot;
exports.saveManagedAccountQuotaSnapshot = saveManagedAccountQuotaSnapshot;
exports.removeManagedAccountQuotaSnapshot = removeManagedAccountQuotaSnapshot;
const STORAGE_KEY = "boygr.antigravity.accounts.v1";
const QUOTA_STORAGE_KEY = "boygr.antigravity.quotaSnapshots.v1";
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function emptyRegistry() {
    return {
        version: 1,
        accounts: {},
    };
}
function getManagedAccounts(context) {
    const state = context.globalState.get(STORAGE_KEY);
    if (!state || state.version !== 1) {
        return [];
    }
    return Object.values(state.accounts)
        .slice()
        .sort((left, right) => left.email.localeCompare(right.email));
}
function findManagedAccount(context, email) {
    const normalized = normalizeEmail(email);
    return getManagedAccounts(context).find(account => normalizeEmail(account.email) === normalized);
}
async function saveCurrentAccountMetadata(context, current, label) {
    const email = normalizeEmail(current.email);
    if (!email) {
        throw new Error("Cannot save an Antigravity account without an email.");
    }
    const existingState = context.globalState.get(STORAGE_KEY);
    const state = existingState?.version === 1
        ? {
            version: 1,
            accounts: {
                ...existingState.accounts,
            },
        }
        : emptyRegistry();
    const existing = state.accounts[email];
    const now = new Date().toISOString();
    const normalizedLabel = label?.trim() || existing?.label || undefined;
    const account = {
        email,
        label: normalizedLabel,
        displayName: current.displayName ||
            existing?.displayName ||
            undefined,
        firstSeenAt: existing?.firstSeenAt || now,
        lastSeenAt: now,
    };
    state.accounts[email] = account;
    await context.globalState.update(STORAGE_KEY, state);
    return account;
}
async function removeManagedAccount(context, email) {
    const normalized = normalizeEmail(email);
    const existingState = context.globalState.get(STORAGE_KEY);
    if (!existingState ||
        existingState.version !== 1 ||
        !existingState.accounts[normalized]) {
        return false;
    }
    const accounts = {
        ...existingState.accounts,
    };
    delete accounts[normalized];
    await context.globalState.update(STORAGE_KEY, {
        version: 1,
        accounts,
    });
    return true;
}
async function updateManagedAccountLabel(context, email, label) {
    const normalized = normalizeEmail(email);
    const existingState = context.globalState.get(STORAGE_KEY);
    if (!existingState ||
        existingState.version !== 1) {
        throw new Error("Antigravity account registry is empty.");
    }
    const existing = existingState.accounts[normalized];
    if (!existing) {
        throw new Error(`Managed Antigravity account not found: ${normalized}`);
    }
    const normalizedLabel = label?.trim() || undefined;
    const updated = {
        ...existing,
        label: normalizedLabel,
    };
    await context.globalState.update(STORAGE_KEY, {
        version: 1,
        accounts: {
            ...existingState.accounts,
            [normalized]: updated,
        },
    });
    return updated;
}
function emptyQuotaSnapshotState() {
    return {
        version: 1,
        accounts: {},
    };
}
function getManagedAccountQuotaSnapshots(context) {
    const stored = context.globalState.get(QUOTA_STORAGE_KEY);
    if (!stored ||
        stored.version !== 1) {
        return {};
    }
    return {
        ...stored.accounts,
    };
}
function getManagedAccountQuotaSnapshot(context, email) {
    const normalized = normalizeEmail(email);
    return getManagedAccountQuotaSnapshots(context)[normalized];
}
async function saveManagedAccountQuotaSnapshot(context, email, snapshot) {
    const normalized = normalizeEmail(email);
    if (!normalized) {
        throw new Error("Cannot save an Antigravity quota snapshot without an email.");
    }
    const existing = context.globalState.get(QUOTA_STORAGE_KEY);
    const state = existing?.version === 1
        ? {
            version: 1,
            accounts: {
                ...existing.accounts,
            },
        }
        : emptyQuotaSnapshotState();
    const stored = {
        email: normalized,
        fetchedAt: snapshot.fetchedAt,
        profilePictureAvailable: snapshot.profilePictureAvailable,
        modelConfigCount: snapshot.modelConfigCount,
        quotaModelCount: snapshot.quotaModelCount,
        models: snapshot.models.map(model => ({
            index: model.index,
            modelId: model.modelId,
            model: model.model,
            remainingFraction: model.remainingFraction,
            resetTime: model.resetTime,
        })),
    };
    state.accounts[normalized] =
        stored;
    await context.globalState.update(QUOTA_STORAGE_KEY, state);
    return stored;
}
async function removeManagedAccountQuotaSnapshot(context, email) {
    const normalized = normalizeEmail(email);
    const existing = context.globalState.get(QUOTA_STORAGE_KEY);
    if (!existing ||
        existing.version !== 1 ||
        !existing.accounts[normalized]) {
        return false;
    }
    const accounts = {
        ...existing.accounts,
    };
    delete accounts[normalized];
    await context.globalState.update(QUOTA_STORAGE_KEY, {
        version: 1,
        accounts,
    });
    return true;
}
//# sourceMappingURL=account-registry.js.map
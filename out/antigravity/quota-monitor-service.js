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
exports.QuotaMonitorService = void 0;
const vscode = __importStar(require("vscode"));
const hub_auth_client_1 = require("./hub-auth-client");
const account_registry_1 = require("./account-registry");
const quota_summary_store_1 = require("./quota-summary-store");
/**
 * Service for periodically refreshing Antigravity quota in the background
 * and notifying the user when their active quota falls below a safety threshold.
 *
 * Rules respected:
 * - NO aggressive polling (minimum 1 minute safe interval).
 * - NO automatic switching of inactive accounts.
 * - Deduplicated warnings per quota reset window.
 */
class QuotaMonitorService {
    context;
    onQuotaUpdated;
    timer;
    isRefreshing = false;
    config;
    notifiedDeduplicationKeys = new Set();
    constructor(context, initialConfig, onQuotaUpdated) {
        this.context = context;
        this.onQuotaUpdated = onQuotaUpdated;
        this.config = this.sanitizeConfig(initialConfig);
        this.start();
    }
    updateConfig(newConfig) {
        const oldInterval = this.config.intervalMinutes;
        this.config = this.sanitizeConfig({
            ...this.config,
            ...newConfig,
        });
        if (this.config.intervalMinutes !== oldInterval) {
            this.start();
        }
    }
    start() {
        this.stop();
        if (this.config.intervalMinutes <= 0) {
            return;
        }
        // Safe minimum of 1 minute (60,000 ms) to avoid aggressive polling
        const safeMinutes = Math.max(1, this.config.intervalMinutes);
        const intervalMs = safeMinutes * 60 * 1000;
        this.timer = setInterval(() => {
            void this.checkAndRefreshNow();
        }, intervalMs);
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
    async checkAndRefreshNow() {
        if (this.isRefreshing) {
            return null;
        }
        this.isRefreshing = true;
        try {
            const current = await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
            if (!current || !current.email) {
                return null;
            }
            const usage = await (0, hub_auth_client_1.getAntigravityQuotaSummary)(true);
            // Persist for managed accounts
            const managedAccounts = (0, account_registry_1.getManagedAccounts)(this.context);
            const normalizedEmail = current.email.trim().toLowerCase();
            const isManaged = managedAccounts.some(account => account.email.trim().toLowerCase() === normalizedEmail);
            if (isManaged) {
                await (0, quota_summary_store_1.saveManagedAccountUsageSnapshot)(this.context, current.email, usage);
            }
            // Notify UI listener
            if (this.onQuotaUpdated) {
                await this.onQuotaUpdated(usage);
            }
            // Evaluate low quota reminders
            if (this.config.reminderEnabled && usage.buckets && usage.buckets.length > 0) {
                await this.evaluateLowQuotaBuckets(current.email, usage.buckets);
            }
            return usage;
        }
        catch {
            // Background monitoring fails silently without breaking the user experience
            return null;
        }
        finally {
            this.isRefreshing = false;
        }
    }
    async evaluateLowQuotaBuckets(email, buckets) {
        for (const bucket of buckets) {
            if (typeof bucket.remainingFraction !== "number" || bucket.disabled) {
                continue;
            }
            const remainingPercent = Math.max(0, Math.min(100, Math.round(bucket.remainingFraction * 100)));
            const bucketIdentifier = bucket.displayName || bucket.bucketId || "Quota";
            const resetKey = bucket.resetTime || "ongoing";
            const dedupKey = `${email.toLowerCase()}:${bucketIdentifier}:${resetKey}`;
            if (remainingPercent <= this.config.thresholdPercent) {
                if (!this.notifiedDeduplicationKeys.has(dedupKey)) {
                    this.notifiedDeduplicationKeys.add(dedupKey);
                    const windowLabel = bucket.window || bucket.description || "Window";
                    const alertMsg = `Antigravity Quota Alert: ${bucketIdentifier} (${windowLabel}) is low (${remainingPercent}% remaining).`;
                    void vscode.window
                        .showWarningMessage(alertMsg, "Switch Account", "View Details", "Dismiss")
                        .then(selection => {
                        if (selection === "Switch Account") {
                            void vscode.commands.executeCommand("boygr.antigravityAccountSwitcher.switchAccount");
                        }
                        else if (selection === "View Details") {
                            void vscode.commands.executeCommand("boygr.antigravityAccountSwitcher.accountsView.focus");
                        }
                    });
                }
            }
            else {
                // If quota is above threshold, clear previous deduplication key for this bucket
                this.notifiedDeduplicationKeys.delete(dedupKey);
            }
        }
    }
    clearDeduplicationCache() {
        this.notifiedDeduplicationKeys.clear();
    }
    sanitizeConfig(config) {
        return {
            intervalMinutes: typeof config.intervalMinutes === "number" && config.intervalMinutes >= 0
                ? config.intervalMinutes
                : 5,
            reminderEnabled: config.reminderEnabled !== false,
            thresholdPercent: typeof config.thresholdPercent === "number" && config.thresholdPercent > 0
                ? Math.min(100, config.thresholdPercent)
                : 20,
        };
    }
    dispose() {
        this.stop();
        this.notifiedDeduplicationKeys.clear();
    }
}
exports.QuotaMonitorService = QuotaMonitorService;
//# sourceMappingURL=quota-monitor-service.js.map
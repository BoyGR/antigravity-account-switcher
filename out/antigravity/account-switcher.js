"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reauthenticateAndDetectAccount = reauthenticateAndDetectAccount;
exports.switchAntigravityAccount = switchAntigravityAccount;
const hub_auth_client_1 = require("./hub-auth-client");
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
async function waitForCurrentAccount(attempts = 12, delayMs = 1500) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            return await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
        }
        catch (error) {
            lastError = error;
            if (attempt < attempts) {
                await delay(delayMs);
            }
        }
    }
    const message = lastError instanceof Error
        ? lastError.message
        : String(lastError);
    throw new Error(`Unable to verify the active Antigravity account: ${message}`);
}
async function reauthenticateAndDetectAccount() {
    const before = await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
    let reauthError;
    try {
        await (0, hub_auth_client_1.reauthenticateAntigravity)();
    }
    catch (error) {
        reauthError = error;
    }
    let after;
    try {
        after =
            await waitForCurrentAccount();
    }
    catch (verificationError) {
        if (reauthError instanceof Error) {
            const verificationMessage = verificationError instanceof Error
                ? verificationError.message
                : String(verificationError);
            throw new Error(`Authentication could not be verified. ${verificationMessage}`);
        }
        throw verificationError;
    }
    return {
        before,
        after,
        changed: normalizeEmail(before.email) !==
            normalizeEmail(after.email),
        reauthWarning: reauthError instanceof Error
            ? reauthError.message
            : undefined,
    };
}
async function switchAntigravityAccount(targetEmail) {
    const target = normalizeEmail(targetEmail);
    if (!target) {
        throw new Error("Target Antigravity account email is empty.");
    }
    const before = await (0, hub_auth_client_1.getAntigravityCurrentAccount)();
    const beforeEmail = normalizeEmail(before.email);
    if (beforeEmail === target) {
        return {
            targetEmail: target,
            beforeEmail,
            afterEmail: beforeEmail,
            changed: false,
            verified: true,
        };
    }
    let reauthError;
    try {
        await (0, hub_auth_client_1.reauthenticateAntigravity)();
    }
    catch (error) {
        /*
         * Interactive Login can succeed in the browser even when
         * the Connect request reports a timeout/transport error.
         *
         * GetUserStatus remains the authoritative verification.
         */
        reauthError = error;
    }
    let after;
    try {
        after =
            await waitForCurrentAccount();
    }
    catch (verificationError) {
        const verificationMessage = verificationError instanceof Error
            ? verificationError.message
            : String(verificationError);
        throw new Error(`Unable to verify the Antigravity account after authentication: ${verificationMessage}`);
    }
    const afterEmail = normalizeEmail(after.email);
    if (afterEmail !== target) {
        if (afterEmail === beforeEmail) {
            throw new Error(`Account switch was not completed. Antigravity is still signed in as ${after.email}.`);
        }
        throw new Error(`A different Google account became active. ` +
            `Expected ${targetEmail}, but Antigravity is signed in as ${after.email}.`);
    }
    /*
     * Do not fail merely because Login transport reported an error
     * if GetUserStatus already proved the target account is active.
     */
    void reauthError;
    return {
        targetEmail: target,
        beforeEmail,
        afterEmail,
        changed: beforeEmail !== afterEmail,
        verified: true,
    };
}
//# sourceMappingURL=account-switcher.js.map
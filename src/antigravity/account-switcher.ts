import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
    AntigravityCurrentAccount,
    getAntigravityCurrentAccount,
    reauthenticateAntigravity,
} from "./hub-auth-client";
import { detectRunningAgyHub } from "./hub-detector";
import { TokenVaultService } from "./token-vault-service";

const execFileAsync = promisify(execFile);

export interface AntigravitySwitchResult {
    targetEmail: string;
    beforeEmail: string;
    afterEmail: string;
    changed: boolean;
    verified: boolean;
    swappedInstantly?: boolean;
}

export interface AntigravityAccountChangeResult {
    before: AntigravityCurrentAccount;
    after: AntigravityCurrentAccount;
    changed: boolean;
    reauthWarning?: string;
}

export interface SwitchAccountOptions {
    tokenVault?: TokenVaultService;
    enableInstantSwitch?: boolean;
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function waitForCurrentAccount(
    attempts = 15,
    delayMs = 1200,
): Promise<AntigravityCurrentAccount> {
    let lastError: unknown;

    for (
        let attempt = 1;
        attempt <= attempts;
        attempt += 1
    ) {
        try {
            return await getAntigravityCurrentAccount();
        } catch (error) {
            lastError = error;

            if (attempt < attempts) {
                await delay(delayMs);
            }
        }
    }

    const message =
        lastError instanceof Error
            ? lastError.message
            : String(lastError);

    throw new Error(
        `Unable to verify the active Antigravity account: ${message}`,
    );
}

export async function reauthenticateAndDetectAccount(
    options?: SwitchAccountOptions,
): Promise<AntigravityAccountChangeResult> {
    const before =
        await getAntigravityCurrentAccount();

    let reauthError: unknown;

    try {
        await reauthenticateAntigravity();
    } catch (error) {
        reauthError = error;
    }

    let after: AntigravityCurrentAccount;

    try {
        after =
            await waitForCurrentAccount();
    } catch (verificationError) {
        if (reauthError instanceof Error) {
            const verificationMessage =
                verificationError instanceof Error
                    ? verificationError.message
                    : String(verificationError);

            throw new Error(
                `Authentication could not be verified. ${verificationMessage}`,
            );
        }

        throw verificationError;
    }

    if (options?.tokenVault?.isSupported() && after?.email) {
        await options.tokenVault.saveActiveCredential(after.email).catch(() => false);
    }

    return {
        before,
        after,
        changed:
            normalizeEmail(before.email) !==
            normalizeEmail(after.email),
        reauthWarning:
            reauthError instanceof Error
                ? reauthError.message
                : undefined,
    };
}

export async function switchAntigravityAccount(
    targetEmail: string,
    options?: SwitchAccountOptions,
): Promise<AntigravitySwitchResult> {
    const target =
        normalizeEmail(targetEmail);

    if (!target) {
        throw new Error(
            "Target Antigravity account email is empty.",
        );
    }

    const before =
        await getAntigravityCurrentAccount();

    const beforeEmail =
        normalizeEmail(before.email);

    if (beforeEmail === target) {
        if (options?.tokenVault?.isSupported()) {
            await options.tokenVault.saveActiveCredential(target).catch(() => false);
        }

        return {
            targetEmail:
                target,

            beforeEmail,

            afterEmail:
                beforeEmail,

            changed:
                false,

            verified:
                true,

            swappedInstantly:
                true,
        };
    }

    // 1. Try Instant Token Swapping if token exists in vault
    const isVaultSupported = options?.tokenVault?.isSupported() === true;
    const isInstantEnabled = options?.enableInstantSwitch !== false;

    if (isVaultSupported && isInstantEnabled && options?.tokenVault) {
        const hasVaulted = await options.tokenVault.hasCredential(target);
        if (hasVaulted) {
            try {
                // Safeguard: Capture the currently active account token first
                if (beforeEmail) {
                    await options.tokenVault.saveActiveCredential(beforeEmail).catch(() => false);
                }

                // Apply target account token to OS Credential Manager
                const applied = await options.tokenVault.applyCredential(target);
                if (applied) {
                    // Terminate current agy backend process so host respawns with new credential
                    const processInfo = await detectRunningAgyHub();
                    if (processInfo?.pid) {
                        if (process.platform === "win32") {
                            await execFileAsync("taskkill", [
                                "/PID",
                                String(processInfo.pid),
                                "/T",
                                "/F",
                            ]).catch(() => undefined);
                        } else {
                            try {
                                process.kill(processInfo.pid, "SIGTERM");
                            } catch {
                                // Ignore
                            }
                        }
                    }

                    // Wait for fresh agy instance to start and report new account
                    const afterSwap = await waitForCurrentAccount(16, 1200);
                    const afterSwapEmail = normalizeEmail(afterSwap.email);

                    if (afterSwapEmail === target) {
                        return {
                            targetEmail: target,
                            beforeEmail,
                            afterEmail: afterSwapEmail,
                            changed: true,
                            verified: true,
                            swappedInstantly: true,
                        };
                    }
                }
            } catch {
                // Fall back to standard browser OAuth flow if instant swap encountered an issue
            }
        }
    }

    // 2. Standard Fallback: Browser-based OAuth login
    let reauthError: unknown;

    try {
        await reauthenticateAntigravity();
    } catch (error) {
        reauthError = error;
    }

    let after: AntigravityCurrentAccount;

    try {
        after =
            await waitForCurrentAccount();
    } catch (verificationError) {
        const verificationMessage =
            verificationError instanceof Error
                ? verificationError.message
                : String(verificationError);

        throw new Error(
            `Unable to verify the Antigravity account after authentication: ${verificationMessage}`,
        );
    }

    const afterEmail =
        normalizeEmail(after.email);

    if (afterEmail !== target) {
        if (afterEmail === beforeEmail) {
            throw new Error(
                `Account switch was not completed. Antigravity is still signed in as ${after.email}.`,
            );
        }

        throw new Error(
            `A different Google account became active. ` +
            `Expected ${targetEmail}, but Antigravity is signed in as ${after.email}.`,
        );
    }

    // Automatically capture newly authenticated account into vault for future instant switches
    if (options?.tokenVault?.isSupported()) {
        await options.tokenVault.saveActiveCredential(afterEmail).catch(() => false);
    }

    void reauthError;

    return {
        targetEmail:
            target,

        beforeEmail,

        afterEmail,

        changed:
            beforeEmail !== afterEmail,

        verified:
            true,

        swappedInstantly:
            false,
    };
}

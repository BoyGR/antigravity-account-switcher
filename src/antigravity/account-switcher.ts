import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
    AntigravityCurrentAccount,
    getAntigravityCurrentAccount,
    invalidateBackendSessionCache,
    reauthenticateAntigravity,
} from "./hub-auth-client";
import { detectRunningAgyHub } from "./hub-detector";
import { findManagedAccount } from "./account-registry";
import { IdeStateService } from "./ide-state-service";
import { OAuthService } from "./oauth-service";
import { TokenVaultService } from "./token-vault-service";
import { syncAntigravityUi } from "./ui-sync";

const execFileAsync = promisify(execFile);

export interface AntigravitySwitchResult {
    targetEmail: string;
    beforeEmail: string;
    afterEmail: string;
    changed: boolean;
    verified: boolean;
    swappedInstantly?: boolean;
    requiresReload?: boolean;
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
    cancellationToken?: vscode.CancellationToken;
    extensionContext?: vscode.ExtensionContext;
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export async function waitForAccountCondition(
    predicate: (account: AntigravityCurrentAccount) => boolean,
    attempts = 45,
    delayMs = 1000,
    onRetry?: (attempt: number) => Promise<void> | void,
    cancellationToken?: vscode.CancellationToken,
): Promise<AntigravityCurrentAccount> {
    let lastAccount: AntigravityCurrentAccount | undefined;
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        if (cancellationToken?.isCancellationRequested) {
            break;
        }

        try {
            const current = await getAntigravityCurrentAccount();
            lastAccount = current;
            if (predicate(current)) {
                return current;
            }
        } catch (error) {
            lastError = error;
        }

        if (onRetry) {
            try {
                await onRetry(attempt);
            } catch {
                // Ignore retry hook error
            }
        }

        if (attempt < attempts && !cancellationToken?.isCancellationRequested) {
            await delay(delayMs);
        }
    }

    if (lastAccount) {
        return lastAccount;
    }

    const message =
        lastError instanceof Error
            ? lastError.message
            : String(lastError);

    throw new Error(
        `Unable to verify the active Antigravity account: ${message}`,
    );
}

async function waitForCurrentAccount(
    attempts = 16,
    delayMs = 1200,
    onRetry?: (attempt: number) => Promise<void> | void,
): Promise<AntigravityCurrentAccount> {
    return await waitForAccountCondition(() => true, attempts, delayMs, onRetry);
}

export async function reauthenticateAndDetectAccount(
    options?: SwitchAccountOptions,
): Promise<AntigravityAccountChangeResult> {
    let before: AntigravityCurrentAccount = { email: "" };
    let beforeEmail = "";
    try {
        before = await getAntigravityCurrentAccount();
        beforeEmail = normalizeEmail(before.email);
    } catch {
        // Safe fallback if not signed in yet or initial query timed out
    }

    let reauthError: unknown;

    try {
        await reauthenticateAntigravity();
    } catch (error) {
        reauthError = error;
    }

    let after: AntigravityCurrentAccount;

    try {
        // Wait for user to complete OAuth in the browser (up to 45 seconds).
        // Returns immediately once a different or new valid account is detected.
        after = await waitForAccountCondition(
            account => {
                const currentEmail = normalizeEmail(account.email);
                if (!beforeEmail) {
                    return Boolean(currentEmail);
                }
                return Boolean(currentEmail) && currentEmail !== beforeEmail;
            },
            45,
            1000,
            undefined,
            options?.cancellationToken,
        );
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
        await options.tokenVault
            .saveActiveCredential(after.email, options?.extensionContext)
            .catch(() => false);
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

    // Invalidate cached backend session so post-switch detection
    // picks up the new credential state immediately.
    invalidateBackendSessionCache();

    let beforeEmail = "";
    try {
        const before = await getAntigravityCurrentAccount();
        beforeEmail = normalizeEmail(before.email);
    } catch {
        // If current account query times out or fails, proceed with the switch
    }

    if (beforeEmail && beforeEmail === target) {
        if (options?.tokenVault?.isSupported()) {
            await options.tokenVault
                .saveActiveCredential(target, options?.extensionContext)
                .catch(() => false);
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
        const hasVaulted = await options.tokenVault.hasCredential(target).catch(() => false);
        if (hasVaulted) {
            // Safeguard: Capture the currently active account token first
            if (beforeEmail) {
                await options.tokenVault
                    .saveActiveCredential(beforeEmail, options?.extensionContext)
                    .catch(() => false);
            }

            // A. If running in Antigravity IDE, perform state.vscdb injection + detached restart
            if (IdeStateService.isAntigravityIde() && options?.extensionContext) {
                const ideTarget = await options.tokenVault.getIdeState(target);
                if (ideTarget?.oauthToken && ideTarget?.userStatus) {
                    // Update OS Credential Manager as well for consistency with CLI / external tools
                    await options.tokenVault.applyCredential(target).catch(() => false);

                    const confirm = await vscode.window.showInformationMessage(
                        `Switch Antigravity IDE to ${target}? The editor window will briefly restart to apply the account.`,
                        { modal: true },
                        "Switch & Restart",
                    );

                    if (confirm !== "Switch & Restart") {
                        return {
                            targetEmail: target,
                            beforeEmail,
                            afterEmail: beforeEmail,
                            changed: false,
                            verified: false,
                            swappedInstantly: false,
                        };
                    }

                    const targetPic =
                        (await options.tokenVault.getAccountPicture(target).catch(() => undefined)) ||
                        (options.extensionContext ? findManagedAccount(options.extensionContext, target)?.profilePictureUrl : undefined);

                    await IdeStateService.performIdeAccountSwitch(
                        options.extensionContext,
                        {
                            email: target,
                            oauthToken: ideTarget.oauthToken,
                            userStatus: ideTarget.userStatus,
                            profileUrl: targetPic,
                        },
                    );

                    return {
                        targetEmail: target,
                        beforeEmail,
                        afterEmail: target,
                        changed: true,
                        verified: true,
                        swappedInstantly: true,
                    };
                }
            }

            // B. Standard VS Code flow: Apply target account token to OS Credential Manager (gemini:antigravity)
            const applied = await options.tokenVault.applyCredential(target);
            if (!applied) {
                throw new Error(
                    `Failed to apply vaulted credential for ${target} to OS Credential Manager.`
                );
            }

            // Signal authentication refresh to host editor if command exists
            try {
                const commands = await vscode.commands.getCommands(true);
                if (commands.includes("antigravity.handleAuthRefresh")) {
                    await vscode.commands.executeCommand("antigravity.handleAuthRefresh");
                }
            } catch {
                // Ignore
            }

            // In standard VS Code, terminate backend process so official extension respawns it with new credential
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

            // Brief wait for process termination
            await delay(800);

            // Signal official Antigravity extension to immediately respawn agy process if supported
            await syncAntigravityUi().catch(() => undefined);

            // Quick live check to see if agy auto-restarted
            try {
                const afterSwap = await waitForCurrentAccount(2, 1000);
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
            } catch {
                // Not restarted live within quick check; requires reload in VS Code
            }

            // In standard VS Code, the official extension spawns agy.exe on startup.
            // With target credentials safely applied to gemini:antigravity, window reload completes activation.
            return {
                targetEmail: target,
                beforeEmail,
                afterEmail: target,
                changed: true,
                verified: true,
                swappedInstantly: true,
                requiresReload: true,
            };
        }
    }

    // 2. Antigravity IDE fallback: Run direct Google OAuth flow
    if (IdeStateService.isAntigravityIde()) {
        const oauthResult = await OAuthService.login({
            cancellationToken: options?.cancellationToken,
        });

        const loggedInEmail = normalizeEmail(oauthResult.profile.email);
        if (loggedInEmail !== target) {
            throw new Error(
                `Expected to switch to ${targetEmail}, but signed in to Google as ${oauthResult.profile.email}.`,
            );
        }

        if (options?.tokenVault?.isSupported()) {
            await options.tokenVault.saveAccountOAuthTokens(
                target,
                {
                    accessToken: oauthResult.tokens.accessToken,
                    refreshToken: oauthResult.tokens.refreshToken,
                    expiresIn: oauthResult.tokens.expiresIn,
                    idToken: oauthResult.tokens.idToken,
                },
                oauthResult.profile.picture,
                options?.extensionContext,
            );
        }

        if (options?.extensionContext) {
            const ideTarget = options.tokenVault
                ? await options.tokenVault.getIdeState(target)
                : null;

            if (ideTarget?.oauthToken && ideTarget?.userStatus) {
                await options.tokenVault?.applyCredential(target).catch(() => false);
                await IdeStateService.performIdeAccountSwitch(options.extensionContext, {
                    email: target,
                    oauthToken: ideTarget.oauthToken,
                    userStatus: ideTarget.userStatus,
                    profileUrl: oauthResult.profile.picture,
                });
            }
        }

        return {
            targetEmail: target,
            beforeEmail,
            afterEmail: target,
            changed: true,
            verified: true,
            swappedInstantly: false,
        };
    }

    // 3. Standard VS Code Fallback: Editor-based OAuth login
    let reauthError: unknown;

    try {
        await reauthenticateAntigravity();
    } catch (error) {
        reauthError = error;
    }

    let after: AntigravityCurrentAccount;

    try {
        // Wait for user to complete OAuth in the browser (up to 45 seconds)
        after = await waitForAccountCondition(
            account => {
                const email = normalizeEmail(account.email);
                return email === target || (Boolean(beforeEmail) && email !== beforeEmail);
            },
            45,
            1000,
            undefined,
            options?.cancellationToken,
        );
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
                `Account switch was not completed. Timed out waiting for browser sign-in for ${targetEmail}. Antigravity is still signed in as ${after.email}.`,
            );
        }

        throw new Error(
            `A different Google account became active. ` +
            `Expected ${targetEmail}, but Antigravity is signed in as ${after.email}.`,
        );
    }

    // Automatically capture newly authenticated account into vault for future instant switches
    if (options?.tokenVault?.isSupported()) {
        await options.tokenVault
            .saveActiveCredential(afterEmail, options?.extensionContext)
            .catch(() => false);
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

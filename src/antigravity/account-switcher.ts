import {
    AntigravityCurrentAccount,
    getAntigravityCurrentAccount,
    reauthenticateAntigravity,
} from "./hub-auth-client";

export interface AntigravitySwitchResult {
    targetEmail: string;
    beforeEmail: string;
    afterEmail: string;
    changed: boolean;
    verified: boolean;
}

export interface AntigravityAccountChangeResult {
    before: AntigravityCurrentAccount;
    after: AntigravityCurrentAccount;
    changed: boolean;
    reauthWarning?: string;
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
    attempts = 12,
    delayMs = 1500,
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

export async function reauthenticateAndDetectAccount():
    Promise<AntigravityAccountChangeResult> {
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
        };
    }

    let reauthError: unknown;

    try {
        await reauthenticateAntigravity();
    } catch (error) {
        /*
         * Interactive Login can succeed in the browser even when
         * the Connect request reports a timeout/transport error.
         *
         * GetUserStatus remains the authoritative verification.
         */
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

    /*
     * Do not fail merely because Login transport reported an error
     * if GetUserStatus already proved the target account is active.
     */
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
    };
}

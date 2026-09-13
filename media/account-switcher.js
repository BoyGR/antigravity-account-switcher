(() => {
    const vscode =
        acquireVsCodeApi();

    const app =
        document.getElementById("app");

    if (!app) {
        return;
    }

    const persisted =
        vscode.getState() || {};

    let state = {
        loading: true,
        current: null,
        accounts: [],
        runtime: null,
        usage: null,
        usageSnapshots: {},
        usageError: null,
        error: null,
        preferences: {
            version: 1,
            theme: "vscode",
            language: "auto",
            effectiveLanguage: "en",
            showCurrent: true,
            showSaved: true,
            showRuntime: true,
            autoRefreshIntervalMinutes: 5,
            enableLowQuotaReminder: true,
            lowQuotaThresholdPercent: 20,
        },

        meta: {
            version: "0.4.0",
            developer: "BoyGR",
            website: "https://boygr.com",
            iconUri: "",
        },
    };

    let ui = {
        search:
            typeof persisted.search === "string"
                ? persisted.search
                : "",

        currentCollapsed:
            Boolean(
                persisted.currentCollapsed
            ),

        savedCollapsed:
            Boolean(
                persisted.savedCollapsed
            ),

        runtimeCollapsed:
            persisted.runtimeCollapsed !== false,

        usageCollapsed:
            Boolean(
                persisted.usageCollapsed
            ),

        settingsOpen:
            false,

        settingsDraft:
            null,

        editingEmail:
            null,

        editValue:
            "",

        removeCandidate:
            null,

        runtimeModalOpen:
            false,
    };

    let operation =
        null;

    let feedback =
        null;

    let feedbackTimer =
        null;

    const translations = {
        en: {
            appName:
                "Antigravity Account Switcher",
            accountManager:
                "Google account manager",

            settings:
                "Settings",

            currentAccount:
                "Current account",

            savedAccounts:
                "Saved accounts",

            antigravityStatus:
                "Antigravity status",

            refresh:
                "Refresh",

            connected:
                "Connected",

            active:
                "Active",

            switch:
                "Switch",

            reauth:
                "Re-auth",

            signout:
                "Sign out",

            addGoogleAccount:
                "Add Google Account",

            addGoogleAccountHint:
                "Sign in or switch account",

            saveCurrentAccount:
                "Save Current Account",

            unavailable:
                "Antigravity account unavailable",

            waiting:
                "Waiting for Antigravity...",

            checking:
                "Checking…",

            loadingAccount:
                "Loading account…",

            checkingAccount:
                "Checking Antigravity account state…",

            checkingExtension:
                "Checking extension status…",

            checkingBackend:
                "Checking backend status…",

            checkingHub:
                "Checking hub connection…",

            noSaved:
                "No saved accounts",

            noSavedHint:
                "Save the current Antigravity account or add another Google account.",

            noMatches:
                "No matching accounts",

            noMatchesHint:
                "Try another label, display name, or email.",

            searchPlaceholder:
                "Search accounts",

            editLabel:
                "Edit label",

            save:
                "Save",

            cancel:
                "Cancel",

            removeLabel:
                "Clear label",

            accountActions:
                "Account actions",

            appearance:
                "Appearance",

            theme:
                "Theme",

            language:
                "Language",

            layout:
                "Layout",

            followVsCode:
                "Follow VS Code",

            light:
                "Light",

            dark:
                "Dark",

            system:
                "System",

            automatic:
                "Auto",

            english:
                "English",

            indonesian:
                "Bahasa Indonesia",

            showCurrent:
                "Show current account",

            showSaved:
                "Show saved accounts",

            showRuntime:
                "Show Antigravity status",

            quotaAndReminders:
                "Quota & Reminders",

            autoRefreshQuota:
                "Auto-refresh quota",

            autoRefreshOff:
                "Off (Manual only)",

            every1Minute:
                "Every 1 minute",

            every5Minutes:
                "Every 5 minutes (Recommended)",

            every15Minutes:
                "Every 15 minutes",

            every30Minutes:
                "Every 30 minutes",

            every1Hour:
                "Every 1 hour",

            lowQuotaReminder:
                "Low quota notification",

            reminderThreshold:
                "Warning threshold",

            percentRemaining:
                "% remaining",

            settingsHint:
                "Changes apply only after Save.",

            googleExtension:
                "Google Extension",

            officialExtension:
                "Official Antigravity extension",

            agyBackend:
                "AGY Backend",

            localBackend:
                "Local Antigravity backend",

            hub:
                "Hub",

            localHub:
                "Local Hub",

            hubConnection:
                "Antigravity hub connection",

            running:
                "Running",

            stopped:
                "Stopped",

            ready:
                "Ready",

            disconnected:
                "Unavailable",

            version:
                "Version",

            refreshing:
                "Refreshing account state...",

            adding:
                "Opening Google account flow...",

            saving:
                "Saving current account...",

            reauthenticating:
                "Re-authenticating...",

            signingOut:
                "Signing out...",

            switching:
                "Switching account...",

            updatingLabel:
                "Updating account label...",

            savingSettings:
                "Saving settings...",

            stateUpdated:
                "Account state updated.",

            labelUpdated:
                "Account label updated.",

            settingsSaved:
                "Settings saved.",

            collapse:
                "Collapse section",

            expand:
                "Expand section",

            currentAccountLabel:
                "Current account",

            developedBy:
                "Developed by",

            about:
                "About",

            developer:
                "Developer",

            website:
                "Website",

            removeSavedAccount:
                "Remove saved account",

            removeSavedQuestion:
                "Remove saved account?",

            removeSavedExplanation:
                "This only removes local Account Switcher metadata. It does not sign you out, delete your Google account, or remove Google credentials.",

            remove:
                "Remove",

            accountRemoved:
                "Saved account removed.",

            usage:
                "Usage",

            weeklyLimit:
                "Weekly limit",

            fiveHourLimit:
                "5-hour limit",

            weeklyShort:
                "Weekly",

            fiveHourShort:
                "5h",

            updated:
                "Updated",

            models:
                "models",

            remaining:
                "remaining",

            resetsIn:
                "Resets in",

            resetDue:
                "Reset due",

            lastUpdated:
                "Last updated",

            quotaSnapshot:
                "Quota snapshot",

            showAllModels:
                "Show all models",

            showLess:
                "Show less",

            justNow:
                "just now",

            ago:
                "ago",

            quotaUnavailable:
                "Usage unavailable",

            quotaUnavailableHint:
                "Antigravity did not return current quota information.",
        },

        id: {
            appName:
                "Antigravity Account Switcher",
            accountManager:
                "Pengelola akun Google",

            settings:
                "Pengaturan",

            currentAccount:
                "Akun saat ini",

            savedAccounts:
                "Akun tersimpan",

            antigravityStatus:
                "Status Antigravity",

            refresh:
                "Segarkan",

            connected:
                "Terhubung",

            active:
                "Aktif",

            switch:
                "Ganti",

            reauth:
                "Autentikasi ulang",

            signout:
                "Keluar",

            addGoogleAccount:
                "Tambah Akun Google",

            addGoogleAccountHint:
                "Masuk atau ganti akun",

            saveCurrentAccount:
                "Simpan Akun Saat Ini",

            unavailable:
                "Akun Antigravity tidak tersedia",

            waiting:
                "Menunggu Antigravity...",

            checking:
                "Memeriksa…",

            loadingAccount:
                "Memuat akun…",

            checkingAccount:
                "Memeriksa status akun Antigravity…",

            checkingExtension:
                "Memeriksa status ekstensi…",

            checkingBackend:
                "Memeriksa status backend…",

            checkingHub:
                "Memeriksa koneksi hub…",

            noSaved:
                "Belum ada akun tersimpan",

            noSavedHint:
                "Simpan akun Antigravity saat ini atau tambahkan akun Google lain.",

            noMatches:
                "Tidak ada akun yang cocok",

            noMatchesHint:
                "Coba label, nama, atau email lainnya.",

            searchPlaceholder:
                "Cari akun",

            editLabel:
                "Edit label",

            save:
                "Simpan",

            cancel:
                "Batal",

            removeLabel:
                "Hapus label",

            accountActions:
                "Tindakan akun",

            appearance:
                "Tampilan",

            theme:
                "Tema",

            language:
                "Bahasa",

            layout:
                "Tata letak",

            followVsCode:
                "Ikuti VS Code",

            light:
                "Terang",

            dark:
                "Gelap",

            system:
                "Sistem",

            automatic:
                "Otomatis",

            english:
                "English",

            indonesian:
                "Bahasa Indonesia",

            showCurrent:
                "Tampilkan akun saat ini",

            showSaved:
                "Tampilkan akun tersimpan",

            showRuntime:
                "Tampilkan status Antigravity",

            quotaAndReminders:
                "Kuota & Pengingat",

            autoRefreshQuota:
                "Auto-refresh kuota",

            autoRefreshOff:
                "Nonaktif (Hanya manual)",

            every1Minute:
                "Setiap 1 menit",

            every5Minutes:
                "Setiap 5 menit (Disarankan)",

            every15Minutes:
                "Setiap 15 menit",

            every30Minutes:
                "Setiap 30 menit",

            every1Hour:
                "Setiap 1 jam",

            lowQuotaReminder:
                "Pemberitahuan kuota menipis",

            reminderThreshold:
                "Batas peringatan",

            percentRemaining:
                "% tersisa",

            settingsHint:
                "Perubahan baru diterapkan setelah Simpan.",

            googleExtension:
                "Ekstensi Google",

            officialExtension:
                "Ekstensi resmi Antigravity",

            agyBackend:
                "Backend AGY",

            localBackend:
                "Backend lokal Antigravity",

            hub:
                "Hub",

            localHub:
                "Hub Lokal",

            hubConnection:
                "Koneksi hub Antigravity",

            running:
                "Berjalan",

            stopped:
                "Berhenti",

            ready:
                "Siap",

            disconnected:
                "Tidak tersedia",

            version:
                "Versi",

            refreshing:
                "Menyegarkan status akun...",

            adding:
                "Membuka alur akun Google...",

            saving:
                "Menyimpan akun saat ini...",

            reauthenticating:
                "Melakukan autentikasi ulang...",

            signingOut:
                "Keluar dari akun...",

            switching:
                "Mengganti akun...",

            updatingLabel:
                "Memperbarui label akun...",

            savingSettings:
                "Menyimpan pengaturan...",

            stateUpdated:
                "Status akun diperbarui.",

            labelUpdated:
                "Label akun diperbarui.",

            settingsSaved:
                "Pengaturan disimpan.",

            collapse:
                "Ciutkan bagian",

            expand:
                "Buka bagian",

            currentAccountLabel:
                "Akun saat ini",

            developedBy:
                "Dikembangkan oleh",

            about:
                "Tentang",

            developer:
                "Developer",

            website:
                "Situs",

            removeSavedAccount:
                "Hapus akun tersimpan",

            removeSavedQuestion:
                "Hapus akun tersimpan?",

            removeSavedExplanation:
                "Ini hanya menghapus metadata lokal Account Switcher. Tindakan ini tidak mengeluarkan akun, menghapus akun Google, atau menghapus kredensial Google.",

            remove:
                "Hapus",

            accountRemoved:
                "Akun tersimpan dihapus.",

            usage:
                "Penggunaan",

            weeklyLimit:
                "Batas mingguan",

            fiveHourLimit:
                "Batas 5 jam",

            weeklyShort:
                "Mingguan",

            fiveHourShort:
                "5j",

            updated:
                "Diperbarui",

            models:
                "model",

            remaining:
                "tersisa",

            resetsIn:
                "Reset dalam",

            resetDue:
                "Waktunya reset",

            lastUpdated:
                "Terakhir diperbarui",

            quotaSnapshot:
                "Snapshot kuota",

            showAllModels:
                "Tampilkan semua model",

            showLess:
                "Tampilkan lebih sedikit",

            justNow:
                "baru saja",

            ago:
                "yang lalu",

            quotaUnavailable:
                "Penggunaan tidak tersedia",

            quotaUnavailableHint:
                "Antigravity tidak mengembalikan informasi kuota saat ini.",
        },
    };

    function language() {
        return state.preferences
            ?.effectiveLanguage === "id"
            ? "id"
            : "en";
    }

    function t(key) {
        return (
            translations[language()]?.[key] ??
            translations.en[key] ??
            key
        );
    }

    function escapeHtml(value) {
        return String(
            value ?? ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );
    }

    function icon(
        name,
        className = "ui-icon"
    ) {
        const common =
            `class="${escapeHtml(className)}" viewBox="0 0 16 16" fill="none" aria-hidden="true"`;

        const icons = {
            refresh: `
                <svg ${common}>
                    <path
                        d="M13 4.5V1.8M13 1.8h-2.7M13 1.8A6 6 0 1 0 13.65 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,

            settings: `
                <svg ${common}>
                    <path
                        d="M6.9 1.5h2.2l.35 1.45c.37.14.72.34 1.04.6l1.42-.44 1.1 1.9-1.08 1.02c.03.19.05.38.05.57s-.02.38-.05.57L13 8.19l-1.1 1.9-1.42-.44c-.32.26-.67.46-1.04.6L9.1 11.7H6.9l-.35-1.45a4.8 4.8 0 0 1-1.04-.6l-1.42.44-1.1-1.9 1.08-1.02A3.5 3.5 0 0 1 4.02 6.6c0-.19.02-.38.05-.57L3 5.01l1.1-1.9 1.42.44c.32-.26.67-.46 1.04-.6L6.9 1.5Z"
                        stroke="currentColor"
                        stroke-width="1.1"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="8"
                        cy="6.6"
                        r="1.7"
                        stroke="currentColor"
                        stroke-width="1.1"
                    />
                </svg>
            `,

            search: `
                <svg ${common}>
                    <circle
                        cx="6.8"
                        cy="6.8"
                        r="3.8"
                        stroke="currentColor"
                        stroke-width="1.35"
                    />
                    <path
                        d="m9.7 9.7 3.1 3.1"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,

            edit: `
                <svg ${common}>
                    <path
                        d="M3 11.7 3.5 9l6.9-6.9a1.15 1.15 0 0 1 1.63 0l.87.87a1.15 1.15 0 0 1 0 1.63L6 11.5 3 11.7Z"
                        stroke="currentColor"
                        stroke-width="1.2"
                        stroke-linejoin="round"
                    />
                    <path
                        d="m9.5 3 3 3"
                        stroke="currentColor"
                        stroke-width="1.2"
                    />
                </svg>
            `,

            trash: `
                <svg ${common}>
                    <path
                        d="M4.2 5.2h7.6M6 5.2V3.7h4v1.5M5.1 5.2l.55 7.1h4.7l.55-7.1M6.9 7.1v3.3M9.1 7.1v3.3"
                        stroke="currentColor"
                        stroke-width="1.15"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,

            plus: `
                <svg ${common}>
                    <path
                        d="M8 3.2v9.6M3.2 8h9.6"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,

            check: `
                <svg ${common}>
                    <path
                        d="m3.2 8.2 3 3 6.6-6.6"
                        stroke="currentColor"
                        stroke-width="1.45"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,

            close: `
                <svg ${common}>
                    <path
                        d="m4 4 8 8M12 4l-8 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,

            chevronDown: `
                <svg ${common}>
                    <path
                        d="m4.2 6.2 3.8 3.6 3.8-3.6"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,

            chevronRight: `
                <svg ${common}>
                    <path
                        d="m6.2 4.2 3.6 3.8-3.6 3.8"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,
        };

        return icons[name] || "";
    }
    function normalizeEmail(value) {
        return String(
            value ?? ""
        )
            .trim()
            .toLowerCase();
    }

    function persistUi() {
        vscode.setState({
            search:
                ui.search,

            currentCollapsed:
                ui.currentCollapsed,

            savedCollapsed:
                ui.savedCollapsed,

            runtimeCollapsed:
                ui.runtimeCollapsed,

            usageCollapsed:
                ui.usageCollapsed,

        });
    }
    function setOperation(
        nextOperation
    ) {
        operation =
            nextOperation;

        render();
    }

    function clearOperation() {
        operation =
            null;
    }

    function showFeedback(
        message,
        kind = "info"
    ) {
        feedback = {
            message,
            kind,
        };

        if (feedbackTimer) {
            clearTimeout(
                feedbackTimer
            );
        }

        feedbackTimer =
            setTimeout(
                () => {
                    feedback =
                        null;

                    feedbackTimer =
                        null;

                    render();
                },
                2600
            );

        render();
    }

    function operationLabel() {
        if (!operation) {
            return "";
        }

        const labels = {
            refresh:
                t("refreshing"),

            add:
                t("adding"),

            save:
                t("saving"),

            reauth:
                t("reauthenticating"),

            signout:
                t("signingOut"),

            switch:
                t("switching"),

            label:
                t("updatingLabel"),

            settings:
                t("savingSettings"),

            remove:
                t("removeSavedAccount"),
        };

        return (
            labels[
                operation.type
            ] ||
            "Working..."
        );
    }

    function isBusy() {
        return Boolean(
            operation
        );
    }

    function initials(
        name,
        email
    ) {
        const source =
            String(
                name || ""
            ).trim() ||
            String(
                email || ""
            ).split("@")[0];

        const parts =
            source
                .split(/\s+/)
                .filter(Boolean);

        if (
            parts.length >= 2
        ) {
            return (
                parts[0][0] +
                parts[
                    parts.length - 1
                ][0]
            ).toUpperCase();
        }

        return (
            source
                .slice(0, 2)
                .toUpperCase() ||
            "A"
        );
    }

    function currentManagedAccount() {
        if (!state.current) {
            return null;
        }

        const email =
            normalizeEmail(
                state.current.email
            );

        return (
            state.accounts.find(
                account =>
                    normalizeEmail(
                        account.email
                    ) === email
            ) || null
        );
    }

    function findAccount(email) {
        const normalized =
            normalizeEmail(
                email
            );

        return state.accounts.find(
            account =>
                normalizeEmail(
                    account.email
                ) === normalized
        );
    }

    function accountTitle(
        account
    ) {
        return (
            account.label ||
            account.displayName ||
            account.email
        );
    }

    function filteredAccounts() {
        const query =
            ui.search
                .trim()
                .toLowerCase();

        if (!query) {
            return state.accounts;
        }

        return state.accounts.filter(
            account => {
                const haystack = [
                    account.label,
                    account.displayName,
                    account.email,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return haystack.includes(
                    query
                );
            }
        );
    }

    function applyTheme() {
        const root =
            document.documentElement;

        const preference =
            state.preferences?.theme ||
            "vscode";

        root.removeAttribute(
            "data-ag-theme"
        );

        if (
            preference === "light" ||
            preference === "dark"
        ) {
            root.setAttribute(
                "data-ag-theme",
                preference
            );

            return;
        }

        if (
            preference === "system"
        ) {
            const dark =
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;

            root.setAttribute(
                "data-ag-theme",
                dark
                    ? "dark"
                    : "light"
            );
        }
    }

    function renderFeedback() {
        if (operation) {
            return `
                <div
                    class="toast-host"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <div
                        class="toast operation"
                        role="status"
                    >
                        <span
                            class="spinner"
                            aria-hidden="true"
                        ></span>

                        <span class="toast-message">
                            ${escapeHtml(operationLabel())}
                        </span>
                    </div>
                </div>
            `;
        }

        if (!feedback) {
            return "";
        }

        return `
            <div
                class="toast-host"
                aria-live="polite"
                aria-atomic="true"
            >
                <div
                    class="toast ${escapeHtml(feedback.kind)}"
                    role="status"
                >
                    <span
                        class="toast-symbol"
                        aria-hidden="true"
                    >
                        ${
                            feedback.kind === "error"
                                ? "!"
                                : "✓"
                        }
                    </span>

                    <span class="toast-message">
                        ${escapeHtml(feedback.message)}
                    </span>
                </div>
            </div>
        `;
    }
    function renderSectionHeader(
        title,
        action,
        collapsed,
        right = ""
    ) {
        return `
            <div class="section-header">
                <button
                    type="button"
                    class="section-toggle"
                    data-action="${escapeHtml(action)}"
                    aria-expanded="${collapsed ? "false" : "true"}"
                    title="${escapeHtml(
                        collapsed
                            ? t("expand")
                            : t("collapse")
                    )}"
                >
                    <span
                        class="chevron"
                        aria-hidden="true"
                    >
                        ${
                            collapsed
                                ? icon("chevronRight")
                                : icon("chevronDown")
                        }
                    </span>

                    <span class="section-title">
                        ${escapeHtml(title)}
                    </span>
                </button>

                <div class="section-tools">
                    ${right}
                </div>
            </div>
        `;
    }
    function renderLoading() {
        return `
            <div class="app">


                <section class="section">
                    <div class="loading-line wide"></div>
                    <div class="loading-line"></div>
                    <div class="loading-line short"></div>
                </section>

                <section class="section">
                    <div class="loading-line wide"></div>
                    <div class="loading-line"></div>
                </section>
            </div>
        `;
    }

    function renderLabelEditor(
        account
    ) {
        return `
            <div
                class="label-editor"
                data-editor-email="${escapeHtml(account.email)}"
            >
                <input
                    class="label-input"
                    type="text"
                    value="${escapeHtml(ui.editValue)}"
                    data-role="label-input"
                    data-email="${escapeHtml(account.email)}"
                    maxlength="80"
                    aria-label="${escapeHtml(t("editLabel"))}"
                >

                <button
                    type="button"
                    class="icon-btn compact confirm"
                    data-action="save-label"
                    data-email="${escapeHtml(account.email)}"
                    title="${escapeHtml(t("save"))}"
                    aria-label="${escapeHtml(t("save"))}"
                >
                    ${icon("check")}
                </button>

                <button
                    type="button"
                    class="icon-btn compact"
                    data-action="cancel-label"
                    data-email="${escapeHtml(account.email)}"
                    title="${escapeHtml(t("cancel"))}"
                    aria-label="${escapeHtml(t("cancel"))}"
                >
                    ${icon("close")}
                </button>
            </div>
        `;
    }
    function safeProfilePictureUrl(
        value
    ) {
        if (
            typeof value !==
            "string"
        ) {
            return "";
        }

        try {
            const url =
                new URL(value);

            const hostname =
                url.hostname
                    .toLowerCase();

            if (
                url.protocol !==
                    "https:" ||
                !(
                    hostname ===
                        "googleusercontent.com" ||
                    hostname.endsWith(
                        ".googleusercontent.com"
                    )
                )
            ) {
                return "";
            }

            return url.toString();
        } catch {
            return "";
        }
    }

    function renderAvatar(
        displayName,
        email,
        profilePictureUrl,
        className = ""
    ) {
        const safeUrl =
            safeProfilePictureUrl(
                profilePictureUrl
            );

        const fallback = `
            <span class="avatar-fallback">
                ${
                    escapeHtml(
                        initials(
                            displayName,
                            email
                        )
                    )
                }
            </span>
        `;

        return `
            <div
                class="avatar ${escapeHtml(className)} ${safeUrl ? "has-image" : ""}"
                aria-hidden="true"
            >
                ${fallback}

                ${
                    safeUrl
                        ? `
                            <img
                                class="avatar-image"
                                src="${escapeHtml(safeUrl)}"
                                alt=""
                                referrerpolicy="no-referrer"
                                draggable="false"
                            >
                        `
                        : ""
                }
            </div>
        `;
    }

    function quotaPercent(
        value
    ) {
        if (
            typeof value !==
                "number" ||
            !Number.isFinite(
                value
            )
        ) {
            return null;
        }

        return Math.max(
            0,
            Math.min(
                100,
                value * 100
            )
        );
    }

    function formatPercent(
        value
    ) {
        const percent =
            quotaPercent(
                value
            );

        if (percent === null) {
            return "—";
        }

        const rounded =
            Math.round(
                percent * 100
            ) / 100;

        return (
            Number.isInteger(
                rounded
            )
                ? String(rounded)
                : rounded.toFixed(2)
        ) + "%";
    }

    function formatDuration(
        milliseconds
    ) {
        const totalMinutes =
            Math.max(
                0,
                Math.floor(
                    milliseconds /
                    60000
                )
            );

        if (totalMinutes < 1) {
            return "<1m";
        }

        const days =
            Math.floor(
                totalMinutes /
                1440
            );

        const hours =
            Math.floor(
                (
                    totalMinutes %
                    1440
                ) /
                60
            );

        const minutes =
            totalMinutes %
            60;

        const parts = [];

        if (days > 0) {
            parts.push(
                `${days}d`
            );
        }

        if (hours > 0) {
            parts.push(
                `${hours}h`
            );
        }

        /*
         * For multi-day weekly windows, day + hour is easier
         * to scan. For shorter windows, hour + minute.
         */
        if (
            days === 0 &&
            minutes > 0
        ) {
            parts.push(
                `${minutes}m`
            );
        }

        return (
            parts
                .slice(
                    0,
                    2
                )
                .join(" ") ||
            "<1m"
        );
    }

    function formatResetTime(
        value
    ) {
        if (!value) {
            return "";
        }

        const timestamp =
            new Date(value)
                .getTime();

        if (
            !Number.isFinite(
                timestamp
            )
        ) {
            return "";
        }

        const remaining =
            timestamp -
            Date.now();

        if (remaining <= 0) {
            const d = new Date(value);
            const hours = String(d.getHours()).padStart(2, "0");
            const minutes = String(d.getMinutes()).padStart(2, "0");
            const isToday =
                d.toDateString() === new Date().toDateString();
            const timeStr = isToday
                ? `${hours}:${minutes}`
                : `${d.getDate()}/${d.getMonth() + 1} ${hours}:${minutes}`;
            return `${t("resetDue")} (${timeStr})`;
        }

        return (
            `${t("resetsIn")} ` +
            formatDuration(
                remaining
            )
        );
    }

    function formatRelativeTime(
        value
    ) {
        if (!value) {
            return "";
        }

        const timestamp =
            new Date(value)
                .getTime();

        if (
            !Number.isFinite(
                timestamp
            )
        ) {
            return "";
        }

        const elapsed =
            Math.max(
                0,
                Date.now() -
                timestamp
            );

        if (
            elapsed <
            60000
        ) {
            return t(
                "justNow"
            );
        }

        return (
            `${formatDuration(elapsed)} ` +
            t("ago")
        );
    }

    function quotaWindowLabel(
        bucket
    ) {
        const windowName =
            String(
                bucket?.window || ""
            )
                .trim()
                .toLowerCase();

        if (
            windowName ===
            "weekly"
        ) {
            return t(
                "weeklyLimit"
            );
        }

        if (
            windowName ===
            "5h"
        ) {
            return t(
                "fiveHourLimit"
            );
        }

        /*
         * Future server windows remain forward-compatible.
         */
        return (
            bucket?.displayName ||
            bucket?.window ||
            "Quota"
        );
    }

    function sortQuotaBuckets(
        buckets
    ) {
        const order = {
            weekly: 0,
            "5h": 1,
        };

        return [
            ...(
                Array.isArray(
                    buckets
                )
                    ? buckets
                    : []
            )
        ].sort(
            (
                left,
                right
            ) => {
                const leftWindow =
                    String(
                        left?.window || ""
                    )
                        .toLowerCase();

                const rightWindow =
                    String(
                        right?.window || ""
                    )
                        .toLowerCase();

                return (
                    (
                        order[
                            leftWindow
                        ] ?? 99
                    ) -
                    (
                        order[
                            rightWindow
                        ] ?? 99
                    )
                );
            }
        );
    }

    function renderQuotaBucket(
        bucket
    ) {
        const percent =
            quotaPercent(
                bucket.remainingFraction
            );

        const percentText =
            formatPercent(
                bucket.remainingFraction
            );

        const resetText =
            formatResetTime(
                bucket.resetTime
            );

        const label =
            quotaWindowLabel(
                bucket
            );

        const formattedLabel =
            escapeHtml(label).replace(/\s+/, "<br>");

        return `
            <div
                class="quota-bucket ${bucket.disabled ? "disabled" : ""}"
                data-window="${escapeHtml(bucket.window || "")}"
            >
                <div class="quota-bucket-heading">
                    <span
                        class="quota-window-name"
                        title="${escapeHtml(bucket.description || label)}"
                    >
                        ${formattedLabel}
                    </span>

                    <strong class="quota-percent">
                        ${escapeHtml(percentText)}
                    </strong>
                </div>

                <progress
                    class="quota-progress"
                    max="100"
                    value="${percent === null ? 0 : percent}"
                    aria-label="${escapeHtml(label)}"
                    aria-valuetext="${escapeHtml(`${percentText} ${t("remaining")}`)}"
                ></progress>

                <div class="quota-bucket-meta">
                    ${
                        resetText
                            ? `
                                <span
                                    class="quota-reset"
                                    data-reset-at="${escapeHtml(bucket.resetTime || "")}"
                                >
                                    ${escapeHtml(resetText)}
                                </span>
                            `
                            : ""
                    }
                </div>
            </div>
        `;
    }

    function quotaGroupLabel(
        group
    ) {
        const serverName =
            String(
                group?.displayName ||
                ""
            )
                .trim();

        const normalized =
            serverName
                .toLowerCase();

        if (
            normalized ===
                "gemini models" ||
            normalized ===
                "gemini"
        ) {
            return "Gemini";
        }

        if (
            normalized ===
                "claude and gpt models" ||
            normalized ===
                "claude and gpt"
        ) {
            return "Claude and GPT";
        }

        /*
         * Unknown future server groups retain their official name.
         */
        return (
            serverName ||
            "Quota"
        );
    }

    function quotaGroupLabel(
        group
    ) {
        const serverName =
            String(
                group?.displayName ||
                ""
            )
                .trim();

        const normalized =
            serverName
                .toLowerCase();

        if (
            normalized ===
                "gemini models" ||
            normalized ===
                "gemini"
        ) {
            return "Gemini";
        }

        if (
            normalized ===
                "claude and gpt models" ||
            normalized ===
                "claude and gpt"
        ) {
            return "Claude and GPT";
        }

        return (
            serverName ||
            "Quota"
        );
    }

    function renderUsageGroup(
        group
    ) {
        const buckets =
            sortQuotaBuckets(
                group.buckets
            );

        const label =
            quotaGroupLabel(
                group
            );

        const description =
            String(
                group?.description ||
                ""
            )
                .trim();

        return `
            <div class="quota-group">
                <div class="quota-group-heading">
                    <span
                        class="quota-group-title"
                        title="${escapeHtml(label)}"
                    >
                        ${escapeHtml(label)}
                    </span>

                    ${
                        description
                            ? `
                                <button
                                    type="button"
                                    class="quota-info-button"
                                    title="${escapeHtml(description)}"
                                    aria-label="${escapeHtml(`${label}: ${description}`)}"
                                >
                                    i
                                </button>
                            `
                            : ""
                    }
                </div>

                <div class="quota-buckets">
                    ${
                        buckets
                            .map(
                                renderQuotaBucket
                            )
                            .join("")
                    }
                </div>
            </div>
        `;
    }
    function renderUsage() {
        const usage =
            state.usage;

        const groups =
            Array.isArray(
                usage?.groups
            )
                ? usage.groups
                : [];

        const updated =
            usage?.fetchedAt
                ? formatRelativeTime(
                    usage.fetchedAt
                )
                : "";

        return `
            <div class="usage-section">
                <div class="usage-heading">
                    <span class="usage-title">
                        ${escapeHtml(t("usage"))}
                    </span>

                    ${
                        updated
                            ? `
                                <span
                                    class="usage-updated"
                                    data-usage-fetched-at="${escapeHtml(usage.fetchedAt)}"
                                    title="${escapeHtml(`${t("updated")} ${updated}`)}"
                                >
                                    ${escapeHtml(updated)}
                                </span>
                            `
                            : ""
                    }
                </div>

                ${
                    groups.length > 0
                        ? `
                            <div class="usage-body">
                                ${
                                    groups
                                        .map(
                                            renderUsageGroup
                                        )
                                        .join("")
                                }
                            </div>
                        `
                        : `
                            <div class="usage-empty secondary-text">
                                ${
                                    escapeHtml(
                                        state.usageError ||
                                        t("quotaUnavailable")
                                    )
                                }
                            </div>
                        `
                }
            </div>
        `;
    }
    function bindAvatarFallback() {
        document
            .querySelectorAll(
                ".avatar-image"
            )
            .forEach(
                image => {
                    image.addEventListener(
                        "error",
                        () => {
                            image.hidden =
                                true;

                            image.closest(
                                ".avatar"
                            )?.classList.remove(
                                "has-image"
                            );
                        },
                        {
                            once: true,
                        }
                    );
                }
            );
    }

    function updateUsageTimeLabels() {
        document
            .querySelectorAll(
                "[data-reset-at]"
            )
            .forEach(
                element => {
                    const reset =
                        formatResetTime(
                            element.dataset
                                .resetAt
                        );

                    const prefix =
                        element.dataset
                            .resetPrefix ||
                        "";

                    element.textContent =
                        reset
                            ? prefix + reset
                            : "";
                }
            );

        document
            .querySelectorAll(
                "[data-usage-fetched-at]"
            )
            .forEach(
                element => {
                    element.textContent =
                        formatRelativeTime(
                            element.dataset
                                .usageFetchedAt
                        );
                }
            );

        document
            .querySelectorAll(
                "[data-snapshot-fetched-at]"
            )
            .forEach(
                element => {
                    element.textContent =
                        formatRelativeTime(
                            element.dataset
                                .snapshotFetchedAt
                        );
                }
            );
    }
    function renderCurrent() {
        if (
            !state.preferences
                ?.showCurrent
        ) {
            return "";
        }

        const checking =
            Boolean(
                state.loading
            );

        const header = `
            <div class="section-header current-static-header">
                <div class="section-static-title">
                    <span class="section-title">
                        ${escapeHtml(t("currentAccount"))}
                    </span>
                </div>
            </div>
        `;

        if (!state.current) {
            return `
                <section class="section current-section">
                    ${header}

                    <div
                        class="current-state-panel ${checking ? "checking" : "error"}"
                        role="status"
                        aria-live="polite"
                    >
                        <strong>
                            ${
                                escapeHtml(
                                    checking
                                        ? t("loadingAccount")
                                        : t("unavailable")
                                )
                            }
                        </strong>

                        <div class="secondary-text">
                            ${
                                escapeHtml(
                                    checking
                                        ? t("checkingAccount")
                                        : (
                                            state.error ||
                                            t("waiting")
                                        )
                                )
                            }
                        </div>
                    </div>
                </section>
            `;
        }

        const managed =
            currentManagedAccount();

        const displayName =
            state.current.displayName ||
            managed?.displayName ||
            state.current.email;

        const editing =
            managed &&
            normalizeEmail(
                ui.editingEmail
            ) ===
            normalizeEmail(
                managed.email
            );

        const localLabel =
            managed?.label ||
            t("currentAccountLabel");

        const connectionStatus = `
            <span class="connection-state inline ${checking ? "checking" : ""}">
                <span class="status-dot"></span>

                ${
                    escapeHtml(
                        checking
                            ? t("checking")
                            : t("connected")
                    )
                }
            </span>
        `;

        return `
            <section class="section current-section">
                ${header}

                <div
                    class="current-panel"
                    aria-label="${escapeHtml(t("currentAccount"))}"
                >
                    <div class="identity-row current-identity-row">
                        ${
                            renderAvatar(
                                displayName,
                                state.current.email,
                                state.current.profilePictureUrl,
                                "current-avatar"
                            )
                        }

                        <div class="identity">
                            <div class="identity-heading">
                                <div
                                    class="identity-name current-name"
                                    title="${escapeHtml(displayName)}"
                                >
                                    ${escapeHtml(displayName)}
                                </div>
                            </div>

                            <div
                                class="identity-email"
                                title="${escapeHtml(state.current.email)}"
                            >
                                ${escapeHtml(state.current.email)}
                            </div>

                            ${
                                managed && editing
                                    ? `
                                        <div class="current-label-editor">
                                            ${renderLabelEditor(managed)}
                                        </div>

                                        <div class="current-status-row">
                                            ${connectionStatus}
                                        </div>
                                    `
                                    : `
                                        <div class="current-label-row">
                                            <div class="current-label-edit">
                                                <span class="account-label">
                                                    ${escapeHtml(localLabel)}
                                                </span>

                                                ${
                                                    managed
                                                        ? `
                                                            <button
                                                                type="button"
                                                                class="edit-icon"
                                                                data-action="edit-label"
                                                                data-email="${escapeHtml(managed.email)}"
                                                                title="${escapeHtml(t("editLabel"))}"
                                                                aria-label="${escapeHtml(t("editLabel"))}"
                                                                ${isBusy() ? "disabled" : ""}
                                                            >
                                                                ${icon("edit")}
                                                            </button>
                                                        `
                                                        : ""
                                                }
                                            </div>

                                            ${connectionStatus}
                                        </div>
                                    `
                            }
                        </div>
                    </div>

                    <div class="action-row">
                        <button
                            type="button"
                            class="btn"
                            data-action="reauth"
                            ${
                                checking ||
                                isBusy()
                                    ? "disabled"
                                    : ""
                            }
                        >
                            ${escapeHtml(t("reauth"))}
                        </button>

                        <button
                            type="button"
                            class="btn subtle-danger"
                            data-action="signout"
                            ${
                                checking ||
                                isBusy()
                                    ? "disabled"
                                    : ""
                            }
                        >
                            ${escapeHtml(t("signout"))}
                        </button>
                    </div>

                    ${renderUsage()}
                </div>
            </section>
        `;
    }
    function snapshotGroup(
        snapshot,
        matcher
    ) {
        const groups =
            Array.isArray(
                snapshot?.groups
            )
                ? snapshot.groups
                : [];

        return groups.find(
            group =>
                matcher(
                    String(
                        group.displayName ||
                        ""
                    ).toLowerCase()
                )
        );
    }

    function snapshotBucket(
        group,
        windowName
    ) {
        return (
            Array.isArray(
                group?.buckets
            )
                ? group.buckets
                : []
        ).find(
            bucket =>
                String(
                    bucket.window || ""
                )
                    .toLowerCase() ===
                windowName
        );
    }

    function compactQuotaValue(
        bucket
    ) {
        return formatPercent(
            bucket?.remainingFraction
        );
    }

    function renderSavedFamilyUsage(
        label,
        group
    ) {
        if (!group) {
            return "";
        }

        const weekly =
            snapshotBucket(
                group,
                "weekly"
            );

        const fiveHour =
            snapshotBucket(
                group,
                "5h"
            );

        const weeklyReset =
            formatResetTime(
                weekly?.resetTime
            );

        const fiveHourReset =
            formatResetTime(
                fiveHour?.resetTime
            );

        const renderSavedQuotaPair = (
            quotaLabel,
            bucket,
            resetText,
            resetClass
        ) => {
            return `
                <div class="saved-quota-pair">
                    <div class="saved-usage-metric">
                        <span class="saved-usage-metric-label">
                            ${escapeHtml(quotaLabel)}
                        </span>

                        <span class="saved-usage-metric-value">
                            ${escapeHtml(compactQuotaValue(bucket))}
                        </span>
                    </div>

                    ${
                        resetText
                            ? `
                                <div
                                    class="saved-quota-reset ${escapeHtml(resetClass)}"
                                    data-reset-at="${escapeHtml(bucket?.resetTime || "")}"
                                    data-reset-prefix=""
                                >
                                    ${
                                        escapeHtml(
                                            resetText
                                        )
                                    }
                                </div>
                            `
                            : ""
                    }
                </div>
            `;
        };

        return `
            <div class="saved-usage-family-column">
                <div class="saved-usage-family">
                    ${escapeHtml(label)}
                </div>

                <div class="saved-usage-metrics">
                    ${
                        renderSavedQuotaPair(
                            t("weeklyShort"),
                            weekly,
                            weeklyReset,
                            "saved-weekly-reset"
                        )
                    }

                    ${
                        renderSavedQuotaPair(
                            t("fiveHourShort"),
                            fiveHour,
                            fiveHourReset,
                            "saved-five-hour-reset"
                        )
                    }
                </div>
            </div>
        `;
    }
    function renderSavedUsageSummary(
        snapshot
    ) {
        if (!snapshot) {
            return "";
        }

        const gemini =
            snapshotGroup(
                snapshot,
                name =>
                    name.includes(
                        "gemini"
                    )
            );

        const claudeGpt =
            snapshotGroup(
                snapshot,
                name =>
                    name.includes(
                        "claude"
                    ) ||
                    name.includes(
                        "gpt"
                    )
            );

        if (
            !gemini &&
            !claudeGpt
        ) {
            return "";
        }

        return `
            <div class="saved-usage-summary">
                ${
                    renderSavedFamilyUsage(
                        "Gemini",
                        gemini
                    )
                }

                ${
                    renderSavedFamilyUsage(
                        "Claude + GPT",
                        claudeGpt
                    )
                }
            </div>
        `;
    }
    function renderSavedAccount(
        account
    ) {
        const currentEmail =
            normalizeEmail(
                state.current?.email
            );

        const isActive =
            Boolean(
                currentEmail
            ) &&
            normalizeEmail(
                account.email
            ) === currentEmail;

        const editing =
            normalizeEmail(
                ui.editingEmail
            ) ===
            normalizeEmail(
                account.email
            );

        const checking =
            Boolean(
                state.loading
            );

        const snapshot =
            state.usageSnapshots?.[
                normalizeEmail(
                    account.email
                )
            ];

        const updated =
            snapshot?.fetchedAt
                ? formatRelativeTime(
                    snapshot.fetchedAt
                )
                : "";

        return `
            <article
                class="account-row saved-account-row ${isActive ? "active" : ""}"
                data-email="${escapeHtml(account.email)}"
                ${isActive ? 'aria-current="true"' : ""}
            >
                <div class="saved-account-rail">
                    <div
                        class="avatar small"
                        aria-hidden="true"
                    >
                        ${
                            escapeHtml(
                                initials(
                                    account.displayName ||
                                    account.label,
                                    account.email
                                )
                            )
                        }

                        ${
                            isActive
                                ? `
                                    <span
                                        class="saved-avatar-active-badge"
                                        title="${escapeHtml(t("active"))}"
                                    >
                                        <span aria-hidden="true">✓</span>
                                    </span>
                                `
                                : ""
                        }
                    </div>
                    ${
                        isActive
                            ? `
                                <span
                                    class="saved-rail-badge active-badge"
                                    title="${escapeHtml(t("active"))}"
                                >
                                    ${escapeHtml(t("active"))}
                                </span>
                            `
                            : `
                                <button
                                    type="button"
                                    class="saved-rail-badge switch-badge-btn"
                                    data-action="switch"
                                    data-email="${escapeHtml(account.email)}"
                                    title="${escapeHtml(t("switch"))}"
                                    aria-label="${escapeHtml(t("switch"))}"
                                    ${
                                        checking ||
                                        isBusy()
                                            ? "disabled"
                                            : ""
                                    }
                                >
                                    <span
                                        class="badge-icon"
                                        aria-hidden="true"
                                    >
                                        ⇄
                                    </span>
                                    <span>${escapeHtml(t("switch"))}</span>
                                </button>
                            `
                    }
                </div>
                <div class="identity saved-account-identity">
                    ${
                        editing
                            ? renderLabelEditor(account)
                            : `
                                <div class="saved-title-row">
                                    <div
                                        class="identity-name saved-label"
                                        title="${escapeHtml(accountTitle(account))}"
                                    >
                                        ${escapeHtml(accountTitle(account))}
                                    </div>

                                    <div class="saved-title-actions">

                                        <button
                                            type="button"
                                            class="edit-icon"
                                            data-action="edit-label"
                                            data-email="${escapeHtml(account.email)}"
                                            title="${escapeHtml(t("editLabel"))}"
                                            aria-label="${escapeHtml(t("editLabel"))}"
                                            ${isBusy() ? "disabled" : ""}
                                        >
                                            ${icon("edit")}
                                        </button>

                                        <button
                                            type="button"
                                            class="icon-btn compact delete-account-btn"
                                            data-action="remove-account"
                                            data-email="${escapeHtml(account.email)}"
                                            title="${escapeHtml(t("removeSavedAccount"))}"
                                            aria-label="${escapeHtml(t("removeSavedAccount"))}"
                                            ${isBusy() ? "disabled" : ""}
                                        >
                                            ${icon("trash")}
                                        </button>
                                    </div>
                                </div>

                                <div class="saved-meta-row">
                                    <div
                                        class="identity-email"
                                        title="${escapeHtml(account.email)}"
                                    >
                                        ${escapeHtml(account.email)}
                                    </div>

                                    ${
                                        updated
                                            ? `
                                                <span
                                                    class="saved-updated"
                                                    data-snapshot-fetched-at="${escapeHtml(snapshot.fetchedAt)}"
                                                    title="${escapeHtml(`${t("updated")} ${updated}`)}"
                                                >
                                                    ${escapeHtml(`${t("updated")} ${updated}`)}
                                                </span>
                                            `
                                            : ""
                                    }
                                </div>


                            `
                    }


                </div>

                <div class="saved-account-quota-area">
                    ${renderSavedUsageSummary(snapshot)}
                </div>
            </article>
        `;
    }
    function renderSavedList() {
        const accounts =
            filteredAccounts();

        if (
            state.accounts.length === 0
        ) {
            return `
                <div class="empty-panel">
                    <strong>
                        ${escapeHtml(t("noSaved"))}
                    </strong>

                    <div class="secondary-text">
                        ${escapeHtml(t("noSavedHint"))}
                    </div>
                </div>
            `;
        }

        if (
            accounts.length === 0
        ) {
            return `
                <div class="empty-panel">
                    <strong>
                        ${escapeHtml(t("noMatches"))}
                    </strong>

                    <div class="secondary-text">
                        ${escapeHtml(t("noMatchesHint"))}
                    </div>
                </div>
            `;
        }

        return accounts
            .map(
                renderSavedAccount
            )
            .join("");
    }

    function renderSaved() {
        if (
            !state.preferences
                ?.showSaved ||
            state.loading
        ) {
            return "";
        }

        const filteredCount =
            filteredAccounts().length;

        const hasManyAccounts =
            (state.accounts?.length || 0) > 3;

        const countText =
            ui.search.trim()
                ? `${filteredCount}/${state.accounts.length}`
                : String(
                    state.accounts.length
                );

        const headerActions = `
            <div class="saved-header-actions">
                <span
                    id="account-count"
                    class="count"
                    title="${escapeHtml(t("savedAccounts"))}"
                >
                    ${escapeHtml(countText)}
                </span>

                <button
                    type="button"
                    class="icon-btn compact saved-add-btn"
                    data-action="add"
                    title="${escapeHtml(t("addGoogleAccount"))}"
                    aria-label="${escapeHtml(t("addGoogleAccount"))}"
                    ${isBusy() ? "disabled" : ""}
                >
                    ${icon("plus")}
                </button>
            </div>
        `;

        return `
            <section class="section saved-section">
                ${
                    renderSectionHeader(
                        t("savedAccounts"),
                        "toggle-saved",
                        ui.savedCollapsed,
                        headerActions
                    )
                }

                ${
                    ui.savedCollapsed
                        ? ""
                        : `
                            <div class="saved-body">
                                <div class="saved-controls">
                                    ${
                                        (state.accounts?.length || 0) > 0
                                            ? `
                                                <div class="search-wrap">
                                                    <span
                                                        class="search-icon"
                                                        aria-hidden="true"
                                                    >
                                                        ${icon("search")}
                                                    </span>

                                                    <input
                                                        id="account-search"
                                                        class="search-input"
                                                        type="search"
                                                        value="${escapeHtml(ui.search)}"
                                                        placeholder="${escapeHtml(t("searchPlaceholder"))}"
                                                        autocomplete="off"
                                                        spellcheck="false"
                                                    >
                                                </div>
                                            `
                                            : ""
                                    }

                                    ${
                                        state.current &&
                                        !currentManagedAccount()
                                            ? `
                                                <button
                                                    type="button"
                                                    class="btn block"
                                                    data-action="save"
                                                    ${isBusy() ? "disabled" : ""}
                                                >
                                                    ${escapeHtml(t("saveCurrentAccount"))}
                                                </button>
                                            `
                                            : ""
                                    }
                                </div>

                                <div
                                    id="saved-account-list"
                                    class="account-list"
                                    tabindex="0"
                                >
                                    ${renderSavedList()}
                                </div>
                            </div>
                        `
                }
            </section>
        `;
    }
    function runtimeRow(
        symbol,
        name,
        detail,
        statusKind,
        status
    ) {
        return `
            <div class="runtime-row">
                <div
                    class="runtime-symbol"
                    aria-hidden="true"
                >
                    ${escapeHtml(symbol)}
                </div>

                <div class="runtime-copy">
                    <div class="runtime-name">
                        ${escapeHtml(name)}
                    </div>

                    <div class="runtime-detail">
                        ${escapeHtml(detail)}
                    </div>
                </div>

                <div
                    class="runtime-state ${escapeHtml(statusKind)}"
                >
                    <span class="status-dot"></span>
                    ${escapeHtml(status)}
                </div>
            </div>
        `;
    }
    function renderRuntimeTrigger() {
        if (
            !state.preferences?.showRuntime
        ) {
            return "";
        }

        const checking =
            Boolean(state.loading);

        const runtime =
            state.runtime || {};

        const extension =
            runtime.extension || {};

        const process =
            runtime.process || null;

        const health =
            runtime.health || null;

        const extensionHealthy =
            Boolean(extension.installed);

        const processHealthy =
            Boolean(process);

        const hubHealthy =
            Boolean(health?.reachable);

        const allHealthy =
            extensionHealthy &&
            processHealthy &&
            hubHealthy;

        const summaryKind =
            checking
                ? "checking"
                : (
                    allHealthy
                        ? "healthy"
                        : "warning"
                );

        const summaryText =
            checking
                ? t("checking")
                : (
                    allHealthy
                        ? t("ready")
                        : t("disconnected")
                );

        return `
            <div class="runtime-status-bar">
                <button
                    type="button"
                    class="runtime-status-pill ${escapeHtml(summaryKind)}"
                    data-action="open-runtime-modal"
                    title="${escapeHtml(t("antigravityStatus"))} · ${escapeHtml(summaryText)}"
                    aria-label="${escapeHtml(t("antigravityStatus"))}"
                >
                    <span class="status-dot"></span>
                    <span class="runtime-status-pill-label">Antigravity:</span>
                    <span class="runtime-status-pill-value">${escapeHtml(summaryText)}</span>
                </button>
            </div>
        `;
    }

    function renderRuntimeModal() {
        if (!ui.runtimeModalOpen) {
            return "";
        }

        const checking =
            Boolean(state.loading);

        const runtime =
            state.runtime || {};

        const extension =
            runtime.extension || {};

        const process =
            runtime.process || null;

        const health =
            runtime.health || null;

        const extensionHealthy =
            Boolean(extension.installed);

        const processHealthy =
            Boolean(process);

        const hubHealthy =
            Boolean(health?.reachable);

        const allHealthy =
            extensionHealthy &&
            processHealthy &&
            hubHealthy;

        const summaryKind =
            checking
                ? "checking"
                : (
                    allHealthy
                        ? "healthy"
                        : "warning"
                );

        const summaryText =
            checking
                ? t("checking")
                : (
                    allHealthy
                        ? t("ready")
                        : t("disconnected")
                );

        return `
            <div
                class="runtime-modal-backdrop"
                data-action="runtime-modal-backdrop"
            >
                <section
                    class="runtime-modal-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${escapeHtml(t("antigravityStatus"))}"
                >
                    <header class="runtime-modal-header">
                        <div class="runtime-modal-title">
                            <span class="status-dot ${escapeHtml(summaryKind)}"></span>
                            <h2>${escapeHtml(t("antigravityStatus"))}</h2>
                        </div>

                        <button
                            type="button"
                            class="icon-btn"
                            data-action="close-runtime-modal"
                            aria-label="${escapeHtml(t("cancel") || "Close")}"
                            title="${escapeHtml(t("cancel") || "Close")}"
                        >
                            ${icon("close")}
                        </button>
                    </header>

                    <div class="runtime-modal-body">
                        <div class="runtime-panel">
                            ${
                                runtimeRow(
                                    "G",
                                    t("googleExtension"),
                                    checking
                                        ? t("checkingExtension")
                                        : (
                                            extension.version
                                                ? `${t("version")} ${extension.version}`
                                                : t("officialExtension")
                                        ),
                                    checking
                                        ? "checking"
                                        : (
                                            extensionHealthy
                                                ? "healthy"
                                                : "error"
                                        ),
                                    checking
                                        ? t("checking")
                                        : (
                                            extensionHealthy
                                                ? t("connected")
                                                : t("disconnected")
                                        )
                                )
                            }

                            ${
                                runtimeRow(
                                    "A",
                                    t("agyBackend"),
                                    checking
                                        ? t("checkingBackend")
                                        : (
                                            runtime.agyVersion
                                                ? `${t("version")} ${runtime.agyVersion}`
                                                : t("localBackend")
                                        ),
                                    checking
                                        ? "checking"
                                        : (
                                            processHealthy
                                                ? "healthy"
                                                : "error"
                                        ),
                                    checking
                                        ? t("checking")
                                        : (
                                            processHealthy
                                                ? t("running")
                                                : t("stopped")
                                        )
                                )
                            }

                            ${
                                runtimeRow(
                                    "H",
                                    t("hub"),
                                    checking
                                        ? t("checkingHub")
                                        : (
                                            hubHealthy
                                                ? t("localHub")
                                                : t("hubConnection")
                                        ),
                                    checking
                                        ? "checking"
                                        : (
                                            hubHealthy
                                                ? "healthy"
                                                : "error"
                                        ),
                                    checking
                                        ? t("checking")
                                        : (
                                            hubHealthy
                                                ? t("connected")
                                                : t("disconnected")
                                        )
                                )
                            }
                        </div>
                    </div>
                </section>
            </div>
        `;
    }
        function renderSettings() {
        if (
            !ui.settingsOpen ||
            !ui.settingsDraft
        ) {
            return "";
        }

        const draft =
            ui.settingsDraft;

        return `
            <div
                class="settings-backdrop"
                data-action="settings-backdrop"
            >
                <section
                    class="settings-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${escapeHtml(t("settings"))}"
                >
                    <header class="settings-header">
                        <h2>
                            ${escapeHtml(t("settings"))}
                        </h2>

                        <button
                            type="button"
                            class="icon-btn"
                            data-action="cancel-settings"
                            aria-label="${escapeHtml(t("cancel"))}"
                            title="${escapeHtml(t("cancel"))}"
                        >
                            ×
                        </button>
                    </header>

                    <div class="settings-body">
                        <div class="settings-group">
                            <h3>
                                ${escapeHtml(t("appearance"))}
                            </h3>

                            <label class="field">
                                <span>
                                    ${escapeHtml(t("theme"))}
                                </span>

                                <select
                                    data-setting="theme"
                                >
                                    <option
                                        value="vscode"
                                        ${draft.theme === "vscode" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("followVsCode"))}
                                    </option>

                                    <option
                                        value="light"
                                        ${draft.theme === "light" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("light"))}
                                    </option>

                                    <option
                                        value="dark"
                                        ${draft.theme === "dark" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("dark"))}
                                    </option>

                                    <option
                                        value="system"
                                        ${draft.theme === "system" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("system"))}
                                    </option>
                                </select>
                            </label>

                            <label class="field">
                                <span>
                                    ${escapeHtml(t("language"))}
                                </span>

                                <select
                                    data-setting="language"
                                >
                                    <option
                                        value="auto"
                                        ${draft.language === "auto" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("automatic"))}
                                    </option>

                                    <option
                                        value="en"
                                        ${draft.language === "en" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("english"))}
                                    </option>

                                    <option
                                        value="id"
                                        ${draft.language === "id" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("indonesian"))}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${escapeHtml(t("quotaAndReminders"))}
                            </h3>

                            <label class="field">
                                <span>
                                    ${escapeHtml(t("autoRefreshQuota"))}
                                </span>

                                <select
                                    data-setting="autoRefreshIntervalMinutes"
                                >
                                    <option
                                        value="0"
                                        ${draft.autoRefreshIntervalMinutes === 0 ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("autoRefreshOff"))}
                                    </option>
                                    <option
                                        value="1"
                                        ${draft.autoRefreshIntervalMinutes === 1 ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("every1Minute"))}
                                    </option>
                                    <option
                                        value="5"
                                        ${draft.autoRefreshIntervalMinutes === 5 ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("every5Minutes"))}
                                    </option>
                                    <option
                                        value="15"
                                        ${draft.autoRefreshIntervalMinutes === 15 ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("every15Minutes"))}
                                    </option>
                                    <option
                                        value="30"
                                        ${draft.autoRefreshIntervalMinutes === 30 ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("every30Minutes"))}
                                    </option>
                                    <option
                                        value="60"
                                        ${draft.autoRefreshIntervalMinutes === 60 ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("every1Hour"))}
                                    </option>
                                </select>
                            </label>

                            ${
                                renderCheckbox(
                                    "enableLowQuotaReminder",
                                    t("lowQuotaReminder"),
                                    draft.enableLowQuotaReminder
                                )
                            }

                            ${
                                draft.enableLowQuotaReminder
                                    ? `
                                        <label class="field subfield">
                                            <span>
                                                ${escapeHtml(t("reminderThreshold"))}
                                            </span>

                                            <select
                                                data-setting="lowQuotaThresholdPercent"
                                            >
                                                <option
                                                    value="5"
                                                    ${draft.lowQuotaThresholdPercent === 5 ? "selected" : ""}
                                                >
                                                    5${escapeHtml(t("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="10"
                                                    ${draft.lowQuotaThresholdPercent === 10 ? "selected" : ""}
                                                >
                                                    10${escapeHtml(t("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="15"
                                                    ${draft.lowQuotaThresholdPercent === 15 ? "selected" : ""}
                                                >
                                                    15${escapeHtml(t("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="20"
                                                    ${draft.lowQuotaThresholdPercent === 20 ? "selected" : ""}
                                                >
                                                    20${escapeHtml(t("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="25"
                                                    ${draft.lowQuotaThresholdPercent === 25 ? "selected" : ""}
                                                >
                                                    25${escapeHtml(t("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="30"
                                                    ${draft.lowQuotaThresholdPercent === 30 ? "selected" : ""}
                                                >
                                                    30${escapeHtml(t("percentRemaining"))}
                                                </option>
                                            </select>
                                        </label>
                                    `
                                    : ""
                            }
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${escapeHtml(t("layout"))}
                            </h3>

                            ${
                                renderCheckbox(
                                    "showRuntime",
                                    t("showRuntime"),
                                    draft.showRuntime
                                )
                            }

                            ${
                                renderCheckbox(
                                    "showCurrent",
                                    t("showCurrent"),
                                    draft.showCurrent
                                )
                            }

                            ${
                                renderCheckbox(
                                    "showSaved",
                                    t("showSaved"),
                                    draft.showSaved
                                )
                            }
                        </div>

                        <div class="settings-group about-group">
                            <h3>
                                ${escapeHtml(t("about"))}
                            </h3>

                            <div class="about-row">
                                <span>
                                    Antigravity Account Switcher
                                </span>

                                <span>
                                    v${escapeHtml(state.meta?.version || "0.4.0")}
                                </span>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${escapeHtml(t("developer"))}
                                </span>

                                <strong>
                                    ${escapeHtml(state.meta?.developer || "BoyGR")}
                                </strong>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${escapeHtml(t("website"))}
                                </span>

                                <a
                                    href="${escapeHtml(state.meta?.website || "https://boygr.com")}"
                                    data-external-url="${escapeHtml(state.meta?.website || "https://boygr.com")}"
                                >
                                    boygr.com
                                </a>
                            </div>
                        </div>

                        <div class="settings-note">
                            ${escapeHtml(t("settingsHint"))}
                        </div>
                    </div>

                    <footer class="settings-footer">
                        <button
                            type="button"
                            class="btn"
                            data-action="cancel-settings"
                        >
                            ${escapeHtml(t("cancel"))}
                        </button>

                        <button
                            type="button"
                            class="btn primary"
                            data-action="save-settings"
                            ${isBusy() ? "disabled" : ""}
                        >
                            ${escapeHtml(t("save"))}
                        </button>
                    </footer>
                </section>
            </div>
        `;
    }

    function renderCheckbox(
        key,
        label,
        checked
    ) {
        return `
            <label class="check-row">
                <input
                    type="checkbox"
                    data-setting="${escapeHtml(key)}"
                    ${checked ? "checked" : ""}
                >

                <span>
                    ${escapeHtml(label)}
                </span>
            </label>
        `;
    }

    function renderFooter() {
        const meta =
            state.meta || {};

        const developer =
            meta.developer ||
            "BoyGR";

        const website =
            meta.website ||
            "https://boygr.com";

        const version =
            meta.version ||
            "0.4.0";

        return `
            <footer class="developer-footer">
                <div class="developer-footer-copy">
                    <span class="footer-prefix">${escapeHtml(t("developedBy"))}</span>
                    <a
                        href="${escapeHtml(website)}"
                        data-external-url="${escapeHtml(website)}"
                        title="${escapeHtml(website)}"
                        class="developer-link"
                    >
                        ${escapeHtml(developer)}
                    </a>
                </div>

                <span class="footer-version">
                    v${escapeHtml(version)}
                </span>
            </footer>
        `;
    }
    function renderRemoveDialog() {
        const account =
            ui.removeCandidate;

        if (!account) {
            return "";
        }

        return `
            <div
                class="dialog-backdrop"
                data-action="cancel-remove"
            >
                <section
                    class="confirm-dialog"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="remove-dialog-title"
                    aria-describedby="remove-dialog-description"
                >
                    <header class="confirm-dialog-header">
                        <div
                            class="danger-symbol"
                            aria-hidden="true"
                        >
                            !
                        </div>

                        <div>
                            <h2 id="remove-dialog-title">
                                ${escapeHtml(t("removeSavedQuestion"))}
                            </h2>

                            <div class="confirm-account-name">
                                ${escapeHtml(accountTitle(account))}
                            </div>

                            <div class="confirm-account-email">
                                ${escapeHtml(account.email)}
                            </div>
                        </div>
                    </header>

                    <p
                        id="remove-dialog-description"
                        class="confirm-description"
                    >
                        ${escapeHtml(t("removeSavedExplanation"))}
                    </p>

                    <footer class="confirm-dialog-actions">
                        <button
                            type="button"
                            class="btn"
                            data-action="cancel-remove"
                        >
                            ${escapeHtml(t("cancel"))}
                        </button>

                        <button
                            type="button"
                            class="btn destructive"
                            data-action="confirm-remove"
                        >
                            ${escapeHtml(t("remove"))}
                        </button>
                    </footer>
                </section>
            </div>
        `;
    }
    function render() {
        applyTheme();

        document.documentElement.lang =
            language();

        app.innerHTML = `
            <div
                class="app"
                aria-busy="${
                    state.loading ||
                    isBusy()
                        ? "true"
                        : "false"
                }"
            >
                <div class="content-shell">
                    ${renderFeedback()}
                    ${renderRuntimeTrigger()}
                    ${renderCurrent()}
                    ${renderSaved()}
                </div>

                ${renderFooter()}
            </div>

            ${renderSettings()}
            ${renderRemoveDialog()}
            ${renderRuntimeModal()}
        `;

        bindAvatarFallback();
        updateUsageTimeLabels();

        if (
            ui.editingEmail
        ) {
            window.requestAnimationFrame(
                () => {
                    const input =
                        document.querySelector(
                            '[data-role="label-input"]'
                        );

                    if (input) {
                        input.focus();

                        input.setSelectionRange(
                            input.value.length,
                            input.value.length
                        );
                    }
                }
            );
        }
    }
    function updateSavedListOnly() {
        const list =
            document.getElementById(
                "saved-account-list"
            );

        if (list) {
            list.innerHTML =
                renderSavedList();
        }

        const count =
            document.getElementById(
                "account-count"
            );

        if (count) {
            const filteredCount =
                filteredAccounts().length;

            count.textContent =
                ui.search.trim()
                    ? `${filteredCount}/${state.accounts.length}`
                    : String(
                        state.accounts.length
                    );
        }
    }

    function beginLabelEdit(
        email
    ) {
        const account =
            findAccount(email);

        if (!account) {
            return;
        }

        ui.editingEmail =
            account.email;

        ui.editValue =
            account.label || "";

        render();
    }

    function cancelLabelEdit() {
        ui.editingEmail =
            null;

        ui.editValue =
            "";

        render();
    }

    function saveLabel(
        email
    ) {
        const account =
            findAccount(email);

        if (!account) {
            return;
        }

        setOperation({
            type: "label",
            email:
                account.email,
        });

        vscode.postMessage({
            type: "updateLabel",
            email:
                account.email,
            label:
                ui.editValue,
        });
    }

    function openSettings() {
        const preferences =
            state.preferences || {};

        ui.settingsDraft = {
            theme:
                preferences.theme ||
                "vscode",

            language:
                preferences.language ||
                "auto",

            showCurrent:
                preferences.showCurrent !== false,

            showSaved:
                preferences.showSaved !== false,

            showRuntime:
                preferences.showRuntime !== false,

            autoRefreshIntervalMinutes:
                typeof preferences.autoRefreshIntervalMinutes === "number"
                    ? preferences.autoRefreshIntervalMinutes
                    : 5,

            enableLowQuotaReminder:
                preferences.enableLowQuotaReminder !== false,

            lowQuotaThresholdPercent:
                typeof preferences.lowQuotaThresholdPercent === "number"
                    ? preferences.lowQuotaThresholdPercent
                    : 20,
        };

        ui.settingsOpen =
            true;

        render();
    }

    function cancelSettings() {
        ui.settingsOpen =
            false;

        ui.settingsDraft =
            null;

        render();
    }

    function saveSettings() {
        if (
            !ui.settingsDraft
        ) {
            return;
        }

        setOperation({
            type: "settings",
        });

        vscode.postMessage({
            type: "saveSettings",
            preferences: {
                ...ui.settingsDraft,
            },
        });
    }

    app.addEventListener(
        "input",
        event => {
            const target =
                event.target;

            if (
                target instanceof HTMLInputElement &&
                target.id ===
                    "account-search"
            ) {
                ui.search =
                    target.value;

                persistUi();
                updateSavedListOnly();
                return;
            }

            if (
                target instanceof HTMLInputElement &&
                target.dataset.role ===
                    "label-input"
            ) {
                ui.editValue =
                    target.value;
            }
        }
    );

    app.addEventListener(
        "change",
        event => {
            const target =
                event.target;

            if (
                !ui.settingsDraft ||
                !(
                    target instanceof
                        HTMLInputElement ||
                    target instanceof
                        HTMLSelectElement
                )
            ) {
                return;
            }

            const key =
                target.dataset.setting;

            if (!key) {
                return;
            }

            if (
                target instanceof
                    HTMLInputElement &&
                target.type === "checkbox"
            ) {
                ui.settingsDraft[
                    key
                ] =
                    target.checked;

                if (key === "enableLowQuotaReminder") {
                    render();
                }

                return;
            }

            if (
                key === "autoRefreshIntervalMinutes" ||
                key === "lowQuotaThresholdPercent"
            ) {
                ui.settingsDraft[key] = Number.parseInt(target.value, 10);
                return;
            }

            ui.settingsDraft[
                key
            ] =
                target.value;
        }
    );

    app.addEventListener(
        "click",
        event => {
            const rawTarget =
                event.target;

            if (
                !(
                    rawTarget instanceof
                    Element
                )
            ) {
                return;
            }

            const target =
                rawTarget.closest(
                    "[data-action]"
                );

            if (!target) {
                return;
            }

            const action =
                target.dataset.action;

            const email =
                target.dataset.email;

            if (
                action ===
                    "open-settings"
            ) {
                openSettings();
                return;
            }

            if (
                action ===
                    "cancel-settings"
            ) {
                cancelSettings();
                return;
            }

            if (
                action ===
                    "settings-backdrop" &&
                rawTarget === target
            ) {
                cancelSettings();
                return;
            }

            if (
                action ===
                    "save-settings"
            ) {
                if (!isBusy()) {
                    saveSettings();
                }

                return;
            }

            if (
                action ===
                    "toggle-current"
            ) {
                ui.currentCollapsed =
                    !ui.currentCollapsed;

                persistUi();
                render();
                return;
            }

            if (
                action ===
                    "toggle-saved"
            ) {
                ui.savedCollapsed =
                    !ui.savedCollapsed;

                persistUi();
                render();
                return;
            }

            if (
                action ===
                    "open-runtime-modal"
            ) {
                ui.runtimeModalOpen = true;
                render();
                return;
            }

            if (
                action === "close-runtime-modal" ||
                (action === "runtime-modal-backdrop" && rawTarget === target)
            ) {
                ui.runtimeModalOpen = false;
                render();
                return;
            }



            if (
                action ===
                    "edit-label"
            ) {
                if (!isBusy()) {
                    beginLabelEdit(
                        email
                    );
                }

                return;
            }

            if (
                action ===
                    "cancel-label"
            ) {
                cancelLabelEdit();
                return;
            }

            if (
                action ===
                    "save-label"
            ) {
                if (!isBusy()) {
                    saveLabel(
                        email
                    );
                }

                return;
            }

            if (
                action ===
                    "remove-account"
            ) {
                const account =
                    findAccount(
                        email
                    );

                if (
                    account &&
                    !isBusy()
                ) {
                    ui.removeCandidate =
                        account;

                    render();
                }

                return;
            }

            if (
                action ===
                    "cancel-remove"
            ) {
                ui.removeCandidate =
                    null;

                render();
                return;
            }

            if (
                action ===
                    "confirm-remove"
            ) {
                const account =
                    ui.removeCandidate;

                if (
                    account &&
                    !isBusy()
                ) {
                    setOperation({
                        type: "remove",
                        email:
                            account.email,
                    });

                    vscode.postMessage({
                        type:
                            "removeAccount",

                        email:
                            account.email,
                    });
                }

                return;
            }

            if (isBusy()) {
                return;
            }

            if (
                action ===
                    "switch"
            ) {
                const account =
                    findAccount(
                        email
                    );

                if (account) {
                    setOperation({
                        type: "switch",
                        email:
                            account.email,
                    });

                    vscode.postMessage({
                        type:
                            "switchAccount",
                        account,
                    });
                }

                return;
            }


            const map = {
                add:
                    "addAccount",

                save:
                    "saveCurrent",

                refresh:
                    "refresh",

                reauth:
                    "reauth",

                signout:
                    "signout",
            };

            if (
                map[action]
            ) {
                const operationTypes = {
                    add:
                        "add",

                    save:
                        "save",

                    refresh:
                        "refresh",

                    reauth:
                        "reauth",

                    signout:
                        "signout",
                };

                setOperation({
                    type:
                        operationTypes[
                            action
                        ],
                });

                vscode.postMessage({
                    type:
                        map[action],
                });
            }
        }
    );

    window.addEventListener(
        "keydown",
        event => {
            if (
                event.key ===
                    "Escape"
            ) {
                if (ui.runtimeModalOpen) {
                    ui.runtimeModalOpen = false;
                    render();
                    return;
                }

                if (
                    ui.settingsOpen
                ) {
                    cancelSettings();
                    return;
                }

                if (
                    ui.editingEmail &&
                    !operation
                ) {
                    cancelLabelEdit();
                    return;
                }

                if (
                    feedback &&
                    !operation
                ) {
                    feedback =
                        null;

                    if (
                        feedbackTimer
                    ) {
                        clearTimeout(
                            feedbackTimer
                        );

                        feedbackTimer =
                            null;
                    }

                    render();
                }

                return;
            }

            if (
                event.key ===
                    "Enter" &&
                ui.editingEmail &&
                !operation
            ) {
                const active =
                    document.activeElement;

                if (
                    active instanceof
                        HTMLInputElement &&
                    active.dataset.role ===
                        "label-input"
                ) {
                    event.preventDefault();

                    saveLabel(
                        ui.editingEmail
                    );
                }
            }
        }
    );

    app.addEventListener(
        "click",
        event => {
            const rawTarget =
                event.target;

            if (
                !(
                    rawTarget instanceof
                        Element
                )
            ) {
                return;
            }

            const link =
                rawTarget.closest(
                    "[data-external-url]"
                );

            if (!link) {
                return;
            }

            event.preventDefault();

            const url =
                link.dataset.externalUrl;

            if (url) {
                vscode.postMessage({
                    type:
                        "openExternal",

                    url,
                });
            }
        }
    );

    window.addEventListener(
        "message",
        event => {
            const message =
                event.data;

            if (!message) {
                return;
            }

            if (
                message.type ===
                    "openSettings"
            ) {
                openSettings();
                return;
            }

            if (
                message.type !==
                    "state"
            ) {
                return;
            }

            const previousOperation =
                operation;

            state =
                message.state;

            clearOperation();

            if (
                previousOperation?.type ===
                    "remove"
            ) {
                ui.removeCandidate =
                    null;

                showFeedback(
                    t("accountRemoved"),
                    "success"
                );

                return;
            }

            if (
                previousOperation?.type ===
                    "label"
            ) {
                ui.editingEmail =
                    null;

                ui.editValue =
                    "";

                showFeedback(
                    t("labelUpdated"),
                    "success"
                );

                return;
            }

            if (
                previousOperation?.type ===
                    "settings"
            ) {
                ui.settingsOpen =
                    false;

                ui.settingsDraft =
                    null;

                showFeedback(
                    t("settingsSaved"),
                    "success"
                );

                return;
            }

            if (
                previousOperation &&
                previousOperation.type !==
                    "refresh"
            ) {
                showFeedback(
                    t("stateUpdated"),
                    "success"
                );

                return;
            }

            render();
        }
    );

    window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).addEventListener(
        "change",
        () => {
            if (
                state.preferences
                    ?.theme ===
                "system"
            ) {
                applyTheme();
            }
        }
    );

    window.setInterval(
        () => {
            updateUsageTimeLabels();
        },
        30000
    );

    render();

    vscode.postMessage({
        type: "ready",
    });
})();

/* === M7.3A SAVED QUOTA PROGRESS ENHANCER START === */

/**
 * Enhances Saved Account quota metrics after they are rendered.
 *
 * Presentation only:
 * - reads the already-rendered percentage text
 * - creates a progress bar
 * - creates "<percentage> remaining"
 * - shortens "Resets in ..." to "Reset ..."
 *
 * It does not fetch quota, switch account, access credentials,
 * or alter quota snapshots.
 */
function enhanceSavedQuotaMetrics(root = document) {
    const quotaAreas = root.querySelectorAll(
        ".saved-account-quota-area"
    );

    for (const quotaArea of quotaAreas) {
        const metrics = quotaArea.querySelectorAll(
            [
                ".saved-family-metric",
                ".saved-usage-metric",
                ".saved-quota-metric",
                ".saved-metric-row",
                ".saved-usage-row"
            ].join(",")
        );

        for (const metric of metrics) {
            const main = metric.querySelector(
                ".saved-quota-main"
            );

            const value = metric.querySelector(
                ".saved-quota-value"
            );

            if (!main || !value) {
                continue;
            }

            const rawValue = value.textContent?.trim() ?? "";

            const percentageMatch = rawValue.match(
                /(-?\d+(?:\.\d+)?)\s*%/
            );

            if (!percentageMatch) {
                continue;
            }

            const numericValue = Number(
                percentageMatch[1]
            );

            if (!Number.isFinite(numericValue)) {
                continue;
            }

            const boundedValue = Math.max(
                0,
                Math.min(100, numericValue)
            );

            let progress = metric.querySelector(
                ":scope > .saved-quota-progress"
            );

            if (!progress) {
                progress = document.createElement("div");
                progress.className = "saved-quota-progress";
                progress.setAttribute(
                    "aria-hidden",
                    "true"
                );

                const fill = document.createElement("span");
                fill.className = "saved-quota-progress-fill";

                progress.append(fill);

                main.insertAdjacentElement(
                    "afterend",
                    progress
                );
            }

            progress.style.setProperty(
                "--saved-quota-percent",
                `${boundedValue}%`
            );

            let remaining = metric.querySelector(
                ":scope > .saved-quota-remaining"
            );

            if (!remaining) {
                remaining = document.createElement("div");
                remaining.className = "saved-quota-remaining";

                progress.insertAdjacentElement(
                    "afterend",
                    remaining
                );
            }

            remaining.textContent =
                `${rawValue} remaining`;

            const reset = metric.querySelector(
                [
                    ".saved-quota-reset",
                    ".saved-usage-reset",
                    ".saved-metric-reset"
                ].join(",")
            );

            if (reset) {
                const resetText =
                    reset.textContent?.trim() ?? "";

                reset.textContent = resetText
                    .replace(
                        /^Resets\s+in\s+/i,
                        "Reset "
                    )
                    .replace(
                        /^Reset\s+in\s+/i,
                        "Reset "
                    );
            }
        }
    }
}


/*
 * Saved-account HTML can be refreshed independently, so enhance
 * both the initial DOM and later quota/account rerenders.
 */
let savedQuotaEnhancementQueued = false;

function queueSavedQuotaEnhancement() {
    if (savedQuotaEnhancementQueued) {
        return;
    }

    savedQuotaEnhancementQueued = true;

    queueMicrotask(() => {
        savedQuotaEnhancementQueued = false;
        enhanceSavedQuotaMetrics(document);
    });
}


if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        () => {
            enhanceSavedQuotaMetrics(document);
        },
        { once: true }
    );
}
else {
    enhanceSavedQuotaMetrics(document);
}


const savedQuotaObserver = new MutationObserver(() => {
    queueSavedQuotaEnhancement();
});

savedQuotaObserver.observe(
    document.documentElement,
    {
        childList: true,
        subtree: true
    }
);

/* === M7.3A SAVED QUOTA PROGRESS ENHANCER END === */

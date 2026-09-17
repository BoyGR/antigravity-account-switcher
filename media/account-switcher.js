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
        current: persisted.current || null,
        accounts: Array.isArray(persisted.accounts) ? persisted.accounts : [],
        runtime: persisted.runtime || null,
        usage: persisted.usage || null,
        usageSnapshots: persisted.usageSnapshots || {},
        usageError: null,
        error: null,
        preferences: {
            version: 1,
            theme: "vscode",
            language: "auto",
            effectiveLanguage: "en",
            hideCurrent: false,
            hideSaved: false,
            hideRuntime: false,
            showCurrent: true,
            showSaved: true,
            showRuntime: true,
            showQuotaAnalytics: false,
            autoRefreshIntervalMinutes: 5,
            enableLowQuotaReminder: true,
            lowQuotaThresholdPercent: 20,
            smartQuotaFallback: true,
            autoRoundRobin: false,
            enableQuotaAudio: true,
            enableInstantSwitch: true,
            proxyMode: "system",
            proxyUrl: "",
            proxyStrictSSL: true,
        },

        vaultedEmails: [],

        meta: {
            version: "1.4.0",
            developer: "Boy Gilang Ramadhan",
            website: "https://boygr.com",
            iconUri: "",
        },
    };

    let ui = {
        search:
            typeof persisted.search === "string"
                ? persisted.search
                : "",

        sortBy:
            persisted.sortCustomized && typeof persisted.sortBy === "string"
                ? persisted.sortBy
                : "recent",

        sortCustomized:
            Boolean(persisted.sortCustomized),

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

        editColorTag:
            "",

        editGroup:
            "",

        customGroupInputOpen:
            false,

        customGroupInputValue:
            "",

        groupFilter:
            "all",

        removeCandidate:
            null,

        runtimeModalOpen:
            false,

        quotaMatrixOpen:
            false,

        matrixSearch:
            "",

        matrixSort:
            "quota",
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

            loadingSavedAccounts:
                "Loading saved accounts…",

            updatingQuota:
                "Updating quota…",

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

            sortBy:
                "Sort by",

            sortQuota:
                "Highest quota",

            sortName:
                "Name (A-Z)",

            sortRecent:
                "Recently used",

            clearSearch:
                "Clear search",

            clearFilter:
                "Clear filter",

            activeNow:
                "Active now",

            lastUsed:
                "Last used",

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
                "Follow Editor / IDE Theme",

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

            hideCurrent:
                "Hide current account",

            hideSaved:
                "Hide saved accounts",

            hideRuntime:
                "Hide Antigravity status",

            showQuotaAnalytics:
                "Show 7-day quota analytics",

            switchingAndAutomation:
                "Switching & Automation",

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

            smartQuotaFallback:
                "Smart Quota Fallback (1-click switch)",

            backupAndRestore:
                "Backup & Restore",

            backupDesc:
                "Export saved accounts metadata to JSON or restore them on another machine.",

            exportAccounts:
                "Export Accounts",

            importAccounts:
                "Import Accounts",

            reconnectHub:
                "Reconnect Hub",

            restartBackend:
                "Restart Backend",

            processRecovery:
                "Process Recovery",

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

            quotaRestored:
                "Restored",

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

            quotaHistory:
                "7-Day Quota Analytics",

            searchAccountsPlaceholder:
                "Filter by name, email, or group...",

            highestQuota:
                "Highest Quota",

            earliestReset:
                "Earliest Reset",

            nameAZ:
                "Name (A-Z)",

            noMatchingAccounts:
                "No accounts match your filter.",

            liveData:
                "Live data",

            quotaHistorySub:
                "Daily lowest remaining",

            exportAnalytics:
                "Export Analytics",

            autoRoundRobin:
                "Auto-Round-Robin (Switch on rate limit)",

            enableQuotaAudio:
                "Subtle Audio Alerts (Web Audio)",

            quotaMatrix:
                "Quota Matrix",

            quotaMatrixTitle:
                "Multi-Account Quota Matrix",

            quotaMatrixSub:
                "Real-time quota comparison across all accounts",

            switchNow:
                "Switch",

            noSnapshotYet:
                "No quota data yet",

            instantSwitch:
                "Instant Switch (No Browser)",

            instantSwitchHint:
                "Switch accounts seamlessly using saved session tokens without re-opening your browser.",

            smartQuotaFallbackHint:
                "Show a 1-click prompt to switch to an account with more quota before limits are reached.",

            autoRoundRobinHint:
                "Automatically rotate to the account with the highest quota when rate limits occur.",

            enableQuotaAudioHint:
                "Play gentle synthesized chimes on quota reset or critical alerts.",

            lowQuotaReminderHint:
                "Show a warning notification when remaining quota falls below threshold.",

            hideRuntimeHint:
                "Hide the Antigravity background status indicator from the bottom bar.",

            hideCurrentHint:
                "Hide the current active account panel from the main view.",

            hideSavedHint:
                "Hide the saved accounts list and manager.",

            showQuotaAnalyticsHint:
                "Display the 7-day lowest quota analytics bar chart.",

            instantBadge:
                "Instant",

            vaultTitle:
                "Token Vault",

            purgeVault:
                "Clear Token Vault...",

            vaultInfo:
                "Saved in encrypted Token Vault for 1-click seamless switching",

            plan:
                "Plan",

            accountPlan:
                "Account Plan",

            selectPlan:
                "Select Plan",

            advancedTitle:
                "Advanced",

            proxyMode:
                "Proxy Mode",

            proxyModeSystem:
                "System / VS Code Default",

            proxyModeManual:
                "Manual Custom Proxy",

            proxyModeDirect:
                "Direct (No Proxy)",

            proxyUrl:
                "Proxy Server URL",

            proxyUrlPlaceholder:
                "http://127.0.0.1:7890 or socks5://...",

            proxyStrictSSL:
                "Strict SSL Verification",

            proxyStrictSSLHint:
                "Disable only if using internal self-signed proxy certs.",
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

            loadingSavedAccounts:
                "Memuat akun tersimpan…",

            updatingQuota:
                "Memperbarui kuota…",

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

            sortBy:
                "Urutkan",

            sortQuota:
                "Sisa kuota",

            sortName:
                "Nama (A-Z)",

            sortRecent:
                "Terakhir dipakai",

            clearSearch:
                "Hapus pencarian",

            clearFilter:
                "Hapus filter",

            activeNow:
                "Sedang aktif",

            lastUsed:
                "Terakhir dipakai",

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
                "Ikuti Tema Editor / IDE",

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

            hideCurrent:
                "Sembunyikan akun saat ini",

            hideSaved:
                "Sembunyikan akun tersimpan",

            hideRuntime:
                "Sembunyikan status Antigravity",

            showQuotaAnalytics:
                "Tampilkan analisis kuota 7 hari",

            switchingAndAutomation:
                "Peralihan & Otomatisasi",

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

            smartQuotaFallback:
                "Peralihan Cepat saat Kuota Menipis",

            backupAndRestore:
                "Cadangan & Pemulihan",

            backupDesc:
                "Ekspor metadata akun tersimpan ke JSON atau pulihkan di perangkat lain.",

            exportAccounts:
                "Ekspor Akun",

            importAccounts:
                "Impor Akun",

            reconnectHub:
                "Sambungkan Ulang Hub",

            restartBackend:
                "Mulai Ulang Backend",

            processRecovery:
                "Pemulihan Proses",

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

            quotaRestored:
                "Dipulihkan",

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

            quotaHistory:
                "Analitik Kuota 7 Hari",

            searchAccountsPlaceholder:
                "Cari nama, email, atau grup...",

            highestQuota:
                "Kuota Tertinggi",

            earliestReset:
                "Reset Terdekat",

            nameAZ:
                "Nama (A-Z)",

            noMatchingAccounts:
                "Tidak ada akun yang cocok dengan filter.",

            liveData:
                "Data langsung",

            quotaHistorySub:
                "Sisa terendah harian",

            exportAnalytics:
                "Ekspor Analitik",

            autoRoundRobin:
                "Auto-Round-Robin (Ganti saat kuota habis)",

            enableQuotaAudio:
                "Notifikasi Suara Lembut (Web Audio)",

            quotaMatrix:
                "Matriks Kuota",

            quotaMatrixTitle:
                "Matriks Kuota Multi-Akun",

            quotaMatrixSub:
                "Perbandingan sisa kuota semua akun secara real-time",

            switchNow:
                "Ganti",

            noSnapshotYet:
                "Belum ada data kuota",

            instantSwitch:
                "Switch Instan (Tanpa Browser)",

            instantSwitchHint:
                "Beralih akun seketika menggunakan token sesi tersimpan tanpa membuka browser.",

            smartQuotaFallbackHint:
                "Tampilkan prompt 1-klik untuk beralih ke akun berkuota lebih banyak sebelum habis.",

            autoRoundRobinHint:
                "Otomatis rotasi ke akun dengan kuota tertinggi saat terkena rate limit (tanpa klik).",

            enableQuotaAudioHint:
                "Bunyikan nada audio lembut saat kuota reset atau mencapai batas kritis.",

            lowQuotaReminderHint:
                "Tampilkan notifikasi peringatan saat sisa kuota akun berada di bawah batas.",

            hideRuntimeHint:
                "Sembunyikan status runtime Antigravity dari bilah bawah.",

            hideCurrentHint:
                "Sembunyikan panel akun yang sedang aktif dari tampilan utama.",

            hideSavedHint:
                "Sembunyikan daftar dan pengelola akun tersimpan.",

            showQuotaAnalyticsHint:
                "Tampilkan grafik analitik dan riwayat kuota 7 hari terakhir.",

            instantBadge:
                "Instan",

            vaultTitle:
                "Brankas Token",

            purgeVault:
                "Bersihkan Brankas Token...",

            vaultInfo:
                "Tersimpan di Brankas Token terenkripsi untuk pergantian 1-klik tanpa login browser",

            plan:
                "Paket",

            accountPlan:
                "Paket Akun",

            selectPlan:
                "Pilih Paket",

            advancedTitle:
                "Lanjutan",

            proxyMode:
                "Mode Proxy",

            proxyModeSystem:
                "Bawaan Sistem / VS Code",

            proxyModeManual:
                "Proxy Kustom Manual",

            proxyModeDirect:
                "Langsung (Tanpa Proxy)",

            proxyUrl:
                "URL Server Proxy",

            proxyUrlPlaceholder:
                "http://127.0.0.1:7890 atau socks5://...",

            proxyStrictSSL:
                "Verifikasi SSL Ketat",

            proxyStrictSSLHint:
                "Nonaktifkan hanya jika menggunakan sertifikat proxy lokal/internal.",
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

            export: `
                <svg ${common}>
                    <path
                        d="M2.5 10v2.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V10M8 2.5v7.5M5 5.5l3-3 3 3"
                        stroke="currentColor"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,

            matrix: `
                <svg ${common}>
                    <rect x="2.2" y="2.2" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="9" y="2.2" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="2.2" y="9" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="9" y="9" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                </svg>
            `,

            key: `
                <svg ${common}>
                    <circle cx="5" cy="8" r="3" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M7.8 8H14M11.5 8v2M13.5 8v1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
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

    function playChime(type) {
        if (state.preferences?.enableQuotaAudio === false) {
            return;
        }

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) {
                return;
            }

            const ctx = new AudioCtx();
            if (type === "restored") {
                const freqs = [523.25, 659.25, 783.99, 1046.5];
                freqs.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
                    gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.07);
                    gain.gain.exponentialRampToValueAtTime(
                        0.0001,
                        ctx.currentTime + idx * 0.07 + 0.55
                    );
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.07);
                    osc.stop(ctx.currentTime + idx * 0.07 + 0.55);
                });
            } else if (type === "warning") {
                const freqs = [440, 369.99];
                freqs.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
                    gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.12);
                    gain.gain.exponentialRampToValueAtTime(
                        0.0001,
                        ctx.currentTime + idx * 0.12 + 0.4
                    );
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.12);
                    osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
                });
            }
        } catch {
            // Autoplay restrictions handled gracefully
        }
    }

    function persistUi() {
        vscode.setState({
            search:
                ui.search,

            sortBy:
                ui.sortBy,

            sortCustomized:
                ui.sortCustomized,

            currentCollapsed:
                ui.currentCollapsed,

            savedCollapsed:
                ui.savedCollapsed,

            runtimeCollapsed:
                ui.runtimeCollapsed,

            usageCollapsed:
                ui.usageCollapsed,

            accounts:
                state.accounts,

            current:
                state.current,

            runtime:
                state.runtime,

            usage:
                state.usage,

            usageSnapshots:
                state.usageSnapshots,
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

    function getAccountQuotaPercent(account) {
        const email = normalizeEmail(account.email);
        const snapshot = state.usageSnapshots?.[email];
        if (!snapshot || !Array.isArray(snapshot.buckets) || snapshot.buckets.length === 0) {
            return undefined;
        }
        let minFraction = undefined;
        for (const b of snapshot.buckets) {
            if (typeof b.remainingFraction === "number" && !b.disabled) {
                if (minFraction === undefined || b.remainingFraction < minFraction) {
                    minFraction = b.remainingFraction;
                }
            }
        }
        return minFraction !== undefined ? Math.round(minFraction * 100) : undefined;
    }

    function filteredAccounts() {
        const query =
            ui.search
                .trim()
                .toLowerCase();

        let list = query
            ? state.accounts.filter(account => {
                const haystack = [
                    account.label,
                    account.displayName,
                    account.email,
                    account.group,
                ].filter(Boolean).join(" ").toLowerCase();
                return haystack.includes(query);
            })
            : state.accounts.slice();

        if (ui.groupFilter && ui.groupFilter !== "all") {
            list = list.filter(account => account.group === ui.groupFilter);
        }

        const currentEmail = normalizeEmail(state.current?.email);

        list.sort((a, b) => {
            const aIsActive = normalizeEmail(a.email) === currentEmail;
            const bIsActive = normalizeEmail(b.email) === currentEmail;
            if (aIsActive !== bIsActive) {
                return aIsActive ? -1 : 1;
            }

            const sortBy = ui.sortBy || "recent";
            if (sortBy === "quota") {
                const aPercent = getAccountQuotaPercent(a);
                const bPercent = getAccountQuotaPercent(b);
                if (aPercent !== undefined && bPercent !== undefined) {
                    if (bPercent !== aPercent) {
                        return bPercent - aPercent;
                    }
                } else if (aPercent !== undefined) {
                    return -1;
                } else if (bPercent !== undefined) {
                    return 1;
                }
            } else if (sortBy === "recent") {
                const aTime = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
                const bTime = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
                if (bTime !== aTime) {
                    return bTime - aTime;
                }
            }

            return (a.label || a.displayName || a.email).localeCompare(b.label || b.displayName || b.email);
        });

        return list;
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
        const colors = ["blue", "green", "purple", "amber", "rose", "teal"];
        return `
            <div
                class="label-editor"
                data-editor-email="${escapeHtml(account.email)}"
            >
                <div class="label-editor-input-row">
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

                <div class="label-editor-colors">
                    ${colors.map(c => `
                        <button
                            type="button"
                            class="color-picker-dot color-${c} ${ui.editColorTag === c ? "selected" : ""}"
                            data-action="select-color-tag"
                            data-color="${c}"
                            title="${c}"
                            aria-label="${c}"
                        ></button>
                    `).join("")}
                    ${ui.editColorTag ? `
                        <button
                            type="button"
                            class="color-clear-btn"
                            data-action="select-color-tag"
                            data-color=""
                            title="Clear color"
                            aria-label="Clear color"
                        >×</button>
                    ` : ""}
                </div>

                <div class="label-editor-groups">
                    <span class="label-editor-meta-title">Group:</span>
                    <div class="group-pills-row">
                        ${(() => {
                            const defaultGroups = ["Personal", "Work"];
                            const existingGroups = (state.accounts || [])
                                .map(a => (a.group || "").trim())
                                .filter(Boolean);
                            const allGroups = Array.from(new Set([...defaultGroups, ...existingGroups]));
                            if (ui.editGroup && !allGroups.includes(ui.editGroup)) {
                                allGroups.push(ui.editGroup);
                            }
                            return allGroups.map(g => `
                                <button
                                    type="button"
                                    class="group-tag-btn ${ui.editGroup === g ? "selected" : ""}"
                                    data-action="select-edit-group"
                                    data-group="${escapeHtml(g)}"
                                >${escapeHtml(g)}</button>
                            `).join("");
                        })()}
                        ${ui.customGroupInputOpen ? `
                            <div class="custom-group-input-wrapper">
                                <input
                                    type="text"
                                    class="custom-group-input"
                                    id="custom-group-input"
                                    placeholder="Group..."
                                    value="${escapeHtml(ui.customGroupInputValue || "")}"
                                    maxlength="24"
                                />
                                <button
                                    type="button"
                                    class="custom-group-btn confirm"
                                    data-action="confirm-custom-group"
                                    title="Terapkan group"
                                    aria-label="Terapkan group"
                                >✓</button>
                                <button
                                    type="button"
                                    class="custom-group-btn cancel"
                                    data-action="cancel-custom-group"
                                    title="Batal"
                                    aria-label="Batal"
                                >✕</button>
                            </div>
                        ` : `
                            <button
                                type="button"
                                class="group-tag-btn add-custom"
                                data-action="open-custom-group"
                                title="Tambah group baru"
                            >+ Custom</button>
                        `}
                        ${ui.editGroup ? `
                            <button
                                type="button"
                                class="color-clear-btn"
                                data-action="select-edit-group"
                                data-group=""
                                title="Clear group"
                                aria-label="Clear group"
                            >×</button>
                        ` : ""}
                    </div>
                </div>
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

        const trimmed = value.trim();

        // Antigravity Connect-RPC GetUserStatus returns genuine Google profile
        // photos as base64-encoded Data URLs (e.g. data:image/png;base64,...).
        if (
            trimmed.startsWith("data:image/png;base64,") ||
            trimmed.startsWith("data:image/jpeg;base64,") ||
            trimmed.startsWith("data:image/webp;base64,") ||
            trimmed.startsWith("data:image/gif;base64,")
        ) {
            return trimmed;
        }

        try {
            const url =
                new URL(trimmed);

            const hostname =
                url.hostname
                    .toLowerCase();

            const isGoogleHost =
                hostname === "googleusercontent.com" ||
                hostname.endsWith(".googleusercontent.com") ||
                hostname === "ggpht.com" ||
                hostname.endsWith(".ggpht.com") ||
                hostname === "gstatic.com" ||
                hostname.endsWith(".gstatic.com") ||
                hostname === "google.com" ||
                hostname.endsWith(".google.com");

            if (
                url.protocol !== "https:" ||
                !isGoogleHost
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
        className = "",
        badgeHtml = ""
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
                                onerror="this.style.display='none'"
                            >
                        `
                        : ""
                }

                ${badgeHtml}
            </div>
        `;
    }
    function resolveAccountPlanInfo(account) {
        if (!account) {
            return null;
        }
        const planStr = typeof account.plan === "string" ? account.plan.trim() : "";
        const g1TierStr = typeof account.g1Tier === "string" ? account.g1Tier.trim() : "";
        const raw = planStr || g1TierStr;
        const isPro = account.isPro === true;

        if (!raw && !isPro) {
            return null;
        }

        let planName = "";
        let planClass = "plan-free";
        let iconSymbol = "";

        const upper = raw.toUpperCase();
        if (upper.includes("ULTRA")) {
            planName = "Google AI Ultra";
            planClass = "plan-ultra";
            iconSymbol = "🌟";
        } else if (upper.includes("PLUS")) {
            planName = "Google AI Plus";
            planClass = "plan-plus";
            iconSymbol = "✨";
        } else if (upper.includes("AI_PREMIUM") || upper.includes("PREMIUM")) {
            planName = "Google AI Plus";
            planClass = "plan-plus";
            iconSymbol = "✨";
        } else if (upper.includes("PRO") || isPro) {
            planName = "Google AI Pro";
            planClass = "plan-pro";
            iconSymbol = "⚡";
        } else if (upper.includes("ENTERPRISE")) {
            planName = "Google AI Enterprise";
            planClass = "plan-pro";
            iconSymbol = "🏢";
        } else if (upper.includes("FREE") || upper.includes("STANDARD")) {
            planName = "Google AI Free";
            planClass = "plan-free";
            iconSymbol = "✦";
        } else if (raw) {
            planName = raw.replace(/^G1_TIER_/, "").replace(/_/g, " ");
            planClass = "plan-custom";
            iconSymbol = "✨";
        } else {
            return null;
        }

        return {
            name: planName,
            className: planClass,
            icon: iconSymbol,
        };
    }

    function renderPlanBadge(account) {
        try {
            const info = resolveAccountPlanInfo(account);
            if (!info || !info.name) {
                return "";
            }
            return `
                <span class="plan-pill ${escapeHtml(info.className)}" title="${escapeHtml(`Plan: ${info.name}`)}">
                    <span class="plan-icon" aria-hidden="true">${info.icon}</span>
                    <span class="plan-text">${escapeHtml(info.name)}</span>
                </span>
            `;
        } catch {
            return "";
        }
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

    /**
     * Calculates the real-time effective remaining fraction of a quota bucket.
     * If the server-provided resetTime has arrived or passed, the quota window
     * has elapsed and Google has replenished the quota back to 100%.
     */
    function getEffectiveRemainingFraction(bucket) {
        if (!bucket || typeof bucket.remainingFraction !== "number" || !Number.isFinite(bucket.remainingFraction)) {
            return null;
        }

        if (bucket.resetTime) {
            const resetTs = new Date(bucket.resetTime).getTime();
            if (Number.isFinite(resetTs) && resetTs <= Date.now()) {
                return 1.0;
            }
        }

        return bucket.remainingFraction;
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
            const label = t("quotaRestored") || t("resetDue");
            return `${label} (${timeStr})`;
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
        const effectiveFraction =
            getEffectiveRemainingFraction(bucket);

        const percent =
            quotaPercent(
                effectiveFraction
            );

        const percentText =
            formatPercent(
                effectiveFraction
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

        const usageHtml = groups.length > 0
            ? renderSavedUsageSummary(usage)
            : `
                <div class="usage-empty secondary-text">
                    ${
                        escapeHtml(
                            state.usageError ||
                            t("quotaUnavailable")
                        )
                    }
                </div>
            `;

        return `
            <div class="usage-section current-usage-section">
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

                <div class="current-usage-body">
                    ${usageHtml}
                </div>
            </div>
        `;
    }

    function getSevenDaysList() {
        const days = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const iso = d.toISOString().split("T")[0];
            const dayName = d.toLocaleDateString(language() === "id" ? "id-ID" : "en-US", { weekday: "short" });
            days.push({ date: iso, label: dayName });
        }
        return days;
    }

    function renderQuotaHistory(email) {
        if (!email) {
            return "";
        }

        const historyMap = state.quotaHistory || {};
        const normalized = normalizeEmail(email);
        const records = historyMap[normalized] || [];
        const sevenDays = getSevenDaysList();

        const barsHtml = sevenDays.map(day => {
            const record = records.find(r => r.date === day.date);
            const hasData = record && typeof record.lowestRemainingPercent === "number";
            const pct = hasData ? record.lowestRemainingPercent : null;
            let toneClass = "history-empty";
            if (hasData) {
                toneClass = pct <= 15 ? "history-critical" : pct <= 35 ? "history-warn" : "history-healthy";
            }
            const height = hasData ? `${Math.max(12, pct)}%` : "4px";
            const tooltip = hasData
                ? `${day.label} (${day.date}): ${pct}% ${t("remaining")}`
                : `${day.label} (${day.date}): -`;

            return `
                <div class="history-bar-col" title="${escapeHtml(tooltip)}">
                    <div class="history-bar-track">
                        <div class="history-bar-fill ${toneClass}" style="height: ${height};"></div>
                    </div>
                    <span class="history-bar-label">${escapeHtml(day.label)}</span>
                    <span class="history-bar-pct">${hasData ? `${pct}%` : "-"}</span>
                </div>
            `;
        }).join("");

        return `
            <div class="quota-history-panel">
                <div class="quota-history-header">
                    <div class="quota-history-title-group">
                        <span class="quota-history-title">${escapeHtml(t("quotaHistory"))}</span>
                        <span class="quota-history-sub secondary-text">${escapeHtml(t("quotaHistorySub"))}</span>
                    </div>
                    <button type="button" class="export-analytics-btn" data-action="export-quota-analytics" title="${escapeHtml(t("exportAnalytics"))}">
                        ${icon("export", "export-btn-icon")}
                        <span>${escapeHtml(t("exportAnalytics"))}</span>
                    </button>
                </div>
                <div class="history-bars-container">
                    ${barsHtml}
                </div>
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
                "[data-reset-time]"
            )
            .forEach(
                element => {
                    const resetTime = element.dataset.resetTime;
                    if (resetTime) {
                        const resetTs = new Date(resetTime).getTime();
                        if (Number.isFinite(resetTs) && resetTs <= Date.now()) {
                            element.textContent = "100%";
                        } else if (element.dataset.initialPercent) {
                            element.textContent = element.dataset.initialPercent;
                        }
                    }
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
            state.preferences?.hideCurrent === true ||
            state.preferences?.showCurrent === false
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
                                state.current.profilePictureUrl || managed?.profilePictureUrl,
                                managed?.colorTag
                                    ? `current-avatar tag-${escapeHtml(managed.colorTag)}`
                                    : "current-avatar"
                            )
                        }


                        <div class="identity">
                            ${
                                managed && editing
                                    ? `
                                        <div class="current-label-editor">
                                            ${renderLabelEditor(managed)}
                                        </div>
                                    `
                                    : `
                                        <div class="saved-title-row current-title-row">
                                            <div
                                                class="identity-name current-name"
                                                title="${escapeHtml(
                                                    (managed?.label && managed.label.trim() && managed.label.trim() !== displayName)
                                                        ? `${managed.label.trim()} (${displayName})`
                                                        : displayName
                                                )}"
                                            >
                                                ${managed?.colorTag ? `<span class="color-tag-dot tag-${escapeHtml(managed.colorTag)}" title="${escapeHtml(managed.colorTag)}"></span>` : ""}${escapeHtml((managed?.label && managed.label.trim()) ? managed.label.trim() : displayName)}
                                            </div>

                                            <div class="saved-title-actions">
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
                                        </div>

                                        <div
                                            class="identity-email"
                                            title="${escapeHtml(state.current.email)}"
                                        >
                                            ${escapeHtml(state.current.email)}
                                        </div>

                                        <div class="saved-badges-row current-badges-row">
                                            ${renderPlanBadge(managed?.plan ? managed : state.current)}

                                            ${
                                                state.vaultedEmails?.includes(normalizeEmail(state.current.email))
                                                    ? `
                                                        <span class="vault-pill" title="${escapeHtml(t("vaultInfo"))}">
                                                            ⚡ ${escapeHtml(t("instantBadge"))}
                                                        </span>
                                                    `
                                                    : ""
                                            }

                                            ${
                                                managed?.group
                                                    ? `
                                                        <span class="group-pill" title="Group: ${escapeHtml(managed.group)}">
                                                            🏷️ ${escapeHtml(managed.group)}
                                                        </span>
                                                    `
                                                    : ""
                                            }

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
                    ${state.preferences?.showQuotaAnalytics ? renderQuotaHistory(state.current.email) : ""}
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
            getEffectiveRemainingFraction(bucket)
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

                        <span
                            class="saved-usage-metric-value"
                            ${bucket?.resetTime ? `data-reset-time="${escapeHtml(bucket.resetTime)}"` : ""}
                            ${typeof bucket?.remainingFraction === "number" ? `data-initial-percent="${escapeHtml(compactQuotaValue(bucket))}"` : ""}
                        >
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
                state.loading &&
                (!state.accounts || state.accounts.length === 0)
            );

        const snapshot =
            state.usageSnapshots?.[
                normalizeEmail(
                    account.email
                )
            ];

        // For the currently active account, prefer live real-time usage data over the stale snapshot
        const usageData = isActive
            ? (state.usage || snapshot)
            : snapshot;

        const updated =
            usageData?.fetchedAt
                ? formatRelativeTime(
                    usageData.fetchedAt
                )
                : "";

        const lastUsedText = isActive
            ? (t("activeNow") || "Active now")
            : (account.lastSeenAt ? formatRelativeTime(account.lastSeenAt) : "");

        const tooltipParts = [];
        if (isActive) {
            tooltipParts.push(t("active") || "Active account");
        } else if (account.lastSeenAt) {
            tooltipParts.push(`${t("lastUsed") || "Last used"}: ${new Date(account.lastSeenAt).toLocaleString()}`);
        }
        if (updated) {
            const updatedLabel = isActive
                ? (t("liveData") || "Live data")
                : (t("updated") || "Snapshot updated");
            tooltipParts.push(`${updatedLabel}: ${updated}`);
        }
        const lastSeenTooltip = tooltipParts.join(" • ");

        const lastSeenHtml = lastUsedText
            ? `
                <span class="last-seen-pill ${isActive ? "active" : ""}" title="${escapeHtml(lastSeenTooltip)}">
                    <span class="last-seen-clock" aria-hidden="true">⏱</span>
                    <span>${escapeHtml(lastUsedText)}</span>
                </span>
            `
            : "";

        return `
            <article
                class="account-row saved-account-row ${isActive ? "active" : ""}"
                data-email="${escapeHtml(account.email)}"
                ${isActive ? 'aria-current="true"' : ""}
            >
                <div class="saved-account-rail">
                    ${
                        renderAvatar(
                            account.displayName || account.label,
                            account.email,
                            account.profilePictureUrl || (isActive ? state.current?.profilePictureUrl : undefined),
                            `small ${account.colorTag ? `tag-${escapeHtml(account.colorTag)}` : ""}`,
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
                        )
                    }
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
                                        ${account.colorTag ? `<span class="color-tag-dot tag-${escapeHtml(account.colorTag)}" title="${escapeHtml(account.colorTag)}"></span>` : ""}${escapeHtml(accountTitle(account))}
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

                                    <div class="saved-badges-row">
                                        ${renderPlanBadge(account)}

                                        ${
                                            state.vaultedEmails?.includes(normalizeEmail(account.email))
                                                ? `
                                                    <span class="vault-pill" title="${escapeHtml(t("vaultInfo"))}">
                                                        ⚡ ${escapeHtml(t("instantBadge"))}
                                                    </span>
                                                `
                                                : ""
                                        }

                                        ${
                                            account.group
                                                ? `
                                                    <span class="group-pill" title="Group: ${escapeHtml(account.group)}">
                                                        🏷️ ${escapeHtml(account.group)}
                                                    </span>
                                                `
                                                : ""
                                        }

                                        ${lastSeenHtml}
                                    </div>
                                </div>


                            `
                    }


                </div>

                <div class="saved-account-quota-area">
                    ${renderSavedUsageSummary(usageData)}
                </div>
            </article>
        `;
    }
    function renderSavedList() {
        if (state.loading && (!state.accounts || state.accounts.length === 0)) {
            return `
                <div class="saved-loading-panel" role="status" aria-live="polite">
                    <div class="saved-loading-spinner-row">
                        <span class="loading-spin-icon">${icon("refresh")}</span>
                        <strong>${escapeHtml(t("loadingSavedAccounts"))}</strong>
                    </div>
                    <div class="saved-skeleton-container">
                        <div class="saved-skeleton-row">
                            <div class="skeleton-avatar"></div>
                            <div class="skeleton-lines">
                                <div class="loading-line wide"></div>
                                <div class="loading-line short"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

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

                    ${ui.search.trim() || ui.groupFilter !== "all" ? `
                        <div style="margin-top: 10px;">
                            <button type="button" class="btn compact" data-action="clear-search">
                                ${escapeHtml(t("clearFilter") || "Clear filter")}
                            </button>
                        </div>
                    ` : ""}
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
            state.preferences?.hideSaved === true ||
            state.preferences?.showSaved === false
        ) {
            return "";
        }

        const filteredCount =
            filteredAccounts().length;

        const hasManyAccounts =
            (state.accounts?.length || 0) > 3;

        const isInitialLoading =
            Boolean(state.loading) && (!state.accounts || state.accounts.length === 0);

        const isRefreshing =
            Boolean(state.loading) && (state.accounts?.length || 0) > 0;

        const countText =
            isInitialLoading
                ? "…"
                : ui.search.trim()
                    ? `${filteredCount}/${state.accounts.length}`
                    : String(
                        state.accounts.length
                    );

        const headerActions = `
            <div class="saved-header-actions">
                ${
                    isRefreshing
                        ? `
                            <span
                                class="refreshing-indicator"
                                title="${escapeHtml(t("updatingQuota"))}"
                                aria-label="${escapeHtml(t("updatingQuota"))}"
                            >
                                <span class="loading-spin-icon">
                                    ${icon("refresh")}
                                </span>
                            </span>
                        `
                        : ""
                }

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
                                                <div class="saved-filter-row">
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

                                                        <button
                                                            type="button"
                                                            class="search-clear-btn"
                                                            data-action="clear-search"
                                                            style="display: ${ui.search ? "inline-flex" : "none"};"
                                                            title="${escapeHtml(t("clearSearch") || "Clear search")}"
                                                            aria-label="${escapeHtml(t("clearSearch") || "Clear search")}"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>

                                                    <div class="sort-wrap">
                                                        <select
                                                            id="account-sort"
                                                            class="sort-select"
                                                            data-action="change-sort"
                                                            aria-label="${escapeHtml(t("sortBy"))}"
                                                            title="${escapeHtml(t("sortBy"))}"
                                                        >
                                                            <option value="recent" ${ui.sortBy === "recent" ? "selected" : ""}>${escapeHtml(t("sortRecent"))}</option>
                                                            <option value="quota" ${ui.sortBy === "quota" ? "selected" : ""}>${escapeHtml(t("sortQuota"))}</option>
                                                            <option value="name" ${ui.sortBy === "name" ? "selected" : ""}>${escapeHtml(t("sortName"))}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                ${(() => {
                                                    const groups = Array.from(new Set((state.accounts || []).map(a => a.group).filter(Boolean)));
                                                    if (groups.length === 0) return "";
                                                    return `
                                                        <div class="saved-group-filter-row">
                                                            <button type="button" class="group-filter-chip ${ui.groupFilter === "all" ? "active" : ""}" data-action="set-group-filter" data-group="all">All (${state.accounts.length})</button>
                                                            ${groups.map(g => {
                                                                const count = state.accounts.filter(a => a.group === g).length;
                                                                return `<button type="button" class="group-filter-chip ${ui.groupFilter === g ? "active" : ""}" data-action="set-group-filter" data-group="${escapeHtml(g)}">${escapeHtml(g)} (${count})</button>`;
                                                            }).join("")}
                                                        </div>
                                                    `;
                                                })()}
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
            state.preferences?.hideRuntime === true ||
            state.preferences?.showRuntime === false
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
                <button
                    type="button"
                    class="quota-matrix-trigger-btn"
                    data-action="open-quota-matrix"
                    title="${escapeHtml(t("quotaMatrixTitle"))}"
                    aria-label="${escapeHtml(t("quotaMatrixTitle"))}"
                >
                    ${icon("matrix", "quota-matrix-icon")}
                    <span>${escapeHtml(t("quotaMatrix"))}</span>
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

                        <div class="runtime-actions-panel">
                            <h3>${escapeHtml(t("processRecovery"))}</h3>
                            <div class="runtime-actions-row">
                                <button
                                    type="button"
                                    class="btn"
                                    data-action="reconnect-hub"
                                    ${checking ? "disabled" : ""}
                                >
                                    ${escapeHtml(t("reconnectHub"))}
                                </button>
                                <button
                                    type="button"
                                    class="btn danger-btn"
                                    data-action="restart-backend"
                                    ${checking ? "disabled" : ""}
                                >
                                    ${escapeHtml(t("restartBackend"))}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    function getEarliestResetTs(account, currentEmail, snapshots) {
        const norm = normalizeEmail(account.email);
        const usage = (norm === currentEmail && state.usage) ? state.usage : snapshots[norm];
        if (!usage?.buckets || !Array.isArray(usage.buckets)) return Infinity;
        let minTs = Infinity;
        for (const b of usage.buckets) {
            if (b.resetTime && !b.disabled) {
                const ts = new Date(b.resetTime).getTime();
                if (Number.isFinite(ts) && ts > Date.now() && ts < minTs) {
                    minTs = ts;
                }
            }
        }
        return minTs;
    }

    function renderMatrixCardsHtml() {
        const accounts = state.accounts || [];
        const snapshots = state.usageSnapshots || {};
        const currentEmail = normalizeEmail(state.current?.email || "");

            const q = (ui.matrixSearch || "").trim().toLowerCase();
            let list = q
                ? accounts.filter(account => {
                    const haystack = [
                        account.label,
                        account.displayName,
                        account.email,
                        account.group,
                    ].filter(Boolean).join(" ").toLowerCase();
                    return haystack.includes(q);
                })
                : accounts.slice();

            const sortBy = ui.matrixSort || "quota";

            const sorted = list.sort((a, b) => {
                const aNorm = normalizeEmail(a.email);
                const bNorm = normalizeEmail(b.email);
                if (aNorm === currentEmail) return -1;
                if (bNorm === currentEmail) return 1;

                if (sortBy === "reset") {
                    const aReset = getEarliestResetTs(a, currentEmail, snapshots);
                    const bReset = getEarliestResetTs(b, currentEmail, snapshots);
                    if (aReset !== bReset) {
                        return aReset - bReset;
                    }
                } else if (sortBy === "quota") {
                    const aPct = getAccountQuotaPercent(a);
                    const bPct = getAccountQuotaPercent(b);
                    const aVal = typeof aPct === "number" ? aPct : -1;
                    const bVal = typeof bPct === "number" ? bPct : -1;
                    if (aVal !== bVal) {
                        return bVal - aVal;
                    }
                }

                return (a.label || a.displayName || a.email).localeCompare(b.label || b.displayName || b.email);
            });

            if (sorted.length === 0) {
                if (q) {
                    return `
                        <div class="search-empty-state">
                            <span>${escapeHtml(t("noMatchingAccounts"))}</span>
                            <button type="button" class="btn compact" data-action="clear-matrix-search">
                                ${escapeHtml(t("clearSearch") || "Clear search")}
                            </button>
                        </div>
                    `;
                }
                return `
                    <div class="matrix-empty secondary-text">
                        ${escapeHtml(t("noSaved"))}
                    </div>
                `;
            }

            return sorted.map(account => {
                const norm = normalizeEmail(account.email);
                const isActive = Boolean(currentEmail && norm === currentEmail);
                const usage = isActive ? (state.usage || snapshots[norm]) : snapshots[norm];

                const displayName = account.displayName || account.label || account.email;
                const localLabel = account.label || (isActive ? t("currentAccountLabel") : "");

                let fiveHourPct = null;
                let fiveHourReset = "";
                let weeklyPct = null;
                let weeklyReset = "";

                if (usage?.buckets && Array.isArray(usage.buckets)) {
                    for (const b of usage.buckets) {
                        const id = (b.displayName || b.bucketId || "").toLowerCase();
                        const win = (b.window || b.description || "").toLowerCase();
                        const is5h = id.includes("5-hour") || id.includes("5h") || win.includes("5 hour") || win.includes("5h");
                        const isWeekly = id.includes("week") || win.includes("week") || win.includes("7 day");

                        if (typeof b.remainingFraction === "number" && !b.disabled) {
                            const effFrac = getEffectiveRemainingFraction(b);
                            const pct = typeof effFrac === "number" ? Math.max(0, Math.min(100, Math.round(effFrac * 100))) : null;
                            const resetStr = b.resetTime ? formatResetTime(b.resetTime) : "";

                            if (is5h || (fiveHourPct === null && !isWeekly)) {
                                fiveHourPct = pct;
                                fiveHourReset = resetStr;
                            } else if (isWeekly) {
                                weeklyPct = pct;
                                weeklyReset = resetStr;
                            }
                        }
                    }
                }

                if (fiveHourPct === null) {
                    const fallbackPct = getAccountQuotaPercent(account);
                    if (typeof fallbackPct === "number") {
                        fiveHourPct = fallbackPct;
                    }
                }

                const toneClass = (pct) => {
                    if (typeof pct !== "number") return "tone-empty";
                    return pct <= 15 ? "tone-critical" : pct <= 35 ? "tone-warn" : "tone-healthy";
                };

                return `
                    <div class="matrix-card ${isActive ? "active-matrix-card" : ""}">
                        <!-- Tier 1: Header Row (Identity Left, Action Right) -->
                        <div class="matrix-card-header">
                            <div class="matrix-identity-group">
                                ${renderAvatar(
                                    displayName,
                                    account.email,
                                    account.profilePictureUrl || (isActive ? state.current?.profilePictureUrl : undefined),
                                    account.colorTag ? `matrix-avatar tag-${escapeHtml(account.colorTag)}` : "matrix-avatar"
                                )}
                                <div class="matrix-identity-text">
                                    <div class="matrix-name-row">
                                        <span class="matrix-account-name" title="${escapeHtml(displayName)}">${escapeHtml(displayName)}</span>
                                        ${account.colorTag ? `<span class="color-tag-dot dot-${escapeHtml(account.colorTag)}"></span>` : ""}
                                        ${isActive ? `<span class="saved-rail-badge active-badge">${escapeHtml(t("active"))}</span>` : ""}
                                    </div>
                                    <div class="matrix-email-row" title="${escapeHtml(account.email)}">${escapeHtml(account.email)}</div>
                                </div>
                            </div>

                            <div class="matrix-card-action">
                                ${isActive
                                    ? `<span class="matrix-connected-pill">✓ ${escapeHtml(t("connected"))}</span>`
                                    : `
                                        <button
                                            type="button"
                                            class="btn btn-primary compact matrix-switch-btn"
                                            data-action="switch"
                                            data-email="${escapeHtml(account.email)}"
                                            title="${escapeHtml(t("switch"))}"
                                        >
                                            ${escapeHtml(t("switchNow"))}
                                        </button>
                                    `
                                }
                            </div>
                        </div>

                        <!-- Tier 2: Badges Row -->
                        <div class="matrix-badges-row">
                            ${renderPlanBadge(isActive ? (state.current || account) : account)}
                            ${state.vaultedEmails?.includes(normalizeEmail(account.email)) ? `<span class="vault-pill" title="${escapeHtml(t("vaultInfo"))}">⚡ ${escapeHtml(t("instantBadge"))}</span>` : ""}
                            ${localLabel ? `<span class="account-label">${escapeHtml(localLabel)}</span>` : ""}
                            ${account.group ? `<span class="group-pill" title="Group: ${escapeHtml(account.group)}">🏷️ ${escapeHtml(account.group)}</span>` : ""}
                        </div>

                        <!-- Tier 3: Quota Grid (5h & Weekly Side by Side) -->
                        <div class="matrix-quota-grid">
                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${escapeHtml(t("fiveHourShort") || "5h")}:</span>
                                    <strong>${typeof fiveHourPct === "number" ? `${fiveHourPct}%` : "-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${toneClass(fiveHourPct)}" style="width: ${typeof fiveHourPct === "number" ? fiveHourPct : 0}%;"></div>
                                </div>
                                ${fiveHourReset ? `<span class="matrix-reset-sub" title="${escapeHtml(fiveHourReset)}">${escapeHtml(fiveHourReset)}</span>` : ""}
                            </div>

                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${escapeHtml(t("weeklyShort") || "Weekly")}:</span>
                                    <strong>${typeof weeklyPct === "number" ? `${weeklyPct}%` : "-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${toneClass(weeklyPct)}" style="width: ${typeof weeklyPct === "number" ? weeklyPct : 0}%;"></div>
                                </div>
                                ${weeklyReset ? `<span class="matrix-reset-sub" title="${escapeHtml(weeklyReset)}">${escapeHtml(weeklyReset)}</span>` : ""}
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
    }

    function renderQuotaMatrixModal() {
        if (!ui.quotaMatrixOpen) {
            return "";
        }

        const accounts = state.accounts || [];
        const cardsHtml = renderMatrixCardsHtml();

        return `
            <div class="matrix-modal-backdrop" data-action="close-quota-matrix">
                <section
                    class="matrix-modal-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${escapeHtml(t("quotaMatrixTitle"))}"
                >
                    <header class="matrix-modal-header">
                        <div class="matrix-modal-title-group">
                            <h2>${icon("matrix", "modal-header-icon")} ${escapeHtml(t("quotaMatrixTitle"))}</h2>
                            <span class="secondary-text">${escapeHtml(t("quotaMatrixSub"))}</span>
                        </div>
                        <button
                            type="button"
                            class="icon-btn"
                            data-action="close-quota-matrix"
                            aria-label="${escapeHtml(t("cancel") || "Close")}"
                            title="${escapeHtml(t("cancel") || "Close")}"
                        >
                            ${icon("close")}
                        </button>
                    </header>

                    <div class="matrix-modal-body">
                        ${accounts.length > 1 ? `
                            <div class="matrix-filter-row">
                                <div class="search-input-wrapper">
                                    <span class="search-input-icon">${icon("search")}</span>
                                    <input
                                        id="matrix-search"
                                        class="accounts-search-input"
                                        type="search"
                                        value="${escapeHtml(ui.matrixSearch || "")}"
                                        placeholder="${escapeHtml(t("searchAccountsPlaceholder"))}"
                                        autocomplete="off"
                                        spellcheck="false"
                                    >
                                    ${ui.matrixSearch ? `
                                        <button
                                            type="button"
                                            class="search-clear-btn"
                                            data-action="clear-matrix-search"
                                            title="${escapeHtml(t("clearSearch") || "Clear search")}"
                                            aria-label="${escapeHtml(t("clearSearch") || "Clear search")}"
                                        >✕</button>
                                    ` : ""}
                                </div>

                                <div class="matrix-sort-chips">
                                    <span class="matrix-sort-label">${escapeHtml(t("sortBy") || "Sort:")}</span>
                                    <button
                                        type="button"
                                        class="matrix-sort-chip ${(!ui.matrixSort || ui.matrixSort === "quota") ? "active" : ""}"
                                        data-action="set-matrix-sort"
                                        data-sort="quota"
                                    >
                                        🟢 ${escapeHtml(t("highestQuota"))}
                                    </button>
                                    <button
                                        type="button"
                                        class="matrix-sort-chip ${ui.matrixSort === "reset" ? "active" : ""}"
                                        data-action="set-matrix-sort"
                                        data-sort="reset"
                                    >
                                        ⏱ ${escapeHtml(t("earliestReset"))}
                                    </button>
                                    <button
                                        type="button"
                                        class="matrix-sort-chip ${ui.matrixSort === "name" ? "active" : ""}"
                                        data-action="set-matrix-sort"
                                        data-sort="name"
                                    >
                                        🔤 ${escapeHtml(t("nameAZ"))}
                                    </button>
                                </div>
                            </div>
                        ` : ""}

                        <div class="matrix-list" id="matrix-account-list">
                            ${cardsHtml}
                        </div>
                    </div>

                    <footer class="matrix-modal-footer">
                        <span class="secondary-text">${accounts.length} ${escapeHtml(t("savedAccounts"))}</span>
                        <button
                            type="button"
                            class="btn"
                            data-action="close-quota-matrix"
                        >
                            ${escapeHtml(t("cancel") || "Close")}
                        </button>
                    </footer>
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
                                        ${draft.theme === "vscode" || draft.theme === "editor" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("followVsCode"))}
                                    </option>

                                    <option
                                        value="dark"
                                        ${draft.theme === "dark" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("dark"))}
                                    </option>

                                    <option
                                        value="light"
                                        ${draft.theme === "light" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("light"))}
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
                                ${escapeHtml(t("layout"))}
                            </h3>

                            ${
                                renderCheckbox(
                                    "hideRuntime",
                                    t("hideRuntime"),
                                    draft.hideRuntime === true || draft.showRuntime === false,
                                    t("hideRuntimeHint")
                                )
                            }

                            ${
                                renderCheckbox(
                                    "hideCurrent",
                                    t("hideCurrent"),
                                    draft.hideCurrent === true || draft.showCurrent === false,
                                    t("hideCurrentHint")
                                )
                            }

                            ${
                                renderCheckbox(
                                    "hideSaved",
                                    t("hideSaved"),
                                    draft.hideSaved === true || draft.showSaved === false,
                                    t("hideSavedHint")
                                )
                            }

                            ${
                                renderCheckbox(
                                    "showQuotaAnalytics",
                                    t("showQuotaAnalytics"),
                                    draft.showQuotaAnalytics === true,
                                    t("showQuotaAnalyticsHint")
                                )
                            }
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
                                    draft.enableLowQuotaReminder,
                                    t("lowQuotaReminderHint")
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

                            ${
                                renderCheckbox(
                                    "enableQuotaAudio",
                                    t("enableQuotaAudio"),
                                    draft.enableQuotaAudio !== false,
                                    t("enableQuotaAudioHint")
                                )
                            }
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${escapeHtml(t("switchingAndAutomation"))}
                            </h3>

                            ${
                                renderCheckbox(
                                    "enableInstantSwitch",
                                    t("instantSwitch"),
                                    draft.enableInstantSwitch !== false,
                                    t("instantSwitchHint")
                                )
                            }

                            ${
                                renderCheckbox(
                                    "smartQuotaFallback",
                                    t("smartQuotaFallback"),
                                    draft.smartQuotaFallback !== false,
                                    t("smartQuotaFallbackHint")
                                )
                            }

                            ${
                                renderCheckbox(
                                    "autoRoundRobin",
                                    t("autoRoundRobin"),
                                    draft.autoRoundRobin === true,
                                    t("autoRoundRobinHint")
                                )
                            }
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${escapeHtml(t("backupAndRestore"))}
                            </h3>
                            <p class="settings-desc">
                                ${escapeHtml(t("backupDesc"))}
                            </p>
                            <div class="settings-actions-row">
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="export-accounts"
                                >
                                    ${escapeHtml(t("exportAccounts"))}
                                </button>
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="import-accounts"
                                >
                                    ${escapeHtml(t("importAccounts"))}
                                </button>
                            </div>
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${escapeHtml(t("vaultTitle"))}
                            </h3>
                            <p class="settings-desc">
                                ${escapeHtml(t("vaultInfo"))}
                            </p>
                            <div class="settings-actions-row">
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="clear-token-vault"
                                >
                                    ${icon("key")} ${escapeHtml(t("purgeVault"))}
                                </button>
                            </div>
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${escapeHtml(t("advancedTitle"))}
                            </h3>

                            <label class="field">
                                <span>
                                    ${escapeHtml(t("proxyMode"))}
                                </span>

                                <select
                                    data-setting="proxyMode"
                                >
                                    <option
                                        value="system"
                                        ${draft.proxyMode === "system" || !draft.proxyMode ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("proxyModeSystem"))}
                                    </option>
                                    <option
                                        value="manual"
                                        ${draft.proxyMode === "manual" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("proxyModeManual"))}
                                    </option>
                                    <option
                                        value="direct"
                                        ${draft.proxyMode === "direct" ? "selected" : ""}
                                    >
                                        ${escapeHtml(t("proxyModeDirect"))}
                                    </option>
                                </select>
                            </label>

                            ${
                                draft.proxyMode === "manual"
                                    ? `
                                        <label class="field subfield">
                                            <span>
                                                ${escapeHtml(t("proxyUrl"))}
                                            </span>

                                            <input
                                                type="text"
                                                class="label-input"
                                                data-setting="proxyUrl"
                                                value="${escapeHtml(draft.proxyUrl || "")}"
                                                placeholder="${escapeHtml(t("proxyUrlPlaceholder"))}"
                                            />
                                        </label>
                                    `
                                    : ""
                            }

                            ${
                                draft.proxyMode !== "direct"
                                    ? renderCheckbox(
                                        "proxyStrictSSL",
                                        t("proxyStrictSSL"),
                                        draft.proxyStrictSSL !== false,
                                        t("proxyStrictSSLHint")
                                    )
                                    : ""
                            }
                        </div>

                        <div class="settings-group about-group">
                            <h3>
                                ${escapeHtml(t("about"))}
                            </h3>

                            ${state.meta?.iconUri ? `
                            <div style="text-align: center; margin: 8px 0 16px 0;">
                                <img src="${escapeHtml(state.meta.iconUri)}" width="64" height="64" style="border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); vertical-align: middle;" alt="Logo" />
                            </div>` : ""}

                            <div class="about-row">
                                <span>
                                    Antigravity Account Switcher
                                </span>

                                <span>
                                    v${escapeHtml(state.meta?.version || "1.0.1")}
                                </span>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${escapeHtml(t("developer"))}
                                </span>

                                <strong>
                                    ${escapeHtml(state.meta?.developer || "Boy Gilang Ramadhan")}
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
        checked,
        hint
    ) {
        return `
            <div class="check-setting-wrap">
                <label class="check-row">
                    <input
                        type="checkbox"
                        data-setting="${escapeHtml(key)}"
                        ${checked ? "checked" : ""}
                    >

                    <span class="check-label-text">
                        ${escapeHtml(label)}
                    </span>
                </label>
                ${hint ? `<div class="field-hint">${escapeHtml(hint)}</div>` : ""}
            </div>
        `;
    }

    function renderFooter() {
        const meta =
            state.meta || {};

        const developer =
            meta.developer ||
            "Boy Gilang Ramadhan";

        const website =
            meta.website ||
            "https://boygr.com";

        const version =
            meta.version ||
            "0.5.1";

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
            ${renderQuotaMatrixModal()}
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

    function updateMatrixListOnly() {
        const list = document.getElementById("matrix-account-list");
        if (list) {
            list.innerHTML = renderMatrixCardsHtml();
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

        ui.editColorTag =
            account.colorTag || "";

        ui.editGroup =
            account.group || "";

        ui.customGroupInputOpen =
            false;

        ui.customGroupInputValue =
            "";

        render();
    }

    function cancelLabelEdit() {
        ui.editingEmail =
            null;

        ui.editValue =
            "";

        ui.editColorTag =
            "";

        ui.editGroup =
            "";

        ui.customGroupInputOpen =
            false;

        ui.customGroupInputValue =
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
            colorTag:
                ui.editColorTag,
            group:
                ui.editGroup,
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

            hideCurrent:
                preferences.hideCurrent === true || preferences.showCurrent === false,

            hideSaved:
                preferences.hideSaved === true || preferences.showSaved === false,

            hideRuntime:
                preferences.hideRuntime === true || preferences.showRuntime === false,

            showQuotaAnalytics:
                preferences.showQuotaAnalytics === true,

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

            smartQuotaFallback:
                preferences.smartQuotaFallback !== false,

            autoRoundRobin:
                preferences.autoRoundRobin === true,

            enableQuotaAudio:
                preferences.enableQuotaAudio !== false,

            enableInstantSwitch:
                preferences.enableInstantSwitch !== false,

            proxyMode:
                preferences.proxyMode || "system",

            proxyUrl:
                preferences.proxyUrl || "",

            proxyStrictSSL:
                preferences.proxyStrictSSL !== false,
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
                showCurrent: !ui.settingsDraft.hideCurrent,
                showSaved: !ui.settingsDraft.hideSaved,
                showRuntime: !ui.settingsDraft.hideRuntime,
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

                const clearBtn = target.closest(".search-input-wrapper")?.querySelector(".search-clear-btn");
                if (clearBtn) {
                    clearBtn.style.display = ui.search ? "inline-flex" : "none";
                }

                persistUi();
                updateSavedListOnly();
                return;
            }

            if (
                target instanceof HTMLInputElement &&
                target.id === "matrix-search"
            ) {
                ui.matrixSearch = target.value;

                const clearBtn = target.closest(".search-input-wrapper")?.querySelector(".search-clear-btn");
                if (clearBtn) {
                    clearBtn.style.display = ui.matrixSearch ? "inline-flex" : "none";
                }

                updateMatrixListOnly();
                return;
            }

            if (
                target instanceof HTMLInputElement &&
                target.dataset.role ===
                    "label-input"
            ) {
                ui.editValue =
                    target.value;
                return;
            }

            if (
                target instanceof HTMLInputElement &&
                target.id ===
                    "custom-group-input"
            ) {
                ui.customGroupInputValue =
                    target.value;
                return;
            }

            if (
                target instanceof HTMLInputElement &&
                target.dataset.setting === "proxyUrl"
            ) {
                if (ui.settingsDraft) {
                    ui.settingsDraft.proxyUrl = target.value;
                }
                return;
            }
        }
    );

    app.addEventListener(
        "keydown",
        event => {
            const target = event.target;
            if (
                target instanceof HTMLInputElement &&
                target.id === "custom-group-input"
            ) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    const val = target.value.trim();
                    if (val) {
                        ui.editGroup = val;
                    }
                    ui.customGroupInputOpen = false;
                    ui.customGroupInputValue = "";
                    render();
                } else if (event.key === "Escape") {
                    event.preventDefault();
                    ui.customGroupInputOpen = false;
                    ui.customGroupInputValue = "";
                    render();
                }
            }
        }
    );

    app.addEventListener(
        "change",
        event => {
            const target =
                event.target;

            if (
                target instanceof HTMLSelectElement &&
                target.dataset.action === "change-sort"
            ) {
                ui.sortBy = target.value;
                ui.sortCustomized = true;
                persistUi();
                updateSavedListOnly();
                return;
            }

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

            if (key === "proxyMode") {
                ui.settingsDraft.proxyMode = target.value;
                render();
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
                    "clear-search"
            ) {
                ui.search = "";
                ui.groupFilter = "all";
                const searchInput = document.getElementById("account-search");
                if (searchInput) {
                    searchInput.value = "";
                    searchInput.focus();
                }
                const clearBtn = document.querySelector(".search-clear-btn");
                if (clearBtn) {
                    clearBtn.style.display = "none";
                }
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

            if (action === "open-quota-matrix") {
                ui.quotaMatrixOpen = true;
                render();
                return;
            }

            if (action === "close-quota-matrix") {
                if (target.classList.contains("matrix-modal-backdrop") && rawTarget !== target) {
                    return;
                }
                ui.quotaMatrixOpen = false;
                ui.matrixSearch = "";
                render();
                return;
            }

            if (action === "clear-matrix-search") {
                ui.matrixSearch = "";
                const searchInput = document.getElementById("matrix-search");
                if (searchInput) {
                    searchInput.value = "";
                    searchInput.focus();
                }
                const clearBtn = target.closest(".search-input-wrapper")?.querySelector(".search-clear-btn")
                    || document.querySelector(".matrix-filter-row .search-clear-btn");
                if (clearBtn) {
                    clearBtn.style.display = "none";
                }
                updateMatrixListOnly();
                return;
            }

            if (action === "set-matrix-sort") {
                const sortType = target.dataset.sort || "quota";
                ui.matrixSort = sortType;
                const chips = document.querySelectorAll(".matrix-sort-chip");
                chips.forEach(chip => {
                    chip.classList.toggle("active", chip.dataset.sort === sortType);
                });
                updateMatrixListOnly();
                return;
            }

            if (action === "export-accounts") {
                vscode.postMessage({
                    type: "exportAccounts",
                });
                return;
            }

            if (action === "import-accounts") {
                vscode.postMessage({
                    type: "importAccounts",
                });
                return;
            }

            if (action === "clear-token-vault") {
                vscode.postMessage({
                    type: "clearTokenVault",
                });
                return;
            }

            if (action === "reconnect-hub") {
                ui.runtimeModalOpen = false;
                setOperation({
                    type: "refresh",
                });
                vscode.postMessage({
                    type: "reconnectHub",
                });
                return;
            }

            if (action === "restart-backend") {
                ui.runtimeModalOpen = false;
                setOperation({
                    type: "refresh",
                });
                vscode.postMessage({
                    type: "restartBackend",
                });
                return;
            }

            if (action === "select-color-tag") {
                const color = target.dataset.color || "";
                ui.editColorTag = ui.editColorTag === color ? "" : color;
                render();
                return;
            }

            if (action === "select-edit-group") {
                const group = target.dataset.group || "";
                ui.editGroup = ui.editGroup === group ? "" : group;
                render();
                return;
            }

            if (action === "open-custom-group") {
                ui.customGroupInputOpen = true;
                ui.customGroupInputValue = "";
                render();
                setTimeout(() => {
                    const inputEl = document.getElementById("custom-group-input");
                    if (inputEl) {
                        inputEl.focus();
                    }
                }, 20);
                return;
            }

            if (action === "cancel-custom-group") {
                ui.customGroupInputOpen = false;
                ui.customGroupInputValue = "";
                render();
                return;
            }

            if (action === "confirm-custom-group") {
                const inputEl = document.getElementById("custom-group-input");
                const val = (inputEl ? inputEl.value : ui.customGroupInputValue || "").trim();
                if (val) {
                    ui.editGroup = val;
                }
                ui.customGroupInputOpen = false;
                ui.customGroupInputValue = "";
                render();
                return;
            }

            if (action === "set-group-filter") {
                ui.groupFilter = target.dataset.group || "all";
                render();
                return;
            }

            if (action === "export-quota-analytics") {
                vscode.postMessage({
                    type: "exportQuotaAnalytics",
                });
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
                    ui.quotaMatrixOpen = false;
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
                if (ui.quotaMatrixOpen) {
                    ui.quotaMatrixOpen = false;
                    render();
                    return;
                }

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

            if (message.type === "openQuotaMatrix") {
                ui.quotaMatrixOpen = true;
                render();
                return;
            }

            if (message.type === "playChime") {
                playChime(message.chime);
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

            persistUi();

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

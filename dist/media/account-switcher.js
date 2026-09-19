"use strict";(()=>{const k=acquireVsCodeApi(),R=document.getElementById("app");if(!R)return;const $=k.getState()||{};let c={loading:!0,current:$.current||null,accounts:Array.isArray($.accounts)?$.accounts:[],runtime:$.runtime||null,usage:$.usage||null,usageSnapshots:$.usageSnapshots||{},usageError:null,error:null,preferences:{version:1,theme:"vscode",language:"auto",effectiveLanguage:"en",hideCurrent:!1,hideSaved:!1,hideRuntime:!1,showCurrent:!0,showSaved:!0,showRuntime:!0,showQuotaAnalytics:!1,autoRefreshIntervalMinutes:5,enableLowQuotaReminder:!0,lowQuotaThresholdPercent:20,smartQuotaFallback:!0,autoRoundRobin:!1,enableQuotaAudio:!0,enableInstantSwitch:!0,proxyMode:"system",proxyUrl:"",proxyStrictSSL:!0},vaultedEmails:[],meta:{version:"1.4.6",developer:"Boy Gilang Ramadhan (BoyGR)",website:"https://boygr.com",iconUri:""}},s={search:typeof $.search=="string"?$.search:"",sortBy:$.sortCustomized&&typeof $.sortBy=="string"?$.sortBy:"recent",sortCustomized:!!$.sortCustomized,currentCollapsed:!!$.currentCollapsed,savedCollapsed:!!$.savedCollapsed,runtimeCollapsed:$.runtimeCollapsed!==!1,usageCollapsed:!!$.usageCollapsed,settingsOpen:!1,settingsDraft:null,editingEmail:null,editValue:"",editColorTag:"",editGroup:"",customGroupInputOpen:!1,customGroupInputValue:"",groupFilter:"all",removeCandidate:null,switchCandidate:null,runtimeModalOpen:!1,quotaMatrixOpen:!1,matrixSearch:"",matrixSort:"quota"},A=null,M=null,T=null;const Q={en:{appName:"Antigravity Account Switcher",accountManager:"Google account manager",settings:"Settings",currentAccount:"Current account",savedAccounts:"Saved accounts",antigravityStatus:"Antigravity status",refresh:"Refresh",connected:"Connected",active:"Active",switch:"Switch",reauth:"Re-auth",signout:"Sign out",addGoogleAccount:"Add Google Account",addGoogleAccountHint:"Sign in or switch account",saveCurrentAccount:"Save Current Account",unavailable:"Antigravity account unavailable",waiting:"Waiting for Antigravity...",checking:"Checking\u2026",loadingAccount:"Loading account\u2026",loadingSavedAccounts:"Loading saved accounts\u2026",updatingQuota:"Updating quota\u2026",checkingAccount:"Checking Antigravity account state\u2026",checkingExtension:"Checking extension status\u2026",checkingBackend:"Checking backend status\u2026",checkingHub:"Checking hub connection\u2026",noSaved:"No saved accounts",noSavedHint:"Save the current Antigravity account or add another Google account.",cannotRemoveActive:"Active account cannot be removed. Sign out first.",cannotRemoveActiveDetail:"This account is currently active in Antigravity. Sign out before removing it.",noActiveAccount:"No Account Connected",noActiveAccountHint:"Sign in with your Google account to start using Google Antigravity and monitor quotas.",signInGoogle:"Sign In with Google",connecting:"Connecting\u2026",connectingToAntigravity:"Connecting to Google Antigravity",connectingToAntigravityHint:"Establishing connection to Google servers. Your active account and quotas will load automatically.",waitingForConnection:"Waiting for Google Antigravity connection before switching accounts\u2026",antigravityOffline:"Antigravity Offline",antigravityOfflineHint:"Unable to connect to the Antigravity backend service.",antigravityNotInstalled:"Not Installed",antigravityNotInstalledHint:"Official Google Antigravity extension is not installed.",noMatches:"No matching accounts",noMatchesHint:"Try another label, display name, or email.",searchPlaceholder:"Search accounts",sortBy:"Sort by",sortQuota:"Highest quota",sortName:"Name (A-Z)",sortRecent:"Recently used",clearSearch:"Clear search",clearFilter:"Clear filter",activeNow:"Active now",lastUsed:"Last used",editLabel:"Edit label",save:"Save",cancel:"Cancel",removeLabel:"Clear label",accountActions:"Account actions",appearance:"Appearance",theme:"Theme",language:"Language",layout:"Layout",followVsCode:"Follow Editor / IDE Theme",light:"Light",dark:"Dark",system:"System",automatic:"Auto",english:"English",indonesian:"Bahasa Indonesia",hideCurrent:"Hide current account",hideSaved:"Hide saved accounts",hideRuntime:"Hide Antigravity status",showQuotaAnalytics:"Show 7-day quota analytics",switchingAndAutomation:"Switching & Automation",quotaAndReminders:"Quota & Reminders",autoRefreshQuota:"Auto-refresh quota",autoRefreshOff:"Off (Manual only)",every1Minute:"Every 1 minute",every5Minutes:"Every 5 minutes (Recommended)",every15Minutes:"Every 15 minutes",every30Minutes:"Every 30 minutes",every1Hour:"Every 1 hour",lowQuotaReminder:"Low quota notification",reminderThreshold:"Warning threshold",percentRemaining:"% remaining",smartQuotaFallback:"Smart Quota Fallback (1-click switch)",backupAndRestore:"Backup & Restore",backupDesc:"Export saved accounts metadata to JSON or restore them on another machine.",exportAccounts:"Export Accounts",importAccounts:"Import Accounts",reconnectHub:"Reconnect Hub",restartBackend:"Restart Backend",processRecovery:"Process Recovery",settingsHint:"Changes apply only after Save.",resetToDefault:"Reset to Default",resetSettingsNotice:"Settings reset to default values. Click Save to apply.",googleExtension:"Google Extension",officialExtension:"Official Antigravity extension",agyBackend:"AGY Backend",localBackend:"Local Antigravity backend",hub:"Hub",localHub:"Local Hub",hubConnection:"Antigravity hub connection",running:"Running",stopped:"Stopped",ready:"Ready",disconnected:"Unavailable",version:"Version",refreshing:"Refreshing account state...",adding:"Opening Google account flow...",saving:"Saving current account...",reauthenticating:"Re-authenticating...",signingOut:"Signing out...",switching:"Switching account...",updatingLabel:"Updating account label...",savingSettings:"Saving settings...",stateUpdated:"Account state updated.",labelUpdated:"Account label updated.",settingsSaved:"Settings saved.",collapse:"Collapse section",expand:"Expand section",currentAccountLabel:"Current account",developedBy:"Developed by",about:"About",developer:"Developer",website:"Website",removeSavedAccount:"Remove saved account",switchAccountQuestion:"Switch active account?",switchAccountExplanation:"Antigravity will switch its active session to this account. Ongoing operations may refresh.",confirmSwitch:"Switch Account",removeSavedQuestion:"Remove saved account?",removeSavedExplanation:"This only removes local Account Switcher metadata. It does not sign you out, delete your Google account, or remove Google credentials.",remove:"Remove",accountRemoved:"Saved account removed.",usage:"Usage",weeklyLimit:"Weekly limit",fiveHourLimit:"5-hour limit",weeklyShort:"Weekly",fiveHourShort:"5h",updated:"Updated",models:"models",remaining:"remaining",resetsIn:"Resets in",resetDue:"Reset due",quotaRestored:"Restored",lastUpdated:"Last updated",quotaSnapshot:"Quota snapshot",showAllModels:"Show all models",showLess:"Show less",justNow:"just now",ago:"ago",quotaUnavailable:"Usage unavailable",quotaUnavailableHint:"Antigravity did not return current quota information.",quotaHistory:"7-Day Quota Analytics",searchAccountsPlaceholder:"Filter by name, email, or group...",highestQuota:"Highest Quota",earliestReset:"Earliest Reset",nameAZ:"Name (A-Z)",noMatchingAccounts:"No accounts match your filter.",liveData:"Live data",quotaHistorySub:"Daily lowest remaining",exportAnalytics:"Export Analytics",autoRoundRobin:"Auto-Round-Robin (Switch on rate limit)",enableQuotaAudio:"Subtle Audio Alerts (Web Audio)",quotaMatrix:"Quota Matrix",quotaMatrixTitle:"Multi-Account Quota Matrix",quotaMatrixSub:"Real-time quota comparison across all accounts",switchNow:"Switch",noSnapshotYet:"No quota data yet",instantSwitch:"Instant Switch (No Browser)",instantSwitchHint:"Switch accounts seamlessly using saved session tokens without re-opening your browser.",smartQuotaFallbackHint:"Show a 1-click prompt to switch to an account with more quota before limits are reached.",autoRoundRobinHint:"Automatically rotate to the account with the highest quota when rate limits occur.",enableQuotaAudioHint:"Play gentle synthesized chimes on quota reset or critical alerts.",lowQuotaReminderHint:"Show a warning notification when remaining quota falls below threshold.",hideRuntimeHint:"Hide the Antigravity background status indicator from the bottom bar.",hideCurrentHint:"Hide the current active account panel from the main view.",hideSavedHint:"Hide the saved accounts list and manager.",showQuotaAnalyticsHint:"Display the 7-day lowest quota analytics bar chart.",instantBadge:"Instant",vaultTitle:"Token Vault",purgeVault:"Clear Token Vault...",vaultInfo:"Saved in encrypted Token Vault for 1-click seamless switching",plan:"Plan",accountPlan:"Account Plan",selectPlan:"Select Plan",advancedTitle:"Advanced",proxyMode:"Proxy Mode",proxyModeSystem:"System / VS Code Default",proxyModeManual:"Manual Custom Proxy",proxyModeDirect:"Direct (No Proxy)",proxyUrl:"Proxy Server URL",proxyUrlPlaceholder:"http://127.0.0.1:7890 or socks5://...",proxyStrictSSL:"Strict SSL Verification",proxyStrictSSLHint:"Disable only if using internal self-signed proxy certs."},id:{appName:"Antigravity Account Switcher",accountManager:"Pengelola akun Google",settings:"Pengaturan",currentAccount:"Akun saat ini",savedAccounts:"Akun tersimpan",antigravityStatus:"Status Antigravity",refresh:"Segarkan",connected:"Terhubung",active:"Aktif",switch:"Ganti",reauth:"Autentikasi ulang",signout:"Keluar",addGoogleAccount:"Tambah Akun Google",addGoogleAccountHint:"Masuk atau ganti akun",saveCurrentAccount:"Simpan Akun Saat Ini",unavailable:"Akun Antigravity tidak tersedia",waiting:"Menunggu Antigravity...",checking:"Memeriksa\u2026",loadingAccount:"Memuat akun\u2026",loadingSavedAccounts:"Memuat akun tersimpan\u2026",updatingQuota:"Memperbarui kuota\u2026",checkingAccount:"Memeriksa status akun Antigravity\u2026",checkingExtension:"Memeriksa status ekstensi\u2026",checkingBackend:"Memeriksa status backend\u2026",checkingHub:"Memeriksa koneksi hub\u2026",noSaved:"Belum ada akun tersimpan",noSavedHint:"Simpan akun Antigravity saat ini atau tambahkan akun Google lain.",cannotRemoveActive:"Akun aktif tidak dapat dihapus. Keluar (Sign out) terlebih dahulu.",cannotRemoveActiveDetail:"Akun ini sedang aktif di Antigravity. Keluar (Sign out) terlebih dahulu sebelum menghapusnya.",noActiveAccount:"Tidak Ada Akun Terhubung",noActiveAccountHint:"Masuk dengan akun Google Anda untuk mulai menggunakan Google Antigravity dan memantau kuota.",signInGoogle:"Masuk dengan Google",connecting:"Menghubungkan\u2026",connectingToAntigravity:"Menghubungkan ke Google Antigravity",connectingToAntigravityHint:"Sedang menyambungkan ke server Google. Akun aktif dan kuota Anda akan dimuat secara otomatis.",waitingForConnection:"Menunggu koneksi Google Antigravity siap sebelum dapat berpindah akun\u2026",antigravityOffline:"Antigravity Offline",antigravityOfflineHint:"Tidak dapat terhubung ke layanan backend Antigravity.",antigravityNotInstalled:"Belum Terpasang",antigravityNotInstalledHint:"Ekstensi resmi Google Antigravity belum terpasang.",noMatches:"Tidak ada akun yang cocok",noMatchesHint:"Coba label, nama, atau email lainnya.",searchPlaceholder:"Cari akun",sortBy:"Urutkan",sortQuota:"Sisa kuota",sortName:"Nama (A-Z)",sortRecent:"Terakhir dipakai",clearSearch:"Hapus pencarian",clearFilter:"Hapus filter",activeNow:"Sedang aktif",lastUsed:"Terakhir dipakai",editLabel:"Edit label",save:"Simpan",cancel:"Batal",removeLabel:"Hapus label",accountActions:"Tindakan akun",appearance:"Tampilan",theme:"Tema",language:"Bahasa",layout:"Tata letak",followVsCode:"Ikuti Tema Editor / IDE",light:"Terang",dark:"Gelap",system:"Sistem",automatic:"Otomatis",english:"English",indonesian:"Bahasa Indonesia",hideCurrent:"Sembunyikan akun saat ini",hideSaved:"Sembunyikan akun tersimpan",hideRuntime:"Sembunyikan status Antigravity",showQuotaAnalytics:"Tampilkan analisis kuota 7 hari",switchingAndAutomation:"Peralihan & Otomatisasi",quotaAndReminders:"Kuota & Pengingat",autoRefreshQuota:"Auto-refresh kuota",autoRefreshOff:"Nonaktif (Hanya manual)",every1Minute:"Setiap 1 menit",every5Minutes:"Setiap 5 menit (Disarankan)",every15Minutes:"Setiap 15 menit",every30Minutes:"Setiap 30 menit",every1Hour:"Setiap 1 jam",lowQuotaReminder:"Pemberitahuan kuota menipis",reminderThreshold:"Batas peringatan",percentRemaining:"% tersisa",smartQuotaFallback:"Peralihan Cepat saat Kuota Menipis",backupAndRestore:"Cadangan & Pemulihan",backupDesc:"Ekspor metadata akun tersimpan ke JSON atau pulihkan di perangkat lain.",exportAccounts:"Ekspor Akun",importAccounts:"Impor Akun",reconnectHub:"Sambungkan Ulang Hub",restartBackend:"Mulai Ulang Backend",processRecovery:"Pemulihan Proses",settingsHint:"Perubahan baru diterapkan setelah Simpan.",resetToDefault:"Atur Ulang ke Default",resetSettingsNotice:"Pengaturan dikembalikan ke nilai default. Klik Simpan untuk menerapkan.",googleExtension:"Ekstensi Google",officialExtension:"Ekstensi resmi Antigravity",agyBackend:"Backend AGY",localBackend:"Backend lokal Antigravity",hub:"Hub",localHub:"Hub Lokal",hubConnection:"Koneksi hub Antigravity",running:"Berjalan",stopped:"Berhenti",ready:"Siap",disconnected:"Tidak tersedia",version:"Versi",refreshing:"Menyegarkan status akun...",adding:"Membuka alur akun Google...",saving:"Menyimpan akun saat ini...",reauthenticating:"Melakukan autentikasi ulang...",signingOut:"Keluar dari akun...",switching:"Mengganti akun...",updatingLabel:"Memperbarui label akun...",savingSettings:"Menyimpan pengaturan...",stateUpdated:"Status akun diperbarui.",labelUpdated:"Label akun diperbarui.",settingsSaved:"Pengaturan disimpan.",collapse:"Ciutkan bagian",expand:"Buka bagian",currentAccountLabel:"Akun saat ini",developedBy:"Dikembangkan oleh",about:"Tentang",developer:"Developer",website:"Situs",removeSavedAccount:"Hapus akun tersimpan",switchAccountQuestion:"Ganti akun aktif?",switchAccountExplanation:"Antigravity akan mengganti sesi aktif ke akun ini. Operasi yang sedang berjalan mungkin akan disegarkan.",confirmSwitch:"Ganti Akun",removeSavedQuestion:"Hapus akun tersimpan?",removeSavedExplanation:"Ini hanya menghapus metadata lokal Account Switcher. Tindakan ini tidak mengeluarkan akun, menghapus akun Google, atau menghapus kredensial Google.",remove:"Hapus",accountRemoved:"Akun tersimpan dihapus.",usage:"Penggunaan",weeklyLimit:"Batas mingguan",fiveHourLimit:"Batas 5 jam",weeklyShort:"Mingguan",fiveHourShort:"5j",updated:"Diperbarui",models:"model",remaining:"tersisa",resetsIn:"Reset dalam",resetDue:"Waktunya reset",quotaRestored:"Dipulihkan",lastUpdated:"Terakhir diperbarui",quotaSnapshot:"Snapshot kuota",showAllModels:"Tampilkan semua model",showLess:"Tampilkan lebih sedikit",justNow:"baru saja",ago:"yang lalu",quotaUnavailable:"Penggunaan tidak tersedia",quotaUnavailableHint:"Antigravity tidak mengembalikan informasi kuota saat ini.",quotaHistory:"Analitik Kuota 7 Hari",searchAccountsPlaceholder:"Cari nama, email, atau grup...",highestQuota:"Kuota Tertinggi",earliestReset:"Reset Terdekat",nameAZ:"Nama (A-Z)",noMatchingAccounts:"Tidak ada akun yang cocok dengan filter.",liveData:"Data langsung",quotaHistorySub:"Sisa terendah harian",exportAnalytics:"Ekspor Analitik",autoRoundRobin:"Auto-Round-Robin (Ganti saat kuota habis)",enableQuotaAudio:"Notifikasi Suara Lembut (Web Audio)",quotaMatrix:"Matriks Kuota",quotaMatrixTitle:"Matriks Kuota Multi-Akun",quotaMatrixSub:"Perbandingan sisa kuota semua akun secara real-time",switchNow:"Ganti",noSnapshotYet:"Belum ada data kuota",instantSwitch:"Switch Instan (Tanpa Browser)",instantSwitchHint:"Beralih akun seketika menggunakan token sesi tersimpan tanpa membuka browser.",smartQuotaFallbackHint:"Tampilkan prompt 1-klik untuk beralih ke akun berkuota lebih banyak sebelum habis.",autoRoundRobinHint:"Otomatis rotasi ke akun dengan kuota tertinggi saat terkena rate limit (tanpa klik).",enableQuotaAudioHint:"Bunyikan nada audio lembut saat kuota reset atau mencapai batas kritis.",lowQuotaReminderHint:"Tampilkan notifikasi peringatan saat sisa kuota akun berada di bawah batas.",hideRuntimeHint:"Sembunyikan status runtime Antigravity dari bilah bawah.",hideCurrentHint:"Sembunyikan panel akun yang sedang aktif dari tampilan utama.",hideSavedHint:"Sembunyikan daftar dan pengelola akun tersimpan.",showQuotaAnalyticsHint:"Tampilkan grafik analitik dan riwayat kuota 7 hari terakhir.",instantBadge:"Instan",vaultTitle:"Brankas Token",purgeVault:"Bersihkan Brankas Token...",vaultInfo:"Tersimpan di Brankas Token terenkripsi untuk pergantian 1-klik tanpa login browser",plan:"Paket",accountPlan:"Paket Akun",selectPlan:"Pilih Paket",advancedTitle:"Lanjutan",proxyMode:"Mode Proxy",proxyModeSystem:"Bawaan Sistem / VS Code",proxyModeManual:"Proxy Kustom Manual",proxyModeDirect:"Langsung (Tanpa Proxy)",proxyUrl:"URL Server Proxy",proxyUrlPlaceholder:"http://127.0.0.1:7890 atau socks5://...",proxyStrictSSL:"Verifikasi SSL Ketat",proxyStrictSSLHint:"Nonaktifkan hanya jika menggunakan sertifikat proxy lokal/internal."}};function E(){return c.preferences?.effectiveLanguage==="id"?"id":"en"}function a(e){return Q[E()]?.[e]??Q.en[e]??e}function t(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function v(e,i="ui-icon"){const n=`class="${t(i)}" viewBox="0 0 16 16" fill="none" aria-hidden="true"`;return{refresh:`
                <svg ${n}>
                    <path
                        d="M13 4.5V1.8M13 1.8h-2.7M13 1.8A6 6 0 1 0 13.65 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,settings:`
                <svg ${n}>
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
            `,search:`
                <svg ${n}>
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
            `,edit:`
                <svg ${n}>
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
            `,trash:`
                <svg ${n}>
                    <path
                        d="M4.2 5.2h7.6M6 5.2V3.7h4v1.5M5.1 5.2l.55 7.1h4.7l.55-7.1M6.9 7.1v3.3M9.1 7.1v3.3"
                        stroke="currentColor"
                        stroke-width="1.15"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,plus:`
                <svg ${n}>
                    <path
                        d="M8 3.2v9.6M3.2 8h9.6"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,check:`
                <svg ${n}>
                    <path
                        d="m3.2 8.2 3 3 6.6-6.6"
                        stroke="currentColor"
                        stroke-width="1.45"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,close:`
                <svg ${n}>
                    <path
                        d="m4 4 8 8M12 4l-8 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,chevronDown:`
                <svg ${n}>
                    <path
                        d="m4.2 6.2 3.8 3.6 3.8-3.6"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,chevronRight:`
                <svg ${n}>
                    <path
                        d="m6.2 4.2 3.6 3.8-3.6 3.8"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,export:`
                <svg ${n}>
                    <path
                        d="M2.5 10v2.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V10M8 2.5v7.5M5 5.5l3-3 3 3"
                        stroke="currentColor"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,matrix:`
                <svg ${n}>
                    <rect x="2.2" y="2.2" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="9" y="2.2" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="2.2" y="9" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="9" y="9" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                </svg>
            `,key:`
                <svg ${n}>
                    <circle cx="5" cy="8" r="3" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M7.8 8H14M11.5 8v2M13.5 8v1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
            `,users:`
                <svg ${n}>
                    <circle cx="8" cy="5.2" r="2.8" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M2.5 13.5c0-2.4 2.5-4 5.5-4s5.5 1.6 5.5 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
            `,star:`
                <svg ${n}>
                    <path d="M8 2.5l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                </svg>
            `}[e]||""}function h(e){return String(e??"").trim().toLowerCase()}function I(e){if(c.preferences?.enableQuotaAudio!==!1)try{const i=window.AudioContext||window.webkitAudioContext;if(!i)return;const n=new i;e==="restored"?[523.25,659.25,783.99,1046.5].forEach((d,u)=>{const l=n.createOscillator(),r=n.createGain();l.type="sine",l.frequency.setValueAtTime(d,n.currentTime+u*.07),r.gain.setValueAtTime(.06,n.currentTime+u*.07),r.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+u*.07+.55),l.connect(r),r.connect(n.destination),l.start(n.currentTime+u*.07),l.stop(n.currentTime+u*.07+.55)}):e==="warning"&&[440,369.99].forEach((d,u)=>{const l=n.createOscillator(),r=n.createGain();l.type="sine",l.frequency.setValueAtTime(d,n.currentTime+u*.12),r.gain.setValueAtTime(.05,n.currentTime+u*.12),r.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+u*.12+.4),l.connect(r),r.connect(n.destination),l.start(n.currentTime+u*.12),l.stop(n.currentTime+u*.12+.4)})}catch{}}function B(){k.setState({search:s.search,sortBy:s.sortBy,sortCustomized:s.sortCustomized,currentCollapsed:s.currentCollapsed,savedCollapsed:s.savedCollapsed,runtimeCollapsed:s.runtimeCollapsed,usageCollapsed:s.usageCollapsed,accounts:c.accounts,current:c.current,runtime:c.runtime,usage:c.usage,usageSnapshots:c.usageSnapshots})}function L(e){A=e,g()}function Ae(){A=null}function q(e,i="info"){M={message:e,kind:i},T&&clearTimeout(T),T=setTimeout(()=>{M=null,T=null,g()},2600),g()}function xe(){return A?{refresh:a("refreshing"),add:a("adding"),save:a("saving"),reauth:a("reauthenticating"),signout:a("signingOut"),switch:a("switching"),label:a("updatingLabel"),settings:a("savingSettings"),remove:a("removeSavedAccount")}[A.type]||"Working...":""}function f(){return!!A}function Me(e,i){const n=String(e||"").trim()||String(i||"").split("@")[0],o=n.split(/\s+/).filter(Boolean);return o.length>=2?(o[0][0]+o[o.length-1][0]).toUpperCase():n.slice(0,2).toUpperCase()||"A"}function X(){if(!c.current)return null;const e=h(c.current.email);return c.accounts.find(i=>h(i.email)===e)||null}function U(e){const i=h(e);return c.accounts.find(n=>h(n.email)===i)}function O(e){return e.label||e.displayName||e.email}function P(e){const i=h(e.email),n=c.usageSnapshots?.[i];if(!n||!Array.isArray(n.buckets)||n.buckets.length===0)return;let o;for(const d of n.buckets)typeof d.remainingFraction=="number"&&!d.disabled&&(o===void 0||d.remainingFraction<o)&&(o=d.remainingFraction);return o!==void 0?Math.round(o*100):void 0}function j(){const e=s.search.trim().toLowerCase();let i=e?c.accounts.filter(o=>[o.label,o.displayName,o.email,o.group].filter(Boolean).join(" ").toLowerCase().includes(e)):c.accounts.slice();s.groupFilter&&s.groupFilter!=="all"&&(i=i.filter(o=>o.group===s.groupFilter));const n=h(c.current?.email);return i.sort((o,d)=>{const u=h(o.email)===n,l=h(d.email)===n;if(u!==l)return u?-1:1;const r=s.sortBy||"recent";if(r==="quota"){const p=P(o),m=P(d);if(p!==void 0&&m!==void 0){if(m!==p)return m-p}else{if(p!==void 0)return-1;if(m!==void 0)return 1}}else if(r==="recent"){const p=o.lastSeenAt?new Date(o.lastSeenAt).getTime():0,m=d.lastSeenAt?new Date(d.lastSeenAt).getTime():0;if(m!==p)return m-p}return(o.label||o.displayName||o.email).localeCompare(d.label||d.displayName||d.email)}),i}function ee(){const e=document.documentElement,i=c.preferences?.theme||"vscode";if(e.removeAttribute("data-ag-theme"),i==="light"||i==="dark"){e.setAttribute("data-ag-theme",i);return}if(i==="system"){const n=window.matchMedia("(prefers-color-scheme: dark)").matches;e.setAttribute("data-ag-theme",n?"dark":"light")}}function Te(){return A?`
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
                            ${t(xe())}
                        </span>
                    </div>
                </div>
            `:M?`
            <div
                class="toast-host"
                aria-live="polite"
                aria-atomic="true"
            >
                <div
                    class="toast ${t(M.kind)}"
                    role="status"
                >
                    <span
                        class="toast-symbol"
                        aria-hidden="true"
                    >
                        ${M.kind==="error"?"!":"\u2713"}
                    </span>

                    <span class="toast-message">
                        ${t(M.message)}
                    </span>
                </div>
            </div>
        `:""}function Ce(e,i,n,o=""){return`
            <div class="section-header">
                <button
                    type="button"
                    class="section-toggle"
                    data-action="${t(i)}"
                    aria-expanded="${n?"false":"true"}"
                    title="${t(a(n?"expand":"collapse"))}"
                >
                    <span
                        class="chevron"
                        aria-hidden="true"
                    >
                        ${v(n?"chevronRight":"chevronDown")}
                    </span>

                    <span class="section-title">
                        ${t(e)}
                    </span>
                </button>

                <div class="section-tools">
                    ${o}
                </div>
            </div>
        `}function Je(){return`
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
        `}function te(e){const i=["blue","green","purple","amber","rose","teal"];return`
            <div
                class="label-editor"
                data-editor-email="${t(e.email)}"
            >
                <div class="label-editor-input-row">
                    <input
                        class="label-input"
                        type="text"
                        value="${t(s.editValue)}"
                        data-role="label-input"
                        data-email="${t(e.email)}"
                        maxlength="80"
                        aria-label="${t(a("editLabel"))}"
                    >

                    <button
                        type="button"
                        class="icon-btn compact confirm"
                        data-action="save-label"
                        data-email="${t(e.email)}"
                        title="${t(a("save"))}"
                        aria-label="${t(a("save"))}"
                    >
                        ${v("check")}
                    </button>

                    <button
                        type="button"
                        class="icon-btn compact"
                        data-action="cancel-label"
                        data-email="${t(e.email)}"
                        title="${t(a("cancel"))}"
                        aria-label="${t(a("cancel"))}"
                    >
                        ${v("close")}
                    </button>
                </div>

                <div class="label-editor-colors">
                    ${i.map(n=>`
                        <button
                            type="button"
                            class="color-picker-dot color-${n} ${s.editColorTag===n?"selected":""}"
                            data-action="select-color-tag"
                            data-color="${n}"
                            title="${n}"
                            aria-label="${n}"
                        ></button>
                    `).join("")}
                    ${s.editColorTag?`
                        <button
                            type="button"
                            class="color-clear-btn"
                            data-action="select-color-tag"
                            data-color=""
                            title="Clear color"
                            aria-label="Clear color"
                        >\xD7</button>
                    `:""}
                </div>

                <div class="label-editor-groups">
                    <span class="label-editor-meta-title">Group:</span>
                    <div class="group-pills-row">
                        ${(()=>{const n=["Personal","Work"],o=(c.accounts||[]).map(u=>(u.group||"").trim()).filter(Boolean),d=Array.from(new Set([...n,...o]));return s.editGroup&&!d.includes(s.editGroup)&&d.push(s.editGroup),d.map(u=>`
                                <button
                                    type="button"
                                    class="group-tag-btn ${s.editGroup===u?"selected":""}"
                                    data-action="select-edit-group"
                                    data-group="${t(u)}"
                                >${t(u)}</button>
                            `).join("")})()}
                        ${s.customGroupInputOpen?`
                            <div class="custom-group-input-wrapper">
                                <input
                                    type="text"
                                    class="custom-group-input"
                                    id="custom-group-input"
                                    placeholder="Group..."
                                    value="${t(s.customGroupInputValue||"")}"
                                    maxlength="24"
                                />
                                <button
                                    type="button"
                                    class="custom-group-btn confirm"
                                    data-action="confirm-custom-group"
                                    title="Terapkan group"
                                    aria-label="Terapkan group"
                                >\u2713</button>
                                <button
                                    type="button"
                                    class="custom-group-btn cancel"
                                    data-action="cancel-custom-group"
                                    title="Batal"
                                    aria-label="Batal"
                                >\u2715</button>
                            </div>
                        `:`
                            <button
                                type="button"
                                class="group-tag-btn add-custom"
                                data-action="open-custom-group"
                                title="Tambah group baru"
                            >+ Custom</button>
                        `}
                        ${s.editGroup?`
                            <button
                                type="button"
                                class="color-clear-btn"
                                data-action="select-edit-group"
                                data-group=""
                                title="Clear group"
                                aria-label="Clear group"
                            >\xD7</button>
                        `:""}
                    </div>
                </div>
            </div>
        `}function Re(e){if(typeof e!="string")return"";const i=e.trim();if(i.startsWith("data:image/png;base64,")||i.startsWith("data:image/jpeg;base64,")||i.startsWith("data:image/webp;base64,")||i.startsWith("data:image/gif;base64,"))return i;try{const n=new URL(i),o=n.hostname.toLowerCase(),d=o==="googleusercontent.com"||o.endsWith(".googleusercontent.com")||o==="ggpht.com"||o.endsWith(".ggpht.com")||o==="gstatic.com"||o.endsWith(".gstatic.com")||o==="google.com"||o.endsWith(".google.com");return n.protocol!=="https:"||!d?"":n.toString()}catch{return""}}function W(e,i,n,o="",d=""){const u=Re(n),l=`
            <span class="avatar-fallback">
                ${t(Me(e,i))}
            </span>
        `;return`
            <div
                class="avatar ${t(o)} ${u?"has-image":""}"
                aria-hidden="true"
            >
                ${l}

                ${u?`
                            <img
                                class="avatar-image"
                                src="${t(u)}"
                                alt=""
                                referrerpolicy="no-referrer"
                                draggable="false"
                                onerror="this.style.display='none'"
                            >
                        `:""}

                ${d}
            </div>
        `}function qe(e){if(!e)return null;const i=typeof e.plan=="string"?e.plan.trim():"",n=typeof e.g1Tier=="string"?e.g1Tier.trim():"",o=i||n,d=e.isPro===!0;if(!o&&!d)return null;let u="",l="plan-free",r="";const p=o.toUpperCase();if(p.includes("ULTRA"))u="Google AI Ultra",l="plan-ultra",r="\u{1F31F}";else if(p.includes("PLUS"))u="Google AI Plus",l="plan-plus",r="\u2728";else if(p.includes("AI_PREMIUM")||p.includes("PREMIUM"))u="Google AI Plus",l="plan-plus",r="\u2728";else if(p.includes("PRO")||d)u="Google AI Pro",l="plan-pro",r="\u26A1";else if(p.includes("ENTERPRISE"))u="Google AI Enterprise",l="plan-pro",r="\u{1F3E2}";else if(p.includes("FREE")||p.includes("STANDARD"))u="Google AI Free",l="plan-free",r="\u2726";else if(o)u=o.replace(/^G1_TIER_/,"").replace(/_/g," "),l="plan-custom",r="\u2728";else return null;return{name:u,className:l,icon:r}}function K(e){try{const i=qe(e);return!i||!i.name?"":`
                <span class="plan-pill ${t(i.className)}" title="${t(`Plan: ${i.name}`)}">
                    <span class="plan-icon" aria-hidden="true">${i.icon}</span>
                    <span class="plan-text">${t(i.name)}</span>
                </span>
            `}catch{return""}}function ae(e){return typeof e!="number"||!Number.isFinite(e)?null:Math.max(0,Math.min(100,e*100))}function ne(e){const i=ae(e);if(i===null)return"\u2014";const n=Math.round(i*100)/100;return(Number.isInteger(n)?String(n):n.toFixed(2))+"%"}function z(e){if(!e||typeof e.remainingFraction!="number"||!Number.isFinite(e.remainingFraction))return null;if(e.resetTime){const i=new Date(e.resetTime).getTime();if(Number.isFinite(i)&&i<=Date.now())return 1}return e.remainingFraction}function ie(e){const i=Math.max(0,Math.floor(e/6e4));if(i<1)return"<1m";const n=Math.floor(i/1440),o=Math.floor(i%1440/60),d=i%60,u=[];return n>0&&u.push(`${n}d`),o>0&&u.push(`${o}h`),n===0&&d>0&&u.push(`${d}m`),u.slice(0,2).join(" ")||"<1m"}function D(e){if(!e)return"";const i=new Date(e).getTime();if(!Number.isFinite(i))return"";const n=i-Date.now();if(n<=0){const o=new Date(e),d=String(o.getHours()).padStart(2,"0"),u=String(o.getMinutes()).padStart(2,"0"),r=o.toDateString()===new Date().toDateString()?`${d}:${u}`:`${o.getDate()}/${o.getMonth()+1} ${d}:${u}`;return`${a("quotaRestored")||a("resetDue")} (${r})`}return`${a("resetsIn")} `+ie(n)}function N(e){if(!e)return"";const i=new Date(e).getTime();if(!Number.isFinite(i))return"";const n=Math.max(0,Date.now()-i);return n<6e4?a("justNow"):`${ie(n)} `+a("ago")}function Le(e){const i=String(e?.window||"").trim().toLowerCase();return i==="weekly"?a("weeklyLimit"):i==="5h"?a("fiveHourLimit"):e?.displayName||e?.window||"Quota"}function He(e){const i={weekly:0,"5h":1};return[...Array.isArray(e)?e:[]].sort((n,o)=>{const d=String(n?.window||"").toLowerCase(),u=String(o?.window||"").toLowerCase();return(i[d]??99)-(i[u]??99)})}function Ee(e){const i=z(e),n=ae(i),o=ne(i),d=D(e.resetTime),u=Le(e),l=t(u).replace(/\s+/,"<br>");return`
            <div
                class="quota-bucket ${e.disabled?"disabled":""}"
                data-window="${t(e.window||"")}"
            >
                <div class="quota-bucket-heading">
                    <span
                        class="quota-window-name"
                        title="${t(e.description||u)}"
                    >
                        ${l}
                    </span>

                    <strong class="quota-percent">
                        ${t(o)}
                    </strong>
                </div>

                <progress
                    class="quota-progress"
                    max="100"
                    value="${n===null?0:n}"
                    aria-label="${t(u)}"
                    aria-valuetext="${t(`${o} ${a("remaining")}`)}"
                ></progress>

                <div class="quota-bucket-meta">
                    ${d?`
                                <span
                                    class="quota-reset"
                                    data-reset-at="${t(e.resetTime||"")}"
                                >
                                    ${t(d)}
                                </span>
                            `:""}
                </div>
            </div>
        `}function se(e){const i=String(e?.displayName||"").trim(),n=i.toLowerCase();return n==="gemini models"||n==="gemini"?"Gemini":n==="claude and gpt models"||n==="claude and gpt"?"Claude and GPT":i||"Quota"}function Xe(e){const i=He(e.buckets),n=se(e),o=String(e?.description||"").trim();return`
            <div class="quota-group">
                <div class="quota-group-heading">
                    <span
                        class="quota-group-title"
                        title="${t(n)}"
                    >
                        ${t(n)}
                    </span>

                    ${o?`
                                <button
                                    type="button"
                                    class="quota-info-button"
                                    title="${t(o)}"
                                    aria-label="${t(`${n}: ${o}`)}"
                                >
                                    i
                                </button>
                            `:""}
                </div>

                <div class="quota-buckets">
                    ${i.map(Ee).join("")}
                </div>
            </div>
        `}function Ie(){const e=c.usage,i=Array.isArray(e?.groups)?e.groups:[],n=e?.fetchedAt?N(e.fetchedAt):"",o=i.length>0?de(e):`
                <div class="usage-empty secondary-text">
                    ${t(c.usageError||a("quotaUnavailable"))}
                </div>
            `;return`
            <div class="usage-section current-usage-section">
                <div class="usage-heading">
                    <span class="usage-title">
                        ${t(a("usage"))}
                    </span>

                    ${n?`
                                <span
                                    class="usage-updated"
                                    data-usage-fetched-at="${t(e.fetchedAt)}"
                                    title="${t(`${a("updated")} ${n}`)}"
                                >
                                    ${t(n)}
                                </span>
                            `:""}
                </div>

                <div class="current-usage-body saved-account-quota-area">
                    ${o}
                </div>
            </div>
        `}function Be(){const e=[],i=new Date;for(let n=6;n>=0;n--){const o=new Date(i);o.setDate(o.getDate()-n);const d=o.toISOString().split("T")[0],u=o.toLocaleDateString(E()==="id"?"id-ID":"en-US",{weekday:"short"});e.push({date:d,label:u})}return e}function Ge(e){if(!e)return"";const i=c.quotaHistory||{},n=h(e),o=i[n]||[],u=Be().map(l=>{const r=o.find(S=>S.date===l.date),p=r&&typeof r.lowestRemainingPercent=="number",m=p?r.lowestRemainingPercent:null;let y="history-empty";p&&(y=m<=15?"history-critical":m<=35?"history-warn":"history-healthy");const b=p?`${Math.max(12,m)}%`:"4px",x=p?`${l.label} (${l.date}): ${m}% ${a("remaining")}`:`${l.label} (${l.date}): -`;return`
                <div class="history-bar-col" title="${t(x)}">
                    <div class="history-bar-track">
                        <div class="history-bar-fill ${y}" style="height: ${b};"></div>
                    </div>
                    <span class="history-bar-label">${t(l.label)}</span>
                    <span class="history-bar-pct">${p?`${m}%`:"-"}</span>
                </div>
            `}).join("");return`
            <div class="quota-history-panel">
                <div class="quota-history-header">
                    <div class="quota-history-title-group">
                        <span class="quota-history-title">${t(a("quotaHistory"))}</span>
                        <span class="quota-history-sub secondary-text">${t(a("quotaHistorySub"))}</span>
                    </div>
                    <button type="button" class="export-analytics-btn" data-action="export-quota-analytics" title="${t(a("exportAnalytics"))}">
                        ${v("export","export-btn-icon")}
                        <span>${t(a("exportAnalytics"))}</span>
                    </button>
                </div>
                <div class="history-bars-container">
                    ${u}
                </div>
            </div>
        `}function Qe(){document.querySelectorAll(".avatar-image").forEach(e=>{e.addEventListener("error",()=>{e.hidden=!0,e.closest(".avatar")?.classList.remove("has-image")},{once:!0})})}function oe(){document.querySelectorAll("[data-reset-at]").forEach(e=>{const i=D(e.dataset.resetAt),n=e.dataset.resetPrefix||"";e.textContent=i?n+i:""}),document.querySelectorAll("[data-reset-time]").forEach(e=>{const i=e.dataset.resetTime;if(i){const n=new Date(i).getTime();Number.isFinite(n)&&n<=Date.now()?e.textContent="100%":e.dataset.initialPercent&&(e.textContent=e.dataset.initialPercent)}}),document.querySelectorAll("[data-usage-fetched-at]").forEach(e=>{e.textContent=N(e.dataset.usageFetchedAt)}),document.querySelectorAll("[data-snapshot-fetched-at]").forEach(e=>{e.textContent=N(e.dataset.snapshotFetchedAt)})}function Pe(){if(c.preferences?.hideCurrent===!0||c.preferences?.showCurrent===!1)return"";const e=!!c.loading,i=`
            <div class="section-header current-static-header">
                <div class="section-static-title">
                    <span class="section-title">
                        ${t(a("currentAccount"))}
                    </span>
                </div>
            </div>
        `;if(!c.current){const r=c.connectionState||(e?"connecting":"disconnected");return r==="connecting"||e?`
                    <section class="section current-section">
                        ${i}

                        <div
                            class="current-state-panel connecting"
                            role="status"
                            aria-live="polite"
                        >
                            <div class="connecting-header-row">
                                <span class="connection-state inline connecting">
                                    <span class="status-dot pulsing"></span>
                                    ${t(a("connecting"))}
                                </span>
                            </div>

                            <strong class="connecting-title">
                                ${t(a("connectingToAntigravity"))}
                            </strong>

                            <div class="secondary-text connecting-desc">
                                ${t(a("connectingToAntigravityHint"))}
                            </div>

                            <div class="connecting-pulse-container" aria-hidden="true">
                                <div class="connecting-pulse-bar"></div>
                            </div>

                            <div class="connecting-actions">
                                <button
                                    type="button"
                                    class="btn secondary-btn compact"
                                    data-action="refresh"
                                    ${f()?"disabled":""}
                                >
                                    ${v("refresh")}
                                    <span>${t(a("refresh"))}</span>
                                </button>
                            </div>
                        </div>
                    </section>
                `:r==="not_installed"?`
                    <section class="section current-section">
                        ${i}

                        <div
                            class="current-state-panel empty-disconnected not-installed"
                            role="region"
                            aria-label="${t(a("antigravityNotInstalled"))}"
                        >
                            <div class="disconnected-header-row">
                                <span class="connection-state inline disconnected">
                                    <span class="status-dot"></span>
                                    ${t(a("antigravityNotInstalled"))}
                                </span>
                            </div>

                            <strong class="disconnected-title">
                                ${t(a("antigravityNotInstalled"))}
                            </strong>

                            <div class="secondary-text disconnected-desc">
                                ${t(a("antigravityNotInstalledHint"))}
                            </div>

                            <div class="disconnected-actions">
                                <button
                                    type="button"
                                    class="btn secondary-btn compact"
                                    data-action="refresh"
                                    ${f()?"disabled":""}
                                >
                                    ${v("refresh")}
                                    <span>${t(a("refresh"))}</span>
                                </button>
                            </div>
                        </div>
                    </section>
                `:r==="offline"?`
                    <section class="section current-section">
                        ${i}

                        <div
                            class="current-state-panel empty-disconnected offline"
                            role="region"
                            aria-label="${t(a("antigravityOffline"))}"
                        >
                            <div class="disconnected-header-row">
                                <span class="connection-state inline disconnected error-state">
                                    <span class="status-dot error"></span>
                                    ${t(a("antigravityOffline"))}
                                </span>
                            </div>

                            <strong class="disconnected-title">
                                ${t(a("antigravityOffline"))}
                            </strong>

                            <div class="secondary-text disconnected-desc">
                                ${t(a("antigravityOfflineHint"))}
                            </div>

                            <div class="disconnected-actions">
                                <button
                                    type="button"
                                    class="btn primary-btn empty-cta-btn"
                                    data-action="restart-backend"
                                    ${f()?"disabled":""}
                                >
                                    ${v("refresh")}
                                    <span>${t(a("restartBackend"))}</span>
                                </button>

                                <button
                                    type="button"
                                    class="btn secondary-btn compact"
                                    data-action="refresh"
                                    ${f()?"disabled":""}
                                >
                                    ${v("refresh")}
                                    <span>${t(a("refresh"))}</span>
                                </button>
                            </div>
                        </div>
                    </section>
                `:`
                <section class="section current-section">
                    ${i}

                    <div
                        class="current-state-panel empty-disconnected"
                        role="region"
                        aria-label="${t(a("noActiveAccount"))}"
                    >
                        <div class="disconnected-header-row">
                            <span class="connection-state inline disconnected">
                                <span class="status-dot"></span>
                                ${t(a("disconnected"))}
                            </span>
                        </div>

                        <strong class="disconnected-title">
                            ${t(a("noActiveAccount"))}
                        </strong>

                        <div class="secondary-text disconnected-desc">
                            ${t(a("noActiveAccountHint"))}
                        </div>

                        <div class="disconnected-actions">
                            <button
                                type="button"
                                class="btn primary-btn empty-cta-btn"
                                data-action="add"
                                ${f()?"disabled":""}
                            >
                                ${v("plus")}
                                <span>${t(a("signInGoogle"))}</span>
                            </button>

                            <button
                                type="button"
                                class="btn secondary-btn compact"
                                data-action="refresh"
                                ${f()?"disabled":""}
                            >
                                ${v("refresh")}
                                <span>${t(a("refresh"))}</span>
                            </button>
                        </div>
                    </div>
                </section>
            `}const n=X(),o=c.current.displayName||n?.displayName||c.current.email,d=n&&h(s.editingEmail)===h(n.email),u=n?.label||a("currentAccountLabel"),l=`
            <span class="connection-state inline ${e?"checking":""}">
                <span class="status-dot"></span>

                ${t(a(e?"checking":"connected"))}
            </span>
        `;return`
            <section class="section current-section">
                ${i}

                <div
                    class="current-panel"
                    aria-label="${t(a("currentAccount"))}"
                >
                    <div class="identity-row current-identity-row">
                        ${W(o,c.current.email,c.current.profilePictureUrl||n?.profilePictureUrl,n?.colorTag?`current-avatar tag-${t(n.colorTag)}`:"current-avatar")}


                        <div class="identity">
                            ${n&&d?`
                                        <div class="current-label-editor">
                                            ${te(n)}
                                        </div>
                                    `:`
                                        <div class="saved-title-row current-title-row">
                                            <div
                                                class="identity-name current-name"
                                                title="${t(n?.label&&n.label.trim()&&n.label.trim()!==o?`${n.label.trim()} (${o})`:o)}"
                                            >
                                                ${n?.colorTag?`<span class="color-tag-dot tag-${t(n.colorTag)}" title="${t(n.colorTag)}"></span>`:""}${t(n?.label&&n.label.trim()?n.label.trim():o)}
                                            </div>

                                            <div class="saved-title-actions">
                                                ${n?`
                                                            <button
                                                                type="button"
                                                                class="edit-icon"
                                                                data-action="edit-label"
                                                                data-email="${t(n.email)}"
                                                                title="${t(a("editLabel"))}"
                                                                aria-label="${t(a("editLabel"))}"
                                                                ${f()?"disabled":""}
                                                            >
                                                                ${v("edit")}
                                                            </button>
                                                        `:""}
                                            </div>
                                        </div>

                                        <div
                                            class="identity-email"
                                            title="${t(c.current.email)}"
                                        >
                                            ${t(c.current.email)}
                                        </div>

                                        <div class="saved-badges-row current-badges-row">
                                            ${K(n?.plan?n:c.current)}

                                            ${c.vaultedEmails?.includes(h(c.current.email))?`
                                                        <span class="vault-pill" title="${t(a("vaultInfo"))}">
                                                            \u26A1 ${t(a("instantBadge"))}
                                                        </span>
                                                    `:""}

                                            ${n?.group?`
                                                        <span class="group-pill" title="Group: ${t(n.group)}">
                                                            \u{1F3F7}\uFE0F ${t(n.group)}
                                                        </span>
                                                    `:""}

                                            ${l}
                                        </div>
                                    `}
                        </div>
                    </div>

                    <div class="action-row">
                        <button
                            type="button"
                            class="btn"
                            data-action="reauth"
                            ${e||f()?"disabled":""}
                        >
                            ${t(a("reauth"))}
                        </button>

                        <button
                            type="button"
                            class="btn subtle-danger"
                            data-action="signout"
                            ${e||f()?"disabled":""}
                        >
                            ${t(a("signout"))}
                        </button>
                    </div>

                    ${Ie()}
                    ${c.preferences?.showQuotaAnalytics?Ge(c.current.email):""}
                </div>
            </section>
        `}function re(e,i){return(Array.isArray(e?.groups)?e.groups:[]).find(o=>i(String(o.displayName||"").toLowerCase()))}function le(e,i){return(Array.isArray(e?.buckets)?e.buckets:[]).find(n=>String(n.window||"").toLowerCase()===i)}function ce(e){return ne(z(e))}function ue(e,i){if(!i)return"";const n=le(i,"weekly"),o=le(i,"5h"),d=D(n?.resetTime),u=D(o?.resetTime),l=(r,p,m,y)=>`
                <div class="saved-quota-pair">
                    <div class="saved-usage-metric">
                        <span class="saved-usage-metric-label">
                            ${t(r)}
                        </span>

                        <span
                            class="saved-usage-metric-value"
                            ${p?.resetTime?`data-reset-time="${t(p.resetTime)}"`:""}
                            ${typeof p?.remainingFraction=="number"?`data-initial-percent="${t(ce(p))}"`:""}
                        >
                            ${t(ce(p))}
                        </span>
                    </div>

                    ${m?`
                                <div
                                    class="saved-quota-reset ${t(y)}"
                                    data-reset-at="${t(p?.resetTime||"")}"
                                    data-reset-prefix=""
                                >
                                    ${t(m)}
                                </div>
                            `:""}
                </div>
            `;return`
            <div class="saved-usage-family-column">
                <div class="saved-usage-family">
                    ${t(e)}
                </div>

                <div class="saved-usage-metrics">
                    ${l(a("weeklyShort"),n,d,"saved-weekly-reset")}

                    ${l(a("fiveHourShort"),o,u,"saved-five-hour-reset")}
                </div>
            </div>
        `}function de(e){if(!e)return"";const i=re(e,o=>o.includes("gemini")),n=re(e,o=>o.includes("claude")||o.includes("gpt"));return!i&&!n?"":`
            <div class="saved-usage-summary">
                ${ue("Gemini",i)}

                ${ue("Claude + GPT",n)}
            </div>
        `}function De(e){const i=h(c.current?.email),n=!!i&&h(e.email)===i,o=h(s.editingEmail)===h(e.email),d=!!(c.loading&&(!c.accounts||c.accounts.length===0)),u=c.usageSnapshots?.[h(e.email)],l=n&&c.usage||u,r=l?.fetchedAt?N(l.fetchedAt):"",p=n?a("activeNow")||"Active now":e.lastSeenAt?N(e.lastSeenAt):"",m=[];if(n?m.push(a("active")||"Active account"):e.lastSeenAt&&m.push(`${a("lastUsed")||"Last used"}: ${new Date(e.lastSeenAt).toLocaleString()}`),r){const x=n?a("liveData")||"Live data":a("updated")||"Snapshot updated";m.push(`${x}: ${r}`)}const y=m.join(" \u2022 "),b=p?`
                <span class="last-seen-pill ${n?"active":""}" title="${t(y)}">
                    <span class="last-seen-clock" aria-hidden="true">\u23F1</span>
                    <span>${t(p)}</span>
                </span>
            `:"";return`
            <article
                class="account-row saved-account-row ${n?"active":""}"
                data-email="${t(e.email)}"
                ${n?'aria-current="true"':""}
            >
                <div class="saved-account-rail">
                    ${W(e.displayName||e.label,e.email,e.profilePictureUrl||(n?c.current?.profilePictureUrl:void 0),`small ${e.colorTag?`tag-${t(e.colorTag)}`:""}`,n?`
                                    <span
                                        class="saved-avatar-active-badge"
                                        title="${t(a("active"))}"
                                    >
                                        <span aria-hidden="true">\u2713</span>
                                    </span>
                                `:"")}
                    ${n?`
                                <span
                                    class="saved-rail-badge active-badge"
                                    title="${t(a("active"))}"
                                >
                                    ${t(a("active"))}
                                </span>
                            `:`
                                <button
                                    type="button"
                                    class="saved-rail-badge switch-badge-btn"
                                    data-action="switch"
                                    data-email="${t(e.email)}"
                                    title="${t(a("switch"))}"
                                    aria-label="${t(a("switch"))}"
                                    ${d||f()?"disabled":""}
                                >
                                    <span
                                        class="badge-icon"
                                        aria-hidden="true"
                                    >
                                        \u21C4
                                    </span>
                                    <span>${t(a("switch"))}</span>
                                </button>
                            `}
                </div>
                <div class="identity saved-account-identity">
                    ${o?te(e):`
                                <div class="saved-title-row">
                                    <div
                                        class="identity-name saved-label"
                                        title="${t(O(e))}"
                                    >
                                        ${e.colorTag?`<span class="color-tag-dot tag-${t(e.colorTag)}" title="${t(e.colorTag)}"></span>`:""}${t(O(e))}
                                    </div>

                                    <div class="saved-title-actions">

                                        <button
                                            type="button"
                                            class="edit-icon"
                                            data-action="edit-label"
                                            data-email="${t(e.email)}"
                                            title="${t(a("editLabel"))}"
                                            aria-label="${t(a("editLabel"))}"
                                            ${f()?"disabled":""}
                                        >
                                            ${v("edit")}
                                        </button>

                                        <button
                                            type="button"
                                            class="icon-btn compact delete-account-btn ${n?"disabled is-active-locked":""}"
                                            ${n?'data-action="active-locked-remove"':'data-action="remove-account"'}
                                            data-email="${t(e.email)}"
                                            title="${t(a(n?"cannotRemoveActive":"removeSavedAccount"))}"
                                            aria-label="${t(a(n?"cannotRemoveActive":"removeSavedAccount"))}"
                                            ${n?'aria-disabled="true"':f()?"disabled":""}
                                        >
                                            ${v("trash")}
                                        </button>
                                    </div>
                                </div>

                                <div class="saved-meta-row">
                                    <div
                                        class="identity-email"
                                        title="${t(e.email)}"
                                    >
                                        ${t(e.email)}
                                    </div>

                                    <div class="saved-badges-row">
                                        ${K(e)}

                                        ${c.vaultedEmails?.includes(h(e.email))?`
                                                    <span class="vault-pill" title="${t(a("vaultInfo"))}">
                                                        \u26A1 ${t(a("instantBadge"))}
                                                    </span>
                                                `:""}

                                        ${e.group?`
                                                    <span class="group-pill" title="Group: ${t(e.group)}">
                                                        \u{1F3F7}\uFE0F ${t(e.group)}
                                                    </span>
                                                `:""}

                                        ${b}
                                    </div>
                                </div>


                            `}


                </div>

                <div class="saved-account-quota-area">
                    ${de(l)}
                </div>
            </article>
        `}function pe(){if(c.loading&&!Array.isArray(c.accounts))return`
                <div class="saved-loading-panel" role="status" aria-live="polite">
                    <div class="saved-loading-spinner-row">
                        <span class="loading-spin-icon">${v("refresh")}</span>
                        <strong>${t(a("loadingSavedAccounts"))}</strong>
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
            `;const e=j();return!c.accounts||c.accounts.length===0?`
                <div class="empty-panel saved-empty-card">
                    <div class="empty-panel-icon">
                        ${v("users")}
                    </div>

                    <strong class="empty-panel-title">
                        ${t(a("noSaved"))}
                    </strong>

                    <div class="secondary-text empty-panel-desc">
                        ${t(a("noSavedHint"))}
                    </div>

                    <div class="empty-panel-actions">
                        ${c.current?.email?`
                                    <button
                                        type="button"
                                        class="btn primary-btn empty-cta-btn"
                                        data-action="save"
                                        ${f()?"disabled":""}
                                    >
                                        ${v("star")}
                                        <span>${t(a("saveCurrent"))}</span>
                                    </button>
                                `:`
                                    <button
                                        type="button"
                                        class="btn primary-btn empty-cta-btn"
                                        data-action="add"
                                        ${f()?"disabled":""}
                                    >
                                        ${v("plus")}
                                        <span>${t(a("signInGoogle"))}</span>
                                    </button>
                                `}
                    </div>
                </div>
            `:e.length===0?`
                <div class="empty-panel">
                    <strong>
                        ${t(a("noMatches"))}
                    </strong>

                    <div class="secondary-text">
                        ${t(a("noMatchesHint"))}
                    </div>

                    ${s.search.trim()||s.groupFilter!=="all"?`
                        <div style="margin-top: 10px;">
                            <button type="button" class="btn compact" data-action="clear-search">
                                ${t(a("clearFilter")||"Clear filter")}
                            </button>
                        </div>
                    `:""}
                </div>
            `:e.map(De).join("")}function Ne(){if(c.preferences?.hideSaved===!0||c.preferences?.showSaved===!1)return"";const e=j().length,i=(c.accounts?.length||0)>3,n=!!c.loading&&(!c.accounts||c.accounts.length===0),o=!!c.loading&&(c.accounts?.length||0)>0,d=n?"\u2026":s.search.trim()?`${e}/${c.accounts.length}`:String(c.accounts.length),u=`
            <div class="saved-header-actions">
                ${o?`
                            <span
                                class="refreshing-indicator"
                                title="${t(a("updatingQuota"))}"
                                aria-label="${t(a("updatingQuota"))}"
                            >
                                <span class="loading-spin-icon">
                                    ${v("refresh")}
                                </span>
                            </span>
                        `:""}

                <span
                    id="account-count"
                    class="count"
                    title="${t(a("savedAccounts"))}"
                >
                    ${t(d)}
                </span>

                <button
                    type="button"
                    class="icon-btn compact saved-add-btn"
                    data-action="add"
                    title="${t(a("addGoogleAccount"))}"
                    aria-label="${t(a("addGoogleAccount"))}"
                    ${f()?"disabled":""}
                >
                    ${v("plus")}
                </button>
            </div>
        `;return`
            <section class="section saved-section">
                ${Ce(a("savedAccounts"),"toggle-saved",s.savedCollapsed,u)}

                ${s.savedCollapsed?"":`
                            <div class="saved-body">
                                <div class="saved-controls">
                                    ${(c.accounts?.length||0)>0?`
                                                <div class="saved-filter-row">
                                                    <div class="search-wrap">
                                                        <span
                                                            class="search-icon"
                                                            aria-hidden="true"
                                                        >
                                                            ${v("search")}
                                                        </span>

                                                        <input
                                                            id="account-search"
                                                            class="search-input"
                                                            type="search"
                                                            value="${t(s.search)}"
                                                            placeholder="${t(a("searchPlaceholder"))}"
                                                            autocomplete="off"
                                                            spellcheck="false"
                                                        >

                                                        <button
                                                            type="button"
                                                            class="search-clear-btn"
                                                            data-action="clear-search"
                                                            style="display: ${s.search?"inline-flex":"none"};"
                                                            title="${t(a("clearSearch")||"Clear search")}"
                                                            aria-label="${t(a("clearSearch")||"Clear search")}"
                                                        >
                                                            \u2715
                                                        </button>
                                                    </div>

                                                    <div class="sort-wrap">
                                                        <select
                                                            id="account-sort"
                                                            class="sort-select"
                                                            data-action="change-sort"
                                                            aria-label="${t(a("sortBy"))}"
                                                            title="${t(a("sortBy"))}"
                                                        >
                                                            <option value="recent" ${s.sortBy==="recent"?"selected":""}>${t(a("sortRecent"))}</option>
                                                            <option value="quota" ${s.sortBy==="quota"?"selected":""}>${t(a("sortQuota"))}</option>
                                                            <option value="name" ${s.sortBy==="name"?"selected":""}>${t(a("sortName"))}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                ${(()=>{const l=Array.from(new Set((c.accounts||[]).map(r=>r.group).filter(Boolean)));return l.length===0?"":`
                                                        <div class="saved-group-filter-row">
                                                            <button type="button" class="group-filter-chip ${s.groupFilter==="all"?"active":""}" data-action="set-group-filter" data-group="all">All (${c.accounts.length})</button>
                                                            ${l.map(r=>{const p=c.accounts.filter(m=>m.group===r).length;return`<button type="button" class="group-filter-chip ${s.groupFilter===r?"active":""}" data-action="set-group-filter" data-group="${t(r)}">${t(r)} (${p})</button>`}).join("")}
                                                        </div>
                                                    `})()}
                                            `:""}

                                    ${c.current&&!X()?`
                                                <button
                                                    type="button"
                                                    class="btn block"
                                                    data-action="save"
                                                    ${f()?"disabled":""}
                                                >
                                                    ${t(a("saveCurrentAccount"))}
                                                </button>
                                            `:""}
                                </div>

                                <div
                                    id="saved-account-list"
                                    class="account-list"
                                    tabindex="0"
                                >
                                    ${pe()}
                                </div>
                            </div>
                        `}
            </section>
        `}function Z(e,i,n,o,d){return`
            <div class="runtime-row">
                <div
                    class="runtime-symbol"
                    aria-hidden="true"
                >
                    ${t(e)}
                </div>

                <div class="runtime-copy">
                    <div class="runtime-name">
                        ${t(i)}
                    </div>

                    <div class="runtime-detail">
                        ${t(n)}
                    </div>
                </div>

                <div
                    class="runtime-state ${t(o)}"
                >
                    <span class="status-dot"></span>
                    ${t(d)}
                </div>
            </div>
        `}function Ue(){if(c.preferences?.hideRuntime===!0||c.preferences?.showRuntime===!1)return"";const e=!!c.loading,i=c.runtime||{},n=i.extension||{},o=i.process||null,d=i.health||null,u=!!n.installed,l=!!o,r=!!d?.reachable,p=u&&l&&r,m=c.connectionState||(e?"connecting":p?"connected":"offline");let y="healthy",b=a("ready");return m==="connecting"||e?(y="connecting",b=a("connecting")):m==="not_installed"?(y="warning",b=a("antigravityNotInstalled")):m==="offline"?(y="warning",b=a("antigravityOffline")):m==="disconnected"||m==="connected"||p?(y="healthy",b=a("ready")):(y="warning",b=a("disconnected")),`
            <div class="runtime-status-bar">
                <button
                    type="button"
                    class="runtime-status-pill ${t(y)}"
                    data-action="open-runtime-modal"
                    title="${t(a("antigravityStatus"))} \xB7 ${t(b)}"
                    aria-label="${t(a("antigravityStatus"))}"
                >
                    <span class="status-dot"></span>
                    <span class="runtime-status-pill-label">Antigravity:</span>
                    <span class="runtime-status-pill-value">${t(b)}</span>
                </button>
                <button
                    type="button"
                    class="quota-matrix-trigger-btn"
                    data-action="open-quota-matrix"
                    title="${t(a("quotaMatrixTitle"))}"
                    aria-label="${t(a("quotaMatrixTitle"))}"
                >
                    ${v("matrix","quota-matrix-icon")}
                    <span>${t(a("quotaMatrix"))}</span>
                </button>
            </div>
        `}function Oe(){if(!s.runtimeModalOpen)return"";const e=!!c.loading,i=c.runtime||{},n=i.extension||{},o=i.process||null,d=i.health||null,u=!!n.installed,l=!!o,r=!!d?.reachable,p=u&&l&&r,m=e?"checking":p?"healthy":"warning",y=a(e?"checking":p?"ready":"disconnected");return`
            <div
                class="runtime-modal-backdrop"
                data-action="runtime-modal-backdrop"
            >
                <section
                    class="runtime-modal-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${t(a("antigravityStatus"))}"
                >
                    <header class="runtime-modal-header">
                        <div class="runtime-modal-title">
                            <span class="status-dot ${t(m)}"></span>
                            <h2>${t(a("antigravityStatus"))}</h2>
                        </div>

                        <button
                            type="button"
                            class="icon-btn"
                            data-action="close-runtime-modal"
                            aria-label="${t(a("cancel")||"Close")}"
                            title="${t(a("cancel")||"Close")}"
                        >
                            ${v("close")}
                        </button>
                    </header>

                    <div class="runtime-modal-body">
                        <div class="runtime-panel">
                            ${Z("G",a("googleExtension"),e?a("checkingExtension"):n.version?`${a("version")} ${n.version}`:a("officialExtension"),e?"checking":u?"healthy":"error",a(e?"checking":u?"connected":"disconnected"))}

                            ${Z("A",a("agyBackend"),e?a("checkingBackend"):i.agyVersion?`${a("version")} ${i.agyVersion}`:a("localBackend"),e?"checking":l?"healthy":"error",a(e?"checking":l?"running":"stopped"))}

                            ${Z("H",a("hub"),a(e?"checkingHub":r?"localHub":"hubConnection"),e?"checking":r?"healthy":"error",a(e?"checking":r?"connected":"disconnected"))}
                        </div>

                        <div class="runtime-actions-panel">
                            <h3>${t(a("processRecovery"))}</h3>
                            <div class="runtime-actions-row">
                                <button
                                    type="button"
                                    class="btn"
                                    data-action="reconnect-hub"
                                    ${e?"disabled":""}
                                >
                                    ${t(a("reconnectHub"))}
                                </button>
                                <button
                                    type="button"
                                    class="btn danger-btn"
                                    data-action="restart-backend"
                                    ${e?"disabled":""}
                                >
                                    ${t(a("restartBackend"))}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `}function me(e,i,n){const o=h(e.email),d=o===i&&c.usage?c.usage:n[o];if(!d?.buckets||!Array.isArray(d.buckets))return 1/0;let u=1/0;for(const l of d.buckets)if(l.resetTime&&!l.disabled){const r=new Date(l.resetTime).getTime();Number.isFinite(r)&&r>Date.now()&&r<u&&(u=r)}return u}function ge(){const e=c.accounts||[],i=c.usageSnapshots||{},n=h(c.current?.email||""),o=(s.matrixSearch||"").trim().toLowerCase();let d=o?e.filter(r=>[r.label,r.displayName,r.email,r.group].filter(Boolean).join(" ").toLowerCase().includes(o)):e.slice();const u=s.matrixSort||"quota",l=d.sort((r,p)=>{const m=h(r.email),y=h(p.email);if(m===n)return-1;if(y===n)return 1;if(u==="reset"){const b=me(r,n,i),x=me(p,n,i);if(b!==x)return b-x}else if(u==="quota"){const b=P(r),x=P(p),S=typeof b=="number"?b:-1,H=typeof x=="number"?x:-1;if(S!==H)return H-S}return(r.label||r.displayName||r.email).localeCompare(p.label||p.displayName||p.email)});return l.length===0?o?`
                        <div class="search-empty-state">
                            <span>${t(a("noMatchingAccounts"))}</span>
                            <button type="button" class="btn compact" data-action="clear-matrix-search">
                                ${t(a("clearSearch")||"Clear search")}
                            </button>
                        </div>
                    `:`
                    <div class="matrix-empty secondary-text">
                        ${t(a("noSaved"))}
                    </div>
                `:l.map(r=>{const p=h(r.email),m=!!(n&&p===n),y=m&&c.usage||i[p],b=r.displayName||r.label||r.email,x=r.label||(m?a("currentAccountLabel"):"");let S=null,H="",G=null,F="";if(y?.buckets&&Array.isArray(y.buckets))for(const w of y.buckets){const J=(w.displayName||w.bucketId||"").toLowerCase(),V=(w.window||w.description||"").toLowerCase(),Ye=J.includes("5-hour")||J.includes("5h")||V.includes("5 hour")||V.includes("5h"),$e=J.includes("week")||V.includes("week")||V.includes("7 day");if(typeof w.remainingFraction=="number"&&!w.disabled){const ke=z(w),we=typeof ke=="number"?Math.max(0,Math.min(100,Math.round(ke*100))):null,Se=w.resetTime?D(w.resetTime):"";Ye||S===null&&!$e?(S=we,H=Se):$e&&(G=we,F=Se)}}if(S===null){const w=P(r);typeof w=="number"&&(S=w)}const ye=w=>typeof w!="number"?"tone-empty":w<=15?"tone-critical":w<=35?"tone-warn":"tone-healthy";return`
                    <div class="matrix-card ${m?"active-matrix-card":""}">
                        <!-- Tier 1: Header Row (Identity Left, Action Right) -->
                        <div class="matrix-card-header">
                            <div class="matrix-identity-group">
                                ${W(b,r.email,r.profilePictureUrl||(m?c.current?.profilePictureUrl:void 0),r.colorTag?`matrix-avatar tag-${t(r.colorTag)}`:"matrix-avatar")}
                                <div class="matrix-identity-text">
                                    <div class="matrix-name-row">
                                        <span class="matrix-account-name" title="${t(b)}">${t(b)}</span>
                                        ${r.colorTag?`<span class="color-tag-dot dot-${t(r.colorTag)}"></span>`:""}
                                        ${m?`<span class="saved-rail-badge active-badge">${t(a("active"))}</span>`:""}
                                    </div>
                                    <div class="matrix-email-row" title="${t(r.email)}">${t(r.email)}</div>
                                </div>
                            </div>

                            <div class="matrix-card-action">
                                ${m?`<span class="matrix-connected-pill">\u2713 ${t(a("connected"))}</span>`:`
                                        <button
                                            type="button"
                                            class="btn btn-primary compact matrix-switch-btn"
                                            data-action="switch"
                                            data-email="${t(r.email)}"
                                            title="${t(a("switch"))}"
                                        >
                                            ${t(a("switchNow"))}
                                        </button>
                                    `}
                            </div>
                        </div>

                        <!-- Tier 2: Badges Row -->
                        <div class="matrix-badges-row">
                            ${K(m&&c.current||r)}
                            ${c.vaultedEmails?.includes(h(r.email))?`<span class="vault-pill" title="${t(a("vaultInfo"))}">\u26A1 ${t(a("instantBadge"))}</span>`:""}
                            ${x?`<span class="account-label">${t(x)}</span>`:""}
                            ${r.group?`<span class="group-pill" title="Group: ${t(r.group)}">\u{1F3F7}\uFE0F ${t(r.group)}</span>`:""}
                        </div>

                        <!-- Tier 3: Quota Grid (5h & Weekly Side by Side) -->
                        <div class="matrix-quota-grid">
                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${t(a("fiveHourShort")||"5h")}:</span>
                                    <strong>${typeof S=="number"?`${S}%`:"-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${ye(S)}" style="width: ${typeof S=="number"?S:0}%;"></div>
                                </div>
                                ${H?`<span class="matrix-reset-sub" title="${t(H)}">${t(H)}</span>`:""}
                            </div>

                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${t(a("weeklyShort")||"Weekly")}:</span>
                                    <strong>${typeof G=="number"?`${G}%`:"-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${ye(G)}" style="width: ${typeof G=="number"?G:0}%;"></div>
                                </div>
                                ${F?`<span class="matrix-reset-sub" title="${t(F)}">${t(F)}</span>`:""}
                            </div>
                        </div>
                    </div>
                `}).join("")}function Fe(){if(!s.quotaMatrixOpen)return"";const e=c.accounts||[],i=ge();return`
            <div class="matrix-modal-backdrop" data-action="close-quota-matrix">
                <section
                    class="matrix-modal-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${t(a("quotaMatrixTitle"))}"
                >
                    <header class="matrix-modal-header">
                        <div class="matrix-modal-title-group">
                            <h2>${v("matrix","modal-header-icon")} ${t(a("quotaMatrixTitle"))}</h2>
                            <span class="secondary-text">${t(a("quotaMatrixSub"))}</span>
                        </div>
                        <button
                            type="button"
                            class="icon-btn"
                            data-action="close-quota-matrix"
                            aria-label="${t(a("cancel")||"Close")}"
                            title="${t(a("cancel")||"Close")}"
                        >
                            ${v("close")}
                        </button>
                    </header>

                    <div class="matrix-modal-body">
                        ${e.length>1?`
                            <div class="matrix-filter-row">
                                <div class="search-input-wrapper">
                                    <span class="search-input-icon">${v("search")}</span>
                                    <input
                                        id="matrix-search"
                                        class="accounts-search-input"
                                        type="search"
                                        value="${t(s.matrixSearch||"")}"
                                        placeholder="${t(a("searchAccountsPlaceholder"))}"
                                        autocomplete="off"
                                        spellcheck="false"
                                    >
                                    ${s.matrixSearch?`
                                        <button
                                            type="button"
                                            class="search-clear-btn"
                                            data-action="clear-matrix-search"
                                            title="${t(a("clearSearch")||"Clear search")}"
                                            aria-label="${t(a("clearSearch")||"Clear search")}"
                                        >\u2715</button>
                                    `:""}
                                </div>

                                <div class="matrix-sort-chips">
                                    <span class="matrix-sort-label">${t(a("sortBy")||"Sort:")}</span>
                                    <button
                                        type="button"
                                        class="matrix-sort-chip ${!s.matrixSort||s.matrixSort==="quota"?"active":""}"
                                        data-action="set-matrix-sort"
                                        data-sort="quota"
                                    >
                                        \u{1F7E2} ${t(a("highestQuota"))}
                                    </button>
                                    <button
                                        type="button"
                                        class="matrix-sort-chip ${s.matrixSort==="reset"?"active":""}"
                                        data-action="set-matrix-sort"
                                        data-sort="reset"
                                    >
                                        \u23F1 ${t(a("earliestReset"))}
                                    </button>
                                    <button
                                        type="button"
                                        class="matrix-sort-chip ${s.matrixSort==="name"?"active":""}"
                                        data-action="set-matrix-sort"
                                        data-sort="name"
                                    >
                                        \u{1F524} ${t(a("nameAZ"))}
                                    </button>
                                </div>
                            </div>
                        `:""}

                        <div class="matrix-list" id="matrix-account-list">
                            ${i}
                        </div>
                    </div>

                    <footer class="matrix-modal-footer">
                        <span class="secondary-text">${e.length} ${t(a("savedAccounts"))}</span>
                        <button
                            type="button"
                            class="btn"
                            data-action="close-quota-matrix"
                        >
                            ${t(a("cancel")||"Close")}
                        </button>
                    </footer>
                </section>
            </div>
        `}function Ve(){if(!s.settingsOpen||!s.settingsDraft)return"";const e=s.settingsDraft;return`
            <div
                class="settings-backdrop"
                data-action="settings-backdrop"
            >
                <section
                    class="settings-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${t(a("settings"))}"
                >
                    <header class="settings-header">
                        <h2>
                            ${t(a("settings"))}
                        </h2>

                        <button
                            type="button"
                            class="icon-btn"
                            data-action="cancel-settings"
                            aria-label="${t(a("cancel"))}"
                            title="${t(a("cancel"))}"
                        >
                            \xD7
                        </button>
                    </header>

                    <div class="settings-body">
                        <div class="settings-group">
                            <h3>
                                ${t(a("appearance"))}
                            </h3>

                            <label class="field">
                                <span>
                                    ${t(a("theme"))}
                                </span>

                                <select
                                    data-setting="theme"
                                >
                                    <option
                                        value="vscode"
                                        ${e.theme==="vscode"||e.theme==="editor"?"selected":""}
                                    >
                                        ${t(a("followVsCode"))}
                                    </option>

                                    <option
                                        value="dark"
                                        ${e.theme==="dark"?"selected":""}
                                    >
                                        ${t(a("dark"))}
                                    </option>

                                    <option
                                        value="light"
                                        ${e.theme==="light"?"selected":""}
                                    >
                                        ${t(a("light"))}
                                    </option>

                                    <option
                                        value="system"
                                        ${e.theme==="system"?"selected":""}
                                    >
                                        ${t(a("system"))}
                                    </option>
                                </select>
                            </label>

                            <label class="field">
                                <span>
                                    ${t(a("language"))}
                                </span>

                                <select
                                    data-setting="language"
                                >
                                    <option
                                        value="auto"
                                        ${e.language==="auto"?"selected":""}
                                    >
                                        ${t(a("automatic"))}
                                    </option>

                                    <option
                                        value="en"
                                        ${e.language==="en"?"selected":""}
                                    >
                                        ${t(a("english"))}
                                    </option>

                                    <option
                                        value="id"
                                        ${e.language==="id"?"selected":""}
                                    >
                                        ${t(a("indonesian"))}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("layout"))}
                            </h3>

                            ${C("hideRuntime",a("hideRuntime"),e.hideRuntime===!0||e.showRuntime===!1,a("hideRuntimeHint"))}

                            ${C("hideCurrent",a("hideCurrent"),e.hideCurrent===!0||e.showCurrent===!1,a("hideCurrentHint"))}

                            ${C("hideSaved",a("hideSaved"),e.hideSaved===!0||e.showSaved===!1,a("hideSavedHint"))}

                            ${C("showQuotaAnalytics",a("showQuotaAnalytics"),e.showQuotaAnalytics===!0,a("showQuotaAnalyticsHint"))}
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("quotaAndReminders"))}
                            </h3>

                            <label class="field">
                                <span>
                                    ${t(a("autoRefreshQuota"))}
                                </span>

                                <select
                                    data-setting="autoRefreshIntervalMinutes"
                                >
                                    <option
                                        value="0"
                                        ${e.autoRefreshIntervalMinutes===0?"selected":""}
                                    >
                                        ${t(a("autoRefreshOff"))}
                                    </option>
                                    <option
                                        value="1"
                                        ${e.autoRefreshIntervalMinutes===1?"selected":""}
                                    >
                                        ${t(a("every1Minute"))}
                                    </option>
                                    <option
                                        value="5"
                                        ${e.autoRefreshIntervalMinutes===5?"selected":""}
                                    >
                                        ${t(a("every5Minutes"))}
                                    </option>
                                    <option
                                        value="15"
                                        ${e.autoRefreshIntervalMinutes===15?"selected":""}
                                    >
                                        ${t(a("every15Minutes"))}
                                    </option>
                                    <option
                                        value="30"
                                        ${e.autoRefreshIntervalMinutes===30?"selected":""}
                                    >
                                        ${t(a("every30Minutes"))}
                                    </option>
                                    <option
                                        value="60"
                                        ${e.autoRefreshIntervalMinutes===60?"selected":""}
                                    >
                                        ${t(a("every1Hour"))}
                                    </option>
                                </select>
                            </label>

                            ${C("enableLowQuotaReminder",a("lowQuotaReminder"),e.enableLowQuotaReminder,a("lowQuotaReminderHint"))}

                            ${e.enableLowQuotaReminder?`
                                        <label class="field subfield">
                                            <span>
                                                ${t(a("reminderThreshold"))}
                                            </span>

                                            <select
                                                data-setting="lowQuotaThresholdPercent"
                                            >
                                                <option
                                                    value="5"
                                                    ${e.lowQuotaThresholdPercent===5?"selected":""}
                                                >
                                                    5${t(a("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="10"
                                                    ${e.lowQuotaThresholdPercent===10?"selected":""}
                                                >
                                                    10${t(a("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="15"
                                                    ${e.lowQuotaThresholdPercent===15?"selected":""}
                                                >
                                                    15${t(a("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="20"
                                                    ${e.lowQuotaThresholdPercent===20?"selected":""}
                                                >
                                                    20${t(a("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="25"
                                                    ${e.lowQuotaThresholdPercent===25?"selected":""}
                                                >
                                                    25${t(a("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="30"
                                                    ${e.lowQuotaThresholdPercent===30?"selected":""}
                                                >
                                                    30${t(a("percentRemaining"))}
                                                </option>
                                            </select>
                                        </label>
                                    `:""}

                            ${C("enableQuotaAudio",a("enableQuotaAudio"),e.enableQuotaAudio!==!1,a("enableQuotaAudioHint"))}
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("switchingAndAutomation"))}
                            </h3>

                            ${C("enableInstantSwitch",a("instantSwitch"),e.enableInstantSwitch!==!1,a("instantSwitchHint"))}

                            ${C("smartQuotaFallback",a("smartQuotaFallback"),e.smartQuotaFallback!==!1,a("smartQuotaFallbackHint"))}

                            ${C("autoRoundRobin",a("autoRoundRobin"),e.autoRoundRobin===!0,a("autoRoundRobinHint"))}
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("backupAndRestore"))}
                            </h3>
                            <p class="settings-desc">
                                ${t(a("backupDesc"))}
                            </p>
                            <div class="settings-actions-row">
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="export-accounts"
                                >
                                    ${t(a("exportAccounts"))}
                                </button>
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="import-accounts"
                                >
                                    ${t(a("importAccounts"))}
                                </button>
                            </div>
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("vaultTitle"))}
                            </h3>
                            <p class="settings-desc">
                                ${t(a("vaultInfo"))}
                            </p>
                            <div class="settings-actions-row">
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="clear-token-vault"
                                >
                                    ${v("key")} ${t(a("purgeVault"))}
                                </button>
                            </div>
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("advancedTitle"))}
                            </h3>

                            <label class="field">
                                <span>
                                    ${t(a("proxyMode"))}
                                </span>

                                <select
                                    data-setting="proxyMode"
                                >
                                    <option
                                        value="system"
                                        ${e.proxyMode==="system"||!e.proxyMode?"selected":""}
                                    >
                                        ${t(a("proxyModeSystem"))}
                                    </option>
                                    <option
                                        value="manual"
                                        ${e.proxyMode==="manual"?"selected":""}
                                    >
                                        ${t(a("proxyModeManual"))}
                                    </option>
                                    <option
                                        value="direct"
                                        ${e.proxyMode==="direct"?"selected":""}
                                    >
                                        ${t(a("proxyModeDirect"))}
                                    </option>
                                </select>
                            </label>

                            ${e.proxyMode==="manual"?`
                                        <label class="field subfield">
                                            <span>
                                                ${t(a("proxyUrl"))}
                                            </span>

                                            <input
                                                type="text"
                                                class="label-input"
                                                data-setting="proxyUrl"
                                                value="${t(e.proxyUrl||"")}"
                                                placeholder="${t(a("proxyUrlPlaceholder"))}"
                                            />
                                        </label>
                                    `:""}

                            ${e.proxyMode!=="direct"?C("proxyStrictSSL",a("proxyStrictSSL"),e.proxyStrictSSL!==!1,a("proxyStrictSSLHint")):""}
                        </div>

                        <div class="settings-group about-group">
                            <h3>
                                ${t(a("about"))}
                            </h3>

                            ${c.meta?.iconUri?`
                            <div style="text-align: center; margin: 8px 0 16px 0;">
                                <img src="${t(c.meta.iconUri)}" width="64" height="64" style="border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); vertical-align: middle;" alt="Logo" />
                            </div>`:""}

                            <div class="about-row">
                                <span>
                                    Antigravity Account Switcher
                                </span>

                                <span>
                                    v${t(c.meta?.version||"1.0.1")}
                                </span>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(a("developer"))}
                                </span>

                                <strong>
                                    ${t(c.meta?.developer||"Boy Gilang Ramadhan (BoyGR)")}
                                </strong>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(a("website"))}
                                </span>

                                <a
                                    href="${t(c.meta?.website||"https://boygr.com")}"
                                    data-external-url="${t(c.meta?.website||"https://boygr.com")}"
                                >
                                    boygr.com
                                </a>
                            </div>
                        </div>

                        <div class="settings-note">
                            ${t(a("settingsHint"))}
                        </div>
                    </div>

                    <footer class="settings-footer">
                        <button
                            type="button"
                            class="btn btn-reset"
                            data-action="reset-settings"
                            title="${t(a("resetToDefault"))}"
                        >
                            ${t(a("resetToDefault"))}
                        </button>

                        <div class="settings-footer-actions">
                            <button
                                type="button"
                                class="btn"
                                data-action="cancel-settings"
                            >
                                ${t(a("cancel"))}
                            </button>

                            <button
                                type="button"
                                class="btn primary"
                                data-action="save-settings"
                                ${f()?"disabled":""}
                            >
                                ${t(a("save"))}
                            </button>
                        </div>
                    </footer>
                </section>
            </div>
        `}function C(e,i,n,o){return`
            <div class="check-setting-wrap">
                <label class="check-row">
                    <input
                        type="checkbox"
                        data-setting="${t(e)}"
                        ${n?"checked":""}
                    >

                    <span class="check-label-text">
                        ${t(i)}
                    </span>
                </label>
                ${o?`<div class="field-hint">${t(o)}</div>`:""}
            </div>
        `}function je(){const e=c.meta||{},i=e.developer||"Boy Gilang Ramadhan (BoyGR)",n=e.website||"https://boygr.com",o=e.version||"0.5.1";return`
            <footer class="developer-footer">
                <div class="developer-footer-copy">
                    <span class="footer-prefix">${t(a("developedBy"))}</span>
                    <a
                        href="${t(n)}"
                        data-external-url="${t(n)}"
                        title="${t(n)}"
                        class="developer-link"
                    >
                        ${t(i)}
                    </a>
                </div>

                <span class="footer-version">
                    v${t(o)}
                </span>
            </footer>
        `}function We(){const e=s.removeCandidate;return e?`
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
                                ${t(a("removeSavedQuestion"))}
                            </h2>

                            <div class="confirm-account-name">
                                ${t(O(e))}
                            </div>

                            <div class="confirm-account-email">
                                ${t(e.email)}
                            </div>
                        </div>
                    </header>

                    <p
                        id="remove-dialog-description"
                        class="confirm-description"
                    >
                        ${t(a("removeSavedExplanation"))}
                    </p>

                    <footer class="confirm-dialog-actions">
                        <button
                            type="button"
                            class="btn"
                            data-action="cancel-remove"
                        >
                            ${t(a("cancel"))}
                        </button>

                        <button
                            type="button"
                            class="btn destructive"
                            data-action="confirm-remove"
                        >
                            ${t(a("remove"))}
                        </button>
                    </footer>
                </section>
            </div>
        `:""}function Ke(){const e=s.switchCandidate;return e?`
            <div
                class="dialog-backdrop"
                data-action="cancel-switch"
            >
                <section
                    class="confirm-dialog switch-dialog"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="switch-dialog-title"
                    aria-describedby="switch-dialog-description"
                >
                    <header class="confirm-dialog-header">
                        <div
                            class="switch-symbol"
                            aria-hidden="true"
                        >
                            \u21C4
                        </div>

                        <div>
                            <h2 id="switch-dialog-title">
                                ${t(a("switchAccountQuestion"))}
                            </h2>

                            <div class="confirm-account-name">
                                ${t(O(e))}
                            </div>

                            <div class="confirm-account-email">
                                ${t(e.email)}
                            </div>
                        </div>
                    </header>

                    <p
                        id="switch-dialog-description"
                        class="confirm-description"
                    >
                        ${t(a("switchAccountExplanation"))}
                    </p>

                    <footer class="confirm-dialog-actions">
                        <button
                            type="button"
                            class="btn"
                            data-action="cancel-switch"
                        >
                            ${t(a("cancel"))}
                        </button>

                        <button
                            type="button"
                            class="btn primary-btn"
                            data-action="confirm-switch"
                        >
                            ${t(a("confirmSwitch"))}
                        </button>
                    </footer>
                </section>
            </div>
        `:""}function g(){ee(),document.documentElement.lang=E(),R.innerHTML=`
            <div
                class="app"
                aria-busy="${c.loading||f()?"true":"false"}"
            >
                <div class="content-shell">
                    ${Te()}
                    ${Ue()}
                    ${Pe()}
                    ${Ne()}
                </div>

                ${je()}
            </div>

            ${Ve()}
            ${We()}
            ${Ke()}
            ${Oe()}
            ${Fe()}
        `,Qe(),oe(),s.editingEmail&&window.requestAnimationFrame(()=>{const e=document.querySelector('[data-role="label-input"]');e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))})}function ve(){const e=document.getElementById("saved-account-list");e&&(e.innerHTML=pe());const i=document.getElementById("account-count");if(i){const n=j().length;i.textContent=s.search.trim()?`${n}/${c.accounts.length}`:String(c.accounts.length)}}function _(){const e=document.getElementById("matrix-account-list");e&&(e.innerHTML=ge())}function ze(e){const i=U(e);i&&(s.editingEmail=i.email,s.editValue=i.label||"",s.editColorTag=i.colorTag||"",s.editGroup=i.group||"",s.customGroupInputOpen=!1,s.customGroupInputValue="",g())}function he(){s.editingEmail=null,s.editValue="",s.editColorTag="",s.editGroup="",s.customGroupInputOpen=!1,s.customGroupInputValue="",g()}function fe(e){const i=U(e);i&&(L({type:"label",email:i.email}),k.postMessage({type:"updateLabel",email:i.email,label:s.editValue,colorTag:s.editColorTag,group:s.editGroup}))}function be(){const e=c.preferences||{};s.settingsDraft={theme:e.theme||"vscode",language:e.language||"auto",hideCurrent:e.hideCurrent===!0||e.showCurrent===!1,hideSaved:e.hideSaved===!0||e.showSaved===!1,hideRuntime:e.hideRuntime===!0||e.showRuntime===!1,showQuotaAnalytics:e.showQuotaAnalytics===!0,autoRefreshIntervalMinutes:typeof e.autoRefreshIntervalMinutes=="number"?e.autoRefreshIntervalMinutes:5,enableLowQuotaReminder:e.enableLowQuotaReminder!==!1,lowQuotaThresholdPercent:typeof e.lowQuotaThresholdPercent=="number"?e.lowQuotaThresholdPercent:20,smartQuotaFallback:e.smartQuotaFallback!==!1,autoRoundRobin:e.autoRoundRobin===!0,enableQuotaAudio:e.enableQuotaAudio!==!1,enableInstantSwitch:e.enableInstantSwitch!==!1,proxyMode:e.proxyMode||"system",proxyUrl:e.proxyUrl||"",proxyStrictSSL:e.proxyStrictSSL!==!1},s.settingsOpen=!0,g()}function Ze(){s.settingsDraft={theme:"vscode",language:"auto",hideCurrent:!1,hideSaved:!1,hideRuntime:!1,showQuotaAnalytics:!1,autoRefreshIntervalMinutes:5,enableLowQuotaReminder:!0,lowQuotaThresholdPercent:20,smartQuotaFallback:!0,autoRoundRobin:!1,enableQuotaAudio:!0,enableInstantSwitch:!0,proxyMode:"system",proxyUrl:"",proxyStrictSSL:!0},q(a("resetSettingsNotice"),"info"),g()}function Y(){s.settingsOpen=!1,s.settingsDraft=null,g()}function _e(){s.settingsDraft&&(L({type:"settings"}),k.postMessage({type:"saveSettings",preferences:{...s.settingsDraft,showCurrent:!s.settingsDraft.hideCurrent,showSaved:!s.settingsDraft.hideSaved,showRuntime:!s.settingsDraft.hideRuntime}}))}R.addEventListener("input",e=>{const i=e.target;if(i instanceof HTMLInputElement&&i.id==="account-search"){s.search=i.value;const n=i.closest(".search-input-wrapper")?.querySelector(".search-clear-btn");n&&(n.style.display=s.search?"inline-flex":"none"),B(),ve();return}if(i instanceof HTMLInputElement&&i.id==="matrix-search"){s.matrixSearch=i.value;const n=i.closest(".search-input-wrapper")?.querySelector(".search-clear-btn");n&&(n.style.display=s.matrixSearch?"inline-flex":"none"),_();return}if(i instanceof HTMLInputElement&&i.dataset.role==="label-input"){s.editValue=i.value;return}if(i instanceof HTMLInputElement&&i.id==="custom-group-input"){s.customGroupInputValue=i.value;return}if(i instanceof HTMLInputElement&&i.dataset.setting==="proxyUrl"){s.settingsDraft&&(s.settingsDraft.proxyUrl=i.value);return}}),R.addEventListener("keydown",e=>{const i=e.target;if(i instanceof HTMLInputElement&&i.id==="custom-group-input")if(e.key==="Enter"){e.preventDefault();const n=i.value.trim();n&&(s.editGroup=n),s.customGroupInputOpen=!1,s.customGroupInputValue="",g()}else e.key==="Escape"&&(e.preventDefault(),s.customGroupInputOpen=!1,s.customGroupInputValue="",g())}),R.addEventListener("change",e=>{const i=e.target;if(i instanceof HTMLSelectElement&&i.dataset.action==="change-sort"){s.sortBy=i.value,s.sortCustomized=!0,B(),ve();return}if(!s.settingsDraft||!(i instanceof HTMLInputElement||i instanceof HTMLSelectElement))return;const n=i.dataset.setting;if(n){if(i instanceof HTMLInputElement&&i.type==="checkbox"){s.settingsDraft[n]=i.checked,n==="enableLowQuotaReminder"&&g();return}if(n==="autoRefreshIntervalMinutes"||n==="lowQuotaThresholdPercent"){s.settingsDraft[n]=Number.parseInt(i.value,10);return}if(n==="proxyMode"){s.settingsDraft.proxyMode=i.value,g();return}s.settingsDraft[n]=i.value}}),R.addEventListener("click",e=>{const i=e.target;if(!(i instanceof Element))return;const n=i.closest("[data-action]");if(!n)return;const o=n.dataset.action,d=n.dataset.email;if(o==="open-settings"){be();return}if(o==="cancel-settings"){Y();return}if(o==="settings-backdrop"&&i===n){Y();return}if(o==="reset-settings"){Ze();return}if(o==="save-settings"){f()||_e();return}if(o==="toggle-current"){s.currentCollapsed=!s.currentCollapsed,B(),g();return}if(o==="toggle-saved"){s.savedCollapsed=!s.savedCollapsed,B(),g();return}if(o==="clear-search"){s.search="",s.groupFilter="all";const l=document.getElementById("account-search");l&&(l.value="",l.focus());const r=document.querySelector(".search-clear-btn");r&&(r.style.display="none"),B(),g();return}if(o==="open-runtime-modal"){s.runtimeModalOpen=!0,g();return}if(o==="close-runtime-modal"||o==="runtime-modal-backdrop"&&i===n){s.runtimeModalOpen=!1,g();return}if(o==="open-quota-matrix"){s.quotaMatrixOpen=!0,g();return}if(o==="close-quota-matrix"){if(n.classList.contains("matrix-modal-backdrop")&&i!==n)return;s.quotaMatrixOpen=!1,s.matrixSearch="",g();return}if(o==="clear-matrix-search"){s.matrixSearch="";const l=document.getElementById("matrix-search");l&&(l.value="",l.focus());const r=n.closest(".search-input-wrapper")?.querySelector(".search-clear-btn")||document.querySelector(".matrix-filter-row .search-clear-btn");r&&(r.style.display="none"),_();return}if(o==="set-matrix-sort"){const l=n.dataset.sort||"quota";s.matrixSort=l,document.querySelectorAll(".matrix-sort-chip").forEach(p=>{p.classList.toggle("active",p.dataset.sort===l)}),_();return}if(o==="export-accounts"){k.postMessage({type:"exportAccounts"});return}if(o==="import-accounts"){k.postMessage({type:"importAccounts"});return}if(o==="clear-token-vault"){k.postMessage({type:"clearTokenVault"});return}if(o==="reconnect-hub"){s.runtimeModalOpen=!1,L({type:"refresh"}),k.postMessage({type:"reconnectHub"});return}if(o==="restart-backend"){s.runtimeModalOpen=!1,L({type:"refresh"}),k.postMessage({type:"restartBackend"});return}if(o==="select-color-tag"){const l=n.dataset.color||"";s.editColorTag=s.editColorTag===l?"":l,g();return}if(o==="select-edit-group"){const l=n.dataset.group||"";s.editGroup=s.editGroup===l?"":l,g();return}if(o==="open-custom-group"){s.customGroupInputOpen=!0,s.customGroupInputValue="",g(),setTimeout(()=>{const l=document.getElementById("custom-group-input");l&&l.focus()},20);return}if(o==="cancel-custom-group"){s.customGroupInputOpen=!1,s.customGroupInputValue="",g();return}if(o==="confirm-custom-group"){const l=document.getElementById("custom-group-input"),r=(l?l.value:s.customGroupInputValue||"").trim();r&&(s.editGroup=r),s.customGroupInputOpen=!1,s.customGroupInputValue="",g();return}if(o==="set-group-filter"){s.groupFilter=n.dataset.group||"all",g();return}if(o==="export-quota-analytics"){k.postMessage({type:"exportQuotaAnalytics"});return}if(o==="edit-label"){f()||ze(d);return}if(o==="cancel-label"){he();return}if(o==="save-label"){f()||fe(d);return}if(o==="active-locked-remove"){q(a("cannotRemoveActive"),"warning");return}if(o==="remove-account"){const l=U(d);if(l&&!f()){const r=h(c.current?.email);if(r&&h(l.email)===r){q(a("cannotRemoveActive"),"warning");return}s.removeCandidate=l,g()}return}if(o==="cancel-remove"){if(n.classList.contains("dialog-backdrop")&&i!==n)return;s.removeCandidate=null,g();return}if(o==="confirm-remove"){const l=s.removeCandidate;if(l&&!f()){const r=h(c.current?.email);if(r&&h(l.email)===r){s.removeCandidate=null,g(),q(a("cannotRemoveActive"),"warning");return}L({type:"remove",email:l.email}),k.postMessage({type:"removeAccount",email:l.email})}return}if(o==="switch"){const l=U(d);l&&!f()&&(s.switchCandidate=l,g());return}if(o==="cancel-switch"){if(n.classList.contains("dialog-backdrop")&&i!==n)return;s.switchCandidate=null,g();return}if(o==="confirm-switch"){const l=s.switchCandidate;s.switchCandidate=null,l&&!f()&&(s.quotaMatrixOpen=!1,L({type:"switch",email:l.email}),k.postMessage({type:"switchAccount",account:l})),g();return}if(f())return;const u={add:"addAccount",save:"saveCurrent",refresh:"refresh",reauth:"reauth",signout:"signout","restart-backend":"restartBackend"};u[o]&&(L({type:{add:"add",save:"save",refresh:"refresh",reauth:"reauth",signout:"signout","restart-backend":"refresh"}[o]}),k.postMessage({type:u[o]}))}),window.addEventListener("keydown",e=>{if(e.key==="Escape"){if(s.quotaMatrixOpen){s.quotaMatrixOpen=!1,g();return}if(s.runtimeModalOpen){s.runtimeModalOpen=!1,g();return}if(s.switchCandidate){s.switchCandidate=null,g();return}if(s.removeCandidate){s.removeCandidate=null,g();return}if(s.settingsOpen){Y();return}if(s.editingEmail&&!A){he();return}M&&!A&&(M=null,T&&(clearTimeout(T),T=null),g());return}if(e.key==="Enter"&&s.editingEmail&&!A){const i=document.activeElement;i instanceof HTMLInputElement&&i.dataset.role==="label-input"&&(e.preventDefault(),fe(s.editingEmail))}}),R.addEventListener("click",e=>{const i=e.target;if(!(i instanceof Element))return;const n=i.closest("[data-external-url]");if(!n)return;e.preventDefault();const o=n.dataset.externalUrl;o&&k.postMessage({type:"openExternal",url:o})}),window.addEventListener("message",e=>{const i=e.data;if(!i)return;if(i.type==="openSettings"){be();return}if(i.type==="openQuotaMatrix"){s.quotaMatrixOpen=!0,g();return}if(i.type==="playChime"){I(i.chime);return}if(i.type!=="state")return;const n=A;if(c=i.state,B(),Ae(),n?.type==="remove"){s.removeCandidate=null,q(a("accountRemoved"),"success");return}if(n?.type==="label"){s.editingEmail=null,s.editValue="",q(a("labelUpdated"),"success");return}if(n?.type==="settings"){s.settingsOpen=!1,s.settingsDraft=null,q(a("settingsSaved"),"success");return}if(n&&n.type!=="refresh"){q(a("stateUpdated"),"success");return}g()}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{c.preferences?.theme==="system"&&ee()}),window.setInterval(()=>{oe()},3e4),g(),k.postMessage({type:"ready"})})();function enhanceSavedQuotaMetrics(k=document){const R=k.querySelectorAll(".saved-account-quota-area");for(const $ of R){const c=$.querySelectorAll([".saved-family-metric",".saved-usage-metric",".saved-quota-metric",".saved-metric-row",".saved-usage-row"].join(","));for(const s of c){const A=s.querySelector(".saved-quota-main"),M=s.querySelector(".saved-quota-value");if(!A||!M)continue;const T=M.textContent?.trim()??"",Q=T.match(/(-?\d+(?:\.\d+)?)\s*%/);if(!Q)continue;const E=Number(Q[1]);if(!Number.isFinite(E))continue;const a=Math.max(0,Math.min(100,E));let t=s.querySelector(":scope > .saved-quota-progress");if(!t){t=document.createElement("div"),t.className="saved-quota-progress",t.setAttribute("aria-hidden","true");const I=document.createElement("span");I.className="saved-quota-progress-fill",t.append(I),A.insertAdjacentElement("afterend",t)}t.style.setProperty("--saved-quota-percent",`${a}%`);let v=s.querySelector(":scope > .saved-quota-remaining");v||(v=document.createElement("div"),v.className="saved-quota-remaining",t.insertAdjacentElement("afterend",v)),v.textContent=`${T} remaining`;const h=s.querySelector([".saved-quota-reset",".saved-usage-reset",".saved-metric-reset"].join(","));if(h){const I=h.textContent?.trim()??"";h.textContent=I.replace(/^Resets\s+in\s+/i,"Reset ").replace(/^Reset\s+in\s+/i,"Reset ")}}}}let savedQuotaEnhancementQueued=!1;function queueSavedQuotaEnhancement(){savedQuotaEnhancementQueued||(savedQuotaEnhancementQueued=!0,queueMicrotask(()=>{savedQuotaEnhancementQueued=!1,enhanceSavedQuotaMetrics(document)}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{enhanceSavedQuotaMetrics(document)},{once:!0}):enhanceSavedQuotaMetrics(document);const savedQuotaObserver=new MutationObserver(()=>{queueSavedQuotaEnhancement()});savedQuotaObserver.observe(document.documentElement,{childList:!0,subtree:!0});

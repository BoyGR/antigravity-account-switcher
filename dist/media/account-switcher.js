"use strict";(()=>{const b=acquireVsCodeApi(),R=document.getElementById("app");if(!R)return;const f=b.getState()||{};let l={loading:!0,current:f.current||null,accounts:Array.isArray(f.accounts)?f.accounts:[],runtime:f.runtime||null,usage:f.usage||null,usageSnapshots:f.usageSnapshots||{},usageError:null,error:null,preferences:{version:1,theme:"vscode",language:"auto",effectiveLanguage:"en",hideCurrent:!1,hideSaved:!1,hideRuntime:!1,showCurrent:!0,showSaved:!0,showRuntime:!0,showQuotaAnalytics:!1,autoRefreshIntervalMinutes:5,enableLowQuotaReminder:!0,lowQuotaThresholdPercent:20,smartQuotaFallback:!0,autoRoundRobin:!1,enableQuotaAudio:!0,enableInstantSwitch:!0,proxyMode:"system",proxyUrl:"",proxyStrictSSL:!0},vaultedEmails:[],meta:{version:"1.4.0",developer:"Boy Gilang Ramadhan",website:"https://boygr.com",iconUri:""}},o={search:typeof f.search=="string"?f.search:"",sortBy:f.sortCustomized&&typeof f.sortBy=="string"?f.sortBy:"recent",sortCustomized:!!f.sortCustomized,currentCollapsed:!!f.currentCollapsed,savedCollapsed:!!f.savedCollapsed,runtimeCollapsed:f.runtimeCollapsed!==!1,usageCollapsed:!!f.usageCollapsed,settingsOpen:!1,settingsDraft:null,editingEmail:null,editValue:"",editColorTag:"",editGroup:"",customGroupInputOpen:!1,customGroupInputValue:"",groupFilter:"all",removeCandidate:null,runtimeModalOpen:!1,quotaMatrixOpen:!1,matrixSearch:"",matrixSort:"quota"},S=null,M=null,T=null;const Q={en:{appName:"Antigravity Account Switcher",accountManager:"Google account manager",settings:"Settings",currentAccount:"Current account",savedAccounts:"Saved accounts",antigravityStatus:"Antigravity status",refresh:"Refresh",connected:"Connected",active:"Active",switch:"Switch",reauth:"Re-auth",signout:"Sign out",addGoogleAccount:"Add Google Account",addGoogleAccountHint:"Sign in or switch account",saveCurrentAccount:"Save Current Account",unavailable:"Antigravity account unavailable",waiting:"Waiting for Antigravity...",checking:"Checking\u2026",loadingAccount:"Loading account\u2026",loadingSavedAccounts:"Loading saved accounts\u2026",updatingQuota:"Updating quota\u2026",checkingAccount:"Checking Antigravity account state\u2026",checkingExtension:"Checking extension status\u2026",checkingBackend:"Checking backend status\u2026",checkingHub:"Checking hub connection\u2026",noSaved:"No saved accounts",noSavedHint:"Save the current Antigravity account or add another Google account.",noMatches:"No matching accounts",noMatchesHint:"Try another label, display name, or email.",searchPlaceholder:"Search accounts",sortBy:"Sort by",sortQuota:"Highest quota",sortName:"Name (A-Z)",sortRecent:"Recently used",clearSearch:"Clear search",clearFilter:"Clear filter",activeNow:"Active now",lastUsed:"Last used",editLabel:"Edit label",save:"Save",cancel:"Cancel",removeLabel:"Clear label",accountActions:"Account actions",appearance:"Appearance",theme:"Theme",language:"Language",layout:"Layout",followVsCode:"Follow Editor / IDE Theme",light:"Light",dark:"Dark",system:"System",automatic:"Auto",english:"English",indonesian:"Bahasa Indonesia",hideCurrent:"Hide current account",hideSaved:"Hide saved accounts",hideRuntime:"Hide Antigravity status",showQuotaAnalytics:"Show 7-day quota analytics",switchingAndAutomation:"Switching & Automation",quotaAndReminders:"Quota & Reminders",autoRefreshQuota:"Auto-refresh quota",autoRefreshOff:"Off (Manual only)",every1Minute:"Every 1 minute",every5Minutes:"Every 5 minutes (Recommended)",every15Minutes:"Every 15 minutes",every30Minutes:"Every 30 minutes",every1Hour:"Every 1 hour",lowQuotaReminder:"Low quota notification",reminderThreshold:"Warning threshold",percentRemaining:"% remaining",smartQuotaFallback:"Smart Quota Fallback (1-click switch)",backupAndRestore:"Backup & Restore",backupDesc:"Export saved accounts metadata to JSON or restore them on another machine.",exportAccounts:"Export Accounts",importAccounts:"Import Accounts",reconnectHub:"Reconnect Hub",restartBackend:"Restart Backend",processRecovery:"Process Recovery",settingsHint:"Changes apply only after Save.",googleExtension:"Google Extension",officialExtension:"Official Antigravity extension",agyBackend:"AGY Backend",localBackend:"Local Antigravity backend",hub:"Hub",localHub:"Local Hub",hubConnection:"Antigravity hub connection",running:"Running",stopped:"Stopped",ready:"Ready",disconnected:"Unavailable",version:"Version",refreshing:"Refreshing account state...",adding:"Opening Google account flow...",saving:"Saving current account...",reauthenticating:"Re-authenticating...",signingOut:"Signing out...",switching:"Switching account...",updatingLabel:"Updating account label...",savingSettings:"Saving settings...",stateUpdated:"Account state updated.",labelUpdated:"Account label updated.",settingsSaved:"Settings saved.",collapse:"Collapse section",expand:"Expand section",currentAccountLabel:"Current account",developedBy:"Developed by",about:"About",developer:"Developer",website:"Website",removeSavedAccount:"Remove saved account",removeSavedQuestion:"Remove saved account?",removeSavedExplanation:"This only removes local Account Switcher metadata. It does not sign you out, delete your Google account, or remove Google credentials.",remove:"Remove",accountRemoved:"Saved account removed.",usage:"Usage",weeklyLimit:"Weekly limit",fiveHourLimit:"5-hour limit",weeklyShort:"Weekly",fiveHourShort:"5h",updated:"Updated",models:"models",remaining:"remaining",resetsIn:"Resets in",resetDue:"Reset due",quotaRestored:"Restored",lastUpdated:"Last updated",quotaSnapshot:"Quota snapshot",showAllModels:"Show all models",showLess:"Show less",justNow:"just now",ago:"ago",quotaUnavailable:"Usage unavailable",quotaUnavailableHint:"Antigravity did not return current quota information.",quotaHistory:"7-Day Quota Analytics",searchAccountsPlaceholder:"Filter by name, email, or group...",highestQuota:"Highest Quota",earliestReset:"Earliest Reset",nameAZ:"Name (A-Z)",noMatchingAccounts:"No accounts match your filter.",liveData:"Live data",quotaHistorySub:"Daily lowest remaining",exportAnalytics:"Export Analytics",autoRoundRobin:"Auto-Round-Robin (Switch on rate limit)",enableQuotaAudio:"Subtle Audio Alerts (Web Audio)",quotaMatrix:"Quota Matrix",quotaMatrixTitle:"Multi-Account Quota Matrix",quotaMatrixSub:"Real-time quota comparison across all accounts",switchNow:"Switch",noSnapshotYet:"No quota data yet",instantSwitch:"Instant Switch (No Browser)",instantSwitchHint:"Switch accounts seamlessly using saved session tokens without re-opening your browser.",smartQuotaFallbackHint:"Show a 1-click prompt to switch to an account with more quota before limits are reached.",autoRoundRobinHint:"Automatically rotate to the account with the highest quota when rate limits occur.",enableQuotaAudioHint:"Play gentle synthesized chimes on quota reset or critical alerts.",lowQuotaReminderHint:"Show a warning notification when remaining quota falls below threshold.",hideRuntimeHint:"Hide the Antigravity background status indicator from the bottom bar.",hideCurrentHint:"Hide the current active account panel from the main view.",hideSavedHint:"Hide the saved accounts list and manager.",showQuotaAnalyticsHint:"Display the 7-day lowest quota analytics bar chart.",instantBadge:"Instant",vaultTitle:"Token Vault",purgeVault:"Clear Token Vault...",vaultInfo:"Saved in encrypted Token Vault for 1-click seamless switching",plan:"Plan",accountPlan:"Account Plan",selectPlan:"Select Plan",advancedTitle:"Advanced",proxyMode:"Proxy Mode",proxyModeSystem:"System / VS Code Default",proxyModeManual:"Manual Custom Proxy",proxyModeDirect:"Direct (No Proxy)",proxyUrl:"Proxy Server URL",proxyUrlPlaceholder:"http://127.0.0.1:7890 or socks5://...",proxyStrictSSL:"Strict SSL Verification",proxyStrictSSLHint:"Disable only if using internal self-signed proxy certs."},id:{appName:"Antigravity Account Switcher",accountManager:"Pengelola akun Google",settings:"Pengaturan",currentAccount:"Akun saat ini",savedAccounts:"Akun tersimpan",antigravityStatus:"Status Antigravity",refresh:"Segarkan",connected:"Terhubung",active:"Aktif",switch:"Ganti",reauth:"Autentikasi ulang",signout:"Keluar",addGoogleAccount:"Tambah Akun Google",addGoogleAccountHint:"Masuk atau ganti akun",saveCurrentAccount:"Simpan Akun Saat Ini",unavailable:"Akun Antigravity tidak tersedia",waiting:"Menunggu Antigravity...",checking:"Memeriksa\u2026",loadingAccount:"Memuat akun\u2026",loadingSavedAccounts:"Memuat akun tersimpan\u2026",updatingQuota:"Memperbarui kuota\u2026",checkingAccount:"Memeriksa status akun Antigravity\u2026",checkingExtension:"Memeriksa status ekstensi\u2026",checkingBackend:"Memeriksa status backend\u2026",checkingHub:"Memeriksa koneksi hub\u2026",noSaved:"Belum ada akun tersimpan",noSavedHint:"Simpan akun Antigravity saat ini atau tambahkan akun Google lain.",noMatches:"Tidak ada akun yang cocok",noMatchesHint:"Coba label, nama, atau email lainnya.",searchPlaceholder:"Cari akun",sortBy:"Urutkan",sortQuota:"Sisa kuota",sortName:"Nama (A-Z)",sortRecent:"Terakhir dipakai",clearSearch:"Hapus pencarian",clearFilter:"Hapus filter",activeNow:"Sedang aktif",lastUsed:"Terakhir dipakai",editLabel:"Edit label",save:"Simpan",cancel:"Batal",removeLabel:"Hapus label",accountActions:"Tindakan akun",appearance:"Tampilan",theme:"Tema",language:"Bahasa",layout:"Tata letak",followVsCode:"Ikuti Tema Editor / IDE",light:"Terang",dark:"Gelap",system:"Sistem",automatic:"Otomatis",english:"English",indonesian:"Bahasa Indonesia",hideCurrent:"Sembunyikan akun saat ini",hideSaved:"Sembunyikan akun tersimpan",hideRuntime:"Sembunyikan status Antigravity",showQuotaAnalytics:"Tampilkan analisis kuota 7 hari",switchingAndAutomation:"Peralihan & Otomatisasi",quotaAndReminders:"Kuota & Pengingat",autoRefreshQuota:"Auto-refresh kuota",autoRefreshOff:"Nonaktif (Hanya manual)",every1Minute:"Setiap 1 menit",every5Minutes:"Setiap 5 menit (Disarankan)",every15Minutes:"Setiap 15 menit",every30Minutes:"Setiap 30 menit",every1Hour:"Setiap 1 jam",lowQuotaReminder:"Pemberitahuan kuota menipis",reminderThreshold:"Batas peringatan",percentRemaining:"% tersisa",smartQuotaFallback:"Peralihan Cepat saat Kuota Menipis",backupAndRestore:"Cadangan & Pemulihan",backupDesc:"Ekspor metadata akun tersimpan ke JSON atau pulihkan di perangkat lain.",exportAccounts:"Ekspor Akun",importAccounts:"Impor Akun",reconnectHub:"Sambungkan Ulang Hub",restartBackend:"Mulai Ulang Backend",processRecovery:"Pemulihan Proses",settingsHint:"Perubahan baru diterapkan setelah Simpan.",googleExtension:"Ekstensi Google",officialExtension:"Ekstensi resmi Antigravity",agyBackend:"Backend AGY",localBackend:"Backend lokal Antigravity",hub:"Hub",localHub:"Hub Lokal",hubConnection:"Koneksi hub Antigravity",running:"Berjalan",stopped:"Berhenti",ready:"Siap",disconnected:"Tidak tersedia",version:"Versi",refreshing:"Menyegarkan status akun...",adding:"Membuka alur akun Google...",saving:"Menyimpan akun saat ini...",reauthenticating:"Melakukan autentikasi ulang...",signingOut:"Keluar dari akun...",switching:"Mengganti akun...",updatingLabel:"Memperbarui label akun...",savingSettings:"Menyimpan pengaturan...",stateUpdated:"Status akun diperbarui.",labelUpdated:"Label akun diperbarui.",settingsSaved:"Pengaturan disimpan.",collapse:"Ciutkan bagian",expand:"Buka bagian",currentAccountLabel:"Akun saat ini",developedBy:"Dikembangkan oleh",about:"Tentang",developer:"Developer",website:"Situs",removeSavedAccount:"Hapus akun tersimpan",removeSavedQuestion:"Hapus akun tersimpan?",removeSavedExplanation:"Ini hanya menghapus metadata lokal Account Switcher. Tindakan ini tidak mengeluarkan akun, menghapus akun Google, atau menghapus kredensial Google.",remove:"Hapus",accountRemoved:"Akun tersimpan dihapus.",usage:"Penggunaan",weeklyLimit:"Batas mingguan",fiveHourLimit:"Batas 5 jam",weeklyShort:"Mingguan",fiveHourShort:"5j",updated:"Diperbarui",models:"model",remaining:"tersisa",resetsIn:"Reset dalam",resetDue:"Waktunya reset",quotaRestored:"Dipulihkan",lastUpdated:"Terakhir diperbarui",quotaSnapshot:"Snapshot kuota",showAllModels:"Tampilkan semua model",showLess:"Tampilkan lebih sedikit",justNow:"baru saja",ago:"yang lalu",quotaUnavailable:"Penggunaan tidak tersedia",quotaUnavailableHint:"Antigravity tidak mengembalikan informasi kuota saat ini.",quotaHistory:"Analitik Kuota 7 Hari",searchAccountsPlaceholder:"Cari nama, email, atau grup...",highestQuota:"Kuota Tertinggi",earliestReset:"Reset Terdekat",nameAZ:"Nama (A-Z)",noMatchingAccounts:"Tidak ada akun yang cocok dengan filter.",liveData:"Data langsung",quotaHistorySub:"Sisa terendah harian",exportAnalytics:"Ekspor Analitik",autoRoundRobin:"Auto-Round-Robin (Ganti saat kuota habis)",enableQuotaAudio:"Notifikasi Suara Lembut (Web Audio)",quotaMatrix:"Matriks Kuota",quotaMatrixTitle:"Matriks Kuota Multi-Akun",quotaMatrixSub:"Perbandingan sisa kuota semua akun secara real-time",switchNow:"Ganti",noSnapshotYet:"Belum ada data kuota",instantSwitch:"Switch Instan (Tanpa Browser)",instantSwitchHint:"Beralih akun seketika menggunakan token sesi tersimpan tanpa membuka browser.",smartQuotaFallbackHint:"Tampilkan prompt 1-klik untuk beralih ke akun berkuota lebih banyak sebelum habis.",autoRoundRobinHint:"Otomatis rotasi ke akun dengan kuota tertinggi saat terkena rate limit (tanpa klik).",enableQuotaAudioHint:"Bunyikan nada audio lembut saat kuota reset atau mencapai batas kritis.",lowQuotaReminderHint:"Tampilkan notifikasi peringatan saat sisa kuota akun berada di bawah batas.",hideRuntimeHint:"Sembunyikan status runtime Antigravity dari bilah bawah.",hideCurrentHint:"Sembunyikan panel akun yang sedang aktif dari tampilan utama.",hideSavedHint:"Sembunyikan daftar dan pengelola akun tersimpan.",showQuotaAnalyticsHint:"Tampilkan grafik analitik dan riwayat kuota 7 hari terakhir.",instantBadge:"Instan",vaultTitle:"Brankas Token",purgeVault:"Bersihkan Brankas Token...",vaultInfo:"Tersimpan di Brankas Token terenkripsi untuk pergantian 1-klik tanpa login browser",plan:"Paket",accountPlan:"Paket Akun",selectPlan:"Pilih Paket",advancedTitle:"Lanjutan",proxyMode:"Mode Proxy",proxyModeSystem:"Bawaan Sistem / VS Code",proxyModeManual:"Proxy Kustom Manual",proxyModeDirect:"Langsung (Tanpa Proxy)",proxyUrl:"URL Server Proxy",proxyUrlPlaceholder:"http://127.0.0.1:7890 atau socks5://...",proxyStrictSSL:"Verifikasi SSL Ketat",proxyStrictSSLHint:"Nonaktifkan hanya jika menggunakan sertifikat proxy lokal/internal."}};function H(){return l.preferences?.effectiveLanguage==="id"?"id":"en"}function a(e){return Q[H()]?.[e]??Q.en[e]??e}function t(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function v(e,i="ui-icon"){const n=`class="${t(i)}" viewBox="0 0 16 16" fill="none" aria-hidden="true"`;return{refresh:`
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
            `}[e]||""}function h(e){return String(e??"").trim().toLowerCase()}function E(e){if(l.preferences?.enableQuotaAudio!==!1)try{const i=window.AudioContext||window.webkitAudioContext;if(!i)return;const n=new i;e==="restored"?[523.25,659.25,783.99,1046.5].forEach((d,u)=>{const c=n.createOscillator(),r=n.createGain();c.type="sine",c.frequency.setValueAtTime(d,n.currentTime+u*.07),r.gain.setValueAtTime(.06,n.currentTime+u*.07),r.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+u*.07+.55),c.connect(r),r.connect(n.destination),c.start(n.currentTime+u*.07),c.stop(n.currentTime+u*.07+.55)}):e==="warning"&&[440,369.99].forEach((d,u)=>{const c=n.createOscillator(),r=n.createGain();c.type="sine",c.frequency.setValueAtTime(d,n.currentTime+u*.12),r.gain.setValueAtTime(.05,n.currentTime+u*.12),r.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+u*.12+.4),c.connect(r),r.connect(n.destination),c.start(n.currentTime+u*.12),c.stop(n.currentTime+u*.12+.4)})}catch{}}function B(){b.setState({search:o.search,sortBy:o.sortBy,sortCustomized:o.sortCustomized,currentCollapsed:o.currentCollapsed,savedCollapsed:o.savedCollapsed,runtimeCollapsed:o.runtimeCollapsed,usageCollapsed:o.usageCollapsed,accounts:l.accounts,current:l.current,runtime:l.runtime,usage:l.usage,usageSnapshots:l.usageSnapshots})}function q(e){S=e,g()}function xe(){S=null}function N(e,i="info"){M={message:e,kind:i},T&&clearTimeout(T),T=setTimeout(()=>{M=null,T=null,g()},2600),g()}function Ae(){return S?{refresh:a("refreshing"),add:a("adding"),save:a("saving"),reauth:a("reauthenticating"),signout:a("signingOut"),switch:a("switching"),label:a("updatingLabel"),settings:a("savingSettings"),remove:a("removeSavedAccount")}[S.type]||"Working...":""}function y(){return!!S}function Me(e,i){const n=String(e||"").trim()||String(i||"").split("@")[0],s=n.split(/\s+/).filter(Boolean);return s.length>=2?(s[0][0]+s[s.length-1][0]).toUpperCase():n.slice(0,2).toUpperCase()||"A"}function X(){if(!l.current)return null;const e=h(l.current.email);return l.accounts.find(i=>h(i.email)===e)||null}function U(e){const i=h(e);return l.accounts.find(n=>h(n.email)===i)}function V(e){return e.label||e.displayName||e.email}function P(e){const i=h(e.email),n=l.usageSnapshots?.[i];if(!n||!Array.isArray(n.buckets)||n.buckets.length===0)return;let s;for(const d of n.buckets)typeof d.remainingFraction=="number"&&!d.disabled&&(s===void 0||d.remainingFraction<s)&&(s=d.remainingFraction);return s!==void 0?Math.round(s*100):void 0}function j(){const e=o.search.trim().toLowerCase();let i=e?l.accounts.filter(s=>[s.label,s.displayName,s.email,s.group].filter(Boolean).join(" ").toLowerCase().includes(e)):l.accounts.slice();o.groupFilter&&o.groupFilter!=="all"&&(i=i.filter(s=>s.group===o.groupFilter));const n=h(l.current?.email);return i.sort((s,d)=>{const u=h(s.email)===n,c=h(d.email)===n;if(u!==c)return u?-1:1;const r=o.sortBy||"recent";if(r==="quota"){const p=P(s),m=P(d);if(p!==void 0&&m!==void 0){if(m!==p)return m-p}else{if(p!==void 0)return-1;if(m!==void 0)return 1}}else if(r==="recent"){const p=s.lastSeenAt?new Date(s.lastSeenAt).getTime():0,m=d.lastSeenAt?new Date(d.lastSeenAt).getTime():0;if(m!==p)return m-p}return(s.label||s.displayName||s.email).localeCompare(d.label||d.displayName||d.email)}),i}function ee(){const e=document.documentElement,i=l.preferences?.theme||"vscode";if(e.removeAttribute("data-ag-theme"),i==="light"||i==="dark"){e.setAttribute("data-ag-theme",i);return}if(i==="system"){const n=window.matchMedia("(prefers-color-scheme: dark)").matches;e.setAttribute("data-ag-theme",n?"dark":"light")}}function Te(){return S?`
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
                            ${t(Ae())}
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
        `:""}function Ce(e,i,n,s=""){return`
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
                    ${s}
                </div>
            </div>
        `}function Ye(){return`
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
                        value="${t(o.editValue)}"
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
                            class="color-picker-dot color-${n} ${o.editColorTag===n?"selected":""}"
                            data-action="select-color-tag"
                            data-color="${n}"
                            title="${n}"
                            aria-label="${n}"
                        ></button>
                    `).join("")}
                    ${o.editColorTag?`
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
                        ${(()=>{const n=["Personal","Work"],s=(l.accounts||[]).map(u=>(u.group||"").trim()).filter(Boolean),d=Array.from(new Set([...n,...s]));return o.editGroup&&!d.includes(o.editGroup)&&d.push(o.editGroup),d.map(u=>`
                                <button
                                    type="button"
                                    class="group-tag-btn ${o.editGroup===u?"selected":""}"
                                    data-action="select-edit-group"
                                    data-group="${t(u)}"
                                >${t(u)}</button>
                            `).join("")})()}
                        ${o.customGroupInputOpen?`
                            <div class="custom-group-input-wrapper">
                                <input
                                    type="text"
                                    class="custom-group-input"
                                    id="custom-group-input"
                                    placeholder="Group..."
                                    value="${t(o.customGroupInputValue||"")}"
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
                        ${o.editGroup?`
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
        `}function Re(e){if(typeof e!="string")return"";const i=e.trim();if(i.startsWith("data:image/png;base64,")||i.startsWith("data:image/jpeg;base64,")||i.startsWith("data:image/webp;base64,")||i.startsWith("data:image/gif;base64,"))return i;try{const n=new URL(i),s=n.hostname.toLowerCase(),d=s==="googleusercontent.com"||s.endsWith(".googleusercontent.com")||s==="ggpht.com"||s.endsWith(".ggpht.com")||s==="gstatic.com"||s.endsWith(".gstatic.com")||s==="google.com"||s.endsWith(".google.com");return n.protocol!=="https:"||!d?"":n.toString()}catch{return""}}function W(e,i,n,s="",d=""){const u=Re(n),c=`
            <span class="avatar-fallback">
                ${t(Me(e,i))}
            </span>
        `;return`
            <div
                class="avatar ${t(s)} ${u?"has-image":""}"
                aria-hidden="true"
            >
                ${c}

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
        `}function qe(e){if(!e)return null;const i=typeof e.plan=="string"?e.plan.trim():"",n=typeof e.g1Tier=="string"?e.g1Tier.trim():"",s=i||n,d=e.isPro===!0;if(!s&&!d)return null;let u="",c="plan-free",r="";const p=s.toUpperCase();if(p.includes("ULTRA"))u="Google AI Ultra",c="plan-ultra",r="\u{1F31F}";else if(p.includes("PLUS"))u="Google AI Plus",c="plan-plus",r="\u2728";else if(p.includes("AI_PREMIUM")||p.includes("PREMIUM"))u="Google AI Plus",c="plan-plus",r="\u2728";else if(p.includes("PRO")||d)u="Google AI Pro",c="plan-pro",r="\u26A1";else if(p.includes("ENTERPRISE"))u="Google AI Enterprise",c="plan-pro",r="\u{1F3E2}";else if(p.includes("FREE")||p.includes("STANDARD"))u="Google AI Free",c="plan-free",r="\u2726";else if(s)u=s.replace(/^G1_TIER_/,"").replace(/_/g," "),c="plan-custom",r="\u2728";else return null;return{name:u,className:c,icon:r}}function K(e){try{const i=qe(e);return!i||!i.name?"":`
                <span class="plan-pill ${t(i.className)}" title="${t(`Plan: ${i.name}`)}">
                    <span class="plan-icon" aria-hidden="true">${i.icon}</span>
                    <span class="plan-text">${t(i.name)}</span>
                </span>
            `}catch{return""}}function ae(e){return typeof e!="number"||!Number.isFinite(e)?null:Math.max(0,Math.min(100,e*100))}function ne(e){const i=ae(e);if(i===null)return"\u2014";const n=Math.round(i*100)/100;return(Number.isInteger(n)?String(n):n.toFixed(2))+"%"}function z(e){if(!e||typeof e.remainingFraction!="number"||!Number.isFinite(e.remainingFraction))return null;if(e.resetTime){const i=new Date(e.resetTime).getTime();if(Number.isFinite(i)&&i<=Date.now())return 1}return e.remainingFraction}function ie(e){const i=Math.max(0,Math.floor(e/6e4));if(i<1)return"<1m";const n=Math.floor(i/1440),s=Math.floor(i%1440/60),d=i%60,u=[];return n>0&&u.push(`${n}d`),s>0&&u.push(`${s}h`),n===0&&d>0&&u.push(`${d}m`),u.slice(0,2).join(" ")||"<1m"}function G(e){if(!e)return"";const i=new Date(e).getTime();if(!Number.isFinite(i))return"";const n=i-Date.now();if(n<=0){const s=new Date(e),d=String(s.getHours()).padStart(2,"0"),u=String(s.getMinutes()).padStart(2,"0"),r=s.toDateString()===new Date().toDateString()?`${d}:${u}`:`${s.getDate()}/${s.getMonth()+1} ${d}:${u}`;return`${a("quotaRestored")||a("resetDue")} (${r})`}return`${a("resetsIn")} `+ie(n)}function D(e){if(!e)return"";const i=new Date(e).getTime();if(!Number.isFinite(i))return"";const n=Math.max(0,Date.now()-i);return n<6e4?a("justNow"):`${ie(n)} `+a("ago")}function Le(e){const i=String(e?.window||"").trim().toLowerCase();return i==="weekly"?a("weeklyLimit"):i==="5h"?a("fiveHourLimit"):e?.displayName||e?.window||"Quota"}function He(e){const i={weekly:0,"5h":1};return[...Array.isArray(e)?e:[]].sort((n,s)=>{const d=String(n?.window||"").toLowerCase(),u=String(s?.window||"").toLowerCase();return(i[d]??99)-(i[u]??99)})}function Ee(e){const i=z(e),n=ae(i),s=ne(i),d=G(e.resetTime),u=Le(e),c=t(u).replace(/\s+/,"<br>");return`
            <div
                class="quota-bucket ${e.disabled?"disabled":""}"
                data-window="${t(e.window||"")}"
            >
                <div class="quota-bucket-heading">
                    <span
                        class="quota-window-name"
                        title="${t(e.description||u)}"
                    >
                        ${c}
                    </span>

                    <strong class="quota-percent">
                        ${t(s)}
                    </strong>
                </div>

                <progress
                    class="quota-progress"
                    max="100"
                    value="${n===null?0:n}"
                    aria-label="${t(u)}"
                    aria-valuetext="${t(`${s} ${a("remaining")}`)}"
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
        `}function se(e){const i=String(e?.displayName||"").trim(),n=i.toLowerCase();return n==="gemini models"||n==="gemini"?"Gemini":n==="claude and gpt models"||n==="claude and gpt"?"Claude and GPT":i||"Quota"}function _e(e){const i=He(e.buckets),n=se(e),s=String(e?.description||"").trim();return`
            <div class="quota-group">
                <div class="quota-group-heading">
                    <span
                        class="quota-group-title"
                        title="${t(n)}"
                    >
                        ${t(n)}
                    </span>

                    ${s?`
                                <button
                                    type="button"
                                    class="quota-info-button"
                                    title="${t(s)}"
                                    aria-label="${t(`${n}: ${s}`)}"
                                >
                                    i
                                </button>
                            `:""}
                </div>

                <div class="quota-buckets">
                    ${i.map(Ee).join("")}
                </div>
            </div>
        `}function Be(){const e=l.usage,i=Array.isArray(e?.groups)?e.groups:[],n=e?.fetchedAt?D(e.fetchedAt):"",s=i.length>0?de(e):`
                <div class="usage-empty secondary-text">
                    ${t(l.usageError||a("quotaUnavailable"))}
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

                <div class="current-usage-body">
                    ${s}
                </div>
            </div>
        `}function Ie(){const e=[],i=new Date;for(let n=6;n>=0;n--){const s=new Date(i);s.setDate(s.getDate()-n);const d=s.toISOString().split("T")[0],u=s.toLocaleDateString(H()==="id"?"id-ID":"en-US",{weekday:"short"});e.push({date:d,label:u})}return e}function Qe(e){if(!e)return"";const i=l.quotaHistory||{},n=h(e),s=i[n]||[],u=Ie().map(c=>{const r=s.find(w=>w.date===c.date),p=r&&typeof r.lowestRemainingPercent=="number",m=p?r.lowestRemainingPercent:null;let $="history-empty";p&&($=m<=15?"history-critical":m<=35?"history-warn":"history-healthy");const x=p?`${Math.max(12,m)}%`:"4px",A=p?`${c.label} (${c.date}): ${m}% ${a("remaining")}`:`${c.label} (${c.date}): -`;return`
                <div class="history-bar-col" title="${t(A)}">
                    <div class="history-bar-track">
                        <div class="history-bar-fill ${$}" style="height: ${x};"></div>
                    </div>
                    <span class="history-bar-label">${t(c.label)}</span>
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
        `}function Pe(){document.querySelectorAll(".avatar-image").forEach(e=>{e.addEventListener("error",()=>{e.hidden=!0,e.closest(".avatar")?.classList.remove("has-image")},{once:!0})})}function oe(){document.querySelectorAll("[data-reset-at]").forEach(e=>{const i=G(e.dataset.resetAt),n=e.dataset.resetPrefix||"";e.textContent=i?n+i:""}),document.querySelectorAll("[data-reset-time]").forEach(e=>{const i=e.dataset.resetTime;if(i){const n=new Date(i).getTime();Number.isFinite(n)&&n<=Date.now()?e.textContent="100%":e.dataset.initialPercent&&(e.textContent=e.dataset.initialPercent)}}),document.querySelectorAll("[data-usage-fetched-at]").forEach(e=>{e.textContent=D(e.dataset.usageFetchedAt)}),document.querySelectorAll("[data-snapshot-fetched-at]").forEach(e=>{e.textContent=D(e.dataset.snapshotFetchedAt)})}function Ge(){if(l.preferences?.hideCurrent===!0||l.preferences?.showCurrent===!1)return"";const e=!!l.loading,i=`
            <div class="section-header current-static-header">
                <div class="section-static-title">
                    <span class="section-title">
                        ${t(a("currentAccount"))}
                    </span>
                </div>
            </div>
        `;if(!l.current)return`
                <section class="section current-section">
                    ${i}

                    <div
                        class="current-state-panel ${e?"checking":"error"}"
                        role="status"
                        aria-live="polite"
                    >
                        <strong>
                            ${t(a(e?"loadingAccount":"unavailable"))}
                        </strong>

                        <div class="secondary-text">
                            ${t(e?a("checkingAccount"):l.error||a("waiting"))}
                        </div>
                    </div>
                </section>
            `;const n=X(),s=l.current.displayName||n?.displayName||l.current.email,d=n&&h(o.editingEmail)===h(n.email),u=n?.label||a("currentAccountLabel"),c=`
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
                        ${W(s,l.current.email,l.current.profilePictureUrl||n?.profilePictureUrl,n?.colorTag?`current-avatar tag-${t(n.colorTag)}`:"current-avatar")}


                        <div class="identity">
                            ${n&&d?`
                                        <div class="current-label-editor">
                                            ${te(n)}
                                        </div>
                                    `:`
                                        <div class="saved-title-row current-title-row">
                                            <div
                                                class="identity-name current-name"
                                                title="${t(n?.label&&n.label.trim()&&n.label.trim()!==s?`${n.label.trim()} (${s})`:s)}"
                                            >
                                                ${n?.colorTag?`<span class="color-tag-dot tag-${t(n.colorTag)}" title="${t(n.colorTag)}"></span>`:""}${t(n?.label&&n.label.trim()?n.label.trim():s)}
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
                                                                ${y()?"disabled":""}
                                                            >
                                                                ${v("edit")}
                                                            </button>
                                                        `:""}
                                            </div>
                                        </div>

                                        <div
                                            class="identity-email"
                                            title="${t(l.current.email)}"
                                        >
                                            ${t(l.current.email)}
                                        </div>

                                        <div class="saved-badges-row current-badges-row">
                                            ${K(n?.plan?n:l.current)}

                                            ${l.vaultedEmails?.includes(h(l.current.email))?`
                                                        <span class="vault-pill" title="${t(a("vaultInfo"))}">
                                                            \u26A1 ${t(a("instantBadge"))}
                                                        </span>
                                                    `:""}

                                            ${n?.group?`
                                                        <span class="group-pill" title="Group: ${t(n.group)}">
                                                            \u{1F3F7}\uFE0F ${t(n.group)}
                                                        </span>
                                                    `:""}

                                            ${c}
                                        </div>
                                    `}
                        </div>
                    </div>

                    <div class="action-row">
                        <button
                            type="button"
                            class="btn"
                            data-action="reauth"
                            ${e||y()?"disabled":""}
                        >
                            ${t(a("reauth"))}
                        </button>

                        <button
                            type="button"
                            class="btn subtle-danger"
                            data-action="signout"
                            ${e||y()?"disabled":""}
                        >
                            ${t(a("signout"))}
                        </button>
                    </div>

                    ${Be()}
                    ${l.preferences?.showQuotaAnalytics?Qe(l.current.email):""}
                </div>
            </section>
        `}function re(e,i){return(Array.isArray(e?.groups)?e.groups:[]).find(s=>i(String(s.displayName||"").toLowerCase()))}function le(e,i){return(Array.isArray(e?.buckets)?e.buckets:[]).find(n=>String(n.window||"").toLowerCase()===i)}function ce(e){return ne(z(e))}function ue(e,i){if(!i)return"";const n=le(i,"weekly"),s=le(i,"5h"),d=G(n?.resetTime),u=G(s?.resetTime),c=(r,p,m,$)=>`
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
                                    class="saved-quota-reset ${t($)}"
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
                    ${c(a("weeklyShort"),n,d,"saved-weekly-reset")}

                    ${c(a("fiveHourShort"),s,u,"saved-five-hour-reset")}
                </div>
            </div>
        `}function de(e){if(!e)return"";const i=re(e,s=>s.includes("gemini")),n=re(e,s=>s.includes("claude")||s.includes("gpt"));return!i&&!n?"":`
            <div class="saved-usage-summary">
                ${ue("Gemini",i)}

                ${ue("Claude + GPT",n)}
            </div>
        `}function De(e){const i=h(l.current?.email),n=!!i&&h(e.email)===i,s=h(o.editingEmail)===h(e.email),d=!!(l.loading&&(!l.accounts||l.accounts.length===0)),u=l.usageSnapshots?.[h(e.email)],c=n&&l.usage||u,r=c?.fetchedAt?D(c.fetchedAt):"",p=n?a("activeNow")||"Active now":e.lastSeenAt?D(e.lastSeenAt):"",m=[];if(n?m.push(a("active")||"Active account"):e.lastSeenAt&&m.push(`${a("lastUsed")||"Last used"}: ${new Date(e.lastSeenAt).toLocaleString()}`),r){const A=n?a("liveData")||"Live data":a("updated")||"Snapshot updated";m.push(`${A}: ${r}`)}const $=m.join(" \u2022 "),x=p?`
                <span class="last-seen-pill ${n?"active":""}" title="${t($)}">
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
                    ${W(e.displayName||e.label,e.email,e.profilePictureUrl||(n?l.current?.profilePictureUrl:void 0),`small ${e.colorTag?`tag-${t(e.colorTag)}`:""}`,n?`
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
                                    ${d||y()?"disabled":""}
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
                    ${s?te(e):`
                                <div class="saved-title-row">
                                    <div
                                        class="identity-name saved-label"
                                        title="${t(V(e))}"
                                    >
                                        ${e.colorTag?`<span class="color-tag-dot tag-${t(e.colorTag)}" title="${t(e.colorTag)}"></span>`:""}${t(V(e))}
                                    </div>

                                    <div class="saved-title-actions">

                                        <button
                                            type="button"
                                            class="edit-icon"
                                            data-action="edit-label"
                                            data-email="${t(e.email)}"
                                            title="${t(a("editLabel"))}"
                                            aria-label="${t(a("editLabel"))}"
                                            ${y()?"disabled":""}
                                        >
                                            ${v("edit")}
                                        </button>

                                        <button
                                            type="button"
                                            class="icon-btn compact delete-account-btn"
                                            data-action="remove-account"
                                            data-email="${t(e.email)}"
                                            title="${t(a("removeSavedAccount"))}"
                                            aria-label="${t(a("removeSavedAccount"))}"
                                            ${y()?"disabled":""}
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

                                        ${l.vaultedEmails?.includes(h(e.email))?`
                                                    <span class="vault-pill" title="${t(a("vaultInfo"))}">
                                                        \u26A1 ${t(a("instantBadge"))}
                                                    </span>
                                                `:""}

                                        ${e.group?`
                                                    <span class="group-pill" title="Group: ${t(e.group)}">
                                                        \u{1F3F7}\uFE0F ${t(e.group)}
                                                    </span>
                                                `:""}

                                        ${x}
                                    </div>
                                </div>


                            `}


                </div>

                <div class="saved-account-quota-area">
                    ${de(c)}
                </div>
            </article>
        `}function pe(){if(l.loading&&(!l.accounts||l.accounts.length===0))return`
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
            `;const e=j();return l.accounts.length===0?`
                <div class="empty-panel">
                    <strong>
                        ${t(a("noSaved"))}
                    </strong>

                    <div class="secondary-text">
                        ${t(a("noSavedHint"))}
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

                    ${o.search.trim()||o.groupFilter!=="all"?`
                        <div style="margin-top: 10px;">
                            <button type="button" class="btn compact" data-action="clear-search">
                                ${t(a("clearFilter")||"Clear filter")}
                            </button>
                        </div>
                    `:""}
                </div>
            `:e.map(De).join("")}function Ne(){if(l.preferences?.hideSaved===!0||l.preferences?.showSaved===!1)return"";const e=j().length,i=(l.accounts?.length||0)>3,n=!!l.loading&&(!l.accounts||l.accounts.length===0),s=!!l.loading&&(l.accounts?.length||0)>0,d=n?"\u2026":o.search.trim()?`${e}/${l.accounts.length}`:String(l.accounts.length),u=`
            <div class="saved-header-actions">
                ${s?`
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
                    ${y()?"disabled":""}
                >
                    ${v("plus")}
                </button>
            </div>
        `;return`
            <section class="section saved-section">
                ${Ce(a("savedAccounts"),"toggle-saved",o.savedCollapsed,u)}

                ${o.savedCollapsed?"":`
                            <div class="saved-body">
                                <div class="saved-controls">
                                    ${(l.accounts?.length||0)>0?`
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
                                                            value="${t(o.search)}"
                                                            placeholder="${t(a("searchPlaceholder"))}"
                                                            autocomplete="off"
                                                            spellcheck="false"
                                                        >

                                                        <button
                                                            type="button"
                                                            class="search-clear-btn"
                                                            data-action="clear-search"
                                                            style="display: ${o.search?"inline-flex":"none"};"
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
                                                            <option value="recent" ${o.sortBy==="recent"?"selected":""}>${t(a("sortRecent"))}</option>
                                                            <option value="quota" ${o.sortBy==="quota"?"selected":""}>${t(a("sortQuota"))}</option>
                                                            <option value="name" ${o.sortBy==="name"?"selected":""}>${t(a("sortName"))}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                ${(()=>{const c=Array.from(new Set((l.accounts||[]).map(r=>r.group).filter(Boolean)));return c.length===0?"":`
                                                        <div class="saved-group-filter-row">
                                                            <button type="button" class="group-filter-chip ${o.groupFilter==="all"?"active":""}" data-action="set-group-filter" data-group="all">All (${l.accounts.length})</button>
                                                            ${c.map(r=>{const p=l.accounts.filter(m=>m.group===r).length;return`<button type="button" class="group-filter-chip ${o.groupFilter===r?"active":""}" data-action="set-group-filter" data-group="${t(r)}">${t(r)} (${p})</button>`}).join("")}
                                                        </div>
                                                    `})()}
                                            `:""}

                                    ${l.current&&!X()?`
                                                <button
                                                    type="button"
                                                    class="btn block"
                                                    data-action="save"
                                                    ${y()?"disabled":""}
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
        `}function Z(e,i,n,s,d){return`
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
                    class="runtime-state ${t(s)}"
                >
                    <span class="status-dot"></span>
                    ${t(d)}
                </div>
            </div>
        `}function Ue(){if(l.preferences?.hideRuntime===!0||l.preferences?.showRuntime===!1)return"";const e=!!l.loading,i=l.runtime||{},n=i.extension||{},s=i.process||null,d=i.health||null,u=!!n.installed,c=!!s,r=!!d?.reachable,p=u&&c&&r,m=e?"checking":p?"healthy":"warning",$=a(e?"checking":p?"ready":"disconnected");return`
            <div class="runtime-status-bar">
                <button
                    type="button"
                    class="runtime-status-pill ${t(m)}"
                    data-action="open-runtime-modal"
                    title="${t(a("antigravityStatus"))} \xB7 ${t($)}"
                    aria-label="${t(a("antigravityStatus"))}"
                >
                    <span class="status-dot"></span>
                    <span class="runtime-status-pill-label">Antigravity:</span>
                    <span class="runtime-status-pill-value">${t($)}</span>
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
        `}function Fe(){if(!o.runtimeModalOpen)return"";const e=!!l.loading,i=l.runtime||{},n=i.extension||{},s=i.process||null,d=i.health||null,u=!!n.installed,c=!!s,r=!!d?.reachable,p=u&&c&&r,m=e?"checking":p?"healthy":"warning",$=a(e?"checking":p?"ready":"disconnected");return`
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

                            ${Z("A",a("agyBackend"),e?a("checkingBackend"):i.agyVersion?`${a("version")} ${i.agyVersion}`:a("localBackend"),e?"checking":c?"healthy":"error",a(e?"checking":c?"running":"stopped"))}

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
        `}function me(e,i,n){const s=h(e.email),d=s===i&&l.usage?l.usage:n[s];if(!d?.buckets||!Array.isArray(d.buckets))return 1/0;let u=1/0;for(const c of d.buckets)if(c.resetTime&&!c.disabled){const r=new Date(c.resetTime).getTime();Number.isFinite(r)&&r>Date.now()&&r<u&&(u=r)}return u}function ge(){const e=l.accounts||[],i=l.usageSnapshots||{},n=h(l.current?.email||""),s=(o.matrixSearch||"").trim().toLowerCase();let d=s?e.filter(r=>[r.label,r.displayName,r.email,r.group].filter(Boolean).join(" ").toLowerCase().includes(s)):e.slice();const u=o.matrixSort||"quota",c=d.sort((r,p)=>{const m=h(r.email),$=h(p.email);if(m===n)return-1;if($===n)return 1;if(u==="reset"){const x=me(r,n,i),A=me(p,n,i);if(x!==A)return x-A}else if(u==="quota"){const x=P(r),A=P(p),w=typeof x=="number"?x:-1,L=typeof A=="number"?A:-1;if(w!==L)return L-w}return(r.label||r.displayName||r.email).localeCompare(p.label||p.displayName||p.email)});return c.length===0?s?`
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
                `:c.map(r=>{const p=h(r.email),m=!!(n&&p===n),$=m&&l.usage||i[p],x=r.displayName||r.label||r.email,A=r.label||(m?a("currentAccountLabel"):"");let w=null,L="",I=null,F="";if($?.buckets&&Array.isArray($.buckets))for(const k of $.buckets){const J=(k.displayName||k.bucketId||"").toLowerCase(),O=(k.window||k.description||"").toLowerCase(),Ze=J.includes("5-hour")||J.includes("5h")||O.includes("5 hour")||O.includes("5h"),$e=J.includes("week")||O.includes("week")||O.includes("7 day");if(typeof k.remainingFraction=="number"&&!k.disabled){const ke=z(k),we=typeof ke=="number"?Math.max(0,Math.min(100,Math.round(ke*100))):null,Se=k.resetTime?G(k.resetTime):"";Ze||w===null&&!$e?(w=we,L=Se):$e&&(I=we,F=Se)}}if(w===null){const k=P(r);typeof k=="number"&&(w=k)}const ye=k=>typeof k!="number"?"tone-empty":k<=15?"tone-critical":k<=35?"tone-warn":"tone-healthy";return`
                    <div class="matrix-card ${m?"active-matrix-card":""}">
                        <!-- Tier 1: Header Row (Identity Left, Action Right) -->
                        <div class="matrix-card-header">
                            <div class="matrix-identity-group">
                                ${W(x,r.email,r.profilePictureUrl||(m?l.current?.profilePictureUrl:void 0),r.colorTag?`matrix-avatar tag-${t(r.colorTag)}`:"matrix-avatar")}
                                <div class="matrix-identity-text">
                                    <div class="matrix-name-row">
                                        <span class="matrix-account-name" title="${t(x)}">${t(x)}</span>
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
                            ${K(m&&l.current||r)}
                            ${l.vaultedEmails?.includes(h(r.email))?`<span class="vault-pill" title="${t(a("vaultInfo"))}">\u26A1 ${t(a("instantBadge"))}</span>`:""}
                            ${A?`<span class="account-label">${t(A)}</span>`:""}
                            ${r.group?`<span class="group-pill" title="Group: ${t(r.group)}">\u{1F3F7}\uFE0F ${t(r.group)}</span>`:""}
                        </div>

                        <!-- Tier 3: Quota Grid (5h & Weekly Side by Side) -->
                        <div class="matrix-quota-grid">
                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${t(a("fiveHourShort")||"5h")}:</span>
                                    <strong>${typeof w=="number"?`${w}%`:"-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${ye(w)}" style="width: ${typeof w=="number"?w:0}%;"></div>
                                </div>
                                ${L?`<span class="matrix-reset-sub" title="${t(L)}">${t(L)}</span>`:""}
                            </div>

                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${t(a("weeklyShort")||"Weekly")}:</span>
                                    <strong>${typeof I=="number"?`${I}%`:"-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${ye(I)}" style="width: ${typeof I=="number"?I:0}%;"></div>
                                </div>
                                ${F?`<span class="matrix-reset-sub" title="${t(F)}">${t(F)}</span>`:""}
                            </div>
                        </div>
                    </div>
                `}).join("")}function Oe(){if(!o.quotaMatrixOpen)return"";const e=l.accounts||[],i=ge();return`
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
                                        value="${t(o.matrixSearch||"")}"
                                        placeholder="${t(a("searchAccountsPlaceholder"))}"
                                        autocomplete="off"
                                        spellcheck="false"
                                    >
                                    ${o.matrixSearch?`
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
                                        class="matrix-sort-chip ${!o.matrixSort||o.matrixSort==="quota"?"active":""}"
                                        data-action="set-matrix-sort"
                                        data-sort="quota"
                                    >
                                        \u{1F7E2} ${t(a("highestQuota"))}
                                    </button>
                                    <button
                                        type="button"
                                        class="matrix-sort-chip ${o.matrixSort==="reset"?"active":""}"
                                        data-action="set-matrix-sort"
                                        data-sort="reset"
                                    >
                                        \u23F1 ${t(a("earliestReset"))}
                                    </button>
                                    <button
                                        type="button"
                                        class="matrix-sort-chip ${o.matrixSort==="name"?"active":""}"
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
        `}function Ve(){if(!o.settingsOpen||!o.settingsDraft)return"";const e=o.settingsDraft;return`
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

                            ${l.meta?.iconUri?`
                            <div style="text-align: center; margin: 8px 0 16px 0;">
                                <img src="${t(l.meta.iconUri)}" width="64" height="64" style="border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); vertical-align: middle;" alt="Logo" />
                            </div>`:""}

                            <div class="about-row">
                                <span>
                                    Antigravity Account Switcher
                                </span>

                                <span>
                                    v${t(l.meta?.version||"1.0.1")}
                                </span>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(a("developer"))}
                                </span>

                                <strong>
                                    ${t(l.meta?.developer||"Boy Gilang Ramadhan")}
                                </strong>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(a("website"))}
                                </span>

                                <a
                                    href="${t(l.meta?.website||"https://boygr.com")}"
                                    data-external-url="${t(l.meta?.website||"https://boygr.com")}"
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
                            class="btn"
                            data-action="cancel-settings"
                        >
                            ${t(a("cancel"))}
                        </button>

                        <button
                            type="button"
                            class="btn primary"
                            data-action="save-settings"
                            ${y()?"disabled":""}
                        >
                            ${t(a("save"))}
                        </button>
                    </footer>
                </section>
            </div>
        `}function C(e,i,n,s){return`
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
                ${s?`<div class="field-hint">${t(s)}</div>`:""}
            </div>
        `}function je(){const e=l.meta||{},i=e.developer||"Boy Gilang Ramadhan",n=e.website||"https://boygr.com",s=e.version||"0.5.1";return`
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
                    v${t(s)}
                </span>
            </footer>
        `}function We(){const e=o.removeCandidate;return e?`
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
                                ${t(V(e))}
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
        `:""}function g(){ee(),document.documentElement.lang=H(),R.innerHTML=`
            <div
                class="app"
                aria-busy="${l.loading||y()?"true":"false"}"
            >
                <div class="content-shell">
                    ${Te()}
                    ${Ue()}
                    ${Ge()}
                    ${Ne()}
                </div>

                ${je()}
            </div>

            ${Ve()}
            ${We()}
            ${Fe()}
            ${Oe()}
        `,Pe(),oe(),o.editingEmail&&window.requestAnimationFrame(()=>{const e=document.querySelector('[data-role="label-input"]');e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))})}function he(){const e=document.getElementById("saved-account-list");e&&(e.innerHTML=pe());const i=document.getElementById("account-count");if(i){const n=j().length;i.textContent=o.search.trim()?`${n}/${l.accounts.length}`:String(l.accounts.length)}}function Y(){const e=document.getElementById("matrix-account-list");e&&(e.innerHTML=ge())}function Ke(e){const i=U(e);i&&(o.editingEmail=i.email,o.editValue=i.label||"",o.editColorTag=i.colorTag||"",o.editGroup=i.group||"",o.customGroupInputOpen=!1,o.customGroupInputValue="",g())}function ve(){o.editingEmail=null,o.editValue="",o.editColorTag="",o.editGroup="",o.customGroupInputOpen=!1,o.customGroupInputValue="",g()}function fe(e){const i=U(e);i&&(q({type:"label",email:i.email}),b.postMessage({type:"updateLabel",email:i.email,label:o.editValue,colorTag:o.editColorTag,group:o.editGroup}))}function be(){const e=l.preferences||{};o.settingsDraft={theme:e.theme||"vscode",language:e.language||"auto",hideCurrent:e.hideCurrent===!0||e.showCurrent===!1,hideSaved:e.hideSaved===!0||e.showSaved===!1,hideRuntime:e.hideRuntime===!0||e.showRuntime===!1,showQuotaAnalytics:e.showQuotaAnalytics===!0,autoRefreshIntervalMinutes:typeof e.autoRefreshIntervalMinutes=="number"?e.autoRefreshIntervalMinutes:5,enableLowQuotaReminder:e.enableLowQuotaReminder!==!1,lowQuotaThresholdPercent:typeof e.lowQuotaThresholdPercent=="number"?e.lowQuotaThresholdPercent:20,smartQuotaFallback:e.smartQuotaFallback!==!1,autoRoundRobin:e.autoRoundRobin===!0,enableQuotaAudio:e.enableQuotaAudio!==!1,enableInstantSwitch:e.enableInstantSwitch!==!1,proxyMode:e.proxyMode||"system",proxyUrl:e.proxyUrl||"",proxyStrictSSL:e.proxyStrictSSL!==!1},o.settingsOpen=!0,g()}function _(){o.settingsOpen=!1,o.settingsDraft=null,g()}function ze(){o.settingsDraft&&(q({type:"settings"}),b.postMessage({type:"saveSettings",preferences:{...o.settingsDraft,showCurrent:!o.settingsDraft.hideCurrent,showSaved:!o.settingsDraft.hideSaved,showRuntime:!o.settingsDraft.hideRuntime}}))}R.addEventListener("input",e=>{const i=e.target;if(i instanceof HTMLInputElement&&i.id==="account-search"){o.search=i.value;const n=i.closest(".search-input-wrapper")?.querySelector(".search-clear-btn");n&&(n.style.display=o.search?"inline-flex":"none"),B(),he();return}if(i instanceof HTMLInputElement&&i.id==="matrix-search"){o.matrixSearch=i.value;const n=i.closest(".search-input-wrapper")?.querySelector(".search-clear-btn");n&&(n.style.display=o.matrixSearch?"inline-flex":"none"),Y();return}if(i instanceof HTMLInputElement&&i.dataset.role==="label-input"){o.editValue=i.value;return}if(i instanceof HTMLInputElement&&i.id==="custom-group-input"){o.customGroupInputValue=i.value;return}if(i instanceof HTMLInputElement&&i.dataset.setting==="proxyUrl"){o.settingsDraft&&(o.settingsDraft.proxyUrl=i.value);return}}),R.addEventListener("keydown",e=>{const i=e.target;if(i instanceof HTMLInputElement&&i.id==="custom-group-input")if(e.key==="Enter"){e.preventDefault();const n=i.value.trim();n&&(o.editGroup=n),o.customGroupInputOpen=!1,o.customGroupInputValue="",g()}else e.key==="Escape"&&(e.preventDefault(),o.customGroupInputOpen=!1,o.customGroupInputValue="",g())}),R.addEventListener("change",e=>{const i=e.target;if(i instanceof HTMLSelectElement&&i.dataset.action==="change-sort"){o.sortBy=i.value,o.sortCustomized=!0,B(),he();return}if(!o.settingsDraft||!(i instanceof HTMLInputElement||i instanceof HTMLSelectElement))return;const n=i.dataset.setting;if(n){if(i instanceof HTMLInputElement&&i.type==="checkbox"){o.settingsDraft[n]=i.checked,n==="enableLowQuotaReminder"&&g();return}if(n==="autoRefreshIntervalMinutes"||n==="lowQuotaThresholdPercent"){o.settingsDraft[n]=Number.parseInt(i.value,10);return}if(n==="proxyMode"){o.settingsDraft.proxyMode=i.value,g();return}o.settingsDraft[n]=i.value}}),R.addEventListener("click",e=>{const i=e.target;if(!(i instanceof Element))return;const n=i.closest("[data-action]");if(!n)return;const s=n.dataset.action,d=n.dataset.email;if(s==="open-settings"){be();return}if(s==="cancel-settings"){_();return}if(s==="settings-backdrop"&&i===n){_();return}if(s==="save-settings"){y()||ze();return}if(s==="toggle-current"){o.currentCollapsed=!o.currentCollapsed,B(),g();return}if(s==="toggle-saved"){o.savedCollapsed=!o.savedCollapsed,B(),g();return}if(s==="clear-search"){o.search="",o.groupFilter="all";const c=document.getElementById("account-search");c&&(c.value="",c.focus());const r=document.querySelector(".search-clear-btn");r&&(r.style.display="none"),B(),g();return}if(s==="open-runtime-modal"){o.runtimeModalOpen=!0,g();return}if(s==="close-runtime-modal"||s==="runtime-modal-backdrop"&&i===n){o.runtimeModalOpen=!1,g();return}if(s==="open-quota-matrix"){o.quotaMatrixOpen=!0,g();return}if(s==="close-quota-matrix"){if(n.classList.contains("matrix-modal-backdrop")&&i!==n)return;o.quotaMatrixOpen=!1,o.matrixSearch="",g();return}if(s==="clear-matrix-search"){o.matrixSearch="";const c=document.getElementById("matrix-search");c&&(c.value="",c.focus());const r=n.closest(".search-input-wrapper")?.querySelector(".search-clear-btn")||document.querySelector(".matrix-filter-row .search-clear-btn");r&&(r.style.display="none"),Y();return}if(s==="set-matrix-sort"){const c=n.dataset.sort||"quota";o.matrixSort=c,document.querySelectorAll(".matrix-sort-chip").forEach(p=>{p.classList.toggle("active",p.dataset.sort===c)}),Y();return}if(s==="export-accounts"){b.postMessage({type:"exportAccounts"});return}if(s==="import-accounts"){b.postMessage({type:"importAccounts"});return}if(s==="clear-token-vault"){b.postMessage({type:"clearTokenVault"});return}if(s==="reconnect-hub"){o.runtimeModalOpen=!1,q({type:"refresh"}),b.postMessage({type:"reconnectHub"});return}if(s==="restart-backend"){o.runtimeModalOpen=!1,q({type:"refresh"}),b.postMessage({type:"restartBackend"});return}if(s==="select-color-tag"){const c=n.dataset.color||"";o.editColorTag=o.editColorTag===c?"":c,g();return}if(s==="select-edit-group"){const c=n.dataset.group||"";o.editGroup=o.editGroup===c?"":c,g();return}if(s==="open-custom-group"){o.customGroupInputOpen=!0,o.customGroupInputValue="",g(),setTimeout(()=>{const c=document.getElementById("custom-group-input");c&&c.focus()},20);return}if(s==="cancel-custom-group"){o.customGroupInputOpen=!1,o.customGroupInputValue="",g();return}if(s==="confirm-custom-group"){const c=document.getElementById("custom-group-input"),r=(c?c.value:o.customGroupInputValue||"").trim();r&&(o.editGroup=r),o.customGroupInputOpen=!1,o.customGroupInputValue="",g();return}if(s==="set-group-filter"){o.groupFilter=n.dataset.group||"all",g();return}if(s==="export-quota-analytics"){b.postMessage({type:"exportQuotaAnalytics"});return}if(s==="edit-label"){y()||Ke(d);return}if(s==="cancel-label"){ve();return}if(s==="save-label"){y()||fe(d);return}if(s==="remove-account"){const c=U(d);c&&!y()&&(o.removeCandidate=c,g());return}if(s==="cancel-remove"){o.removeCandidate=null,g();return}if(s==="confirm-remove"){const c=o.removeCandidate;c&&!y()&&(q({type:"remove",email:c.email}),b.postMessage({type:"removeAccount",email:c.email}));return}if(y())return;if(s==="switch"){const c=U(d);c&&(o.quotaMatrixOpen=!1,q({type:"switch",email:c.email}),b.postMessage({type:"switchAccount",account:c}));return}const u={add:"addAccount",save:"saveCurrent",refresh:"refresh",reauth:"reauth",signout:"signout"};u[s]&&(q({type:{add:"add",save:"save",refresh:"refresh",reauth:"reauth",signout:"signout"}[s]}),b.postMessage({type:u[s]}))}),window.addEventListener("keydown",e=>{if(e.key==="Escape"){if(o.quotaMatrixOpen){o.quotaMatrixOpen=!1,g();return}if(o.runtimeModalOpen){o.runtimeModalOpen=!1,g();return}if(o.settingsOpen){_();return}if(o.editingEmail&&!S){ve();return}M&&!S&&(M=null,T&&(clearTimeout(T),T=null),g());return}if(e.key==="Enter"&&o.editingEmail&&!S){const i=document.activeElement;i instanceof HTMLInputElement&&i.dataset.role==="label-input"&&(e.preventDefault(),fe(o.editingEmail))}}),R.addEventListener("click",e=>{const i=e.target;if(!(i instanceof Element))return;const n=i.closest("[data-external-url]");if(!n)return;e.preventDefault();const s=n.dataset.externalUrl;s&&b.postMessage({type:"openExternal",url:s})}),window.addEventListener("message",e=>{const i=e.data;if(!i)return;if(i.type==="openSettings"){be();return}if(i.type==="openQuotaMatrix"){o.quotaMatrixOpen=!0,g();return}if(i.type==="playChime"){E(i.chime);return}if(i.type!=="state")return;const n=S;if(l=i.state,B(),xe(),n?.type==="remove"){o.removeCandidate=null,N(a("accountRemoved"),"success");return}if(n?.type==="label"){o.editingEmail=null,o.editValue="",N(a("labelUpdated"),"success");return}if(n?.type==="settings"){o.settingsOpen=!1,o.settingsDraft=null,N(a("settingsSaved"),"success");return}if(n&&n.type!=="refresh"){N(a("stateUpdated"),"success");return}g()}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{l.preferences?.theme==="system"&&ee()}),window.setInterval(()=>{oe()},3e4),g(),b.postMessage({type:"ready"})})();function enhanceSavedQuotaMetrics(b=document){const R=b.querySelectorAll(".saved-account-quota-area");for(const f of R){const l=f.querySelectorAll([".saved-family-metric",".saved-usage-metric",".saved-quota-metric",".saved-metric-row",".saved-usage-row"].join(","));for(const o of l){const S=o.querySelector(".saved-quota-main"),M=o.querySelector(".saved-quota-value");if(!S||!M)continue;const T=M.textContent?.trim()??"",Q=T.match(/(-?\d+(?:\.\d+)?)\s*%/);if(!Q)continue;const H=Number(Q[1]);if(!Number.isFinite(H))continue;const a=Math.max(0,Math.min(100,H));let t=o.querySelector(":scope > .saved-quota-progress");if(!t){t=document.createElement("div"),t.className="saved-quota-progress",t.setAttribute("aria-hidden","true");const E=document.createElement("span");E.className="saved-quota-progress-fill",t.append(E),S.insertAdjacentElement("afterend",t)}t.style.setProperty("--saved-quota-percent",`${a}%`);let v=o.querySelector(":scope > .saved-quota-remaining");v||(v=document.createElement("div"),v.className="saved-quota-remaining",t.insertAdjacentElement("afterend",v)),v.textContent=`${T} remaining`;const h=o.querySelector([".saved-quota-reset",".saved-usage-reset",".saved-metric-reset"].join(","));if(h){const E=h.textContent?.trim()??"";h.textContent=E.replace(/^Resets\s+in\s+/i,"Reset ").replace(/^Reset\s+in\s+/i,"Reset ")}}}}let savedQuotaEnhancementQueued=!1;function queueSavedQuotaEnhancement(){savedQuotaEnhancementQueued||(savedQuotaEnhancementQueued=!0,queueMicrotask(()=>{savedQuotaEnhancementQueued=!1,enhanceSavedQuotaMetrics(document)}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{enhanceSavedQuotaMetrics(document)},{once:!0}):enhanceSavedQuotaMetrics(document);const savedQuotaObserver=new MutationObserver(()=>{queueSavedQuotaEnhancement()});savedQuotaObserver.observe(document.documentElement,{childList:!0,subtree:!0});

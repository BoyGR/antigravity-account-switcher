"use strict";(()=>{const b=acquireVsCodeApi(),M=document.getElementById("app");if(!M)return;const $=b.getState()||{};let r={loading:!0,current:$.current||null,accounts:Array.isArray($.accounts)?$.accounts:[],runtime:$.runtime||null,usage:$.usage||null,usageSnapshots:$.usageSnapshots||{},usageError:null,error:null,preferences:{version:1,theme:"vscode",language:"auto",effectiveLanguage:"en",hideCurrent:!1,hideSaved:!1,hideRuntime:!1,showCurrent:!0,showSaved:!0,showRuntime:!0,showQuotaAnalytics:!1,autoRefreshIntervalMinutes:5,enableLowQuotaReminder:!0,lowQuotaThresholdPercent:20,smartQuotaFallback:!0,autoRoundRobin:!1,enableQuotaAudio:!0,enableInstantSwitch:!0},vaultedEmails:[],meta:{version:"1.2.6",developer:"Boy Gilang Ramadhan",website:"https://boygr.com",iconUri:""}},o={search:typeof $.search=="string"?$.search:"",sortBy:typeof $.sortBy=="string"?$.sortBy:"quota",currentCollapsed:!!$.currentCollapsed,savedCollapsed:!!$.savedCollapsed,runtimeCollapsed:$.runtimeCollapsed!==!1,usageCollapsed:!!$.usageCollapsed,settingsOpen:!1,settingsDraft:null,editingEmail:null,editValue:"",editColorTag:"",editGroup:"",customGroupInputOpen:!1,customGroupInputValue:"",groupFilter:"all",removeCandidate:null,runtimeModalOpen:!1,quotaMatrixOpen:!1},A=null,S=null,x=null;const B={en:{appName:"Antigravity Account Switcher",accountManager:"Google account manager",settings:"Settings",currentAccount:"Current account",savedAccounts:"Saved accounts",antigravityStatus:"Antigravity status",refresh:"Refresh",connected:"Connected",active:"Active",switch:"Switch",reauth:"Re-auth",signout:"Sign out",addGoogleAccount:"Add Google Account",addGoogleAccountHint:"Sign in or switch account",saveCurrentAccount:"Save Current Account",unavailable:"Antigravity account unavailable",waiting:"Waiting for Antigravity...",checking:"Checking\u2026",loadingAccount:"Loading account\u2026",loadingSavedAccounts:"Loading saved accounts\u2026",updatingQuota:"Updating quota\u2026",checkingAccount:"Checking Antigravity account state\u2026",checkingExtension:"Checking extension status\u2026",checkingBackend:"Checking backend status\u2026",checkingHub:"Checking hub connection\u2026",noSaved:"No saved accounts",noSavedHint:"Save the current Antigravity account or add another Google account.",noMatches:"No matching accounts",noMatchesHint:"Try another label, display name, or email.",searchPlaceholder:"Search accounts",sortBy:"Sort by",sortQuota:"Highest quota",sortName:"Name (A-Z)",sortRecent:"Recently used",editLabel:"Edit label",save:"Save",cancel:"Cancel",removeLabel:"Clear label",accountActions:"Account actions",appearance:"Appearance",theme:"Theme",language:"Language",layout:"Layout",followVsCode:"Follow Editor / IDE Theme",light:"Light",dark:"Dark",system:"System",automatic:"Auto",english:"English",indonesian:"Bahasa Indonesia",hideCurrent:"Hide current account",hideSaved:"Hide saved accounts",hideRuntime:"Hide Antigravity status",showQuotaAnalytics:"Show 7-day quota analytics",switchingAndAutomation:"Switching & Automation",quotaAndReminders:"Quota & Reminders",autoRefreshQuota:"Auto-refresh quota",autoRefreshOff:"Off (Manual only)",every1Minute:"Every 1 minute",every5Minutes:"Every 5 minutes (Recommended)",every15Minutes:"Every 15 minutes",every30Minutes:"Every 30 minutes",every1Hour:"Every 1 hour",lowQuotaReminder:"Low quota notification",reminderThreshold:"Warning threshold",percentRemaining:"% remaining",smartQuotaFallback:"Smart Quota Fallback (1-click switch)",backupAndRestore:"Backup & Restore",backupDesc:"Export saved accounts metadata to JSON or restore them on another machine.",exportAccounts:"Export Accounts",importAccounts:"Import Accounts",reconnectHub:"Reconnect Hub",restartBackend:"Restart Backend",processRecovery:"Process Recovery",settingsHint:"Changes apply only after Save.",googleExtension:"Google Extension",officialExtension:"Official Antigravity extension",agyBackend:"AGY Backend",localBackend:"Local Antigravity backend",hub:"Hub",localHub:"Local Hub",hubConnection:"Antigravity hub connection",running:"Running",stopped:"Stopped",ready:"Ready",disconnected:"Unavailable",version:"Version",refreshing:"Refreshing account state...",adding:"Opening Google account flow...",saving:"Saving current account...",reauthenticating:"Re-authenticating...",signingOut:"Signing out...",switching:"Switching account...",updatingLabel:"Updating account label...",savingSettings:"Saving settings...",stateUpdated:"Account state updated.",labelUpdated:"Account label updated.",settingsSaved:"Settings saved.",collapse:"Collapse section",expand:"Expand section",currentAccountLabel:"Current account",developedBy:"Developed by",about:"About",developer:"Developer",website:"Website",removeSavedAccount:"Remove saved account",removeSavedQuestion:"Remove saved account?",removeSavedExplanation:"This only removes local Account Switcher metadata. It does not sign you out, delete your Google account, or remove Google credentials.",remove:"Remove",accountRemoved:"Saved account removed.",usage:"Usage",weeklyLimit:"Weekly limit",fiveHourLimit:"5-hour limit",weeklyShort:"Weekly",fiveHourShort:"5h",updated:"Updated",models:"models",remaining:"remaining",resetsIn:"Resets in",resetDue:"Reset due",lastUpdated:"Last updated",quotaSnapshot:"Quota snapshot",showAllModels:"Show all models",showLess:"Show less",justNow:"just now",ago:"ago",quotaUnavailable:"Usage unavailable",quotaUnavailableHint:"Antigravity did not return current quota information.",quotaHistory:"7-Day Quota Analytics",quotaHistorySub:"Daily lowest remaining",exportAnalytics:"Export Analytics",autoRoundRobin:"Auto-Round-Robin (Switch on rate limit)",enableQuotaAudio:"Subtle Audio Alerts (Web Audio)",quotaMatrix:"Quota Matrix",quotaMatrixTitle:"Multi-Account Quota Matrix",quotaMatrixSub:"Real-time quota comparison across all accounts",switchNow:"Switch",noSnapshotYet:"No quota data yet",workspace:"Workspace",workspaceLinked:"Workspace linked",linkWorkspace:"Link Workspace",unlinkWorkspace:"Unlink",instantSwitch:"Instant Switch (No Browser)",instantBadge:"Instant",vaultTitle:"Token Vault",purgeVault:"Clear Token Vault...",vaultInfo:"Saved in encrypted Token Vault for 1-click seamless switching",plan:"Plan",accountPlan:"Account Plan",selectPlan:"Select Plan"},id:{appName:"Antigravity Account Switcher",accountManager:"Pengelola akun Google",settings:"Pengaturan",currentAccount:"Akun saat ini",savedAccounts:"Akun tersimpan",antigravityStatus:"Status Antigravity",refresh:"Segarkan",connected:"Terhubung",active:"Aktif",switch:"Ganti",reauth:"Autentikasi ulang",signout:"Keluar",addGoogleAccount:"Tambah Akun Google",addGoogleAccountHint:"Masuk atau ganti akun",saveCurrentAccount:"Simpan Akun Saat Ini",unavailable:"Akun Antigravity tidak tersedia",waiting:"Menunggu Antigravity...",checking:"Memeriksa\u2026",loadingAccount:"Memuat akun\u2026",loadingSavedAccounts:"Memuat akun tersimpan\u2026",updatingQuota:"Memperbarui kuota\u2026",checkingAccount:"Memeriksa status akun Antigravity\u2026",checkingExtension:"Memeriksa status ekstensi\u2026",checkingBackend:"Memeriksa status backend\u2026",checkingHub:"Memeriksa koneksi hub\u2026",noSaved:"Belum ada akun tersimpan",noSavedHint:"Simpan akun Antigravity saat ini atau tambahkan akun Google lain.",noMatches:"Tidak ada akun yang cocok",noMatchesHint:"Coba label, nama, atau email lainnya.",searchPlaceholder:"Cari akun",sortBy:"Urutkan",sortQuota:"Sisa kuota",sortName:"Nama (A-Z)",sortRecent:"Terakhir dipakai",editLabel:"Edit label",save:"Simpan",cancel:"Batal",removeLabel:"Hapus label",accountActions:"Tindakan akun",appearance:"Tampilan",theme:"Tema",language:"Bahasa",layout:"Tata letak",followVsCode:"Ikuti Tema Editor / IDE",light:"Terang",dark:"Gelap",system:"Sistem",automatic:"Otomatis",english:"English",indonesian:"Bahasa Indonesia",hideCurrent:"Sembunyikan akun saat ini",hideSaved:"Sembunyikan akun tersimpan",hideRuntime:"Sembunyikan status Antigravity",showQuotaAnalytics:"Tampilkan analisis kuota 7 hari",switchingAndAutomation:"Peralihan & Otomatisasi",quotaAndReminders:"Kuota & Pengingat",autoRefreshQuota:"Auto-refresh kuota",autoRefreshOff:"Nonaktif (Hanya manual)",every1Minute:"Setiap 1 menit",every5Minutes:"Setiap 5 menit (Disarankan)",every15Minutes:"Setiap 15 menit",every30Minutes:"Setiap 30 menit",every1Hour:"Setiap 1 jam",lowQuotaReminder:"Pemberitahuan kuota menipis",reminderThreshold:"Batas peringatan",percentRemaining:"% tersisa",smartQuotaFallback:"Peralihan Cepat saat Kuota Menipis",backupAndRestore:"Cadangan & Pemulihan",backupDesc:"Ekspor metadata akun tersimpan ke JSON atau pulihkan di perangkat lain.",exportAccounts:"Ekspor Akun",importAccounts:"Impor Akun",reconnectHub:"Sambungkan Ulang Hub",restartBackend:"Mulai Ulang Backend",processRecovery:"Pemulihan Proses",settingsHint:"Perubahan baru diterapkan setelah Simpan.",googleExtension:"Ekstensi Google",officialExtension:"Ekstensi resmi Antigravity",agyBackend:"Backend AGY",localBackend:"Backend lokal Antigravity",hub:"Hub",localHub:"Hub Lokal",hubConnection:"Koneksi hub Antigravity",running:"Berjalan",stopped:"Berhenti",ready:"Siap",disconnected:"Tidak tersedia",version:"Versi",refreshing:"Menyegarkan status akun...",adding:"Membuka alur akun Google...",saving:"Menyimpan akun saat ini...",reauthenticating:"Melakukan autentikasi ulang...",signingOut:"Keluar dari akun...",switching:"Mengganti akun...",updatingLabel:"Memperbarui label akun...",savingSettings:"Menyimpan pengaturan...",stateUpdated:"Status akun diperbarui.",labelUpdated:"Label akun diperbarui.",settingsSaved:"Pengaturan disimpan.",collapse:"Ciutkan bagian",expand:"Buka bagian",currentAccountLabel:"Akun saat ini",developedBy:"Dikembangkan oleh",about:"Tentang",developer:"Developer",website:"Situs",removeSavedAccount:"Hapus akun tersimpan",removeSavedQuestion:"Hapus akun tersimpan?",removeSavedExplanation:"Ini hanya menghapus metadata lokal Account Switcher. Tindakan ini tidak mengeluarkan akun, menghapus akun Google, atau menghapus kredensial Google.",remove:"Hapus",accountRemoved:"Akun tersimpan dihapus.",usage:"Penggunaan",weeklyLimit:"Batas mingguan",fiveHourLimit:"Batas 5 jam",weeklyShort:"Mingguan",fiveHourShort:"5j",updated:"Diperbarui",models:"model",remaining:"tersisa",resetsIn:"Reset dalam",resetDue:"Waktunya reset",lastUpdated:"Terakhir diperbarui",quotaSnapshot:"Snapshot kuota",showAllModels:"Tampilkan semua model",showLess:"Tampilkan lebih sedikit",justNow:"baru saja",ago:"yang lalu",quotaUnavailable:"Penggunaan tidak tersedia",quotaUnavailableHint:"Antigravity tidak mengembalikan informasi kuota saat ini.",quotaHistory:"Analitik Kuota 7 Hari",quotaHistorySub:"Sisa terendah harian",exportAnalytics:"Ekspor Analitik",autoRoundRobin:"Auto-Round-Robin (Ganti saat kuota habis)",enableQuotaAudio:"Notifikasi Suara Lembut (Web Audio)",quotaMatrix:"Matriks Kuota",quotaMatrixTitle:"Matriks Kuota Multi-Akun",quotaMatrixSub:"Perbandingan sisa kuota semua akun secara real-time",switchNow:"Ganti",noSnapshotYet:"Belum ada data kuota",workspace:"Workspace",workspaceLinked:"Tertaut ke workspace",linkWorkspace:"Tautkan Workspace",unlinkWorkspace:"Lepas",instantSwitch:"Switch Instan (Tanpa Browser)",instantBadge:"Instan",vaultTitle:"Brankas Token",purgeVault:"Bersihkan Brankas Token...",vaultInfo:"Tersimpan di Brankas Token terenkripsi untuk pergantian 1-klik tanpa login browser",plan:"Paket",accountPlan:"Paket Akun",selectPlan:"Pilih Paket"}};function E(){return r.preferences?.effectiveLanguage==="id"?"id":"en"}function n(e){return B[E()]?.[e]??B.en[e]??e}function t(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function h(e,s="ui-icon"){const a=`class="${t(s)}" viewBox="0 0 16 16" fill="none" aria-hidden="true"`;return{refresh:`
                <svg ${a}>
                    <path
                        d="M13 4.5V1.8M13 1.8h-2.7M13 1.8A6 6 0 1 0 13.65 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,settings:`
                <svg ${a}>
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
                <svg ${a}>
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
                <svg ${a}>
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
                <svg ${a}>
                    <path
                        d="M4.2 5.2h7.6M6 5.2V3.7h4v1.5M5.1 5.2l.55 7.1h4.7l.55-7.1M6.9 7.1v3.3M9.1 7.1v3.3"
                        stroke="currentColor"
                        stroke-width="1.15"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,plus:`
                <svg ${a}>
                    <path
                        d="M8 3.2v9.6M3.2 8h9.6"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,check:`
                <svg ${a}>
                    <path
                        d="m3.2 8.2 3 3 6.6-6.6"
                        stroke="currentColor"
                        stroke-width="1.45"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,close:`
                <svg ${a}>
                    <path
                        d="m4 4 8 8M12 4l-8 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,chevronDown:`
                <svg ${a}>
                    <path
                        d="m4.2 6.2 3.8 3.6 3.8-3.6"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,chevronRight:`
                <svg ${a}>
                    <path
                        d="m6.2 4.2 3.6 3.8-3.6 3.8"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,export:`
                <svg ${a}>
                    <path
                        d="M2.5 10v2.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V10M8 2.5v7.5M5 5.5l3-3 3 3"
                        stroke="currentColor"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,matrix:`
                <svg ${a}>
                    <rect x="2.2" y="2.2" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="9" y="2.2" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="2.2" y="9" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                    <rect x="9" y="9" width="4.8" height="4.8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                </svg>
            `,key:`
                <svg ${a}>
                    <circle cx="5" cy="8" r="3" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M7.8 8H14M11.5 8v2M13.5 8v1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
            `}[e]||""}function m(e){return String(e??"").trim().toLowerCase()}function L(e){if(r.preferences?.enableQuotaAudio!==!1)try{const s=window.AudioContext||window.webkitAudioContext;if(!s)return;const a=new s;e==="restored"?[523.25,659.25,783.99,1046.5].forEach((u,l)=>{const c=a.createOscillator(),d=a.createGain();c.type="sine",c.frequency.setValueAtTime(u,a.currentTime+l*.07),d.gain.setValueAtTime(.06,a.currentTime+l*.07),d.gain.exponentialRampToValueAtTime(1e-4,a.currentTime+l*.07+.55),c.connect(d),d.connect(a.destination),c.start(a.currentTime+l*.07),c.stop(a.currentTime+l*.07+.55)}):e==="warning"&&[440,369.99].forEach((u,l)=>{const c=a.createOscillator(),d=a.createGain();c.type="sine",c.frequency.setValueAtTime(u,a.currentTime+l*.12),d.gain.setValueAtTime(.05,a.currentTime+l*.12),d.gain.exponentialRampToValueAtTime(1e-4,a.currentTime+l*.12+.4),c.connect(d),d.connect(a.destination),c.start(a.currentTime+l*.12),c.stop(a.currentTime+l*.12+.4)})}catch{}}function G(){b.setState({search:o.search,sortBy:o.sortBy,currentCollapsed:o.currentCollapsed,savedCollapsed:o.savedCollapsed,runtimeCollapsed:o.runtimeCollapsed,usageCollapsed:o.usageCollapsed,accounts:r.accounts,current:r.current,runtime:r.runtime,usage:r.usage,usageSnapshots:r.usageSnapshots})}function q(e){A=e,g()}function ve(){A=null}function Q(e,s="info"){S={message:e,kind:s},x&&clearTimeout(x),x=setTimeout(()=>{S=null,x=null,g()},2600),g()}function he(){return A?{refresh:n("refreshing"),add:n("adding"),save:n("saving"),reauth:n("reauthenticating"),signout:n("signingOut"),switch:n("switching"),label:n("updatingLabel"),settings:n("savingSettings"),remove:n("removeSavedAccount")}[A.type]||"Working...":""}function f(){return!!A}function fe(e,s){const a=String(e||"").trim()||String(s||"").split("@")[0],i=a.split(/\s+/).filter(Boolean);return i.length>=2?(i[0][0]+i[i.length-1][0]).toUpperCase():a.slice(0,2).toUpperCase()||"A"}function Y(){if(!r.current)return null;const e=m(r.current.email);return r.accounts.find(s=>m(s.email)===e)||null}function P(e){const s=m(e);return r.accounts.find(a=>m(a.email)===s)}function O(e){return e.label||e.displayName||e.email}function I(e){const s=m(e.email),a=r.usageSnapshots?.[s];if(!a||!Array.isArray(a.buckets)||a.buckets.length===0)return;let i;for(const u of a.buckets)typeof u.remainingFraction=="number"&&!u.disabled&&(i===void 0||u.remainingFraction<i)&&(i=u.remainingFraction);return i!==void 0?Math.round(i*100):void 0}function U(){const e=o.search.trim().toLowerCase();let s=e?r.accounts.filter(i=>[i.label,i.displayName,i.email,i.group].filter(Boolean).join(" ").toLowerCase().includes(e)):r.accounts.slice();o.groupFilter&&o.groupFilter!=="all"&&(s=s.filter(i=>i.group===o.groupFilter));const a=m(r.current?.email);return s.sort((i,u)=>{const l=m(i.email)===a,c=m(u.email)===a;if(l!==c)return l?-1:1;const d=o.sortBy||"quota";if(d==="quota"){const p=I(i),v=I(u);if(p!==void 0&&v!==void 0){if(v!==p)return v-p}else{if(p!==void 0)return-1;if(v!==void 0)return 1}}else if(d==="recent"){const p=i.lastSeenAt?new Date(i.lastSeenAt).getTime():0,v=u.lastSeenAt?new Date(u.lastSeenAt).getTime():0;if(v!==p)return v-p}return(i.label||i.displayName||i.email).localeCompare(u.label||u.displayName||u.email)}),s}function Z(){const e=document.documentElement,s=r.preferences?.theme||"vscode";if(e.removeAttribute("data-ag-theme"),s==="light"||s==="dark"){e.setAttribute("data-ag-theme",s);return}if(s==="system"){const a=window.matchMedia("(prefers-color-scheme: dark)").matches;e.setAttribute("data-ag-theme",a?"dark":"light")}}function be(){return A?`
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
                            ${t(he())}
                        </span>
                    </div>
                </div>
            `:S?`
            <div
                class="toast-host"
                aria-live="polite"
                aria-atomic="true"
            >
                <div
                    class="toast ${t(S.kind)}"
                    role="status"
                >
                    <span
                        class="toast-symbol"
                        aria-hidden="true"
                    >
                        ${S.kind==="error"?"!":"\u2713"}
                    </span>

                    <span class="toast-message">
                        ${t(S.message)}
                    </span>
                </div>
            </div>
        `:""}function $e(e,s,a,i=""){return`
            <div class="section-header">
                <button
                    type="button"
                    class="section-toggle"
                    data-action="${t(s)}"
                    aria-expanded="${a?"false":"true"}"
                    title="${t(n(a?"expand":"collapse"))}"
                >
                    <span
                        class="chevron"
                        aria-hidden="true"
                    >
                        ${h(a?"chevronRight":"chevronDown")}
                    </span>

                    <span class="section-title">
                        ${t(e)}
                    </span>
                </button>

                <div class="section-tools">
                    ${i}
                </div>
            </div>
        `}function We(){return`
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
        `}function _(e){const s=["blue","green","purple","amber","rose","teal"];return`
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
                        aria-label="${t(n("editLabel"))}"
                    >

                    <button
                        type="button"
                        class="icon-btn compact confirm"
                        data-action="save-label"
                        data-email="${t(e.email)}"
                        title="${t(n("save"))}"
                        aria-label="${t(n("save"))}"
                    >
                        ${h("check")}
                    </button>

                    <button
                        type="button"
                        class="icon-btn compact"
                        data-action="cancel-label"
                        data-email="${t(e.email)}"
                        title="${t(n("cancel"))}"
                        aria-label="${t(n("cancel"))}"
                    >
                        ${h("close")}
                    </button>
                </div>

                <div class="label-editor-colors">
                    ${s.map(a=>`
                        <button
                            type="button"
                            class="color-picker-dot color-${a} ${o.editColorTag===a?"selected":""}"
                            data-action="select-color-tag"
                            data-color="${a}"
                            title="${a}"
                            aria-label="${a}"
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
                        ${(()=>{const a=["Personal","Work"],i=(r.accounts||[]).map(l=>(l.group||"").trim()).filter(Boolean),u=Array.from(new Set([...a,...i]));return o.editGroup&&!u.includes(o.editGroup)&&u.push(o.editGroup),u.map(l=>`
                                <button
                                    type="button"
                                    class="group-tag-btn ${o.editGroup===l?"selected":""}"
                                    data-action="select-edit-group"
                                    data-group="${t(l)}"
                                >${t(l)}</button>
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
        `}function ye(e){if(typeof e!="string")return"";try{const s=new URL(e),a=s.hostname.toLowerCase(),i=a==="googleusercontent.com"||a.endsWith(".googleusercontent.com")||a==="ggpht.com"||a.endsWith(".ggpht.com")||a==="gstatic.com"||a.endsWith(".gstatic.com")||a==="google.com"||a.endsWith(".google.com");return s.protocol!=="https:"||!i?"":s.toString()}catch{return""}}function V(e,s,a,i="",u=""){const l=ye(a),c=`
            <span class="avatar-fallback">
                ${t(fe(e,s))}
            </span>
        `;return`
            <div
                class="avatar ${t(i)} ${l?"has-image":""}"
                aria-hidden="true"
            >
                ${c}

                ${l?`
                            <img
                                class="avatar-image"
                                src="${t(l)}"
                                alt=""
                                referrerpolicy="no-referrer"
                                draggable="false"
                                onerror="this.style.display='none'"
                            >
                        `:""}

                ${u}
            </div>
        `}function ke(e){if(!e)return null;const s=typeof e.plan=="string"?e.plan.trim():"",a=typeof e.g1Tier=="string"?e.g1Tier.trim():"",i=s||a,u=e.isPro===!0;if(!i&&!u)return null;let l="",c="plan-free",d="";const p=i.toUpperCase();if(p.includes("ULTRA"))l="Google AI Ultra",c="plan-ultra",d="\u{1F31F}";else if(p.includes("PLUS"))l="Google AI Plus",c="plan-plus",d="\u2728";else if(p.includes("AI_PREMIUM")||p.includes("PREMIUM"))l="Google AI Plus",c="plan-plus",d="\u2728";else if(p.includes("PRO")||u)l="Google AI Pro",c="plan-pro",d="\u26A1";else if(p.includes("ENTERPRISE"))l="Google AI Enterprise",c="plan-pro",d="\u{1F3E2}";else if(p.includes("FREE")||p.includes("STANDARD"))l="Google AI Free",c="plan-free",d="\u2726";else if(i)l=i.replace(/^G1_TIER_/,"").replace(/_/g," "),c="plan-custom",d="\u2728";else return null;return{name:l,className:c,icon:d}}function F(e){try{const s=ke(e);return!s||!s.name?"":`
                <span class="plan-pill ${t(s.className)}" title="${t(`Plan: ${s.name}`)}">
                    <span class="plan-icon" aria-hidden="true">${s.icon}</span>
                    <span class="plan-text">${t(s.name)}</span>
                </span>
            `}catch{return""}}function J(e){return typeof e!="number"||!Number.isFinite(e)?null:Math.max(0,Math.min(100,e*100))}function X(e){const s=J(e);if(s===null)return"\u2014";const a=Math.round(s*100)/100;return(Number.isInteger(a)?String(a):a.toFixed(2))+"%"}function ee(e){const s=Math.max(0,Math.floor(e/6e4));if(s<1)return"<1m";const a=Math.floor(s/1440),i=Math.floor(s%1440/60),u=s%60,l=[];return a>0&&l.push(`${a}d`),i>0&&l.push(`${i}h`),a===0&&u>0&&l.push(`${u}m`),l.slice(0,2).join(" ")||"<1m"}function H(e){if(!e)return"";const s=new Date(e).getTime();if(!Number.isFinite(s))return"";const a=s-Date.now();if(a<=0){const i=new Date(e),u=String(i.getHours()).padStart(2,"0"),l=String(i.getMinutes()).padStart(2,"0"),d=i.toDateString()===new Date().toDateString()?`${u}:${l}`:`${i.getDate()}/${i.getMonth()+1} ${u}:${l}`;return`${n("resetDue")} (${d})`}return`${n("resetsIn")} `+ee(a)}function D(e){if(!e)return"";const s=new Date(e).getTime();if(!Number.isFinite(s))return"";const a=Math.max(0,Date.now()-s);return a<6e4?n("justNow"):`${ee(a)} `+n("ago")}function we(e){const s=String(e?.window||"").trim().toLowerCase();return s==="weekly"?n("weeklyLimit"):s==="5h"?n("fiveHourLimit"):e?.displayName||e?.window||"Quota"}function Ae(e){const s={weekly:0,"5h":1};return[...Array.isArray(e)?e:[]].sort((a,i)=>{const u=String(a?.window||"").toLowerCase(),l=String(i?.window||"").toLowerCase();return(s[u]??99)-(s[l]??99)})}function Se(e){const s=J(e.remainingFraction),a=X(e.remainingFraction),i=H(e.resetTime),u=we(e),l=t(u).replace(/\s+/,"<br>");return`
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
                        ${t(a)}
                    </strong>
                </div>

                <progress
                    class="quota-progress"
                    max="100"
                    value="${s===null?0:s}"
                    aria-label="${t(u)}"
                    aria-valuetext="${t(`${a} ${n("remaining")}`)}"
                ></progress>

                <div class="quota-bucket-meta">
                    ${i?`
                                <span
                                    class="quota-reset"
                                    data-reset-at="${t(e.resetTime||"")}"
                                >
                                    ${t(i)}
                                </span>
                            `:""}
                </div>
            </div>
        `}function te(e){const s=String(e?.displayName||"").trim(),a=s.toLowerCase();return a==="gemini models"||a==="gemini"?"Gemini":a==="claude and gpt models"||a==="claude and gpt"?"Claude and GPT":s||"Quota"}function xe(e){const s=Ae(e.buckets),a=te(e),i=String(e?.description||"").trim();return`
            <div class="quota-group">
                <div class="quota-group-heading">
                    <span
                        class="quota-group-title"
                        title="${t(a)}"
                    >
                        ${t(a)}
                    </span>

                    ${i?`
                                <button
                                    type="button"
                                    class="quota-info-button"
                                    title="${t(i)}"
                                    aria-label="${t(`${a}: ${i}`)}"
                                >
                                    i
                                </button>
                            `:""}
                </div>

                <div class="quota-buckets">
                    ${s.map(Se).join("")}
                </div>
            </div>
        `}function Me(){const e=r.usage,s=Array.isArray(e?.groups)?e.groups:[],a=e?.fetchedAt?D(e.fetchedAt):"";return`
            <div class="usage-section">
                <div class="usage-heading">
                    <span class="usage-title">
                        ${t(n("usage"))}
                    </span>

                    ${a?`
                                <span
                                    class="usage-updated"
                                    data-usage-fetched-at="${t(e.fetchedAt)}"
                                    title="${t(`${n("updated")} ${a}`)}"
                                >
                                    ${t(a)}
                                </span>
                            `:""}
                </div>

                ${s.length>0?`
                            <div class="usage-body">
                                ${s.map(xe).join("")}
                            </div>
                        `:`
                            <div class="usage-empty secondary-text">
                                ${t(r.usageError||n("quotaUnavailable"))}
                            </div>
                        `}
            </div>
        `}function Ce(){const e=[],s=new Date;for(let a=6;a>=0;a--){const i=new Date(s);i.setDate(i.getDate()-a);const u=i.toISOString().split("T")[0],l=i.toLocaleDateString(E()==="id"?"id-ID":"en-US",{weekday:"short"});e.push({date:u,label:l})}return e}function Te(e){if(!e)return"";const s=r.quotaHistory||{},a=m(e),i=s[a]||[],l=Ce().map(c=>{const d=i.find(R=>R.date===c.date),p=d&&typeof d.lowestRemainingPercent=="number",v=p?d.lowestRemainingPercent:null;let k="history-empty";p&&(k=v<=15?"history-critical":v<=35?"history-warn":"history-healthy");const w=p?`${Math.max(12,v)}%`:"4px",T=p?`${c.label} (${c.date}): ${v}% ${n("remaining")}`:`${c.label} (${c.date}): -`;return`
                <div class="history-bar-col" title="${t(T)}">
                    <div class="history-bar-track">
                        <div class="history-bar-fill ${k}" style="height: ${w};"></div>
                    </div>
                    <span class="history-bar-label">${t(c.label)}</span>
                    <span class="history-bar-pct">${p?`${v}%`:"-"}</span>
                </div>
            `}).join("");return`
            <div class="quota-history-panel">
                <div class="quota-history-header">
                    <div class="quota-history-title-group">
                        <span class="quota-history-title">${t(n("quotaHistory"))}</span>
                        <span class="quota-history-sub secondary-text">${t(n("quotaHistorySub"))}</span>
                    </div>
                    <button type="button" class="export-analytics-btn" data-action="export-quota-analytics" title="${t(n("exportAnalytics"))}">
                        ${h("export","export-btn-icon")}
                        <span>${t(n("exportAnalytics"))}</span>
                    </button>
                </div>
                <div class="history-bars-container">
                    ${l}
                </div>
            </div>
        `}function Re(){if(!r.workspace||!r.workspace.folderPath)return"";const e=m(r.current?.email||""),s=m(r.workspace.linkedEmail||""),a=!!(s&&s===e);return`
            <div class="workspace-link-bar ${a?"linked-active":""}">
                <div class="workspace-link-icon" aria-hidden="true">\u{1F4C1}</div>
                <div class="workspace-link-info">
                    <div class="workspace-link-name" title="${t(r.workspace.folderPath)}">
                        <strong>${t(r.workspace.folderName)}</strong>
                    </div>
                    <div class="workspace-link-detail secondary-text">
                        ${a?`<span class="workspace-linked-tag">\u2713 ${t(n("workspaceLinked"))}</span>`:s?`<span>Linked to ${t(s)}</span>`:"<span>No account linked</span>"}
                    </div>
                </div>
                <div class="workspace-link-actions">
                    ${a?`
                                <button
                                    type="button"
                                    class="btn subtle-btn compact"
                                    data-action="clearWorkspaceAccount"
                                    title="${t(n("unlinkWorkspace"))}"
                                    ${f()?"disabled":""}
                                >
                                    ${t(n("unlinkWorkspace"))}
                                </button>
                            `:`
                                <button
                                    type="button"
                                    class="btn subtle-btn compact"
                                    data-action="setWorkspaceAccount"
                                    title="${t(n("linkWorkspace"))}"
                                    ${f()?"disabled":""}
                                >
                                    ${t(n("linkWorkspace"))}
                                </button>
                            `}
                </div>
            </div>
        `}function qe(){document.querySelectorAll(".avatar-image").forEach(e=>{e.addEventListener("error",()=>{e.hidden=!0,e.closest(".avatar")?.classList.remove("has-image")},{once:!0})})}function ae(){document.querySelectorAll("[data-reset-at]").forEach(e=>{const s=H(e.dataset.resetAt),a=e.dataset.resetPrefix||"";e.textContent=s?a+s:""}),document.querySelectorAll("[data-usage-fetched-at]").forEach(e=>{e.textContent=D(e.dataset.usageFetchedAt)}),document.querySelectorAll("[data-snapshot-fetched-at]").forEach(e=>{e.textContent=D(e.dataset.snapshotFetchedAt)})}function Ee(){if(r.preferences?.hideCurrent===!0||r.preferences?.showCurrent===!1)return"";const e=!!r.loading,s=`
            <div class="section-header current-static-header">
                <div class="section-static-title">
                    <span class="section-title">
                        ${t(n("currentAccount"))}
                    </span>
                </div>
            </div>
        `;if(!r.current)return`
                <section class="section current-section">
                    ${s}

                    <div
                        class="current-state-panel ${e?"checking":"error"}"
                        role="status"
                        aria-live="polite"
                    >
                        <strong>
                            ${t(n(e?"loadingAccount":"unavailable"))}
                        </strong>

                        <div class="secondary-text">
                            ${t(e?n("checkingAccount"):r.error||n("waiting"))}
                        </div>
                    </div>
                </section>
            `;const a=Y(),i=r.current.displayName||a?.displayName||r.current.email,u=a&&m(o.editingEmail)===m(a.email),l=a?.label||n("currentAccountLabel"),c=`
            <span class="connection-state inline ${e?"checking":""}">
                <span class="status-dot"></span>

                ${t(n(e?"checking":"connected"))}
            </span>
        `;return`
            <section class="section current-section">
                ${s}

                <div
                    class="current-panel"
                    aria-label="${t(n("currentAccount"))}"
                >
                    <div class="identity-row current-identity-row">
                        ${V(i,r.current.email,r.current.profilePictureUrl,a?.colorTag?`current-avatar tag-${t(a.colorTag)}`:"current-avatar")}

                        <div class="identity">
                            <div class="identity-heading current-identity-heading">
                                <div
                                    class="identity-name current-name"
                                    title="${t(i)}"
                                >
                                    ${t(i)}
                                </div>

                                ${F(a?.plan?a:r.current)}
                            </div>

                            <div
                                class="identity-email"
                                title="${t(r.current.email)}"
                            >
                                ${t(r.current.email)}
                            </div>

                            ${a&&u?`
                                        <div class="current-label-editor">
                                            ${_(a)}
                                        </div>

                                        <div class="current-status-row">
                                            ${c}
                                        </div>
                                    `:`
                                        <div class="current-label-row">
                                            <div class="current-label-edit">
                                                <span class="account-label">
                                                    ${t(l)}
                                                </span>

                                                ${a?.group?`
                                                            <span class="group-pill" title="Group: ${t(a.group)}">
                                                                \u{1F3F7}\uFE0F ${t(a.group)}
                                                            </span>
                                                        `:""}

                                                ${a?`
                                                            <button
                                                                type="button"
                                                                class="edit-icon"
                                                                data-action="edit-label"
                                                                data-email="${t(a.email)}"
                                                                title="${t(n("editLabel"))}"
                                                                aria-label="${t(n("editLabel"))}"
                                                                ${f()?"disabled":""}
                                                            >
                                                                ${h("edit")}
                                                            </button>
                                                        `:""}
                                            </div>

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
                            ${e||f()?"disabled":""}
                        >
                            ${t(n("reauth"))}
                        </button>

                        <button
                            type="button"
                            class="btn subtle-danger"
                            data-action="signout"
                            ${e||f()?"disabled":""}
                        >
                            ${t(n("signout"))}
                        </button>
                    </div>

                    ${Re()}
                    ${Me()}
                    ${r.preferences?.showQuotaAnalytics?Te(r.current.email):""}
                </div>
            </section>
        `}function ne(e,s){return(Array.isArray(e?.groups)?e.groups:[]).find(i=>s(String(i.displayName||"").toLowerCase()))}function se(e,s){return(Array.isArray(e?.buckets)?e.buckets:[]).find(a=>String(a.window||"").toLowerCase()===s)}function Le(e){return X(e?.remainingFraction)}function ie(e,s){if(!s)return"";const a=se(s,"weekly"),i=se(s,"5h"),u=H(a?.resetTime),l=H(i?.resetTime),c=(d,p,v,k)=>`
                <div class="saved-quota-pair">
                    <div class="saved-usage-metric">
                        <span class="saved-usage-metric-label">
                            ${t(d)}
                        </span>

                        <span class="saved-usage-metric-value">
                            ${t(Le(p))}
                        </span>
                    </div>

                    ${v?`
                                <div
                                    class="saved-quota-reset ${t(k)}"
                                    data-reset-at="${t(p?.resetTime||"")}"
                                    data-reset-prefix=""
                                >
                                    ${t(v)}
                                </div>
                            `:""}
                </div>
            `;return`
            <div class="saved-usage-family-column">
                <div class="saved-usage-family">
                    ${t(e)}
                </div>

                <div class="saved-usage-metrics">
                    ${c(n("weeklyShort"),a,u,"saved-weekly-reset")}

                    ${c(n("fiveHourShort"),i,l,"saved-five-hour-reset")}
                </div>
            </div>
        `}function Be(e){if(!e)return"";const s=ne(e,i=>i.includes("gemini")),a=ne(e,i=>i.includes("claude")||i.includes("gpt"));return!s&&!a?"":`
            <div class="saved-usage-summary">
                ${ie("Gemini",s)}

                ${ie("Claude + GPT",a)}
            </div>
        `}function Ge(e){const s=m(r.current?.email),a=!!s&&m(e.email)===s,i=m(o.editingEmail)===m(e.email),u=!!(r.loading&&(!r.accounts||r.accounts.length===0)),l=r.usageSnapshots?.[m(e.email)],c=l?.fetchedAt?D(l.fetchedAt):"";return`
            <article
                class="account-row saved-account-row ${a?"active":""}"
                data-email="${t(e.email)}"
                ${a?'aria-current="true"':""}
            >
                <div class="saved-account-rail">
                    ${V(e.displayName||e.label,e.email,e.profilePictureUrl||(a?r.current?.profilePictureUrl:void 0),`small ${e.colorTag?`tag-${t(e.colorTag)}`:""}`,a?`
                                    <span
                                        class="saved-avatar-active-badge"
                                        title="${t(n("active"))}"
                                    >
                                        <span aria-hidden="true">\u2713</span>
                                    </span>
                                `:"")}
                    ${a?`
                                <span
                                    class="saved-rail-badge active-badge"
                                    title="${t(n("active"))}"
                                >
                                    ${t(n("active"))}
                                </span>
                            `:`
                                <button
                                    type="button"
                                    class="saved-rail-badge switch-badge-btn"
                                    data-action="switch"
                                    data-email="${t(e.email)}"
                                    title="${t(n("switch"))}"
                                    aria-label="${t(n("switch"))}"
                                    ${u||f()?"disabled":""}
                                >
                                    <span
                                        class="badge-icon"
                                        aria-hidden="true"
                                    >
                                        \u21C4
                                    </span>
                                    <span>${t(n("switch"))}</span>
                                </button>
                            `}
                </div>
                <div class="identity saved-account-identity">
                    ${i?_(e):`
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
                                            title="${t(n("editLabel"))}"
                                            aria-label="${t(n("editLabel"))}"
                                            ${f()?"disabled":""}
                                        >
                                            ${h("edit")}
                                        </button>

                                        <button
                                            type="button"
                                            class="icon-btn compact delete-account-btn"
                                            data-action="remove-account"
                                            data-email="${t(e.email)}"
                                            title="${t(n("removeSavedAccount"))}"
                                            aria-label="${t(n("removeSavedAccount"))}"
                                            ${f()?"disabled":""}
                                        >
                                            ${h("trash")}
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

                                    ${F(e)}

                                    ${r.vaultedEmails?.includes(m(e.email))?`
                                                <span class="vault-pill" title="${t(n("vaultInfo"))}">
                                                    \u26A1 ${t(n("instantBadge"))}
                                                </span>
                                            `:""}

                                    ${e.group?`
                                                <span class="group-pill" title="Group: ${t(e.group)}">
                                                    \u{1F3F7}\uFE0F ${t(e.group)}
                                                </span>
                                            `:""}

                                    ${r.workspace?.linkedEmail&&m(r.workspace.linkedEmail)===m(e.email)?`
                                                <span class="workspace-pill" title="${t(`${n("workspaceLinked")} (${r.workspace.folderName})`)}">
                                                    \u{1F4C1} ${t(r.workspace.folderName)}
                                                </span>
                                            `:""}

                                    ${c?`
                                                <span
                                                    class="saved-updated"
                                                    data-snapshot-fetched-at="${t(l.fetchedAt)}"
                                                    title="${t(`${n("updated")} ${c}`)}"
                                                >
                                                    ${t(`${n("updated")} ${c}`)}
                                                </span>
                                            `:""}
                                </div>


                            `}


                </div>

                <div class="saved-account-quota-area">
                    ${Be(l)}
                </div>
            </article>
        `}function oe(){if(r.loading&&(!r.accounts||r.accounts.length===0))return`
                <div class="saved-loading-panel" role="status" aria-live="polite">
                    <div class="saved-loading-spinner-row">
                        <span class="loading-spin-icon">${h("refresh")}</span>
                        <strong>${t(n("loadingSavedAccounts"))}</strong>
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
            `;const e=U();return r.accounts.length===0?`
                <div class="empty-panel">
                    <strong>
                        ${t(n("noSaved"))}
                    </strong>

                    <div class="secondary-text">
                        ${t(n("noSavedHint"))}
                    </div>
                </div>
            `:e.length===0?`
                <div class="empty-panel">
                    <strong>
                        ${t(n("noMatches"))}
                    </strong>

                    <div class="secondary-text">
                        ${t(n("noMatchesHint"))}
                    </div>
                </div>
            `:e.map(Ge).join("")}function Ie(){if(r.preferences?.hideSaved===!0||r.preferences?.showSaved===!1)return"";const e=U().length,s=(r.accounts?.length||0)>3,a=!!r.loading&&(!r.accounts||r.accounts.length===0),i=!!r.loading&&(r.accounts?.length||0)>0,u=a?"\u2026":o.search.trim()?`${e}/${r.accounts.length}`:String(r.accounts.length),l=`
            <div class="saved-header-actions">
                ${i?`
                            <span
                                class="refreshing-indicator"
                                title="${t(n("updatingQuota"))}"
                                aria-label="${t(n("updatingQuota"))}"
                            >
                                <span class="loading-spin-icon">
                                    ${h("refresh")}
                                </span>
                            </span>
                        `:""}

                <span
                    id="account-count"
                    class="count"
                    title="${t(n("savedAccounts"))}"
                >
                    ${t(u)}
                </span>

                <button
                    type="button"
                    class="icon-btn compact saved-add-btn"
                    data-action="add"
                    title="${t(n("addGoogleAccount"))}"
                    aria-label="${t(n("addGoogleAccount"))}"
                    ${f()?"disabled":""}
                >
                    ${h("plus")}
                </button>
            </div>
        `;return`
            <section class="section saved-section">
                ${$e(n("savedAccounts"),"toggle-saved",o.savedCollapsed,l)}

                ${o.savedCollapsed?"":`
                            <div class="saved-body">
                                <div class="saved-controls">
                                    ${(r.accounts?.length||0)>0?`
                                                <div class="saved-filter-row">
                                                    <div class="search-wrap">
                                                        <span
                                                            class="search-icon"
                                                            aria-hidden="true"
                                                        >
                                                            ${h("search")}
                                                        </span>

                                                        <input
                                                            id="account-search"
                                                            class="search-input"
                                                            type="search"
                                                            value="${t(o.search)}"
                                                            placeholder="${t(n("searchPlaceholder"))}"
                                                            autocomplete="off"
                                                            spellcheck="false"
                                                        >
                                                    </div>

                                                    <div class="sort-wrap">
                                                        <select
                                                            id="account-sort"
                                                            class="sort-select"
                                                            data-action="change-sort"
                                                            aria-label="${t(n("sortBy"))}"
                                                            title="${t(n("sortBy"))}"
                                                        >
                                                            <option value="quota" ${o.sortBy==="quota"?"selected":""}>${t(n("sortQuota"))}</option>
                                                            <option value="name" ${o.sortBy==="name"?"selected":""}>${t(n("sortName"))}</option>
                                                            <option value="recent" ${o.sortBy==="recent"?"selected":""}>${t(n("sortRecent"))}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                ${(()=>{const c=Array.from(new Set((r.accounts||[]).map(d=>d.group).filter(Boolean)));return c.length===0?"":`
                                                        <div class="saved-group-filter-row">
                                                            <button type="button" class="group-filter-chip ${o.groupFilter==="all"?"active":""}" data-action="set-group-filter" data-group="all">All (${r.accounts.length})</button>
                                                            ${c.map(d=>{const p=r.accounts.filter(v=>v.group===d).length;return`<button type="button" class="group-filter-chip ${o.groupFilter===d?"active":""}" data-action="set-group-filter" data-group="${t(d)}">${t(d)} (${p})</button>`}).join("")}
                                                        </div>
                                                    `})()}
                                            `:""}

                                    ${r.current&&!Y()?`
                                                <button
                                                    type="button"
                                                    class="btn block"
                                                    data-action="save"
                                                    ${f()?"disabled":""}
                                                >
                                                    ${t(n("saveCurrentAccount"))}
                                                </button>
                                            `:""}
                                </div>

                                <div
                                    id="saved-account-list"
                                    class="account-list"
                                    tabindex="0"
                                >
                                    ${oe()}
                                </div>
                            </div>
                        `}
            </section>
        `}function W(e,s,a,i,u){return`
            <div class="runtime-row">
                <div
                    class="runtime-symbol"
                    aria-hidden="true"
                >
                    ${t(e)}
                </div>

                <div class="runtime-copy">
                    <div class="runtime-name">
                        ${t(s)}
                    </div>

                    <div class="runtime-detail">
                        ${t(a)}
                    </div>
                </div>

                <div
                    class="runtime-state ${t(i)}"
                >
                    <span class="status-dot"></span>
                    ${t(u)}
                </div>
            </div>
        `}function He(){if(r.preferences?.hideRuntime===!0||r.preferences?.showRuntime===!1)return"";const e=!!r.loading,s=r.runtime||{},a=s.extension||{},i=s.process||null,u=s.health||null,l=!!a.installed,c=!!i,d=!!u?.reachable,p=l&&c&&d,v=e?"checking":p?"healthy":"warning",k=n(e?"checking":p?"ready":"disconnected");return`
            <div class="runtime-status-bar">
                <button
                    type="button"
                    class="runtime-status-pill ${t(v)}"
                    data-action="open-runtime-modal"
                    title="${t(n("antigravityStatus"))} \xB7 ${t(k)}"
                    aria-label="${t(n("antigravityStatus"))}"
                >
                    <span class="status-dot"></span>
                    <span class="runtime-status-pill-label">Antigravity:</span>
                    <span class="runtime-status-pill-value">${t(k)}</span>
                </button>
            </div>
        `}function Qe(){if(!o.runtimeModalOpen)return"";const e=!!r.loading,s=r.runtime||{},a=s.extension||{},i=s.process||null,u=s.health||null,l=!!a.installed,c=!!i,d=!!u?.reachable,p=l&&c&&d,v=e?"checking":p?"healthy":"warning",k=n(e?"checking":p?"ready":"disconnected");return`
            <div
                class="runtime-modal-backdrop"
                data-action="runtime-modal-backdrop"
            >
                <section
                    class="runtime-modal-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${t(n("antigravityStatus"))}"
                >
                    <header class="runtime-modal-header">
                        <div class="runtime-modal-title">
                            <span class="status-dot ${t(v)}"></span>
                            <h2>${t(n("antigravityStatus"))}</h2>
                        </div>

                        <button
                            type="button"
                            class="icon-btn"
                            data-action="close-runtime-modal"
                            aria-label="${t(n("cancel")||"Close")}"
                            title="${t(n("cancel")||"Close")}"
                        >
                            ${h("close")}
                        </button>
                    </header>

                    <div class="runtime-modal-body">
                        <div class="runtime-panel">
                            ${W("G",n("googleExtension"),e?n("checkingExtension"):a.version?`${n("version")} ${a.version}`:n("officialExtension"),e?"checking":l?"healthy":"error",n(e?"checking":l?"connected":"disconnected"))}

                            ${W("A",n("agyBackend"),e?n("checkingBackend"):s.agyVersion?`${n("version")} ${s.agyVersion}`:n("localBackend"),e?"checking":c?"healthy":"error",n(e?"checking":c?"running":"stopped"))}

                            ${W("H",n("hub"),n(e?"checkingHub":d?"localHub":"hubConnection"),e?"checking":d?"healthy":"error",n(e?"checking":d?"connected":"disconnected"))}
                        </div>

                        <div class="runtime-actions-panel">
                            <h3>${t(n("processRecovery"))}</h3>
                            <div class="runtime-actions-row">
                                <button
                                    type="button"
                                    class="btn"
                                    data-action="reconnect-hub"
                                    ${e?"disabled":""}
                                >
                                    ${t(n("reconnectHub"))}
                                </button>
                                <button
                                    type="button"
                                    class="btn danger-btn"
                                    data-action="restart-backend"
                                    ${e?"disabled":""}
                                >
                                    ${t(n("restartBackend"))}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `}function Pe(){if(!o.quotaMatrixOpen)return"";const e=r.accounts||[],s=r.usageSnapshots||{},a=m(r.current?.email||""),i=[...e].sort((l,c)=>{const d=m(l.email),p=m(c.email);if(d===a)return-1;if(p===a)return 1;const v=I(l),k=I(c),w=typeof v=="number"?v:-1,T=typeof k=="number"?k:-1;return w!==T?T-w:(l.label||l.displayName||l.email).localeCompare(c.label||c.displayName||c.email)}),u=i.length===0?`
                <div class="matrix-empty secondary-text">
                    ${t(n("noSaved"))}
                </div>
            `:i.map(l=>{const c=m(l.email),d=!!(a&&c===a),p=d&&r.usage||s[c],v=l.displayName||l.label||l.email,k=l.label||(d?n("currentAccountLabel"):"");let w=null,T="",R=null,K="";if(p?.buckets&&Array.isArray(p.buckets))for(const y of p.buckets){const z=(y.displayName||y.bucketId||"").toLowerCase(),N=(y.window||y.description||"").toLowerCase(),Fe=z.includes("5-hour")||z.includes("5h")||N.includes("5 hour")||N.includes("5h"),pe=z.includes("week")||N.includes("week")||N.includes("7 day");if(typeof y.remainingFraction=="number"&&!y.disabled){const me=Math.max(0,Math.min(100,Math.round(y.remainingFraction*100))),ge=y.resetTime?H(y.resetTime):"";Fe||w===null&&!pe?(w=me,T=ge):pe&&(R=me,K=ge)}}if(w===null){const y=I(l);typeof y=="number"&&(w=y)}const de=y=>typeof y!="number"?"tone-empty":y<=15?"tone-critical":y<=35?"tone-warn":"tone-healthy";return`
                    <div class="matrix-card ${d?"active-matrix-card":""}">
                        <div class="matrix-identity-col">
                            ${V(v,l.email,l.profilePictureUrl||(d?r.current?.profilePictureUrl:void 0),l.colorTag?`matrix-avatar tag-${t(l.colorTag)}`:"matrix-avatar")}
                            <div class="matrix-identity-info">
                                <div class="matrix-name-row">
                                    <span class="matrix-account-name" title="${t(v)}">${t(v)}</span>
                                    ${l.colorTag?`<span class="color-tag-dot dot-${t(l.colorTag)}"></span>`:""}
                                    ${d?`<span class="badge active-badge">${t(n("active"))}</span>`:""}
                                </div>
                                <div class="matrix-email-row" title="${t(l.email)}">${t(l.email)}</div>
                                <div class="matrix-tags-row">
                                    ${r.vaultedEmails?.includes(m(l.email))?`<span class="vault-pill" title="${t(n("vaultInfo"))}">\u26A1 ${t(n("instantBadge"))}</span>`:""}
                                    ${F(d&&r.current||l)}
                                    ${k?`<span class="account-label">${t(k)}</span>`:""}
                                    ${l.group?`<span class="group-pill" title="Group: ${t(l.group)}">\u{1F3F7}\uFE0F ${t(l.group)}</span>`:""}
                                </div>
                            </div>
                        </div>

                        <div class="matrix-quota-col">
                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${t(n("fiveHourShort")||"5h")}:</span>
                                    <strong>${typeof w=="number"?`${w}%`:"-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${de(w)}" style="width: ${typeof w=="number"?w:0}%;"></div>
                                </div>
                                ${T?`<span class="matrix-reset-sub">${t(T)}</span>`:""}
                            </div>

                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${t(n("weeklyShort")||"Weekly")}:</span>
                                    <strong>${typeof R=="number"?`${R}%`:"-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${de(R)}" style="width: ${typeof R=="number"?R:0}%;"></div>
                                </div>
                                ${K?`<span class="matrix-reset-sub">${t(K)}</span>`:""}
                            </div>
                        </div>

                        <div class="matrix-action-col">
                            ${d?`<span class="matrix-connected-pill">\u2713 ${t(n("connected"))}</span>`:`
                                    <button
                                        type="button"
                                        class="btn btn-primary compact matrix-switch-btn"
                                        data-action="switch"
                                        data-email="${t(l.email)}"
                                        title="${t(n("switch"))}"
                                    >
                                        ${t(n("switchNow"))}
                                    </button>
                                `}
                        </div>
                    </div>
                `}).join("");return`
            <div class="matrix-modal-backdrop" data-action="close-quota-matrix">
                <section
                    class="matrix-modal-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${t(n("quotaMatrixTitle"))}"
                >
                    <header class="matrix-modal-header">
                        <div class="matrix-modal-title-group">
                            <h2>${h("matrix","modal-header-icon")} ${t(n("quotaMatrixTitle"))}</h2>
                            <span class="secondary-text">${t(n("quotaMatrixSub"))}</span>
                        </div>
                        <button
                            type="button"
                            class="icon-btn"
                            data-action="close-quota-matrix"
                            aria-label="${t(n("cancel")||"Close")}"
                            title="${t(n("cancel")||"Close")}"
                        >
                            ${h("close")}
                        </button>
                    </header>

                    <div class="matrix-modal-body">
                        <div class="matrix-list">
                            ${u}
                        </div>
                    </div>

                    <footer class="matrix-modal-footer">
                        <span class="secondary-text">${i.length} ${t(n("savedAccounts"))}</span>
                        <button
                            type="button"
                            class="btn"
                            data-action="close-quota-matrix"
                        >
                            ${t(n("cancel")||"Close")}
                        </button>
                    </footer>
                </section>
            </div>
        `}function De(){if(!o.settingsOpen||!o.settingsDraft)return"";const e=o.settingsDraft;return`
            <div
                class="settings-backdrop"
                data-action="settings-backdrop"
            >
                <section
                    class="settings-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="${t(n("settings"))}"
                >
                    <header class="settings-header">
                        <h2>
                            ${t(n("settings"))}
                        </h2>

                        <button
                            type="button"
                            class="icon-btn"
                            data-action="cancel-settings"
                            aria-label="${t(n("cancel"))}"
                            title="${t(n("cancel"))}"
                        >
                            \xD7
                        </button>
                    </header>

                    <div class="settings-body">
                        <div class="settings-group">
                            <h3>
                                ${t(n("appearance"))}
                            </h3>

                            <label class="field">
                                <span>
                                    ${t(n("theme"))}
                                </span>

                                <select
                                    data-setting="theme"
                                >
                                    <option
                                        value="vscode"
                                        ${e.theme==="vscode"||e.theme==="editor"?"selected":""}
                                    >
                                        ${t(n("followVsCode"))}
                                    </option>

                                    <option
                                        value="dark"
                                        ${e.theme==="dark"?"selected":""}
                                    >
                                        ${t(n("dark"))}
                                    </option>

                                    <option
                                        value="light"
                                        ${e.theme==="light"?"selected":""}
                                    >
                                        ${t(n("light"))}
                                    </option>

                                    <option
                                        value="system"
                                        ${e.theme==="system"?"selected":""}
                                    >
                                        ${t(n("system"))}
                                    </option>
                                </select>
                            </label>

                            <label class="field">
                                <span>
                                    ${t(n("language"))}
                                </span>

                                <select
                                    data-setting="language"
                                >
                                    <option
                                        value="auto"
                                        ${e.language==="auto"?"selected":""}
                                    >
                                        ${t(n("automatic"))}
                                    </option>

                                    <option
                                        value="en"
                                        ${e.language==="en"?"selected":""}
                                    >
                                        ${t(n("english"))}
                                    </option>

                                    <option
                                        value="id"
                                        ${e.language==="id"?"selected":""}
                                    >
                                        ${t(n("indonesian"))}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(n("layout"))}
                            </h3>

                            ${C("hideRuntime",n("hideRuntime"),e.hideRuntime===!0||e.showRuntime===!1)}

                            ${C("hideCurrent",n("hideCurrent"),e.hideCurrent===!0||e.showCurrent===!1)}

                            ${C("hideSaved",n("hideSaved"),e.hideSaved===!0||e.showSaved===!1)}

                            ${C("showQuotaAnalytics",n("showQuotaAnalytics"),e.showQuotaAnalytics===!0)}
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(n("quotaAndReminders"))}
                            </h3>

                            <label class="field">
                                <span>
                                    ${t(n("autoRefreshQuota"))}
                                </span>

                                <select
                                    data-setting="autoRefreshIntervalMinutes"
                                >
                                    <option
                                        value="0"
                                        ${e.autoRefreshIntervalMinutes===0?"selected":""}
                                    >
                                        ${t(n("autoRefreshOff"))}
                                    </option>
                                    <option
                                        value="1"
                                        ${e.autoRefreshIntervalMinutes===1?"selected":""}
                                    >
                                        ${t(n("every1Minute"))}
                                    </option>
                                    <option
                                        value="5"
                                        ${e.autoRefreshIntervalMinutes===5?"selected":""}
                                    >
                                        ${t(n("every5Minutes"))}
                                    </option>
                                    <option
                                        value="15"
                                        ${e.autoRefreshIntervalMinutes===15?"selected":""}
                                    >
                                        ${t(n("every15Minutes"))}
                                    </option>
                                    <option
                                        value="30"
                                        ${e.autoRefreshIntervalMinutes===30?"selected":""}
                                    >
                                        ${t(n("every30Minutes"))}
                                    </option>
                                    <option
                                        value="60"
                                        ${e.autoRefreshIntervalMinutes===60?"selected":""}
                                    >
                                        ${t(n("every1Hour"))}
                                    </option>
                                </select>
                            </label>

                            ${C("enableLowQuotaReminder",n("lowQuotaReminder"),e.enableLowQuotaReminder)}

                            ${e.enableLowQuotaReminder?`
                                        <label class="field subfield">
                                            <span>
                                                ${t(n("reminderThreshold"))}
                                            </span>

                                            <select
                                                data-setting="lowQuotaThresholdPercent"
                                            >
                                                <option
                                                    value="5"
                                                    ${e.lowQuotaThresholdPercent===5?"selected":""}
                                                >
                                                    5${t(n("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="10"
                                                    ${e.lowQuotaThresholdPercent===10?"selected":""}
                                                >
                                                    10${t(n("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="15"
                                                    ${e.lowQuotaThresholdPercent===15?"selected":""}
                                                >
                                                    15${t(n("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="20"
                                                    ${e.lowQuotaThresholdPercent===20?"selected":""}
                                                >
                                                    20${t(n("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="25"
                                                    ${e.lowQuotaThresholdPercent===25?"selected":""}
                                                >
                                                    25${t(n("percentRemaining"))}
                                                </option>
                                                <option
                                                    value="30"
                                                    ${e.lowQuotaThresholdPercent===30?"selected":""}
                                                >
                                                    30${t(n("percentRemaining"))}
                                                </option>
                                            </select>
                                        </label>
                                    `:""}

                            ${C("enableQuotaAudio",n("enableQuotaAudio"),e.enableQuotaAudio!==!1)}
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(n("switchingAndAutomation"))}
                            </h3>

                            ${C("enableInstantSwitch",n("instantSwitch"),e.enableInstantSwitch!==!1)}

                            ${C("smartQuotaFallback",n("smartQuotaFallback"),e.smartQuotaFallback!==!1)}

                            ${C("autoRoundRobin",n("autoRoundRobin"),e.autoRoundRobin===!0)}
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(n("backupAndRestore"))}
                            </h3>
                            <p class="settings-desc">
                                ${t(n("backupDesc"))}
                            </p>
                            <div class="settings-actions-row">
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="export-accounts"
                                >
                                    ${t(n("exportAccounts"))}
                                </button>
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="import-accounts"
                                >
                                    ${t(n("importAccounts"))}
                                </button>
                            </div>
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(n("vaultTitle"))}
                            </h3>
                            <p class="settings-desc">
                                ${t(n("vaultInfo"))}
                            </p>
                            <div class="settings-actions-row">
                                <button
                                    type="button"
                                    class="btn block"
                                    data-action="clear-token-vault"
                                >
                                    ${h("key")} ${t(n("purgeVault"))}
                                </button>
                            </div>
                        </div>

                        <div class="settings-group about-group">
                            <h3>
                                ${t(n("about"))}
                            </h3>

                            ${r.meta?.iconUri?`
                            <div style="text-align: center; margin: 8px 0 16px 0;">
                                <img src="${t(r.meta.iconUri)}" width="64" height="64" style="border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); vertical-align: middle;" alt="Logo" />
                            </div>`:""}

                            <div class="about-row">
                                <span>
                                    Antigravity Account Switcher
                                </span>

                                <span>
                                    v${t(r.meta?.version||"1.0.1")}
                                </span>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(n("developer"))}
                                </span>

                                <strong>
                                    ${t(r.meta?.developer||"Boy Gilang Ramadhan")}
                                </strong>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(n("website"))}
                                </span>

                                <a
                                    href="${t(r.meta?.website||"https://boygr.com")}"
                                    data-external-url="${t(r.meta?.website||"https://boygr.com")}"
                                >
                                    boygr.com
                                </a>
                            </div>
                        </div>

                        <div class="settings-note">
                            ${t(n("settingsHint"))}
                        </div>
                    </div>

                    <footer class="settings-footer">
                        <button
                            type="button"
                            class="btn"
                            data-action="cancel-settings"
                        >
                            ${t(n("cancel"))}
                        </button>

                        <button
                            type="button"
                            class="btn primary"
                            data-action="save-settings"
                            ${f()?"disabled":""}
                        >
                            ${t(n("save"))}
                        </button>
                    </footer>
                </section>
            </div>
        `}function C(e,s,a){return`
            <label class="check-row">
                <input
                    type="checkbox"
                    data-setting="${t(e)}"
                    ${a?"checked":""}
                >

                <span>
                    ${t(s)}
                </span>
            </label>
        `}function Ne(){const e=r.meta||{},s=e.developer||"Boy Gilang Ramadhan",a=e.website||"https://boygr.com",i=e.version||"0.5.1";return`
            <footer class="developer-footer">
                <div class="developer-footer-copy">
                    <span class="footer-prefix">${t(n("developedBy"))}</span>
                    <a
                        href="${t(a)}"
                        data-external-url="${t(a)}"
                        title="${t(a)}"
                        class="developer-link"
                    >
                        ${t(s)}
                    </a>
                </div>

                <span class="footer-version">
                    v${t(i)}
                </span>
            </footer>
        `}function Oe(){const e=o.removeCandidate;return e?`
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
                                ${t(n("removeSavedQuestion"))}
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
                        ${t(n("removeSavedExplanation"))}
                    </p>

                    <footer class="confirm-dialog-actions">
                        <button
                            type="button"
                            class="btn"
                            data-action="cancel-remove"
                        >
                            ${t(n("cancel"))}
                        </button>

                        <button
                            type="button"
                            class="btn destructive"
                            data-action="confirm-remove"
                        >
                            ${t(n("remove"))}
                        </button>
                    </footer>
                </section>
            </div>
        `:""}function g(){Z(),document.documentElement.lang=E(),M.innerHTML=`
            <div
                class="app"
                aria-busy="${r.loading||f()?"true":"false"}"
            >
                <div class="content-shell">
                    ${be()}
                    ${He()}
                    ${Ee()}
                    ${Ie()}
                </div>

                ${Ne()}
            </div>

            ${De()}
            ${Oe()}
            ${Qe()}
            ${Pe()}
        `,qe(),ae(),o.editingEmail&&window.requestAnimationFrame(()=>{const e=document.querySelector('[data-role="label-input"]');e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))})}function re(){const e=document.getElementById("saved-account-list");e&&(e.innerHTML=oe());const s=document.getElementById("account-count");if(s){const a=U().length;s.textContent=o.search.trim()?`${a}/${r.accounts.length}`:String(r.accounts.length)}}function Ue(e){const s=P(e);s&&(o.editingEmail=s.email,o.editValue=s.label||"",o.editColorTag=s.colorTag||"",o.editGroup=s.group||"",o.customGroupInputOpen=!1,o.customGroupInputValue="",g())}function le(){o.editingEmail=null,o.editValue="",o.editColorTag="",o.editGroup="",o.customGroupInputOpen=!1,o.customGroupInputValue="",g()}function ce(e){const s=P(e);s&&(q({type:"label",email:s.email}),b.postMessage({type:"updateLabel",email:s.email,label:o.editValue,colorTag:o.editColorTag,group:o.editGroup}))}function ue(){const e=r.preferences||{};o.settingsDraft={theme:e.theme||"vscode",language:e.language||"auto",hideCurrent:e.hideCurrent===!0||e.showCurrent===!1,hideSaved:e.hideSaved===!0||e.showSaved===!1,hideRuntime:e.hideRuntime===!0||e.showRuntime===!1,showQuotaAnalytics:e.showQuotaAnalytics===!0,autoRefreshIntervalMinutes:typeof e.autoRefreshIntervalMinutes=="number"?e.autoRefreshIntervalMinutes:5,enableLowQuotaReminder:e.enableLowQuotaReminder!==!1,lowQuotaThresholdPercent:typeof e.lowQuotaThresholdPercent=="number"?e.lowQuotaThresholdPercent:20,smartQuotaFallback:e.smartQuotaFallback!==!1,autoRoundRobin:e.autoRoundRobin===!0,enableQuotaAudio:e.enableQuotaAudio!==!1,enableInstantSwitch:e.enableInstantSwitch!==!1},o.settingsOpen=!0,g()}function j(){o.settingsOpen=!1,o.settingsDraft=null,g()}function Ve(){o.settingsDraft&&(q({type:"settings"}),b.postMessage({type:"saveSettings",preferences:{...o.settingsDraft,showCurrent:!o.settingsDraft.hideCurrent,showSaved:!o.settingsDraft.hideSaved,showRuntime:!o.settingsDraft.hideRuntime}}))}M.addEventListener("input",e=>{const s=e.target;if(s instanceof HTMLInputElement&&s.id==="account-search"){o.search=s.value,G(),re();return}if(s instanceof HTMLInputElement&&s.dataset.role==="label-input"){o.editValue=s.value;return}if(s instanceof HTMLInputElement&&s.id==="custom-group-input"){o.customGroupInputValue=s.value;return}}),M.addEventListener("keydown",e=>{const s=e.target;if(s instanceof HTMLInputElement&&s.id==="custom-group-input")if(e.key==="Enter"){e.preventDefault();const a=s.value.trim();a&&(o.editGroup=a),o.customGroupInputOpen=!1,o.customGroupInputValue="",g()}else e.key==="Escape"&&(e.preventDefault(),o.customGroupInputOpen=!1,o.customGroupInputValue="",g())}),M.addEventListener("change",e=>{const s=e.target;if(s instanceof HTMLSelectElement&&s.dataset.action==="change-sort"){o.sortBy=s.value,G(),re();return}if(!o.settingsDraft||!(s instanceof HTMLInputElement||s instanceof HTMLSelectElement))return;const a=s.dataset.setting;if(a){if(s instanceof HTMLInputElement&&s.type==="checkbox"){o.settingsDraft[a]=s.checked,a==="enableLowQuotaReminder"&&g();return}if(a==="autoRefreshIntervalMinutes"||a==="lowQuotaThresholdPercent"){o.settingsDraft[a]=Number.parseInt(s.value,10);return}o.settingsDraft[a]=s.value}}),M.addEventListener("click",e=>{const s=e.target;if(!(s instanceof Element))return;const a=s.closest("[data-action]");if(!a)return;const i=a.dataset.action,u=a.dataset.email;if(i==="open-settings"){ue();return}if(i==="cancel-settings"){j();return}if(i==="settings-backdrop"&&s===a){j();return}if(i==="save-settings"){f()||Ve();return}if(i==="toggle-current"){o.currentCollapsed=!o.currentCollapsed,G(),g();return}if(i==="toggle-saved"){o.savedCollapsed=!o.savedCollapsed,G(),g();return}if(i==="open-runtime-modal"){o.runtimeModalOpen=!0,g();return}if(i==="close-runtime-modal"||i==="runtime-modal-backdrop"&&s===a){o.runtimeModalOpen=!1,g();return}if(i==="open-quota-matrix"){o.quotaMatrixOpen=!0,g();return}if(i==="close-quota-matrix"){if(a.classList.contains("matrix-modal-backdrop")&&s!==a)return;o.quotaMatrixOpen=!1,g();return}if(i==="export-accounts"){b.postMessage({type:"exportAccounts"});return}if(i==="import-accounts"){b.postMessage({type:"importAccounts"});return}if(i==="clear-token-vault"){b.postMessage({type:"clearTokenVault"});return}if(i==="reconnect-hub"){o.runtimeModalOpen=!1,q({type:"refresh"}),b.postMessage({type:"reconnectHub"});return}if(i==="restart-backend"){o.runtimeModalOpen=!1,q({type:"refresh"}),b.postMessage({type:"restartBackend"});return}if(i==="select-color-tag"){const c=a.dataset.color||"";o.editColorTag=o.editColorTag===c?"":c,g();return}if(i==="select-edit-group"){const c=a.dataset.group||"";o.editGroup=o.editGroup===c?"":c,g();return}if(i==="open-custom-group"){o.customGroupInputOpen=!0,o.customGroupInputValue="",g(),setTimeout(()=>{const c=document.getElementById("custom-group-input");c&&c.focus()},20);return}if(i==="cancel-custom-group"){o.customGroupInputOpen=!1,o.customGroupInputValue="",g();return}if(i==="confirm-custom-group"){const c=document.getElementById("custom-group-input"),d=(c?c.value:o.customGroupInputValue||"").trim();d&&(o.editGroup=d),o.customGroupInputOpen=!1,o.customGroupInputValue="",g();return}if(i==="set-group-filter"){o.groupFilter=a.dataset.group||"all",g();return}if(i==="export-quota-analytics"){b.postMessage({type:"exportQuotaAnalytics"});return}if(i==="edit-label"){f()||Ue(u);return}if(i==="cancel-label"){le();return}if(i==="save-label"){f()||ce(u);return}if(i==="remove-account"){const c=P(u);c&&!f()&&(o.removeCandidate=c,g());return}if(i==="cancel-remove"){o.removeCandidate=null,g();return}if(i==="confirm-remove"){const c=o.removeCandidate;c&&!f()&&(q({type:"remove",email:c.email}),b.postMessage({type:"removeAccount",email:c.email}));return}if(f())return;if(i==="switch"){const c=P(u);c&&(o.quotaMatrixOpen=!1,q({type:"switch",email:c.email}),b.postMessage({type:"switchAccount",account:c}));return}const l={add:"addAccount",save:"saveCurrent",refresh:"refresh",reauth:"reauth",signout:"signout",setWorkspaceAccount:"setWorkspaceAccount",clearWorkspaceAccount:"clearWorkspaceAccount"};l[i]&&(q({type:{add:"add",save:"save",refresh:"refresh",reauth:"reauth",signout:"signout",setWorkspaceAccount:"refresh",clearWorkspaceAccount:"refresh"}[i]}),b.postMessage({type:l[i]}))}),window.addEventListener("keydown",e=>{if(e.key==="Escape"){if(o.quotaMatrixOpen){o.quotaMatrixOpen=!1,g();return}if(o.runtimeModalOpen){o.runtimeModalOpen=!1,g();return}if(o.settingsOpen){j();return}if(o.editingEmail&&!A){le();return}S&&!A&&(S=null,x&&(clearTimeout(x),x=null),g());return}if(e.key==="Enter"&&o.editingEmail&&!A){const s=document.activeElement;s instanceof HTMLInputElement&&s.dataset.role==="label-input"&&(e.preventDefault(),ce(o.editingEmail))}}),M.addEventListener("click",e=>{const s=e.target;if(!(s instanceof Element))return;const a=s.closest("[data-external-url]");if(!a)return;e.preventDefault();const i=a.dataset.externalUrl;i&&b.postMessage({type:"openExternal",url:i})}),window.addEventListener("message",e=>{const s=e.data;if(!s)return;if(s.type==="openSettings"){ue();return}if(s.type==="openQuotaMatrix"){o.quotaMatrixOpen=!0,g();return}if(s.type==="playChime"){L(s.chime);return}if(s.type!=="state")return;const a=A;if(r=s.state,G(),ve(),a?.type==="remove"){o.removeCandidate=null,Q(n("accountRemoved"),"success");return}if(a?.type==="label"){o.editingEmail=null,o.editValue="",Q(n("labelUpdated"),"success");return}if(a?.type==="settings"){o.settingsOpen=!1,o.settingsDraft=null,Q(n("settingsSaved"),"success");return}if(a&&a.type!=="refresh"){Q(n("stateUpdated"),"success");return}g()}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{r.preferences?.theme==="system"&&Z()}),window.setInterval(()=>{ae()},3e4),g(),b.postMessage({type:"ready"})})();function enhanceSavedQuotaMetrics(b=document){const M=b.querySelectorAll(".saved-account-quota-area");for(const $ of M){const r=$.querySelectorAll([".saved-family-metric",".saved-usage-metric",".saved-quota-metric",".saved-metric-row",".saved-usage-row"].join(","));for(const o of r){const A=o.querySelector(".saved-quota-main"),S=o.querySelector(".saved-quota-value");if(!A||!S)continue;const x=S.textContent?.trim()??"",B=x.match(/(-?\d+(?:\.\d+)?)\s*%/);if(!B)continue;const E=Number(B[1]);if(!Number.isFinite(E))continue;const n=Math.max(0,Math.min(100,E));let t=o.querySelector(":scope > .saved-quota-progress");if(!t){t=document.createElement("div"),t.className="saved-quota-progress",t.setAttribute("aria-hidden","true");const L=document.createElement("span");L.className="saved-quota-progress-fill",t.append(L),A.insertAdjacentElement("afterend",t)}t.style.setProperty("--saved-quota-percent",`${n}%`);let h=o.querySelector(":scope > .saved-quota-remaining");h||(h=document.createElement("div"),h.className="saved-quota-remaining",t.insertAdjacentElement("afterend",h)),h.textContent=`${x} remaining`;const m=o.querySelector([".saved-quota-reset",".saved-usage-reset",".saved-metric-reset"].join(","));if(m){const L=m.textContent?.trim()??"";m.textContent=L.replace(/^Resets\s+in\s+/i,"Reset ").replace(/^Reset\s+in\s+/i,"Reset ")}}}}let savedQuotaEnhancementQueued=!1;function queueSavedQuotaEnhancement(){savedQuotaEnhancementQueued||(savedQuotaEnhancementQueued=!0,queueMicrotask(()=>{savedQuotaEnhancementQueued=!1,enhanceSavedQuotaMetrics(document)}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{enhanceSavedQuotaMetrics(document)},{once:!0}):enhanceSavedQuotaMetrics(document);const savedQuotaObserver=new MutationObserver(()=>{queueSavedQuotaEnhancement()});savedQuotaObserver.observe(document.documentElement,{childList:!0,subtree:!0});

"use strict";(()=>{const f=acquireVsCodeApi(),M=document.getElementById("app");if(!M)return;const $=f.getState()||{};let r={loading:!0,current:$.current||null,accounts:Array.isArray($.accounts)?$.accounts:[],runtime:$.runtime||null,usage:$.usage||null,usageSnapshots:$.usageSnapshots||{},usageError:null,error:null,preferences:{version:1,theme:"vscode",language:"auto",effectiveLanguage:"en",showCurrent:!0,showSaved:!0,showRuntime:!0,autoRefreshIntervalMinutes:5,enableLowQuotaReminder:!0,lowQuotaThresholdPercent:20,smartQuotaFallback:!0,autoRoundRobin:!1,enableQuotaAudio:!0},meta:{version:"0.9.0",developer:"Boy Gilang Ramadhan",website:"https://boygr.com",iconUri:""}},i={search:typeof $.search=="string"?$.search:"",sortBy:typeof $.sortBy=="string"?$.sortBy:"quota",currentCollapsed:!!$.currentCollapsed,savedCollapsed:!!$.savedCollapsed,runtimeCollapsed:$.runtimeCollapsed!==!1,usageCollapsed:!!$.usageCollapsed,settingsOpen:!1,settingsDraft:null,editingEmail:null,editValue:"",editColorTag:"",editGroup:"",groupFilter:"all",removeCandidate:null,runtimeModalOpen:!1,quotaMatrixOpen:!1},A=null,S=null,x=null;const B={en:{appName:"Antigravity Account Switcher",accountManager:"Google account manager",settings:"Settings",currentAccount:"Current account",savedAccounts:"Saved accounts",antigravityStatus:"Antigravity status",refresh:"Refresh",connected:"Connected",active:"Active",switch:"Switch",reauth:"Re-auth",signout:"Sign out",addGoogleAccount:"Add Google Account",addGoogleAccountHint:"Sign in or switch account",saveCurrentAccount:"Save Current Account",unavailable:"Antigravity account unavailable",waiting:"Waiting for Antigravity...",checking:"Checking\u2026",loadingAccount:"Loading account\u2026",loadingSavedAccounts:"Loading saved accounts\u2026",updatingQuota:"Updating quota\u2026",checkingAccount:"Checking Antigravity account state\u2026",checkingExtension:"Checking extension status\u2026",checkingBackend:"Checking backend status\u2026",checkingHub:"Checking hub connection\u2026",noSaved:"No saved accounts",noSavedHint:"Save the current Antigravity account or add another Google account.",noMatches:"No matching accounts",noMatchesHint:"Try another label, display name, or email.",searchPlaceholder:"Search accounts",sortBy:"Sort by",sortQuota:"Highest quota",sortName:"Name (A-Z)",sortRecent:"Recently used",editLabel:"Edit label",save:"Save",cancel:"Cancel",removeLabel:"Clear label",accountActions:"Account actions",appearance:"Appearance",theme:"Theme",language:"Language",layout:"Layout",followVsCode:"Follow VS Code",light:"Light",dark:"Dark",system:"System",automatic:"Auto",english:"English",indonesian:"Bahasa Indonesia",showCurrent:"Show current account",showSaved:"Show saved accounts",showRuntime:"Show Antigravity status",quotaAndReminders:"Quota & Reminders",autoRefreshQuota:"Auto-refresh quota",autoRefreshOff:"Off (Manual only)",every1Minute:"Every 1 minute",every5Minutes:"Every 5 minutes (Recommended)",every15Minutes:"Every 15 minutes",every30Minutes:"Every 30 minutes",every1Hour:"Every 1 hour",lowQuotaReminder:"Low quota notification",reminderThreshold:"Warning threshold",percentRemaining:"% remaining",smartQuotaFallback:"Smart Quota Fallback (1-click switch)",backupAndRestore:"Backup & Restore",backupDesc:"Export saved accounts metadata to JSON or restore them on another machine.",exportAccounts:"Export Accounts",importAccounts:"Import Accounts",reconnectHub:"Reconnect Hub",restartBackend:"Restart Backend",processRecovery:"Process Recovery",settingsHint:"Changes apply only after Save.",googleExtension:"Google Extension",officialExtension:"Official Antigravity extension",agyBackend:"AGY Backend",localBackend:"Local Antigravity backend",hub:"Hub",localHub:"Local Hub",hubConnection:"Antigravity hub connection",running:"Running",stopped:"Stopped",ready:"Ready",disconnected:"Unavailable",version:"Version",refreshing:"Refreshing account state...",adding:"Opening Google account flow...",saving:"Saving current account...",reauthenticating:"Re-authenticating...",signingOut:"Signing out...",switching:"Switching account...",updatingLabel:"Updating account label...",savingSettings:"Saving settings...",stateUpdated:"Account state updated.",labelUpdated:"Account label updated.",settingsSaved:"Settings saved.",collapse:"Collapse section",expand:"Expand section",currentAccountLabel:"Current account",developedBy:"Developed by",about:"About",developer:"Developer",website:"Website",removeSavedAccount:"Remove saved account",removeSavedQuestion:"Remove saved account?",removeSavedExplanation:"This only removes local Account Switcher metadata. It does not sign you out, delete your Google account, or remove Google credentials.",remove:"Remove",accountRemoved:"Saved account removed.",usage:"Usage",weeklyLimit:"Weekly limit",fiveHourLimit:"5-hour limit",weeklyShort:"Weekly",fiveHourShort:"5h",updated:"Updated",models:"models",remaining:"remaining",resetsIn:"Resets in",resetDue:"Reset due",lastUpdated:"Last updated",quotaSnapshot:"Quota snapshot",showAllModels:"Show all models",showLess:"Show less",justNow:"just now",ago:"ago",quotaUnavailable:"Usage unavailable",quotaUnavailableHint:"Antigravity did not return current quota information.",quotaHistory:"7-Day Quota Analytics",quotaHistorySub:"Daily lowest remaining",exportAnalytics:"Export Analytics",autoRoundRobin:"Auto-Round-Robin (Switch on rate limit)",enableQuotaAudio:"Subtle Audio Alerts (Web Audio)",quotaMatrix:"Quota Matrix",quotaMatrixTitle:"Multi-Account Quota Matrix",quotaMatrixSub:"Real-time quota comparison across all accounts",switchNow:"Switch",noSnapshotYet:"No quota data yet",workspace:"Workspace",workspaceLinked:"Workspace linked",linkWorkspace:"Link Workspace",unlinkWorkspace:"Unlink"},id:{appName:"Antigravity Account Switcher",accountManager:"Pengelola akun Google",settings:"Pengaturan",currentAccount:"Akun saat ini",savedAccounts:"Akun tersimpan",antigravityStatus:"Status Antigravity",refresh:"Segarkan",connected:"Terhubung",active:"Aktif",switch:"Ganti",reauth:"Autentikasi ulang",signout:"Keluar",addGoogleAccount:"Tambah Akun Google",addGoogleAccountHint:"Masuk atau ganti akun",saveCurrentAccount:"Simpan Akun Saat Ini",unavailable:"Akun Antigravity tidak tersedia",waiting:"Menunggu Antigravity...",checking:"Memeriksa\u2026",loadingAccount:"Memuat akun\u2026",loadingSavedAccounts:"Memuat akun tersimpan\u2026",updatingQuota:"Memperbarui kuota\u2026",checkingAccount:"Memeriksa status akun Antigravity\u2026",checkingExtension:"Memeriksa status ekstensi\u2026",checkingBackend:"Memeriksa status backend\u2026",checkingHub:"Memeriksa koneksi hub\u2026",noSaved:"Belum ada akun tersimpan",noSavedHint:"Simpan akun Antigravity saat ini atau tambahkan akun Google lain.",noMatches:"Tidak ada akun yang cocok",noMatchesHint:"Coba label, nama, atau email lainnya.",searchPlaceholder:"Cari akun",sortBy:"Urutkan",sortQuota:"Sisa kuota",sortName:"Nama (A-Z)",sortRecent:"Terakhir dipakai",editLabel:"Edit label",save:"Simpan",cancel:"Batal",removeLabel:"Hapus label",accountActions:"Tindakan akun",appearance:"Tampilan",theme:"Tema",language:"Bahasa",layout:"Tata letak",followVsCode:"Ikuti VS Code",light:"Terang",dark:"Gelap",system:"Sistem",automatic:"Otomatis",english:"English",indonesian:"Bahasa Indonesia",showCurrent:"Tampilkan akun saat ini",showSaved:"Tampilkan akun tersimpan",showRuntime:"Tampilkan status Antigravity",quotaAndReminders:"Kuota & Pengingat",autoRefreshQuota:"Auto-refresh kuota",autoRefreshOff:"Nonaktif (Hanya manual)",every1Minute:"Setiap 1 menit",every5Minutes:"Setiap 5 menit (Disarankan)",every15Minutes:"Setiap 15 menit",every30Minutes:"Setiap 30 menit",every1Hour:"Setiap 1 jam",lowQuotaReminder:"Pemberitahuan kuota menipis",reminderThreshold:"Batas peringatan",percentRemaining:"% tersisa",smartQuotaFallback:"Peralihan Cepat saat Kuota Menipis",backupAndRestore:"Cadangan & Pemulihan",backupDesc:"Ekspor metadata akun tersimpan ke JSON atau pulihkan di perangkat lain.",exportAccounts:"Ekspor Akun",importAccounts:"Impor Akun",reconnectHub:"Sambungkan Ulang Hub",restartBackend:"Mulai Ulang Backend",processRecovery:"Pemulihan Proses",settingsHint:"Perubahan baru diterapkan setelah Simpan.",googleExtension:"Ekstensi Google",officialExtension:"Ekstensi resmi Antigravity",agyBackend:"Backend AGY",localBackend:"Backend lokal Antigravity",hub:"Hub",localHub:"Hub Lokal",hubConnection:"Koneksi hub Antigravity",running:"Berjalan",stopped:"Berhenti",ready:"Siap",disconnected:"Tidak tersedia",version:"Versi",refreshing:"Menyegarkan status akun...",adding:"Membuka alur akun Google...",saving:"Menyimpan akun saat ini...",reauthenticating:"Melakukan autentikasi ulang...",signingOut:"Keluar dari akun...",switching:"Mengganti akun...",updatingLabel:"Memperbarui label akun...",savingSettings:"Menyimpan pengaturan...",stateUpdated:"Status akun diperbarui.",labelUpdated:"Label akun diperbarui.",settingsSaved:"Pengaturan disimpan.",collapse:"Ciutkan bagian",expand:"Buka bagian",currentAccountLabel:"Akun saat ini",developedBy:"Dikembangkan oleh",about:"Tentang",developer:"Developer",website:"Situs",removeSavedAccount:"Hapus akun tersimpan",removeSavedQuestion:"Hapus akun tersimpan?",removeSavedExplanation:"Ini hanya menghapus metadata lokal Account Switcher. Tindakan ini tidak mengeluarkan akun, menghapus akun Google, atau menghapus kredensial Google.",remove:"Hapus",accountRemoved:"Akun tersimpan dihapus.",usage:"Penggunaan",weeklyLimit:"Batas mingguan",fiveHourLimit:"Batas 5 jam",weeklyShort:"Mingguan",fiveHourShort:"5j",updated:"Diperbarui",models:"model",remaining:"tersisa",resetsIn:"Reset dalam",resetDue:"Waktunya reset",lastUpdated:"Terakhir diperbarui",quotaSnapshot:"Snapshot kuota",showAllModels:"Tampilkan semua model",showLess:"Tampilkan lebih sedikit",justNow:"baru saja",ago:"yang lalu",quotaUnavailable:"Penggunaan tidak tersedia",quotaUnavailableHint:"Antigravity tidak mengembalikan informasi kuota saat ini.",quotaHistory:"Analitik Kuota 7 Hari",quotaHistorySub:"Sisa terendah harian",exportAnalytics:"Ekspor Analitik",autoRoundRobin:"Auto-Round-Robin (Ganti saat kuota habis)",enableQuotaAudio:"Notifikasi Suara Lembut (Web Audio)",quotaMatrix:"Matriks Kuota",quotaMatrixTitle:"Matriks Kuota Multi-Akun",quotaMatrixSub:"Perbandingan sisa kuota semua akun secara real-time",switchNow:"Ganti",noSnapshotYet:"Belum ada data kuota",workspace:"Workspace",workspaceLinked:"Tertaut ke workspace",linkWorkspace:"Tautkan Workspace",unlinkWorkspace:"Lepas"}};function L(){return r.preferences?.effectiveLanguage==="id"?"id":"en"}function a(e){return B[L()]?.[e]??B.en[e]??e}function t(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function h(e,s="ui-icon"){const n=`class="${t(s)}" viewBox="0 0 16 16" fill="none" aria-hidden="true"`;return{refresh:`
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
            `}[e]||""}function g(e){return String(e??"").trim().toLowerCase()}function E(e){if(r.preferences?.enableQuotaAudio!==!1)try{const s=window.AudioContext||window.webkitAudioContext;if(!s)return;const n=new s;e==="restored"?[523.25,659.25,783.99,1046.5].forEach((u,l)=>{const c=n.createOscillator(),d=n.createGain();c.type="sine",c.frequency.setValueAtTime(u,n.currentTime+l*.07),d.gain.setValueAtTime(.06,n.currentTime+l*.07),d.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+l*.07+.55),c.connect(d),d.connect(n.destination),c.start(n.currentTime+l*.07),c.stop(n.currentTime+l*.07+.55)}):e==="warning"&&[440,369.99].forEach((u,l)=>{const c=n.createOscillator(),d=n.createGain();c.type="sine",c.frequency.setValueAtTime(u,n.currentTime+l*.12),d.gain.setValueAtTime(.05,n.currentTime+l*.12),d.gain.exponentialRampToValueAtTime(1e-4,n.currentTime+l*.12+.4),c.connect(d),d.connect(n.destination),c.start(n.currentTime+l*.12),c.stop(n.currentTime+l*.12+.4)})}catch{}}function H(){f.setState({search:i.search,sortBy:i.sortBy,currentCollapsed:i.currentCollapsed,savedCollapsed:i.savedCollapsed,runtimeCollapsed:i.runtimeCollapsed,usageCollapsed:i.usageCollapsed,accounts:r.accounts,current:r.current,runtime:r.runtime,usage:r.usage,usageSnapshots:r.usageSnapshots})}function q(e){A=e,v()}function ve(){A=null}function N(e,s="info"){S={message:e,kind:s},x&&clearTimeout(x),x=setTimeout(()=>{S=null,x=null,v()},2600),v()}function he(){return A?{refresh:a("refreshing"),add:a("adding"),save:a("saving"),reauth:a("reauthenticating"),signout:a("signingOut"),switch:a("switching"),label:a("updatingLabel"),settings:a("savingSettings"),remove:a("removeSavedAccount")}[A.type]||"Working...":""}function b(){return!!A}function K(e,s){const n=String(e||"").trim()||String(s||"").split("@")[0],o=n.split(/\s+/).filter(Boolean);return o.length>=2?(o[0][0]+o[o.length-1][0]).toUpperCase():n.slice(0,2).toUpperCase()||"A"}function z(){if(!r.current)return null;const e=g(r.current.email);return r.accounts.find(s=>g(s.email)===e)||null}function P(e){const s=g(e);return r.accounts.find(n=>g(n.email)===s)}function U(e){return e.label||e.displayName||e.email}function Q(e){const s=g(e.email),n=r.usageSnapshots?.[s];if(!n||!Array.isArray(n.buckets)||n.buckets.length===0)return;let o;for(const u of n.buckets)typeof u.remainingFraction=="number"&&!u.disabled&&(o===void 0||u.remainingFraction<o)&&(o=u.remainingFraction);return o!==void 0?Math.round(o*100):void 0}function I(){const e=i.search.trim().toLowerCase();let s=e?r.accounts.filter(o=>[o.label,o.displayName,o.email,o.group].filter(Boolean).join(" ").toLowerCase().includes(e)):r.accounts.slice();i.groupFilter&&i.groupFilter!=="all"&&(s=s.filter(o=>o.group===i.groupFilter));const n=g(r.current?.email);return s.sort((o,u)=>{const l=g(o.email)===n,c=g(u.email)===n;if(l!==c)return l?-1:1;const d=i.sortBy||"quota";if(d==="quota"){const p=Q(o),m=Q(u);if(p!==void 0&&m!==void 0){if(m!==p)return m-p}else{if(p!==void 0)return-1;if(m!==void 0)return 1}}else if(d==="recent"){const p=o.lastSeenAt?new Date(o.lastSeenAt).getTime():0,m=u.lastSeenAt?new Date(u.lastSeenAt).getTime():0;if(m!==p)return m-p}return(o.label||o.displayName||o.email).localeCompare(u.label||u.displayName||u.email)}),s}function Y(){const e=document.documentElement,s=r.preferences?.theme||"vscode";if(e.removeAttribute("data-ag-theme"),s==="light"||s==="dark"){e.setAttribute("data-ag-theme",s);return}if(s==="system"){const n=window.matchMedia("(prefers-color-scheme: dark)").matches;e.setAttribute("data-ag-theme",n?"dark":"light")}}function be(){return A?`
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
        `:""}function fe(e,s,n,o=""){return`
            <div class="section-header">
                <button
                    type="button"
                    class="section-toggle"
                    data-action="${t(s)}"
                    aria-expanded="${n?"false":"true"}"
                    title="${t(a(n?"expand":"collapse"))}"
                >
                    <span
                        class="chevron"
                        aria-hidden="true"
                    >
                        ${h(n?"chevronRight":"chevronDown")}
                    </span>

                    <span class="section-title">
                        ${t(e)}
                    </span>
                </button>

                <div class="section-tools">
                    ${o}
                </div>
            </div>
        `}function Fe(){return`
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
        `}function Z(e){const s=["blue","green","purple","amber","rose","teal"];return`
            <div
                class="label-editor"
                data-editor-email="${t(e.email)}"
            >
                <div class="label-editor-input-row">
                    <input
                        class="label-input"
                        type="text"
                        value="${t(i.editValue)}"
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
                        ${h("check")}
                    </button>

                    <button
                        type="button"
                        class="icon-btn compact"
                        data-action="cancel-label"
                        data-email="${t(e.email)}"
                        title="${t(a("cancel"))}"
                        aria-label="${t(a("cancel"))}"
                    >
                        ${h("close")}
                    </button>
                </div>

                <div class="label-editor-colors">
                    ${s.map(n=>`
                        <button
                            type="button"
                            class="color-picker-dot color-${n} ${i.editColorTag===n?"selected":""}"
                            data-action="select-color-tag"
                            data-color="${n}"
                            title="${n}"
                            aria-label="${n}"
                        ></button>
                    `).join("")}
                    ${i.editColorTag?`
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
                        ${["Personal","Work","Client"].map(n=>`
                            <button
                                type="button"
                                class="group-tag-btn ${i.editGroup===n?"selected":""}"
                                data-action="select-edit-group"
                                data-group="${n}"
                            >${n}</button>
                        `).join("")}
                        ${i.editGroup&&!["Personal","Work","Client"].includes(i.editGroup)?`
                            <button
                                type="button"
                                class="group-tag-btn selected"
                                data-action="select-edit-group"
                                data-group="${t(i.editGroup)}"
                            >${t(i.editGroup)}</button>
                        `:""}
                        ${i.editGroup?`
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
        `}function $e(e){if(typeof e!="string")return"";try{const s=new URL(e),n=s.hostname.toLowerCase();return s.protocol!=="https:"||!(n==="googleusercontent.com"||n.endsWith(".googleusercontent.com"))?"":s.toString()}catch{return""}}function J(e,s,n,o=""){const u=$e(n),l=`
            <span class="avatar-fallback">
                ${t(K(e,s))}
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
                            >
                        `:""}
            </div>
        `}function X(e){return typeof e!="number"||!Number.isFinite(e)?null:Math.max(0,Math.min(100,e*100))}function _(e){const s=X(e);if(s===null)return"\u2014";const n=Math.round(s*100)/100;return(Number.isInteger(n)?String(n):n.toFixed(2))+"%"}function ee(e){const s=Math.max(0,Math.floor(e/6e4));if(s<1)return"<1m";const n=Math.floor(s/1440),o=Math.floor(s%1440/60),u=s%60,l=[];return n>0&&l.push(`${n}d`),o>0&&l.push(`${o}h`),n===0&&u>0&&l.push(`${u}m`),l.slice(0,2).join(" ")||"<1m"}function G(e){if(!e)return"";const s=new Date(e).getTime();if(!Number.isFinite(s))return"";const n=s-Date.now();if(n<=0){const o=new Date(e),u=String(o.getHours()).padStart(2,"0"),l=String(o.getMinutes()).padStart(2,"0"),d=o.toDateString()===new Date().toDateString()?`${u}:${l}`:`${o.getDate()}/${o.getMonth()+1} ${u}:${l}`;return`${a("resetDue")} (${d})`}return`${a("resetsIn")} `+ee(n)}function D(e){if(!e)return"";const s=new Date(e).getTime();if(!Number.isFinite(s))return"";const n=Math.max(0,Date.now()-s);return n<6e4?a("justNow"):`${ee(n)} `+a("ago")}function ye(e){const s=String(e?.window||"").trim().toLowerCase();return s==="weekly"?a("weeklyLimit"):s==="5h"?a("fiveHourLimit"):e?.displayName||e?.window||"Quota"}function ke(e){const s={weekly:0,"5h":1};return[...Array.isArray(e)?e:[]].sort((n,o)=>{const u=String(n?.window||"").toLowerCase(),l=String(o?.window||"").toLowerCase();return(s[u]??99)-(s[l]??99)})}function we(e){const s=X(e.remainingFraction),n=_(e.remainingFraction),o=G(e.resetTime),u=ye(e),l=t(u).replace(/\s+/,"<br>");return`
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
                        ${t(n)}
                    </strong>
                </div>

                <progress
                    class="quota-progress"
                    max="100"
                    value="${s===null?0:s}"
                    aria-label="${t(u)}"
                    aria-valuetext="${t(`${n} ${a("remaining")}`)}"
                ></progress>

                <div class="quota-bucket-meta">
                    ${o?`
                                <span
                                    class="quota-reset"
                                    data-reset-at="${t(e.resetTime||"")}"
                                >
                                    ${t(o)}
                                </span>
                            `:""}
                </div>
            </div>
        `}function te(e){const s=String(e?.displayName||"").trim(),n=s.toLowerCase();return n==="gemini models"||n==="gemini"?"Gemini":n==="claude and gpt models"||n==="claude and gpt"?"Claude and GPT":s||"Quota"}function Ae(e){const s=ke(e.buckets),n=te(e),o=String(e?.description||"").trim();return`
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
                    ${s.map(we).join("")}
                </div>
            </div>
        `}function Se(){const e=r.usage,s=Array.isArray(e?.groups)?e.groups:[],n=e?.fetchedAt?D(e.fetchedAt):"";return`
            <div class="usage-section">
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

                ${s.length>0?`
                            <div class="usage-body">
                                ${s.map(Ae).join("")}
                            </div>
                        `:`
                            <div class="usage-empty secondary-text">
                                ${t(r.usageError||a("quotaUnavailable"))}
                            </div>
                        `}
            </div>
        `}function xe(){const e=[],s=new Date;for(let n=6;n>=0;n--){const o=new Date(s);o.setDate(o.getDate()-n);const u=o.toISOString().split("T")[0],l=o.toLocaleDateString(L()==="id"?"id-ID":"en-US",{weekday:"short"});e.push({date:u,label:l})}return e}function Me(e){if(!e)return"";const s=r.quotaHistory||{},n=g(e),o=s[n]||[],l=xe().map(c=>{const d=o.find(T=>T.date===c.date),p=d&&typeof d.lowestRemainingPercent=="number",m=p?d.lowestRemainingPercent:null;let k="history-empty";p&&(k=m<=15?"history-critical":m<=35?"history-warn":"history-healthy");const w=p?`${Math.max(12,m)}%`:"4px",C=p?`${c.label} (${c.date}): ${m}% ${a("remaining")}`:`${c.label} (${c.date}): -`;return`
                <div class="history-bar-col" title="${t(C)}">
                    <div class="history-bar-track">
                        <div class="history-bar-fill ${k}" style="height: ${w};"></div>
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
                        ${h("export","export-btn-icon")}
                        <span>${t(a("exportAnalytics"))}</span>
                    </button>
                </div>
                <div class="history-bars-container">
                    ${l}
                </div>
            </div>
        `}function Ce(){if(!r.workspace||!r.workspace.folderPath)return"";const e=g(r.current?.email||""),s=g(r.workspace.linkedEmail||""),n=!!(s&&s===e);return`
            <div class="workspace-link-bar ${n?"linked-active":""}">
                <div class="workspace-link-icon" aria-hidden="true">\u{1F4C1}</div>
                <div class="workspace-link-info">
                    <div class="workspace-link-name" title="${t(r.workspace.folderPath)}">
                        <strong>${t(r.workspace.folderName)}</strong>
                    </div>
                    <div class="workspace-link-detail secondary-text">
                        ${n?`<span class="workspace-linked-tag">\u2713 ${t(a("workspaceLinked"))}</span>`:s?`<span>Linked to ${t(s)}</span>`:"<span>No account linked</span>"}
                    </div>
                </div>
                <div class="workspace-link-actions">
                    ${n?`
                                <button
                                    type="button"
                                    class="btn subtle-btn compact"
                                    data-action="clearWorkspaceAccount"
                                    title="${t(a("unlinkWorkspace"))}"
                                    ${b()?"disabled":""}
                                >
                                    ${t(a("unlinkWorkspace"))}
                                </button>
                            `:`
                                <button
                                    type="button"
                                    class="btn subtle-btn compact"
                                    data-action="setWorkspaceAccount"
                                    title="${t(a("linkWorkspace"))}"
                                    ${b()?"disabled":""}
                                >
                                    ${t(a("linkWorkspace"))}
                                </button>
                            `}
                </div>
            </div>
        `}function Te(){document.querySelectorAll(".avatar-image").forEach(e=>{e.addEventListener("error",()=>{e.hidden=!0,e.closest(".avatar")?.classList.remove("has-image")},{once:!0})})}function ae(){document.querySelectorAll("[data-reset-at]").forEach(e=>{const s=G(e.dataset.resetAt),n=e.dataset.resetPrefix||"";e.textContent=s?n+s:""}),document.querySelectorAll("[data-usage-fetched-at]").forEach(e=>{e.textContent=D(e.dataset.usageFetchedAt)}),document.querySelectorAll("[data-snapshot-fetched-at]").forEach(e=>{e.textContent=D(e.dataset.snapshotFetchedAt)})}function qe(){if(!r.preferences?.showCurrent)return"";const e=!!r.loading,s=`
            <div class="section-header current-static-header">
                <div class="section-static-title">
                    <span class="section-title">
                        ${t(a("currentAccount"))}
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
                            ${t(a(e?"loadingAccount":"unavailable"))}
                        </strong>

                        <div class="secondary-text">
                            ${t(e?a("checkingAccount"):r.error||a("waiting"))}
                        </div>
                    </div>
                </section>
            `;const n=z(),o=r.current.displayName||n?.displayName||r.current.email,u=n&&g(i.editingEmail)===g(n.email),l=n?.label||a("currentAccountLabel"),c=`
            <span class="connection-state inline ${e?"checking":""}">
                <span class="status-dot"></span>

                ${t(a(e?"checking":"connected"))}
            </span>
        `;return`
            <section class="section current-section">
                ${s}

                <div
                    class="current-panel"
                    aria-label="${t(a("currentAccount"))}"
                >
                    <div class="identity-row current-identity-row">
                        ${J(o,r.current.email,r.current.profilePictureUrl,n?.colorTag?`current-avatar tag-${t(n.colorTag)}`:"current-avatar")}

                        <div class="identity">
                            <div class="identity-heading">
                                <div
                                    class="identity-name current-name"
                                    title="${t(o)}"
                                >
                                    ${t(o)}
                                </div>
                            </div>

                            <div
                                class="identity-email"
                                title="${t(r.current.email)}"
                            >
                                ${t(r.current.email)}
                            </div>

                            ${n&&u?`
                                        <div class="current-label-editor">
                                            ${Z(n)}
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

                                                ${n?.group?`
                                                            <span class="group-pill" title="Group: ${t(n.group)}">
                                                                \u{1F3F7}\uFE0F ${t(n.group)}
                                                            </span>
                                                        `:""}

                                                ${n?`
                                                            <button
                                                                type="button"
                                                                class="edit-icon"
                                                                data-action="edit-label"
                                                                data-email="${t(n.email)}"
                                                                title="${t(a("editLabel"))}"
                                                                aria-label="${t(a("editLabel"))}"
                                                                ${b()?"disabled":""}
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
                            ${e||b()?"disabled":""}
                        >
                            ${t(a("reauth"))}
                        </button>

                        <button
                            type="button"
                            class="btn subtle-danger"
                            data-action="signout"
                            ${e||b()?"disabled":""}
                        >
                            ${t(a("signout"))}
                        </button>
                    </div>

                    ${Ce()}
                    ${Se()}
                    ${Me(r.current.email)}
                </div>
            </section>
        `}function ne(e,s){return(Array.isArray(e?.groups)?e.groups:[]).find(o=>s(String(o.displayName||"").toLowerCase()))}function se(e,s){return(Array.isArray(e?.buckets)?e.buckets:[]).find(n=>String(n.window||"").toLowerCase()===s)}function Re(e){return _(e?.remainingFraction)}function oe(e,s){if(!s)return"";const n=se(s,"weekly"),o=se(s,"5h"),u=G(n?.resetTime),l=G(o?.resetTime),c=(d,p,m,k)=>`
                <div class="saved-quota-pair">
                    <div class="saved-usage-metric">
                        <span class="saved-usage-metric-label">
                            ${t(d)}
                        </span>

                        <span class="saved-usage-metric-value">
                            ${t(Re(p))}
                        </span>
                    </div>

                    ${m?`
                                <div
                                    class="saved-quota-reset ${t(k)}"
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
                    ${c(a("weeklyShort"),n,u,"saved-weekly-reset")}

                    ${c(a("fiveHourShort"),o,l,"saved-five-hour-reset")}
                </div>
            </div>
        `}function Le(e){if(!e)return"";const s=ne(e,o=>o.includes("gemini")),n=ne(e,o=>o.includes("claude")||o.includes("gpt"));return!s&&!n?"":`
            <div class="saved-usage-summary">
                ${oe("Gemini",s)}

                ${oe("Claude + GPT",n)}
            </div>
        `}function Ee(e){const s=g(r.current?.email),n=!!s&&g(e.email)===s,o=g(i.editingEmail)===g(e.email),u=!!(r.loading&&(!r.accounts||r.accounts.length===0)),l=r.usageSnapshots?.[g(e.email)],c=l?.fetchedAt?D(l.fetchedAt):"";return`
            <article
                class="account-row saved-account-row ${n?"active":""}"
                data-email="${t(e.email)}"
                ${n?'aria-current="true"':""}
            >
                <div class="saved-account-rail">
                    <div
                        class="avatar small ${e.colorTag?`tag-${t(e.colorTag)}`:""}"
                        aria-hidden="true"
                    >
                        ${t(K(e.displayName||e.label,e.email))}

                        ${n?`
                                    <span
                                        class="saved-avatar-active-badge"
                                        title="${t(a("active"))}"
                                    >
                                        <span aria-hidden="true">\u2713</span>
                                    </span>
                                `:""}
                    </div>
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
                                    ${u||b()?"disabled":""}
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
                    ${o?Z(e):`
                                <div class="saved-title-row">
                                    <div
                                        class="identity-name saved-label"
                                        title="${t(U(e))}"
                                    >
                                        ${e.colorTag?`<span class="color-tag-dot tag-${t(e.colorTag)}" title="${t(e.colorTag)}"></span>`:""}${t(U(e))}
                                    </div>

                                    <div class="saved-title-actions">

                                        <button
                                            type="button"
                                            class="edit-icon"
                                            data-action="edit-label"
                                            data-email="${t(e.email)}"
                                            title="${t(a("editLabel"))}"
                                            aria-label="${t(a("editLabel"))}"
                                            ${b()?"disabled":""}
                                        >
                                            ${h("edit")}
                                        </button>

                                        <button
                                            type="button"
                                            class="icon-btn compact delete-account-btn"
                                            data-action="remove-account"
                                            data-email="${t(e.email)}"
                                            title="${t(a("removeSavedAccount"))}"
                                            aria-label="${t(a("removeSavedAccount"))}"
                                            ${b()?"disabled":""}
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

                                    ${e.group?`
                                                <span class="group-pill" title="Group: ${t(e.group)}">
                                                    \u{1F3F7}\uFE0F ${t(e.group)}
                                                </span>
                                            `:""}

                                    ${r.workspace?.linkedEmail&&g(r.workspace.linkedEmail)===g(e.email)?`
                                                <span class="workspace-pill" title="${t(`${a("workspaceLinked")} (${r.workspace.folderName})`)}">
                                                    \u{1F4C1} ${t(r.workspace.folderName)}
                                                </span>
                                            `:""}

                                    ${c?`
                                                <span
                                                    class="saved-updated"
                                                    data-snapshot-fetched-at="${t(l.fetchedAt)}"
                                                    title="${t(`${a("updated")} ${c}`)}"
                                                >
                                                    ${t(`${a("updated")} ${c}`)}
                                                </span>
                                            `:""}
                                </div>


                            `}


                </div>

                <div class="saved-account-quota-area">
                    ${Le(l)}
                </div>
            </article>
        `}function ie(){if(r.loading&&(!r.accounts||r.accounts.length===0))return`
                <div class="saved-loading-panel" role="status" aria-live="polite">
                    <div class="saved-loading-spinner-row">
                        <span class="loading-spin-icon">${h("refresh")}</span>
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
            `;const e=I();return r.accounts.length===0?`
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
                </div>
            `:e.map(Ee).join("")}function Be(){if(!r.preferences?.showSaved)return"";const e=I().length,s=(r.accounts?.length||0)>3,n=!!r.loading&&(!r.accounts||r.accounts.length===0),o=!!r.loading&&(r.accounts?.length||0)>0,u=n?"\u2026":i.search.trim()?`${e}/${r.accounts.length}`:String(r.accounts.length),l=`
            <div class="saved-header-actions">
                ${o?`
                            <span
                                class="refreshing-indicator"
                                title="${t(a("updatingQuota"))}"
                                aria-label="${t(a("updatingQuota"))}"
                            >
                                <span class="loading-spin-icon">
                                    ${h("refresh")}
                                </span>
                            </span>
                        `:""}

                <span
                    id="account-count"
                    class="count"
                    title="${t(a("savedAccounts"))}"
                >
                    ${t(u)}
                </span>

                <button
                    type="button"
                    class="icon-btn compact saved-add-btn"
                    data-action="add"
                    title="${t(a("addGoogleAccount"))}"
                    aria-label="${t(a("addGoogleAccount"))}"
                    ${b()?"disabled":""}
                >
                    ${h("plus")}
                </button>
            </div>
        `;return`
            <section class="section saved-section">
                ${fe(a("savedAccounts"),"toggle-saved",i.savedCollapsed,l)}

                ${i.savedCollapsed?"":`
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
                                                            value="${t(i.search)}"
                                                            placeholder="${t(a("searchPlaceholder"))}"
                                                            autocomplete="off"
                                                            spellcheck="false"
                                                        >
                                                    </div>

                                                    <div class="sort-wrap">
                                                        <select
                                                            id="account-sort"
                                                            class="sort-select"
                                                            data-action="change-sort"
                                                            aria-label="${t(a("sortBy"))}"
                                                            title="${t(a("sortBy"))}"
                                                        >
                                                            <option value="quota" ${i.sortBy==="quota"?"selected":""}>${t(a("sortQuota"))}</option>
                                                            <option value="name" ${i.sortBy==="name"?"selected":""}>${t(a("sortName"))}</option>
                                                            <option value="recent" ${i.sortBy==="recent"?"selected":""}>${t(a("sortRecent"))}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                ${(()=>{const c=Array.from(new Set((r.accounts||[]).map(d=>d.group).filter(Boolean)));return c.length===0?"":`
                                                        <div class="saved-group-filter-row">
                                                            <button type="button" class="group-filter-chip ${i.groupFilter==="all"?"active":""}" data-action="set-group-filter" data-group="all">All (${r.accounts.length})</button>
                                                            ${c.map(d=>{const p=r.accounts.filter(m=>m.group===d).length;return`<button type="button" class="group-filter-chip ${i.groupFilter===d?"active":""}" data-action="set-group-filter" data-group="${t(d)}">${t(d)} (${p})</button>`}).join("")}
                                                        </div>
                                                    `})()}
                                            `:""}

                                    ${r.current&&!z()?`
                                                <button
                                                    type="button"
                                                    class="btn block"
                                                    data-action="save"
                                                    ${b()?"disabled":""}
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
                                    ${ie()}
                                </div>
                            </div>
                        `}
            </section>
        `}function F(e,s,n,o,u){return`
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
                        ${t(n)}
                    </div>
                </div>

                <div
                    class="runtime-state ${t(o)}"
                >
                    <span class="status-dot"></span>
                    ${t(u)}
                </div>
            </div>
        `}function He(){if(!r.preferences?.showRuntime)return"";const e=!!r.loading,s=r.runtime||{},n=s.extension||{},o=s.process||null,u=s.health||null,l=!!n.installed,c=!!o,d=!!u?.reachable,p=l&&c&&d,m=e?"checking":p?"healthy":"warning",k=a(e?"checking":p?"ready":"disconnected");return`
            <div class="runtime-status-bar">
                <button
                    type="button"
                    class="runtime-status-pill ${t(m)}"
                    data-action="open-runtime-modal"
                    title="${t(a("antigravityStatus"))} \xB7 ${t(k)}"
                    aria-label="${t(a("antigravityStatus"))}"
                >
                    <span class="status-dot"></span>
                    <span class="runtime-status-pill-label">Antigravity:</span>
                    <span class="runtime-status-pill-value">${t(k)}</span>
                </button>

                <button
                    type="button"
                    class="quota-matrix-trigger-btn"
                    data-action="open-quota-matrix"
                    title="${t(a("quotaMatrixTitle"))}"
                    aria-label="${t(a("quotaMatrixTitle"))}"
                >
                    ${h("matrix","matrix-icon")}
                    <span>${t(a("quotaMatrix"))}</span>
                </button>
            </div>
        `}function Qe(){if(!i.runtimeModalOpen)return"";const e=!!r.loading,s=r.runtime||{},n=s.extension||{},o=s.process||null,u=s.health||null,l=!!n.installed,c=!!o,d=!!u?.reachable,p=l&&c&&d,m=e?"checking":p?"healthy":"warning",k=a(e?"checking":p?"ready":"disconnected");return`
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
                            ${h("close")}
                        </button>
                    </header>

                    <div class="runtime-modal-body">
                        <div class="runtime-panel">
                            ${F("G",a("googleExtension"),e?a("checkingExtension"):n.version?`${a("version")} ${n.version}`:a("officialExtension"),e?"checking":l?"healthy":"error",a(e?"checking":l?"connected":"disconnected"))}

                            ${F("A",a("agyBackend"),e?a("checkingBackend"):s.agyVersion?`${a("version")} ${s.agyVersion}`:a("localBackend"),e?"checking":c?"healthy":"error",a(e?"checking":c?"running":"stopped"))}

                            ${F("H",a("hub"),a(e?"checkingHub":d?"localHub":"hubConnection"),e?"checking":d?"healthy":"error",a(e?"checking":d?"connected":"disconnected"))}
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
        `}function Ge(){if(!i.quotaMatrixOpen)return"";const e=r.accounts||[],s=r.usageSnapshots||{},n=g(r.current?.email||""),o=[...e].sort((l,c)=>{const d=g(l.email),p=g(c.email);if(d===n)return-1;if(p===n)return 1;const m=Q(l),k=Q(c),w=typeof m=="number"?m:-1,C=typeof k=="number"?k:-1;return w!==C?C-w:(l.label||l.displayName||l.email).localeCompare(c.label||c.displayName||c.email)}),u=o.length===0?`
                <div class="matrix-empty secondary-text">
                    ${t(a("noSaved"))}
                </div>
            `:o.map(l=>{const c=g(l.email),d=!!(n&&c===n),p=d&&r.usage||s[c],m=l.displayName||l.label||l.email,k=l.label||(d?a("currentAccountLabel"):"");let w=null,C="",T=null,V="";if(p?.buckets&&Array.isArray(p.buckets))for(const y of p.buckets){const j=(y.displayName||y.bucketId||"").toLowerCase(),O=(y.window||y.description||"").toLowerCase(),Ie=j.includes("5-hour")||j.includes("5h")||O.includes("5 hour")||O.includes("5h"),pe=j.includes("week")||O.includes("week")||O.includes("7 day");if(typeof y.remainingFraction=="number"&&!y.disabled){const me=Math.max(0,Math.min(100,Math.round(y.remainingFraction*100))),ge=y.resetTime?G(y.resetTime):"";Ie||w===null&&!pe?(w=me,C=ge):pe&&(T=me,V=ge)}}if(w===null){const y=Q(l);typeof y=="number"&&(w=y)}const de=y=>typeof y!="number"?"tone-empty":y<=15?"tone-critical":y<=35?"tone-warn":"tone-healthy";return`
                    <div class="matrix-card ${d?"active-matrix-card":""}">
                        <div class="matrix-identity-col">
                            ${J(m,l.email,l.profilePictureUrl||(d?r.current?.profilePictureUrl:void 0),l.colorTag?`matrix-avatar tag-${t(l.colorTag)}`:"matrix-avatar")}
                            <div class="matrix-identity-info">
                                <div class="matrix-name-row">
                                    <span class="matrix-account-name" title="${t(m)}">${t(m)}</span>
                                    ${l.colorTag?`<span class="color-tag-dot dot-${t(l.colorTag)}"></span>`:""}
                                    ${d?`<span class="badge active-badge">${t(a("active"))}</span>`:""}
                                </div>
                                <div class="matrix-email-row" title="${t(l.email)}">${t(l.email)}</div>
                                <div class="matrix-tags-row">
                                    ${k?`<span class="account-label">${t(k)}</span>`:""}
                                    ${l.group?`<span class="group-pill" title="Group: ${t(l.group)}">\u{1F3F7}\uFE0F ${t(l.group)}</span>`:""}
                                </div>
                            </div>
                        </div>

                        <div class="matrix-quota-col">
                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${t(a("fiveHourShort")||"5h")}:</span>
                                    <strong>${typeof w=="number"?`${w}%`:"-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${de(w)}" style="width: ${typeof w=="number"?w:0}%;"></div>
                                </div>
                                ${C?`<span class="matrix-reset-sub">${t(C)}</span>`:""}
                            </div>

                            <div class="matrix-quota-block">
                                <div class="matrix-quota-label-row">
                                    <span class="matrix-quota-dim">${t(a("weeklyShort")||"Weekly")}:</span>
                                    <strong>${typeof T=="number"?`${T}%`:"-"}</strong>
                                </div>
                                <div class="matrix-quota-track">
                                    <div class="matrix-quota-fill ${de(T)}" style="width: ${typeof T=="number"?T:0}%;"></div>
                                </div>
                                ${V?`<span class="matrix-reset-sub">${t(V)}</span>`:""}
                            </div>
                        </div>

                        <div class="matrix-action-col">
                            ${d?`<span class="matrix-connected-pill">\u2713 ${t(a("connected"))}</span>`:`
                                    <button
                                        type="button"
                                        class="btn btn-primary compact matrix-switch-btn"
                                        data-action="switch"
                                        data-email="${t(l.email)}"
                                        title="${t(a("switch"))}"
                                    >
                                        ${t(a("switchNow"))}
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
                    aria-label="${t(a("quotaMatrixTitle"))}"
                >
                    <header class="matrix-modal-header">
                        <div class="matrix-modal-title-group">
                            <h2>${h("matrix","modal-header-icon")} ${t(a("quotaMatrixTitle"))}</h2>
                            <span class="secondary-text">${t(a("quotaMatrixSub"))}</span>
                        </div>
                        <button
                            type="button"
                            class="icon-btn"
                            data-action="close-quota-matrix"
                            aria-label="${t(a("cancel")||"Close")}"
                            title="${t(a("cancel")||"Close")}"
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
                        <span class="secondary-text">${o.length} ${t(a("savedAccounts"))}</span>
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
        `}function Ne(){if(!i.settingsOpen||!i.settingsDraft)return"";const e=i.settingsDraft;return`
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
                                        ${e.theme==="vscode"?"selected":""}
                                    >
                                        ${t(a("followVsCode"))}
                                    </option>

                                    <option
                                        value="light"
                                        ${e.theme==="light"?"selected":""}
                                    >
                                        ${t(a("light"))}
                                    </option>

                                    <option
                                        value="dark"
                                        ${e.theme==="dark"?"selected":""}
                                    >
                                        ${t(a("dark"))}
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

                            ${R("enableLowQuotaReminder",a("lowQuotaReminder"),e.enableLowQuotaReminder)}

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

                            ${R("smartQuotaFallback",a("smartQuotaFallback"),e.smartQuotaFallback!==!1)}

                            ${R("autoRoundRobin",a("autoRoundRobin"),e.autoRoundRobin===!0)}

                            ${R("enableQuotaAudio",a("enableQuotaAudio"),e.enableQuotaAudio!==!1)}
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("layout"))}
                            </h3>

                            ${R("showRuntime",a("showRuntime"),e.showRuntime)}

                            ${R("showCurrent",a("showCurrent"),e.showCurrent)}

                            ${R("showSaved",a("showSaved"),e.showSaved)}
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

                        <div class="settings-group about-group">
                            <h3>
                                ${t(a("about"))}
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
                                    v${t(r.meta?.version||"0.6.0")}
                                </span>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(a("developer"))}
                                </span>

                                <strong>
                                    ${t(r.meta?.developer||"Boy Gilang Ramadhan")}
                                </strong>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(a("website"))}
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
                            ${b()?"disabled":""}
                        >
                            ${t(a("save"))}
                        </button>
                    </footer>
                </section>
            </div>
        `}function R(e,s,n){return`
            <label class="check-row">
                <input
                    type="checkbox"
                    data-setting="${t(e)}"
                    ${n?"checked":""}
                >

                <span>
                    ${t(s)}
                </span>
            </label>
        `}function Pe(){const e=r.meta||{},s=e.developer||"Boy Gilang Ramadhan",n=e.website||"https://boygr.com",o=e.version||"0.5.1";return`
            <footer class="developer-footer">
                <div class="developer-footer-copy">
                    <span class="footer-prefix">${t(a("developedBy"))}</span>
                    <a
                        href="${t(n)}"
                        data-external-url="${t(n)}"
                        title="${t(n)}"
                        class="developer-link"
                    >
                        ${t(s)}
                    </a>
                </div>

                <span class="footer-version">
                    v${t(o)}
                </span>
            </footer>
        `}function De(){const e=i.removeCandidate;return e?`
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
                                ${t(U(e))}
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
        `:""}function v(){Y(),document.documentElement.lang=L(),M.innerHTML=`
            <div
                class="app"
                aria-busy="${r.loading||b()?"true":"false"}"
            >
                <div class="content-shell">
                    ${be()}
                    ${He()}
                    ${qe()}
                    ${Be()}
                </div>

                ${Pe()}
            </div>

            ${Ne()}
            ${De()}
            ${Qe()}
            ${Ge()}
        `,Te(),ae(),i.editingEmail&&window.requestAnimationFrame(()=>{const e=document.querySelector('[data-role="label-input"]');e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))})}function re(){const e=document.getElementById("saved-account-list");e&&(e.innerHTML=ie());const s=document.getElementById("account-count");if(s){const n=I().length;s.textContent=i.search.trim()?`${n}/${r.accounts.length}`:String(r.accounts.length)}}function Oe(e){const s=P(e);s&&(i.editingEmail=s.email,i.editValue=s.label||"",i.editColorTag=s.colorTag||"",i.editGroup=s.group||"",v())}function le(){i.editingEmail=null,i.editValue="",i.editColorTag="",i.editGroup="",v()}function ce(e){const s=P(e);s&&(q({type:"label",email:s.email}),f.postMessage({type:"updateLabel",email:s.email,label:i.editValue,colorTag:i.editColorTag,group:i.editGroup}))}function ue(){const e=r.preferences||{};i.settingsDraft={theme:e.theme||"vscode",language:e.language||"auto",showCurrent:e.showCurrent!==!1,showSaved:e.showSaved!==!1,showRuntime:e.showRuntime!==!1,autoRefreshIntervalMinutes:typeof e.autoRefreshIntervalMinutes=="number"?e.autoRefreshIntervalMinutes:5,enableLowQuotaReminder:e.enableLowQuotaReminder!==!1,lowQuotaThresholdPercent:typeof e.lowQuotaThresholdPercent=="number"?e.lowQuotaThresholdPercent:20,smartQuotaFallback:e.smartQuotaFallback!==!1,autoRoundRobin:e.autoRoundRobin===!0,enableQuotaAudio:e.enableQuotaAudio!==!1},i.settingsOpen=!0,v()}function W(){i.settingsOpen=!1,i.settingsDraft=null,v()}function Ue(){i.settingsDraft&&(q({type:"settings"}),f.postMessage({type:"saveSettings",preferences:{...i.settingsDraft}}))}M.addEventListener("input",e=>{const s=e.target;if(s instanceof HTMLInputElement&&s.id==="account-search"){i.search=s.value,H(),re();return}s instanceof HTMLInputElement&&s.dataset.role==="label-input"&&(i.editValue=s.value)}),M.addEventListener("change",e=>{const s=e.target;if(s instanceof HTMLSelectElement&&s.dataset.action==="change-sort"){i.sortBy=s.value,H(),re();return}if(!i.settingsDraft||!(s instanceof HTMLInputElement||s instanceof HTMLSelectElement))return;const n=s.dataset.setting;if(n){if(s instanceof HTMLInputElement&&s.type==="checkbox"){i.settingsDraft[n]=s.checked,n==="enableLowQuotaReminder"&&v();return}if(n==="autoRefreshIntervalMinutes"||n==="lowQuotaThresholdPercent"){i.settingsDraft[n]=Number.parseInt(s.value,10);return}i.settingsDraft[n]=s.value}}),M.addEventListener("click",e=>{const s=e.target;if(!(s instanceof Element))return;const n=s.closest("[data-action]");if(!n)return;const o=n.dataset.action,u=n.dataset.email;if(o==="open-settings"){ue();return}if(o==="cancel-settings"){W();return}if(o==="settings-backdrop"&&s===n){W();return}if(o==="save-settings"){b()||Ue();return}if(o==="toggle-current"){i.currentCollapsed=!i.currentCollapsed,H(),v();return}if(o==="toggle-saved"){i.savedCollapsed=!i.savedCollapsed,H(),v();return}if(o==="open-runtime-modal"){i.runtimeModalOpen=!0,v();return}if(o==="close-runtime-modal"||o==="runtime-modal-backdrop"&&s===n){i.runtimeModalOpen=!1,v();return}if(o==="open-quota-matrix"){i.quotaMatrixOpen=!0,v();return}if(o==="close-quota-matrix"){if(n.classList.contains("matrix-modal-backdrop")&&s!==n)return;i.quotaMatrixOpen=!1,v();return}if(o==="export-accounts"){f.postMessage({type:"exportAccounts"});return}if(o==="import-accounts"){f.postMessage({type:"importAccounts"});return}if(o==="reconnect-hub"){i.runtimeModalOpen=!1,q({type:"refresh"}),f.postMessage({type:"reconnectHub"});return}if(o==="restart-backend"){i.runtimeModalOpen=!1,q({type:"refresh"}),f.postMessage({type:"restartBackend"});return}if(o==="select-color-tag"){const c=n.dataset.color||"";i.editColorTag=i.editColorTag===c?"":c,v();return}if(o==="select-edit-group"){const c=n.dataset.group||"";i.editGroup=i.editGroup===c?"":c,v();return}if(o==="set-group-filter"){i.groupFilter=n.dataset.group||"all",v();return}if(o==="export-quota-analytics"){f.postMessage({type:"exportQuotaAnalytics"});return}if(o==="edit-label"){b()||Oe(u);return}if(o==="cancel-label"){le();return}if(o==="save-label"){b()||ce(u);return}if(o==="remove-account"){const c=P(u);c&&!b()&&(i.removeCandidate=c,v());return}if(o==="cancel-remove"){i.removeCandidate=null,v();return}if(o==="confirm-remove"){const c=i.removeCandidate;c&&!b()&&(q({type:"remove",email:c.email}),f.postMessage({type:"removeAccount",email:c.email}));return}if(b())return;if(o==="switch"){const c=P(u);c&&(i.quotaMatrixOpen=!1,q({type:"switch",email:c.email}),f.postMessage({type:"switchAccount",account:c}));return}const l={add:"addAccount",save:"saveCurrent",refresh:"refresh",reauth:"reauth",signout:"signout",setWorkspaceAccount:"setWorkspaceAccount",clearWorkspaceAccount:"clearWorkspaceAccount"};l[o]&&(q({type:{add:"add",save:"save",refresh:"refresh",reauth:"reauth",signout:"signout",setWorkspaceAccount:"refresh",clearWorkspaceAccount:"refresh"}[o]}),f.postMessage({type:l[o]}))}),window.addEventListener("keydown",e=>{if(e.key==="Escape"){if(i.quotaMatrixOpen){i.quotaMatrixOpen=!1,v();return}if(i.runtimeModalOpen){i.runtimeModalOpen=!1,v();return}if(i.settingsOpen){W();return}if(i.editingEmail&&!A){le();return}S&&!A&&(S=null,x&&(clearTimeout(x),x=null),v());return}if(e.key==="Enter"&&i.editingEmail&&!A){const s=document.activeElement;s instanceof HTMLInputElement&&s.dataset.role==="label-input"&&(e.preventDefault(),ce(i.editingEmail))}}),M.addEventListener("click",e=>{const s=e.target;if(!(s instanceof Element))return;const n=s.closest("[data-external-url]");if(!n)return;e.preventDefault();const o=n.dataset.externalUrl;o&&f.postMessage({type:"openExternal",url:o})}),window.addEventListener("message",e=>{const s=e.data;if(!s)return;if(s.type==="openSettings"){ue();return}if(s.type==="openQuotaMatrix"){i.quotaMatrixOpen=!0,v();return}if(s.type==="playChime"){E(s.chime);return}if(s.type!=="state")return;const n=A;if(r=s.state,H(),ve(),n?.type==="remove"){i.removeCandidate=null,N(a("accountRemoved"),"success");return}if(n?.type==="label"){i.editingEmail=null,i.editValue="",N(a("labelUpdated"),"success");return}if(n?.type==="settings"){i.settingsOpen=!1,i.settingsDraft=null,N(a("settingsSaved"),"success");return}if(n&&n.type!=="refresh"){N(a("stateUpdated"),"success");return}v()}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{r.preferences?.theme==="system"&&Y()}),window.setInterval(()=>{ae()},3e4),v(),f.postMessage({type:"ready"})})();function enhanceSavedQuotaMetrics(f=document){const M=f.querySelectorAll(".saved-account-quota-area");for(const $ of M){const r=$.querySelectorAll([".saved-family-metric",".saved-usage-metric",".saved-quota-metric",".saved-metric-row",".saved-usage-row"].join(","));for(const i of r){const A=i.querySelector(".saved-quota-main"),S=i.querySelector(".saved-quota-value");if(!A||!S)continue;const x=S.textContent?.trim()??"",B=x.match(/(-?\d+(?:\.\d+)?)\s*%/);if(!B)continue;const L=Number(B[1]);if(!Number.isFinite(L))continue;const a=Math.max(0,Math.min(100,L));let t=i.querySelector(":scope > .saved-quota-progress");if(!t){t=document.createElement("div"),t.className="saved-quota-progress",t.setAttribute("aria-hidden","true");const E=document.createElement("span");E.className="saved-quota-progress-fill",t.append(E),A.insertAdjacentElement("afterend",t)}t.style.setProperty("--saved-quota-percent",`${a}%`);let h=i.querySelector(":scope > .saved-quota-remaining");h||(h=document.createElement("div"),h.className="saved-quota-remaining",t.insertAdjacentElement("afterend",h)),h.textContent=`${x} remaining`;const g=i.querySelector([".saved-quota-reset",".saved-usage-reset",".saved-metric-reset"].join(","));if(g){const E=g.textContent?.trim()??"";g.textContent=E.replace(/^Resets\s+in\s+/i,"Reset ").replace(/^Reset\s+in\s+/i,"Reset ")}}}}let savedQuotaEnhancementQueued=!1;function queueSavedQuotaEnhancement(){savedQuotaEnhancementQueued||(savedQuotaEnhancementQueued=!0,queueMicrotask(()=>{savedQuotaEnhancementQueued=!1,enhanceSavedQuotaMetrics(document)}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{enhanceSavedQuotaMetrics(document)},{once:!0}):enhanceSavedQuotaMetrics(document);const savedQuotaObserver=new MutationObserver(()=>{queueSavedQuotaEnhancement()});savedQuotaObserver.observe(document.documentElement,{childList:!0,subtree:!0});

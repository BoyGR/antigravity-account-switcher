"use strict";(()=>{const b=acquireVsCodeApi(),S=document.getElementById("app");if(!S)return;const $=b.getState()||{};let r={loading:!0,current:$.current||null,accounts:Array.isArray($.accounts)?$.accounts:[],runtime:$.runtime||null,usage:$.usage||null,usageSnapshots:$.usageSnapshots||{},usageError:null,error:null,preferences:{version:1,theme:"vscode",language:"auto",effectiveLanguage:"en",showCurrent:!0,showSaved:!0,showRuntime:!0,autoRefreshIntervalMinutes:5,enableLowQuotaReminder:!0,lowQuotaThresholdPercent:20},meta:{version:"0.8.0",developer:"Boy Gilang Ramadhan",website:"https://boygr.com",iconUri:""}},i={search:typeof $.search=="string"?$.search:"",sortBy:typeof $.sortBy=="string"?$.sortBy:"quota",currentCollapsed:!!$.currentCollapsed,savedCollapsed:!!$.savedCollapsed,runtimeCollapsed:$.runtimeCollapsed!==!1,usageCollapsed:!!$.usageCollapsed,settingsOpen:!1,settingsDraft:null,editingEmail:null,editValue:"",editColorTag:"",editGroup:"",groupFilter:"all",removeCandidate:null,runtimeModalOpen:!1},k=null,y=null,w=null;const R={en:{appName:"Antigravity Account Switcher",accountManager:"Google account manager",settings:"Settings",currentAccount:"Current account",savedAccounts:"Saved accounts",antigravityStatus:"Antigravity status",refresh:"Refresh",connected:"Connected",active:"Active",switch:"Switch",reauth:"Re-auth",signout:"Sign out",addGoogleAccount:"Add Google Account",addGoogleAccountHint:"Sign in or switch account",saveCurrentAccount:"Save Current Account",unavailable:"Antigravity account unavailable",waiting:"Waiting for Antigravity...",checking:"Checking\u2026",loadingAccount:"Loading account\u2026",loadingSavedAccounts:"Loading saved accounts\u2026",updatingQuota:"Updating quota\u2026",checkingAccount:"Checking Antigravity account state\u2026",checkingExtension:"Checking extension status\u2026",checkingBackend:"Checking backend status\u2026",checkingHub:"Checking hub connection\u2026",noSaved:"No saved accounts",noSavedHint:"Save the current Antigravity account or add another Google account.",noMatches:"No matching accounts",noMatchesHint:"Try another label, display name, or email.",searchPlaceholder:"Search accounts",sortBy:"Sort by",sortQuota:"Highest quota",sortName:"Name (A-Z)",sortRecent:"Recently used",editLabel:"Edit label",save:"Save",cancel:"Cancel",removeLabel:"Clear label",accountActions:"Account actions",appearance:"Appearance",theme:"Theme",language:"Language",layout:"Layout",followVsCode:"Follow VS Code",light:"Light",dark:"Dark",system:"System",automatic:"Auto",english:"English",indonesian:"Bahasa Indonesia",showCurrent:"Show current account",showSaved:"Show saved accounts",showRuntime:"Show Antigravity status",quotaAndReminders:"Quota & Reminders",autoRefreshQuota:"Auto-refresh quota",autoRefreshOff:"Off (Manual only)",every1Minute:"Every 1 minute",every5Minutes:"Every 5 minutes (Recommended)",every15Minutes:"Every 15 minutes",every30Minutes:"Every 30 minutes",every1Hour:"Every 1 hour",lowQuotaReminder:"Low quota notification",reminderThreshold:"Warning threshold",percentRemaining:"% remaining",smartQuotaFallback:"Smart Quota Fallback (1-click switch)",backupAndRestore:"Backup & Restore",backupDesc:"Export saved accounts metadata to JSON or restore them on another machine.",exportAccounts:"Export Accounts",importAccounts:"Import Accounts",reconnectHub:"Reconnect Hub",restartBackend:"Restart Backend",processRecovery:"Process Recovery",settingsHint:"Changes apply only after Save.",googleExtension:"Google Extension",officialExtension:"Official Antigravity extension",agyBackend:"AGY Backend",localBackend:"Local Antigravity backend",hub:"Hub",localHub:"Local Hub",hubConnection:"Antigravity hub connection",running:"Running",stopped:"Stopped",ready:"Ready",disconnected:"Unavailable",version:"Version",refreshing:"Refreshing account state...",adding:"Opening Google account flow...",saving:"Saving current account...",reauthenticating:"Re-authenticating...",signingOut:"Signing out...",switching:"Switching account...",updatingLabel:"Updating account label...",savingSettings:"Saving settings...",stateUpdated:"Account state updated.",labelUpdated:"Account label updated.",settingsSaved:"Settings saved.",collapse:"Collapse section",expand:"Expand section",currentAccountLabel:"Current account",developedBy:"Developed by",about:"About",developer:"Developer",website:"Website",removeSavedAccount:"Remove saved account",removeSavedQuestion:"Remove saved account?",removeSavedExplanation:"This only removes local Account Switcher metadata. It does not sign you out, delete your Google account, or remove Google credentials.",remove:"Remove",accountRemoved:"Saved account removed.",usage:"Usage",weeklyLimit:"Weekly limit",fiveHourLimit:"5-hour limit",weeklyShort:"Weekly",fiveHourShort:"5h",updated:"Updated",models:"models",remaining:"remaining",resetsIn:"Resets in",resetDue:"Reset due",lastUpdated:"Last updated",quotaSnapshot:"Quota snapshot",showAllModels:"Show all models",showLess:"Show less",justNow:"just now",ago:"ago",quotaUnavailable:"Usage unavailable",quotaUnavailableHint:"Antigravity did not return current quota information.",quotaHistory:"7-Day Quota Analytics",quotaHistorySub:"Daily lowest remaining",exportAnalytics:"Export Analytics",workspace:"Workspace",workspaceLinked:"Workspace linked",linkWorkspace:"Link Workspace",unlinkWorkspace:"Unlink"},id:{appName:"Antigravity Account Switcher",accountManager:"Pengelola akun Google",settings:"Pengaturan",currentAccount:"Akun saat ini",savedAccounts:"Akun tersimpan",antigravityStatus:"Status Antigravity",refresh:"Segarkan",connected:"Terhubung",active:"Aktif",switch:"Ganti",reauth:"Autentikasi ulang",signout:"Keluar",addGoogleAccount:"Tambah Akun Google",addGoogleAccountHint:"Masuk atau ganti akun",saveCurrentAccount:"Simpan Akun Saat Ini",unavailable:"Akun Antigravity tidak tersedia",waiting:"Menunggu Antigravity...",checking:"Memeriksa\u2026",loadingAccount:"Memuat akun\u2026",loadingSavedAccounts:"Memuat akun tersimpan\u2026",updatingQuota:"Memperbarui kuota\u2026",checkingAccount:"Memeriksa status akun Antigravity\u2026",checkingExtension:"Memeriksa status ekstensi\u2026",checkingBackend:"Memeriksa status backend\u2026",checkingHub:"Memeriksa koneksi hub\u2026",noSaved:"Belum ada akun tersimpan",noSavedHint:"Simpan akun Antigravity saat ini atau tambahkan akun Google lain.",noMatches:"Tidak ada akun yang cocok",noMatchesHint:"Coba label, nama, atau email lainnya.",searchPlaceholder:"Cari akun",sortBy:"Urutkan",sortQuota:"Sisa kuota",sortName:"Nama (A-Z)",sortRecent:"Terakhir dipakai",editLabel:"Edit label",save:"Simpan",cancel:"Batal",removeLabel:"Hapus label",accountActions:"Tindakan akun",appearance:"Tampilan",theme:"Tema",language:"Bahasa",layout:"Tata letak",followVsCode:"Ikuti VS Code",light:"Terang",dark:"Gelap",system:"Sistem",automatic:"Otomatis",english:"English",indonesian:"Bahasa Indonesia",showCurrent:"Tampilkan akun saat ini",showSaved:"Tampilkan akun tersimpan",showRuntime:"Tampilkan status Antigravity",quotaAndReminders:"Kuota & Pengingat",autoRefreshQuota:"Auto-refresh kuota",autoRefreshOff:"Nonaktif (Hanya manual)",every1Minute:"Setiap 1 menit",every5Minutes:"Setiap 5 menit (Disarankan)",every15Minutes:"Setiap 15 menit",every30Minutes:"Setiap 30 menit",every1Hour:"Setiap 1 jam",lowQuotaReminder:"Pemberitahuan kuota menipis",reminderThreshold:"Batas peringatan",percentRemaining:"% tersisa",smartQuotaFallback:"Peralihan Cepat saat Kuota Menipis",backupAndRestore:"Cadangan & Pemulihan",backupDesc:"Ekspor metadata akun tersimpan ke JSON atau pulihkan di perangkat lain.",exportAccounts:"Ekspor Akun",importAccounts:"Impor Akun",reconnectHub:"Sambungkan Ulang Hub",restartBackend:"Mulai Ulang Backend",processRecovery:"Pemulihan Proses",settingsHint:"Perubahan baru diterapkan setelah Simpan.",googleExtension:"Ekstensi Google",officialExtension:"Ekstensi resmi Antigravity",agyBackend:"Backend AGY",localBackend:"Backend lokal Antigravity",hub:"Hub",localHub:"Hub Lokal",hubConnection:"Koneksi hub Antigravity",running:"Berjalan",stopped:"Berhenti",ready:"Siap",disconnected:"Tidak tersedia",version:"Versi",refreshing:"Menyegarkan status akun...",adding:"Membuka alur akun Google...",saving:"Menyimpan akun saat ini...",reauthenticating:"Melakukan autentikasi ulang...",signingOut:"Keluar dari akun...",switching:"Mengganti akun...",updatingLabel:"Memperbarui label akun...",savingSettings:"Menyimpan pengaturan...",stateUpdated:"Status akun diperbarui.",labelUpdated:"Label akun diperbarui.",settingsSaved:"Pengaturan disimpan.",collapse:"Ciutkan bagian",expand:"Buka bagian",currentAccountLabel:"Akun saat ini",developedBy:"Dikembangkan oleh",about:"Tentang",developer:"Developer",website:"Situs",removeSavedAccount:"Hapus akun tersimpan",removeSavedQuestion:"Hapus akun tersimpan?",removeSavedExplanation:"Ini hanya menghapus metadata lokal Account Switcher. Tindakan ini tidak mengeluarkan akun, menghapus akun Google, atau menghapus kredensial Google.",remove:"Hapus",accountRemoved:"Akun tersimpan dihapus.",usage:"Penggunaan",weeklyLimit:"Batas mingguan",fiveHourLimit:"Batas 5 jam",weeklyShort:"Mingguan",fiveHourShort:"5j",updated:"Diperbarui",models:"model",remaining:"tersisa",resetsIn:"Reset dalam",resetDue:"Waktunya reset",lastUpdated:"Terakhir diperbarui",quotaSnapshot:"Snapshot kuota",showAllModels:"Tampilkan semua model",showLess:"Tampilkan lebih sedikit",justNow:"baru saja",ago:"yang lalu",quotaUnavailable:"Penggunaan tidak tersedia",quotaUnavailableHint:"Antigravity tidak mengembalikan informasi kuota saat ini.",quotaHistory:"Analitik Kuota 7 Hari",quotaHistorySub:"Sisa terendah harian",exportAnalytics:"Ekspor Analitik",workspace:"Workspace",workspaceLinked:"Tertaut ke workspace",linkWorkspace:"Tautkan Workspace",unlinkWorkspace:"Lepas"}};function L(){return r.preferences?.effectiveLanguage==="id"?"id":"en"}function a(e){return R[L()]?.[e]??R.en[e]??e}function t(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function h(e,s="ui-icon"){const n=`class="${t(s)}" viewBox="0 0 16 16" fill="none" aria-hidden="true"`;return{refresh:`
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
            `}[e]||""}function d(e){return String(e??"").trim().toLowerCase()}function A(){b.setState({search:i.search,sortBy:i.sortBy,currentCollapsed:i.currentCollapsed,savedCollapsed:i.savedCollapsed,runtimeCollapsed:i.runtimeCollapsed,usageCollapsed:i.usageCollapsed,accounts:r.accounts,current:r.current,runtime:r.runtime,usage:r.usage,usageSnapshots:r.usageSnapshots})}function M(e){k=e,m()}function ae(){k=null}function x(e,s="info"){y={message:e,kind:s},w&&clearTimeout(w),w=setTimeout(()=>{y=null,w=null,m()},2600),m()}function ne(){return k?{refresh:a("refreshing"),add:a("adding"),save:a("saving"),reauth:a("reauthenticating"),signout:a("signingOut"),switch:a("switching"),label:a("updatingLabel"),settings:a("savingSettings"),remove:a("removeSavedAccount")}[k.type]||"Working...":""}function f(){return!!k}function P(e,s){const n=String(e||"").trim()||String(s||"").split("@")[0],o=n.split(/\s+/).filter(Boolean);return o.length>=2?(o[0][0]+o[o.length-1][0]).toUpperCase():n.slice(0,2).toUpperCase()||"A"}function N(){if(!r.current)return null;const e=d(r.current.email);return r.accounts.find(s=>d(s.email)===e)||null}function E(e){const s=d(e);return r.accounts.find(n=>d(n.email)===s)}function H(e){return e.label||e.displayName||e.email}function U(e){const s=d(e.email),n=r.usageSnapshots?.[s];if(!n||!Array.isArray(n.buckets)||n.buckets.length===0)return;let o;for(const c of n.buckets)typeof c.remainingFraction=="number"&&!c.disabled&&(o===void 0||c.remainingFraction<o)&&(o=c.remainingFraction);return o!==void 0?Math.round(o*100):void 0}function Q(){const e=i.search.trim().toLowerCase();let s=e?r.accounts.filter(o=>[o.label,o.displayName,o.email,o.group].filter(Boolean).join(" ").toLowerCase().includes(e)):r.accounts.slice();i.groupFilter&&i.groupFilter!=="all"&&(s=s.filter(o=>o.group===i.groupFilter));const n=d(r.current?.email);return s.sort((o,c)=>{const u=d(o.email)===n,l=d(c.email)===n;if(u!==l)return u?-1:1;const p=i.sortBy||"quota";if(p==="quota"){const g=U(o),v=U(c);if(g!==void 0&&v!==void 0){if(v!==g)return v-g}else{if(g!==void 0)return-1;if(v!==void 0)return 1}}else if(p==="recent"){const g=o.lastSeenAt?new Date(o.lastSeenAt).getTime():0,v=c.lastSeenAt?new Date(c.lastSeenAt).getTime():0;if(v!==g)return v-g}return(o.label||o.displayName||o.email).localeCompare(c.label||c.displayName||c.email)}),s}function I(){const e=document.documentElement,s=r.preferences?.theme||"vscode";if(e.removeAttribute("data-ag-theme"),s==="light"||s==="dark"){e.setAttribute("data-ag-theme",s);return}if(s==="system"){const n=window.matchMedia("(prefers-color-scheme: dark)").matches;e.setAttribute("data-ag-theme",n?"dark":"light")}}function se(){return k?`
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
                            ${t(ne())}
                        </span>
                    </div>
                </div>
            `:y?`
            <div
                class="toast-host"
                aria-live="polite"
                aria-atomic="true"
            >
                <div
                    class="toast ${t(y.kind)}"
                    role="status"
                >
                    <span
                        class="toast-symbol"
                        aria-hidden="true"
                    >
                        ${y.kind==="error"?"!":"\u2713"}
                    </span>

                    <span class="toast-message">
                        ${t(y.message)}
                    </span>
                </div>
            </div>
        `:""}function oe(e,s,n,o=""){return`
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
        `}function qe(){return`
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
        `}function F(e){const s=["blue","green","purple","amber","rose","teal"];return`
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
        `}function ie(e){if(typeof e!="string")return"";try{const s=new URL(e),n=s.hostname.toLowerCase();return s.protocol!=="https:"||!(n==="googleusercontent.com"||n.endsWith(".googleusercontent.com"))?"":s.toString()}catch{return""}}function re(e,s,n,o=""){const c=ie(n),u=`
            <span class="avatar-fallback">
                ${t(P(e,s))}
            </span>
        `;return`
            <div
                class="avatar ${t(o)} ${c?"has-image":""}"
                aria-hidden="true"
            >
                ${u}

                ${c?`
                            <img
                                class="avatar-image"
                                src="${t(c)}"
                                alt=""
                                referrerpolicy="no-referrer"
                                draggable="false"
                            >
                        `:""}
            </div>
        `}function W(e){return typeof e!="number"||!Number.isFinite(e)?null:Math.max(0,Math.min(100,e*100))}function O(e){const s=W(e);if(s===null)return"\u2014";const n=Math.round(s*100)/100;return(Number.isInteger(n)?String(n):n.toFixed(2))+"%"}function j(e){const s=Math.max(0,Math.floor(e/6e4));if(s<1)return"<1m";const n=Math.floor(s/1440),o=Math.floor(s%1440/60),c=s%60,u=[];return n>0&&u.push(`${n}d`),o>0&&u.push(`${o}h`),n===0&&c>0&&u.push(`${c}m`),u.slice(0,2).join(" ")||"<1m"}function q(e){if(!e)return"";const s=new Date(e).getTime();if(!Number.isFinite(s))return"";const n=s-Date.now();if(n<=0){const o=new Date(e),c=String(o.getHours()).padStart(2,"0"),u=String(o.getMinutes()).padStart(2,"0"),p=o.toDateString()===new Date().toDateString()?`${c}:${u}`:`${o.getDate()}/${o.getMonth()+1} ${c}:${u}`;return`${a("resetDue")} (${p})`}return`${a("resetsIn")} `+j(n)}function B(e){if(!e)return"";const s=new Date(e).getTime();if(!Number.isFinite(s))return"";const n=Math.max(0,Date.now()-s);return n<6e4?a("justNow"):`${j(n)} `+a("ago")}function ce(e){const s=String(e?.window||"").trim().toLowerCase();return s==="weekly"?a("weeklyLimit"):s==="5h"?a("fiveHourLimit"):e?.displayName||e?.window||"Quota"}function le(e){const s={weekly:0,"5h":1};return[...Array.isArray(e)?e:[]].sort((n,o)=>{const c=String(n?.window||"").toLowerCase(),u=String(o?.window||"").toLowerCase();return(s[c]??99)-(s[u]??99)})}function ue(e){const s=W(e.remainingFraction),n=O(e.remainingFraction),o=q(e.resetTime),c=ce(e),u=t(c).replace(/\s+/,"<br>");return`
            <div
                class="quota-bucket ${e.disabled?"disabled":""}"
                data-window="${t(e.window||"")}"
            >
                <div class="quota-bucket-heading">
                    <span
                        class="quota-window-name"
                        title="${t(e.description||c)}"
                    >
                        ${u}
                    </span>

                    <strong class="quota-percent">
                        ${t(n)}
                    </strong>
                </div>

                <progress
                    class="quota-progress"
                    max="100"
                    value="${s===null?0:s}"
                    aria-label="${t(c)}"
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
        `}function V(e){const s=String(e?.displayName||"").trim(),n=s.toLowerCase();return n==="gemini models"||n==="gemini"?"Gemini":n==="claude and gpt models"||n==="claude and gpt"?"Claude and GPT":s||"Quota"}function de(e){const s=le(e.buckets),n=V(e),o=String(e?.description||"").trim();return`
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
                    ${s.map(ue).join("")}
                </div>
            </div>
        `}function pe(){const e=r.usage,s=Array.isArray(e?.groups)?e.groups:[],n=e?.fetchedAt?B(e.fetchedAt):"";return`
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
                                ${s.map(de).join("")}
                            </div>
                        `:`
                            <div class="usage-empty secondary-text">
                                ${t(r.usageError||a("quotaUnavailable"))}
                            </div>
                        `}
            </div>
        `}function ge(){const e=[],s=new Date;for(let n=6;n>=0;n--){const o=new Date(s);o.setDate(o.getDate()-n);const c=o.toISOString().split("T")[0],u=o.toLocaleDateString(L()==="id"?"id-ID":"en-US",{weekday:"short"});e.push({date:c,label:u})}return e}function ve(e){if(!e)return"";const s=r.quotaHistory||{},n=d(e),o=s[n]||[],u=ge().map(l=>{const p=o.find(Ee=>Ee.date===l.date),g=p&&typeof p.lowestRemainingPercent=="number",v=g?p.lowestRemainingPercent:null;let C="history-empty";g&&(C=v<=15?"history-critical":v<=35?"history-warn":"history-healthy");const Te=g?`${Math.max(12,v)}%`:"4px",xe=g?`${l.label} (${l.date}): ${v}% ${a("remaining")}`:`${l.label} (${l.date}): -`;return`
                <div class="history-bar-col" title="${t(xe)}">
                    <div class="history-bar-track">
                        <div class="history-bar-fill ${C}" style="height: ${Te};"></div>
                    </div>
                    <span class="history-bar-label">${t(l.label)}</span>
                    <span class="history-bar-pct">${g?`${v}%`:"-"}</span>
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
                    ${u}
                </div>
            </div>
        `}function me(){if(!r.workspace||!r.workspace.folderPath)return"";const e=d(r.current?.email||""),s=d(r.workspace.linkedEmail||""),n=!!(s&&s===e);return`
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
                                    ${f()?"disabled":""}
                                >
                                    ${t(a("unlinkWorkspace"))}
                                </button>
                            `:`
                                <button
                                    type="button"
                                    class="btn subtle-btn compact"
                                    data-action="setWorkspaceAccount"
                                    title="${t(a("linkWorkspace"))}"
                                    ${f()?"disabled":""}
                                >
                                    ${t(a("linkWorkspace"))}
                                </button>
                            `}
                </div>
            </div>
        `}function he(){document.querySelectorAll(".avatar-image").forEach(e=>{e.addEventListener("error",()=>{e.hidden=!0,e.closest(".avatar")?.classList.remove("has-image")},{once:!0})})}function K(){document.querySelectorAll("[data-reset-at]").forEach(e=>{const s=q(e.dataset.resetAt),n=e.dataset.resetPrefix||"";e.textContent=s?n+s:""}),document.querySelectorAll("[data-usage-fetched-at]").forEach(e=>{e.textContent=B(e.dataset.usageFetchedAt)}),document.querySelectorAll("[data-snapshot-fetched-at]").forEach(e=>{e.textContent=B(e.dataset.snapshotFetchedAt)})}function fe(){if(!r.preferences?.showCurrent)return"";const e=!!r.loading,s=`
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
            `;const n=N(),o=r.current.displayName||n?.displayName||r.current.email,c=n&&d(i.editingEmail)===d(n.email),u=n?.label||a("currentAccountLabel"),l=`
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
                        ${re(o,r.current.email,r.current.profilePictureUrl,n?.colorTag?`current-avatar tag-${t(n.colorTag)}`:"current-avatar")}

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

                            ${n&&c?`
                                        <div class="current-label-editor">
                                            ${F(n)}
                                        </div>

                                        <div class="current-status-row">
                                            ${l}
                                        </div>
                                    `:`
                                        <div class="current-label-row">
                                            <div class="current-label-edit">
                                                <span class="account-label">
                                                    ${t(u)}
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
                                                                ${f()?"disabled":""}
                                                            >
                                                                ${h("edit")}
                                                            </button>
                                                        `:""}
                                            </div>

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

                    ${me()}
                    ${pe()}
                    ${ve(r.current.email)}
                </div>
            </section>
        `}function z(e,s){return(Array.isArray(e?.groups)?e.groups:[]).find(o=>s(String(o.displayName||"").toLowerCase()))}function Z(e,s){return(Array.isArray(e?.buckets)?e.buckets:[]).find(n=>String(n.window||"").toLowerCase()===s)}function be(e){return O(e?.remainingFraction)}function J(e,s){if(!s)return"";const n=Z(s,"weekly"),o=Z(s,"5h"),c=q(n?.resetTime),u=q(o?.resetTime),l=(p,g,v,C)=>`
                <div class="saved-quota-pair">
                    <div class="saved-usage-metric">
                        <span class="saved-usage-metric-label">
                            ${t(p)}
                        </span>

                        <span class="saved-usage-metric-value">
                            ${t(be(g))}
                        </span>
                    </div>

                    ${v?`
                                <div
                                    class="saved-quota-reset ${t(C)}"
                                    data-reset-at="${t(g?.resetTime||"")}"
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
                    ${l(a("weeklyShort"),n,c,"saved-weekly-reset")}

                    ${l(a("fiveHourShort"),o,u,"saved-five-hour-reset")}
                </div>
            </div>
        `}function $e(e){if(!e)return"";const s=z(e,o=>o.includes("gemini")),n=z(e,o=>o.includes("claude")||o.includes("gpt"));return!s&&!n?"":`
            <div class="saved-usage-summary">
                ${J("Gemini",s)}

                ${J("Claude + GPT",n)}
            </div>
        `}function ke(e){const s=d(r.current?.email),n=!!s&&d(e.email)===s,o=d(i.editingEmail)===d(e.email),c=!!(r.loading&&(!r.accounts||r.accounts.length===0)),u=r.usageSnapshots?.[d(e.email)],l=u?.fetchedAt?B(u.fetchedAt):"";return`
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
                        ${t(P(e.displayName||e.label,e.email))}

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
                                    ${c||f()?"disabled":""}
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
                    ${o?F(e):`
                                <div class="saved-title-row">
                                    <div
                                        class="identity-name saved-label"
                                        title="${t(H(e))}"
                                    >
                                        ${e.colorTag?`<span class="color-tag-dot tag-${t(e.colorTag)}" title="${t(e.colorTag)}"></span>`:""}${t(H(e))}
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
                                            ${h("edit")}
                                        </button>

                                        <button
                                            type="button"
                                            class="icon-btn compact delete-account-btn"
                                            data-action="remove-account"
                                            data-email="${t(e.email)}"
                                            title="${t(a("removeSavedAccount"))}"
                                            aria-label="${t(a("removeSavedAccount"))}"
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

                                    ${e.group?`
                                                <span class="group-pill" title="Group: ${t(e.group)}">
                                                    \u{1F3F7}\uFE0F ${t(e.group)}
                                                </span>
                                            `:""}

                                    ${r.workspace?.linkedEmail&&d(r.workspace.linkedEmail)===d(e.email)?`
                                                <span class="workspace-pill" title="${t(`${a("workspaceLinked")} (${r.workspace.folderName})`)}">
                                                    \u{1F4C1} ${t(r.workspace.folderName)}
                                                </span>
                                            `:""}

                                    ${l?`
                                                <span
                                                    class="saved-updated"
                                                    data-snapshot-fetched-at="${t(u.fetchedAt)}"
                                                    title="${t(`${a("updated")} ${l}`)}"
                                                >
                                                    ${t(`${a("updated")} ${l}`)}
                                                </span>
                                            `:""}
                                </div>


                            `}


                </div>

                <div class="saved-account-quota-area">
                    ${$e(u)}
                </div>
            </article>
        `}function Y(){if(r.loading&&(!r.accounts||r.accounts.length===0))return`
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
            `;const e=Q();return r.accounts.length===0?`
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
            `:e.map(ke).join("")}function ye(){if(!r.preferences?.showSaved)return"";const e=Q().length,s=(r.accounts?.length||0)>3,n=!!r.loading&&(!r.accounts||r.accounts.length===0),o=!!r.loading&&(r.accounts?.length||0)>0,c=n?"\u2026":i.search.trim()?`${e}/${r.accounts.length}`:String(r.accounts.length),u=`
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
                    ${t(c)}
                </span>

                <button
                    type="button"
                    class="icon-btn compact saved-add-btn"
                    data-action="add"
                    title="${t(a("addGoogleAccount"))}"
                    aria-label="${t(a("addGoogleAccount"))}"
                    ${f()?"disabled":""}
                >
                    ${h("plus")}
                </button>
            </div>
        `;return`
            <section class="section saved-section">
                ${oe(a("savedAccounts"),"toggle-saved",i.savedCollapsed,u)}

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

                                                ${(()=>{const l=Array.from(new Set((r.accounts||[]).map(p=>p.group).filter(Boolean)));return l.length===0?"":`
                                                        <div class="saved-group-filter-row">
                                                            <button type="button" class="group-filter-chip ${i.groupFilter==="all"?"active":""}" data-action="set-group-filter" data-group="all">All (${r.accounts.length})</button>
                                                            ${l.map(p=>{const g=r.accounts.filter(v=>v.group===p).length;return`<button type="button" class="group-filter-chip ${i.groupFilter===p?"active":""}" data-action="set-group-filter" data-group="${t(p)}">${t(p)} (${g})</button>`}).join("")}
                                                        </div>
                                                    `})()}
                                            `:""}

                                    ${r.current&&!N()?`
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
                                    ${Y()}
                                </div>
                            </div>
                        `}
            </section>
        `}function D(e,s,n,o,c){return`
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
                    ${t(c)}
                </div>
            </div>
        `}function we(){if(!r.preferences?.showRuntime)return"";const e=!!r.loading,s=r.runtime||{},n=s.extension||{},o=s.process||null,c=s.health||null,u=!!n.installed,l=!!o,p=!!c?.reachable,g=u&&l&&p,v=e?"checking":g?"healthy":"warning",C=a(e?"checking":g?"ready":"disconnected");return`
            <div class="runtime-status-bar">
                <button
                    type="button"
                    class="runtime-status-pill ${t(v)}"
                    data-action="open-runtime-modal"
                    title="${t(a("antigravityStatus"))} \xB7 ${t(C)}"
                    aria-label="${t(a("antigravityStatus"))}"
                >
                    <span class="status-dot"></span>
                    <span class="runtime-status-pill-label">Antigravity:</span>
                    <span class="runtime-status-pill-value">${t(C)}</span>
                </button>
            </div>
        `}function Ae(){if(!i.runtimeModalOpen)return"";const e=!!r.loading,s=r.runtime||{},n=s.extension||{},o=s.process||null,c=s.health||null,u=!!n.installed,l=!!o,p=!!c?.reachable,g=u&&l&&p,v=e?"checking":g?"healthy":"warning",C=a(e?"checking":g?"ready":"disconnected");return`
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
                            <span class="status-dot ${t(v)}"></span>
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
                            ${D("G",a("googleExtension"),e?a("checkingExtension"):n.version?`${a("version")} ${n.version}`:a("officialExtension"),e?"checking":u?"healthy":"error",a(e?"checking":u?"connected":"disconnected"))}

                            ${D("A",a("agyBackend"),e?a("checkingBackend"):s.agyVersion?`${a("version")} ${s.agyVersion}`:a("localBackend"),e?"checking":l?"healthy":"error",a(e?"checking":l?"running":"stopped"))}

                            ${D("H",a("hub"),a(e?"checkingHub":p?"localHub":"hubConnection"),e?"checking":p?"healthy":"error",a(e?"checking":p?"connected":"disconnected"))}
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
        `}function Se(){if(!i.settingsOpen||!i.settingsDraft)return"";const e=i.settingsDraft;return`
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

                            ${T("enableLowQuotaReminder",a("lowQuotaReminder"),e.enableLowQuotaReminder)}

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

                            ${T("smartQuotaFallback",a("smartQuotaFallback"),e.smartQuotaFallback!==!1)}
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("layout"))}
                            </h3>

                            ${T("showRuntime",a("showRuntime"),e.showRuntime)}

                            ${T("showCurrent",a("showCurrent"),e.showCurrent)}

                            ${T("showSaved",a("showSaved"),e.showSaved)}
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
                            ${f()?"disabled":""}
                        >
                            ${t(a("save"))}
                        </button>
                    </footer>
                </section>
            </div>
        `}function T(e,s,n){return`
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
        `}function Ce(){const e=r.meta||{},s=e.developer||"Boy Gilang Ramadhan",n=e.website||"https://boygr.com",o=e.version||"0.5.1";return`
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
        `}function Me(){const e=i.removeCandidate;return e?`
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
                                ${t(H(e))}
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
        `:""}function m(){I(),document.documentElement.lang=L(),S.innerHTML=`
            <div
                class="app"
                aria-busy="${r.loading||f()?"true":"false"}"
            >
                <div class="content-shell">
                    ${se()}
                    ${we()}
                    ${fe()}
                    ${ye()}
                </div>

                ${Ce()}
            </div>

            ${Se()}
            ${Me()}
            ${Ae()}
        `,he(),K(),i.editingEmail&&window.requestAnimationFrame(()=>{const e=document.querySelector('[data-role="label-input"]');e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))})}function X(){const e=document.getElementById("saved-account-list");e&&(e.innerHTML=Y());const s=document.getElementById("account-count");if(s){const n=Q().length;s.textContent=i.search.trim()?`${n}/${r.accounts.length}`:String(r.accounts.length)}}function Le(e){const s=E(e);s&&(i.editingEmail=s.email,i.editValue=s.label||"",i.editColorTag=s.colorTag||"",i.editGroup=s.group||"",m())}function _(){i.editingEmail=null,i.editValue="",i.editColorTag="",i.editGroup="",m()}function ee(e){const s=E(e);s&&(M({type:"label",email:s.email}),b.postMessage({type:"updateLabel",email:s.email,label:i.editValue,colorTag:i.editColorTag,group:i.editGroup}))}function te(){const e=r.preferences||{};i.settingsDraft={theme:e.theme||"vscode",language:e.language||"auto",showCurrent:e.showCurrent!==!1,showSaved:e.showSaved!==!1,showRuntime:e.showRuntime!==!1,autoRefreshIntervalMinutes:typeof e.autoRefreshIntervalMinutes=="number"?e.autoRefreshIntervalMinutes:5,enableLowQuotaReminder:e.enableLowQuotaReminder!==!1,lowQuotaThresholdPercent:typeof e.lowQuotaThresholdPercent=="number"?e.lowQuotaThresholdPercent:20,smartQuotaFallback:e.smartQuotaFallback!==!1},i.settingsOpen=!0,m()}function G(){i.settingsOpen=!1,i.settingsDraft=null,m()}function Re(){i.settingsDraft&&(M({type:"settings"}),b.postMessage({type:"saveSettings",preferences:{...i.settingsDraft}}))}S.addEventListener("input",e=>{const s=e.target;if(s instanceof HTMLInputElement&&s.id==="account-search"){i.search=s.value,A(),X();return}s instanceof HTMLInputElement&&s.dataset.role==="label-input"&&(i.editValue=s.value)}),S.addEventListener("change",e=>{const s=e.target;if(s instanceof HTMLSelectElement&&s.dataset.action==="change-sort"){i.sortBy=s.value,A(),X();return}if(!i.settingsDraft||!(s instanceof HTMLInputElement||s instanceof HTMLSelectElement))return;const n=s.dataset.setting;if(n){if(s instanceof HTMLInputElement&&s.type==="checkbox"){i.settingsDraft[n]=s.checked,n==="enableLowQuotaReminder"&&m();return}if(n==="autoRefreshIntervalMinutes"||n==="lowQuotaThresholdPercent"){i.settingsDraft[n]=Number.parseInt(s.value,10);return}i.settingsDraft[n]=s.value}}),S.addEventListener("click",e=>{const s=e.target;if(!(s instanceof Element))return;const n=s.closest("[data-action]");if(!n)return;const o=n.dataset.action,c=n.dataset.email;if(o==="open-settings"){te();return}if(o==="cancel-settings"){G();return}if(o==="settings-backdrop"&&s===n){G();return}if(o==="save-settings"){f()||Re();return}if(o==="toggle-current"){i.currentCollapsed=!i.currentCollapsed,A(),m();return}if(o==="toggle-saved"){i.savedCollapsed=!i.savedCollapsed,A(),m();return}if(o==="open-runtime-modal"){i.runtimeModalOpen=!0,m();return}if(o==="close-runtime-modal"||o==="runtime-modal-backdrop"&&s===n){i.runtimeModalOpen=!1,m();return}if(o==="export-accounts"){b.postMessage({type:"exportAccounts"});return}if(o==="import-accounts"){b.postMessage({type:"importAccounts"});return}if(o==="reconnect-hub"){i.runtimeModalOpen=!1,M({type:"refresh"}),b.postMessage({type:"reconnectHub"});return}if(o==="restart-backend"){i.runtimeModalOpen=!1,M({type:"refresh"}),b.postMessage({type:"restartBackend"});return}if(o==="select-color-tag"){const l=n.dataset.color||"";i.editColorTag=i.editColorTag===l?"":l,m();return}if(o==="select-edit-group"){const l=n.dataset.group||"";i.editGroup=i.editGroup===l?"":l,m();return}if(o==="set-group-filter"){i.groupFilter=n.dataset.group||"all",m();return}if(o==="export-quota-analytics"){b.postMessage({type:"exportQuotaAnalytics"});return}if(o==="edit-label"){f()||Le(c);return}if(o==="cancel-label"){_();return}if(o==="save-label"){f()||ee(c);return}if(o==="remove-account"){const l=E(c);l&&!f()&&(i.removeCandidate=l,m());return}if(o==="cancel-remove"){i.removeCandidate=null,m();return}if(o==="confirm-remove"){const l=i.removeCandidate;l&&!f()&&(M({type:"remove",email:l.email}),b.postMessage({type:"removeAccount",email:l.email}));return}if(f())return;if(o==="switch"){const l=E(c);l&&(M({type:"switch",email:l.email}),b.postMessage({type:"switchAccount",account:l}));return}const u={add:"addAccount",save:"saveCurrent",refresh:"refresh",reauth:"reauth",signout:"signout",setWorkspaceAccount:"setWorkspaceAccount",clearWorkspaceAccount:"clearWorkspaceAccount"};u[o]&&(M({type:{add:"add",save:"save",refresh:"refresh",reauth:"reauth",signout:"signout",setWorkspaceAccount:"refresh",clearWorkspaceAccount:"refresh"}[o]}),b.postMessage({type:u[o]}))}),window.addEventListener("keydown",e=>{if(e.key==="Escape"){if(i.runtimeModalOpen){i.runtimeModalOpen=!1,m();return}if(i.settingsOpen){G();return}if(i.editingEmail&&!k){_();return}y&&!k&&(y=null,w&&(clearTimeout(w),w=null),m());return}if(e.key==="Enter"&&i.editingEmail&&!k){const s=document.activeElement;s instanceof HTMLInputElement&&s.dataset.role==="label-input"&&(e.preventDefault(),ee(i.editingEmail))}}),S.addEventListener("click",e=>{const s=e.target;if(!(s instanceof Element))return;const n=s.closest("[data-external-url]");if(!n)return;e.preventDefault();const o=n.dataset.externalUrl;o&&b.postMessage({type:"openExternal",url:o})}),window.addEventListener("message",e=>{const s=e.data;if(!s)return;if(s.type==="openSettings"){te();return}if(s.type!=="state")return;const n=k;if(r=s.state,A(),ae(),n?.type==="remove"){i.removeCandidate=null,x(a("accountRemoved"),"success");return}if(n?.type==="label"){i.editingEmail=null,i.editValue="",x(a("labelUpdated"),"success");return}if(n?.type==="settings"){i.settingsOpen=!1,i.settingsDraft=null,x(a("settingsSaved"),"success");return}if(n&&n.type!=="refresh"){x(a("stateUpdated"),"success");return}m()}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{r.preferences?.theme==="system"&&I()}),window.setInterval(()=>{K()},3e4),m(),b.postMessage({type:"ready"})})();function enhanceSavedQuotaMetrics(b=document){const S=b.querySelectorAll(".saved-account-quota-area");for(const $ of S){const r=$.querySelectorAll([".saved-family-metric",".saved-usage-metric",".saved-quota-metric",".saved-metric-row",".saved-usage-row"].join(","));for(const i of r){const k=i.querySelector(".saved-quota-main"),y=i.querySelector(".saved-quota-value");if(!k||!y)continue;const w=y.textContent?.trim()??"",R=w.match(/(-?\d+(?:\.\d+)?)\s*%/);if(!R)continue;const L=Number(R[1]);if(!Number.isFinite(L))continue;const a=Math.max(0,Math.min(100,L));let t=i.querySelector(":scope > .saved-quota-progress");if(!t){t=document.createElement("div"),t.className="saved-quota-progress",t.setAttribute("aria-hidden","true");const A=document.createElement("span");A.className="saved-quota-progress-fill",t.append(A),k.insertAdjacentElement("afterend",t)}t.style.setProperty("--saved-quota-percent",`${a}%`);let h=i.querySelector(":scope > .saved-quota-remaining");h||(h=document.createElement("div"),h.className="saved-quota-remaining",t.insertAdjacentElement("afterend",h)),h.textContent=`${w} remaining`;const d=i.querySelector([".saved-quota-reset",".saved-usage-reset",".saved-metric-reset"].join(","));if(d){const A=d.textContent?.trim()??"";d.textContent=A.replace(/^Resets\s+in\s+/i,"Reset ").replace(/^Reset\s+in\s+/i,"Reset ")}}}}let savedQuotaEnhancementQueued=!1;function queueSavedQuotaEnhancement(){savedQuotaEnhancementQueued||(savedQuotaEnhancementQueued=!0,queueMicrotask(()=>{savedQuotaEnhancementQueued=!1,enhanceSavedQuotaMetrics(document)}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{enhanceSavedQuotaMetrics(document)},{once:!0}):enhanceSavedQuotaMetrics(document);const savedQuotaObserver=new MutationObserver(()=>{queueSavedQuotaEnhancement()});savedQuotaObserver.observe(document.documentElement,{childList:!0,subtree:!0});

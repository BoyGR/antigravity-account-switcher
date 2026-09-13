"use strict";(()=>{const f=acquireVsCodeApi(),w=document.getElementById("app");if(!w)return;const m=f.getState()||{};let o={loading:!0,current:m.current||null,accounts:Array.isArray(m.accounts)?m.accounts:[],runtime:m.runtime||null,usage:m.usage||null,usageSnapshots:m.usageSnapshots||{},usageError:null,error:null,preferences:{version:1,theme:"vscode",language:"auto",effectiveLanguage:"en",showCurrent:!0,showSaved:!0,showRuntime:!0,autoRefreshIntervalMinutes:5,enableLowQuotaReminder:!0,lowQuotaThresholdPercent:20},meta:{version:"0.5.1",developer:"Boy Gilang Ramadhan",website:"https://boygr.com",iconUri:""}},r={search:typeof m.search=="string"?m.search:"",currentCollapsed:!!m.currentCollapsed,savedCollapsed:!!m.savedCollapsed,runtimeCollapsed:m.runtimeCollapsed!==!1,usageCollapsed:!!m.usageCollapsed,settingsOpen:!1,settingsDraft:null,editingEmail:null,editValue:"",removeCandidate:null,runtimeModalOpen:!1},h=null,b=null,$=null;const C={en:{appName:"Antigravity Account Switcher",accountManager:"Google account manager",settings:"Settings",currentAccount:"Current account",savedAccounts:"Saved accounts",antigravityStatus:"Antigravity status",refresh:"Refresh",connected:"Connected",active:"Active",switch:"Switch",reauth:"Re-auth",signout:"Sign out",addGoogleAccount:"Add Google Account",addGoogleAccountHint:"Sign in or switch account",saveCurrentAccount:"Save Current Account",unavailable:"Antigravity account unavailable",waiting:"Waiting for Antigravity...",checking:"Checking\u2026",loadingAccount:"Loading account\u2026",loadingSavedAccounts:"Loading saved accounts\u2026",updatingQuota:"Updating quota\u2026",checkingAccount:"Checking Antigravity account state\u2026",checkingExtension:"Checking extension status\u2026",checkingBackend:"Checking backend status\u2026",checkingHub:"Checking hub connection\u2026",noSaved:"No saved accounts",noSavedHint:"Save the current Antigravity account or add another Google account.",noMatches:"No matching accounts",noMatchesHint:"Try another label, display name, or email.",searchPlaceholder:"Search accounts",editLabel:"Edit label",save:"Save",cancel:"Cancel",removeLabel:"Clear label",accountActions:"Account actions",appearance:"Appearance",theme:"Theme",language:"Language",layout:"Layout",followVsCode:"Follow VS Code",light:"Light",dark:"Dark",system:"System",automatic:"Auto",english:"English",indonesian:"Bahasa Indonesia",showCurrent:"Show current account",showSaved:"Show saved accounts",showRuntime:"Show Antigravity status",quotaAndReminders:"Quota & Reminders",autoRefreshQuota:"Auto-refresh quota",autoRefreshOff:"Off (Manual only)",every1Minute:"Every 1 minute",every5Minutes:"Every 5 minutes (Recommended)",every15Minutes:"Every 15 minutes",every30Minutes:"Every 30 minutes",every1Hour:"Every 1 hour",lowQuotaReminder:"Low quota notification",reminderThreshold:"Warning threshold",percentRemaining:"% remaining",settingsHint:"Changes apply only after Save.",googleExtension:"Google Extension",officialExtension:"Official Antigravity extension",agyBackend:"AGY Backend",localBackend:"Local Antigravity backend",hub:"Hub",localHub:"Local Hub",hubConnection:"Antigravity hub connection",running:"Running",stopped:"Stopped",ready:"Ready",disconnected:"Unavailable",version:"Version",refreshing:"Refreshing account state...",adding:"Opening Google account flow...",saving:"Saving current account...",reauthenticating:"Re-authenticating...",signingOut:"Signing out...",switching:"Switching account...",updatingLabel:"Updating account label...",savingSettings:"Saving settings...",stateUpdated:"Account state updated.",labelUpdated:"Account label updated.",settingsSaved:"Settings saved.",collapse:"Collapse section",expand:"Expand section",currentAccountLabel:"Current account",developedBy:"Developed by",about:"About",developer:"Developer",website:"Website",removeSavedAccount:"Remove saved account",removeSavedQuestion:"Remove saved account?",removeSavedExplanation:"This only removes local Account Switcher metadata. It does not sign you out, delete your Google account, or remove Google credentials.",remove:"Remove",accountRemoved:"Saved account removed.",usage:"Usage",weeklyLimit:"Weekly limit",fiveHourLimit:"5-hour limit",weeklyShort:"Weekly",fiveHourShort:"5h",updated:"Updated",models:"models",remaining:"remaining",resetsIn:"Resets in",resetDue:"Reset due",lastUpdated:"Last updated",quotaSnapshot:"Quota snapshot",showAllModels:"Show all models",showLess:"Show less",justNow:"just now",ago:"ago",quotaUnavailable:"Usage unavailable",quotaUnavailableHint:"Antigravity did not return current quota information."},id:{appName:"Antigravity Account Switcher",accountManager:"Pengelola akun Google",settings:"Pengaturan",currentAccount:"Akun saat ini",savedAccounts:"Akun tersimpan",antigravityStatus:"Status Antigravity",refresh:"Segarkan",connected:"Terhubung",active:"Aktif",switch:"Ganti",reauth:"Autentikasi ulang",signout:"Keluar",addGoogleAccount:"Tambah Akun Google",addGoogleAccountHint:"Masuk atau ganti akun",saveCurrentAccount:"Simpan Akun Saat Ini",unavailable:"Akun Antigravity tidak tersedia",waiting:"Menunggu Antigravity...",checking:"Memeriksa\u2026",loadingAccount:"Memuat akun\u2026",loadingSavedAccounts:"Memuat akun tersimpan\u2026",updatingQuota:"Memperbarui kuota\u2026",checkingAccount:"Memeriksa status akun Antigravity\u2026",checkingExtension:"Memeriksa status ekstensi\u2026",checkingBackend:"Memeriksa status backend\u2026",checkingHub:"Memeriksa koneksi hub\u2026",noSaved:"Belum ada akun tersimpan",noSavedHint:"Simpan akun Antigravity saat ini atau tambahkan akun Google lain.",noMatches:"Tidak ada akun yang cocok",noMatchesHint:"Coba label, nama, atau email lainnya.",searchPlaceholder:"Cari akun",editLabel:"Edit label",save:"Simpan",cancel:"Batal",removeLabel:"Hapus label",accountActions:"Tindakan akun",appearance:"Tampilan",theme:"Tema",language:"Bahasa",layout:"Tata letak",followVsCode:"Ikuti VS Code",light:"Terang",dark:"Gelap",system:"Sistem",automatic:"Otomatis",english:"English",indonesian:"Bahasa Indonesia",showCurrent:"Tampilkan akun saat ini",showSaved:"Tampilkan akun tersimpan",showRuntime:"Tampilkan status Antigravity",quotaAndReminders:"Kuota & Pengingat",autoRefreshQuota:"Auto-refresh kuota",autoRefreshOff:"Nonaktif (Hanya manual)",every1Minute:"Setiap 1 menit",every5Minutes:"Setiap 5 menit (Disarankan)",every15Minutes:"Setiap 15 menit",every30Minutes:"Setiap 30 menit",every1Hour:"Setiap 1 jam",lowQuotaReminder:"Pemberitahuan kuota menipis",reminderThreshold:"Batas peringatan",percentRemaining:"% tersisa",settingsHint:"Perubahan baru diterapkan setelah Simpan.",googleExtension:"Ekstensi Google",officialExtension:"Ekstensi resmi Antigravity",agyBackend:"Backend AGY",localBackend:"Backend lokal Antigravity",hub:"Hub",localHub:"Hub Lokal",hubConnection:"Koneksi hub Antigravity",running:"Berjalan",stopped:"Berhenti",ready:"Siap",disconnected:"Tidak tersedia",version:"Versi",refreshing:"Menyegarkan status akun...",adding:"Membuka alur akun Google...",saving:"Menyimpan akun saat ini...",reauthenticating:"Melakukan autentikasi ulang...",signingOut:"Keluar dari akun...",switching:"Mengganti akun...",updatingLabel:"Memperbarui label akun...",savingSettings:"Menyimpan pengaturan...",stateUpdated:"Status akun diperbarui.",labelUpdated:"Label akun diperbarui.",settingsSaved:"Pengaturan disimpan.",collapse:"Ciutkan bagian",expand:"Buka bagian",currentAccountLabel:"Akun saat ini",developedBy:"Dikembangkan oleh",about:"Tentang",developer:"Developer",website:"Situs",removeSavedAccount:"Hapus akun tersimpan",removeSavedQuestion:"Hapus akun tersimpan?",removeSavedExplanation:"Ini hanya menghapus metadata lokal Account Switcher. Tindakan ini tidak mengeluarkan akun, menghapus akun Google, atau menghapus kredensial Google.",remove:"Hapus",accountRemoved:"Akun tersimpan dihapus.",usage:"Penggunaan",weeklyLimit:"Batas mingguan",fiveHourLimit:"Batas 5 jam",weeklyShort:"Mingguan",fiveHourShort:"5j",updated:"Diperbarui",models:"model",remaining:"tersisa",resetsIn:"Reset dalam",resetDue:"Waktunya reset",lastUpdated:"Terakhir diperbarui",quotaSnapshot:"Snapshot kuota",showAllModels:"Tampilkan semua model",showLess:"Tampilkan lebih sedikit",justNow:"baru saja",ago:"yang lalu",quotaUnavailable:"Penggunaan tidak tersedia",quotaUnavailableHint:"Antigravity tidak mengembalikan informasi kuota saat ini."}};function M(){return o.preferences?.effectiveLanguage==="id"?"id":"en"}function a(e){return C[M()]?.[e]??C.en[e]??e}function t(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function d(e,n="ui-icon"){const s=`class="${t(n)}" viewBox="0 0 16 16" fill="none" aria-hidden="true"`;return{refresh:`
                <svg ${s}>
                    <path
                        d="M13 4.5V1.8M13 1.8h-2.7M13 1.8A6 6 0 1 0 13.65 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,settings:`
                <svg ${s}>
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
                <svg ${s}>
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
                <svg ${s}>
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
                <svg ${s}>
                    <path
                        d="M4.2 5.2h7.6M6 5.2V3.7h4v1.5M5.1 5.2l.55 7.1h4.7l.55-7.1M6.9 7.1v3.3M9.1 7.1v3.3"
                        stroke="currentColor"
                        stroke-width="1.15"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,plus:`
                <svg ${s}>
                    <path
                        d="M8 3.2v9.6M3.2 8h9.6"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,check:`
                <svg ${s}>
                    <path
                        d="m3.2 8.2 3 3 6.6-6.6"
                        stroke="currentColor"
                        stroke-width="1.45"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,close:`
                <svg ${s}>
                    <path
                        d="m4 4 8 8M12 4l-8 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,chevronDown:`
                <svg ${s}>
                    <path
                        d="m4.2 6.2 3.8 3.6 3.8-3.6"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,chevronRight:`
                <svg ${s}>
                    <path
                        d="m6.2 4.2 3.6 3.8-3.6 3.8"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `}[e]||""}function p(e){return String(e??"").trim().toLowerCase()}function k(){f.setState({search:r.search,currentCollapsed:r.currentCollapsed,savedCollapsed:r.savedCollapsed,runtimeCollapsed:r.runtimeCollapsed,usageCollapsed:r.usageCollapsed,accounts:o.accounts,current:o.current,runtime:o.runtime,usage:o.usage,usageSnapshots:o.usageSnapshots})}function L(e){h=e,g()}function ee(){h=null}function E(e,n="info"){b={message:e,kind:n},$&&clearTimeout($),$=setTimeout(()=>{b=null,$=null,g()},2600),g()}function te(){return h?{refresh:a("refreshing"),add:a("adding"),save:a("saving"),reauth:a("reauthenticating"),signout:a("signingOut"),switch:a("switching"),label:a("updatingLabel"),settings:a("savingSettings"),remove:a("removeSavedAccount")}[h.type]||"Working...":""}function v(){return!!h}function U(e,n){const s=String(e||"").trim()||String(n||"").split("@")[0],i=s.split(/\s+/).filter(Boolean);return i.length>=2?(i[0][0]+i[i.length-1][0]).toUpperCase():s.slice(0,2).toUpperCase()||"A"}function P(){if(!o.current)return null;const e=p(o.current.email);return o.accounts.find(n=>p(n.email)===e)||null}function x(e){const n=p(e);return o.accounts.find(s=>p(s.email)===n)}function B(e){return e.label||e.displayName||e.email}function Q(){const e=r.search.trim().toLowerCase();return e?o.accounts.filter(n=>[n.label,n.displayName,n.email].filter(Boolean).join(" ").toLowerCase().includes(e)):o.accounts}function I(){const e=document.documentElement,n=o.preferences?.theme||"vscode";if(e.removeAttribute("data-ag-theme"),n==="light"||n==="dark"){e.setAttribute("data-ag-theme",n);return}if(n==="system"){const s=window.matchMedia("(prefers-color-scheme: dark)").matches;e.setAttribute("data-ag-theme",s?"dark":"light")}}function ae(){return h?`
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
                            ${t(te())}
                        </span>
                    </div>
                </div>
            `:b?`
            <div
                class="toast-host"
                aria-live="polite"
                aria-atomic="true"
            >
                <div
                    class="toast ${t(b.kind)}"
                    role="status"
                >
                    <span
                        class="toast-symbol"
                        aria-hidden="true"
                    >
                        ${b.kind==="error"?"!":"\u2713"}
                    </span>

                    <span class="toast-message">
                        ${t(b.message)}
                    </span>
                </div>
            </div>
        `:""}function ne(e,n,s,i=""){return`
            <div class="section-header">
                <button
                    type="button"
                    class="section-toggle"
                    data-action="${t(n)}"
                    aria-expanded="${s?"false":"true"}"
                    title="${t(a(s?"expand":"collapse"))}"
                >
                    <span
                        class="chevron"
                        aria-hidden="true"
                    >
                        ${d(s?"chevronRight":"chevronDown")}
                    </span>

                    <span class="section-title">
                        ${t(e)}
                    </span>
                </button>

                <div class="section-tools">
                    ${i}
                </div>
            </div>
        `}function Ce(){return`
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
        `}function N(e){return`
            <div
                class="label-editor"
                data-editor-email="${t(e.email)}"
            >
                <input
                    class="label-input"
                    type="text"
                    value="${t(r.editValue)}"
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
                    ${d("check")}
                </button>

                <button
                    type="button"
                    class="icon-btn compact"
                    data-action="cancel-label"
                    data-email="${t(e.email)}"
                    title="${t(a("cancel"))}"
                    aria-label="${t(a("cancel"))}"
                >
                    ${d("close")}
                </button>
            </div>
        `}function se(e){if(typeof e!="string")return"";try{const n=new URL(e),s=n.hostname.toLowerCase();return n.protocol!=="https:"||!(s==="googleusercontent.com"||s.endsWith(".googleusercontent.com"))?"":n.toString()}catch{return""}}function ie(e,n,s,i=""){const c=se(s),l=`
            <span class="avatar-fallback">
                ${t(U(e,n))}
            </span>
        `;return`
            <div
                class="avatar ${t(i)} ${c?"has-image":""}"
                aria-hidden="true"
            >
                ${l}

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
        `}function O(e){return typeof e!="number"||!Number.isFinite(e)?null:Math.max(0,Math.min(100,e*100))}function j(e){const n=O(e);if(n===null)return"\u2014";const s=Math.round(n*100)/100;return(Number.isInteger(s)?String(s):s.toFixed(2))+"%"}function V(e){const n=Math.max(0,Math.floor(e/6e4));if(n<1)return"<1m";const s=Math.floor(n/1440),i=Math.floor(n%1440/60),c=n%60,l=[];return s>0&&l.push(`${s}d`),i>0&&l.push(`${i}h`),s===0&&c>0&&l.push(`${c}m`),l.slice(0,2).join(" ")||"<1m"}function T(e){if(!e)return"";const n=new Date(e).getTime();if(!Number.isFinite(n))return"";const s=n-Date.now();if(s<=0){const i=new Date(e),c=String(i.getHours()).padStart(2,"0"),l=String(i.getMinutes()).padStart(2,"0"),y=i.toDateString()===new Date().toDateString()?`${c}:${l}`:`${i.getDate()}/${i.getMonth()+1} ${c}:${l}`;return`${a("resetDue")} (${y})`}return`${a("resetsIn")} `+V(s)}function q(e){if(!e)return"";const n=new Date(e).getTime();if(!Number.isFinite(n))return"";const s=Math.max(0,Date.now()-n);return s<6e4?a("justNow"):`${V(s)} `+a("ago")}function oe(e){const n=String(e?.window||"").trim().toLowerCase();return n==="weekly"?a("weeklyLimit"):n==="5h"?a("fiveHourLimit"):e?.displayName||e?.window||"Quota"}function re(e){const n={weekly:0,"5h":1};return[...Array.isArray(e)?e:[]].sort((s,i)=>{const c=String(s?.window||"").toLowerCase(),l=String(i?.window||"").toLowerCase();return(n[c]??99)-(n[l]??99)})}function ce(e){const n=O(e.remainingFraction),s=j(e.remainingFraction),i=T(e.resetTime),c=oe(e),l=t(c).replace(/\s+/,"<br>");return`
            <div
                class="quota-bucket ${e.disabled?"disabled":""}"
                data-window="${t(e.window||"")}"
            >
                <div class="quota-bucket-heading">
                    <span
                        class="quota-window-name"
                        title="${t(e.description||c)}"
                    >
                        ${l}
                    </span>

                    <strong class="quota-percent">
                        ${t(s)}
                    </strong>
                </div>

                <progress
                    class="quota-progress"
                    max="100"
                    value="${n===null?0:n}"
                    aria-label="${t(c)}"
                    aria-valuetext="${t(`${s} ${a("remaining")}`)}"
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
        `}function F(e){const n=String(e?.displayName||"").trim(),s=n.toLowerCase();return s==="gemini models"||s==="gemini"?"Gemini":s==="claude and gpt models"||s==="claude and gpt"?"Claude and GPT":n||"Quota"}function le(e){const n=re(e.buckets),s=F(e),i=String(e?.description||"").trim();return`
            <div class="quota-group">
                <div class="quota-group-heading">
                    <span
                        class="quota-group-title"
                        title="${t(s)}"
                    >
                        ${t(s)}
                    </span>

                    ${i?`
                                <button
                                    type="button"
                                    class="quota-info-button"
                                    title="${t(i)}"
                                    aria-label="${t(`${s}: ${i}`)}"
                                >
                                    i
                                </button>
                            `:""}
                </div>

                <div class="quota-buckets">
                    ${n.map(ce).join("")}
                </div>
            </div>
        `}function ue(){const e=o.usage,n=Array.isArray(e?.groups)?e.groups:[],s=e?.fetchedAt?q(e.fetchedAt):"";return`
            <div class="usage-section">
                <div class="usage-heading">
                    <span class="usage-title">
                        ${t(a("usage"))}
                    </span>

                    ${s?`
                                <span
                                    class="usage-updated"
                                    data-usage-fetched-at="${t(e.fetchedAt)}"
                                    title="${t(`${a("updated")} ${s}`)}"
                                >
                                    ${t(s)}
                                </span>
                            `:""}
                </div>

                ${n.length>0?`
                            <div class="usage-body">
                                ${n.map(le).join("")}
                            </div>
                        `:`
                            <div class="usage-empty secondary-text">
                                ${t(o.usageError||a("quotaUnavailable"))}
                            </div>
                        `}
            </div>
        `}function de(){document.querySelectorAll(".avatar-image").forEach(e=>{e.addEventListener("error",()=>{e.hidden=!0,e.closest(".avatar")?.classList.remove("has-image")},{once:!0})})}function W(){document.querySelectorAll("[data-reset-at]").forEach(e=>{const n=T(e.dataset.resetAt),s=e.dataset.resetPrefix||"";e.textContent=n?s+n:""}),document.querySelectorAll("[data-usage-fetched-at]").forEach(e=>{e.textContent=q(e.dataset.usageFetchedAt)}),document.querySelectorAll("[data-snapshot-fetched-at]").forEach(e=>{e.textContent=q(e.dataset.snapshotFetchedAt)})}function ge(){if(!o.preferences?.showCurrent)return"";const e=!!o.loading,n=`
            <div class="section-header current-static-header">
                <div class="section-static-title">
                    <span class="section-title">
                        ${t(a("currentAccount"))}
                    </span>
                </div>
            </div>
        `;if(!o.current)return`
                <section class="section current-section">
                    ${n}

                    <div
                        class="current-state-panel ${e?"checking":"error"}"
                        role="status"
                        aria-live="polite"
                    >
                        <strong>
                            ${t(a(e?"loadingAccount":"unavailable"))}
                        </strong>

                        <div class="secondary-text">
                            ${t(e?a("checkingAccount"):o.error||a("waiting"))}
                        </div>
                    </div>
                </section>
            `;const s=P(),i=o.current.displayName||s?.displayName||o.current.email,c=s&&p(r.editingEmail)===p(s.email),l=s?.label||a("currentAccountLabel"),u=`
            <span class="connection-state inline ${e?"checking":""}">
                <span class="status-dot"></span>

                ${t(a(e?"checking":"connected"))}
            </span>
        `;return`
            <section class="section current-section">
                ${n}

                <div
                    class="current-panel"
                    aria-label="${t(a("currentAccount"))}"
                >
                    <div class="identity-row current-identity-row">
                        ${ie(i,o.current.email,o.current.profilePictureUrl,"current-avatar")}

                        <div class="identity">
                            <div class="identity-heading">
                                <div
                                    class="identity-name current-name"
                                    title="${t(i)}"
                                >
                                    ${t(i)}
                                </div>
                            </div>

                            <div
                                class="identity-email"
                                title="${t(o.current.email)}"
                            >
                                ${t(o.current.email)}
                            </div>

                            ${s&&c?`
                                        <div class="current-label-editor">
                                            ${N(s)}
                                        </div>

                                        <div class="current-status-row">
                                            ${u}
                                        </div>
                                    `:`
                                        <div class="current-label-row">
                                            <div class="current-label-edit">
                                                <span class="account-label">
                                                    ${t(l)}
                                                </span>

                                                ${s?`
                                                            <button
                                                                type="button"
                                                                class="edit-icon"
                                                                data-action="edit-label"
                                                                data-email="${t(s.email)}"
                                                                title="${t(a("editLabel"))}"
                                                                aria-label="${t(a("editLabel"))}"
                                                                ${v()?"disabled":""}
                                                            >
                                                                ${d("edit")}
                                                            </button>
                                                        `:""}
                                            </div>

                                            ${u}
                                        </div>
                                    `}
                        </div>
                    </div>

                    <div class="action-row">
                        <button
                            type="button"
                            class="btn"
                            data-action="reauth"
                            ${e||v()?"disabled":""}
                        >
                            ${t(a("reauth"))}
                        </button>

                        <button
                            type="button"
                            class="btn subtle-danger"
                            data-action="signout"
                            ${e||v()?"disabled":""}
                        >
                            ${t(a("signout"))}
                        </button>
                    </div>

                    ${ue()}
                </div>
            </section>
        `}function K(e,n){return(Array.isArray(e?.groups)?e.groups:[]).find(i=>n(String(i.displayName||"").toLowerCase()))}function z(e,n){return(Array.isArray(e?.buckets)?e.buckets:[]).find(s=>String(s.window||"").toLowerCase()===n)}function ve(e){return j(e?.remainingFraction)}function Y(e,n){if(!n)return"";const s=z(n,"weekly"),i=z(n,"5h"),c=T(s?.resetTime),l=T(i?.resetTime),u=(y,S,A,R)=>`
                <div class="saved-quota-pair">
                    <div class="saved-usage-metric">
                        <span class="saved-usage-metric-label">
                            ${t(y)}
                        </span>

                        <span class="saved-usage-metric-value">
                            ${t(ve(S))}
                        </span>
                    </div>

                    ${A?`
                                <div
                                    class="saved-quota-reset ${t(R)}"
                                    data-reset-at="${t(S?.resetTime||"")}"
                                    data-reset-prefix=""
                                >
                                    ${t(A)}
                                </div>
                            `:""}
                </div>
            `;return`
            <div class="saved-usage-family-column">
                <div class="saved-usage-family">
                    ${t(e)}
                </div>

                <div class="saved-usage-metrics">
                    ${u(a("weeklyShort"),s,c,"saved-weekly-reset")}

                    ${u(a("fiveHourShort"),i,l,"saved-five-hour-reset")}
                </div>
            </div>
        `}function pe(e){if(!e)return"";const n=K(e,i=>i.includes("gemini")),s=K(e,i=>i.includes("claude")||i.includes("gpt"));return!n&&!s?"":`
            <div class="saved-usage-summary">
                ${Y("Gemini",n)}

                ${Y("Claude + GPT",s)}
            </div>
        `}function me(e){const n=p(o.current?.email),s=!!n&&p(e.email)===n,i=p(r.editingEmail)===p(e.email),c=!!(o.loading&&(!o.accounts||o.accounts.length===0)),l=o.usageSnapshots?.[p(e.email)],u=l?.fetchedAt?q(l.fetchedAt):"";return`
            <article
                class="account-row saved-account-row ${s?"active":""}"
                data-email="${t(e.email)}"
                ${s?'aria-current="true"':""}
            >
                <div class="saved-account-rail">
                    <div
                        class="avatar small"
                        aria-hidden="true"
                    >
                        ${t(U(e.displayName||e.label,e.email))}

                        ${s?`
                                    <span
                                        class="saved-avatar-active-badge"
                                        title="${t(a("active"))}"
                                    >
                                        <span aria-hidden="true">\u2713</span>
                                    </span>
                                `:""}
                    </div>
                    ${s?`
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
                                    ${c||v()?"disabled":""}
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
                    ${i?N(e):`
                                <div class="saved-title-row">
                                    <div
                                        class="identity-name saved-label"
                                        title="${t(B(e))}"
                                    >
                                        ${t(B(e))}
                                    </div>

                                    <div class="saved-title-actions">

                                        <button
                                            type="button"
                                            class="edit-icon"
                                            data-action="edit-label"
                                            data-email="${t(e.email)}"
                                            title="${t(a("editLabel"))}"
                                            aria-label="${t(a("editLabel"))}"
                                            ${v()?"disabled":""}
                                        >
                                            ${d("edit")}
                                        </button>

                                        <button
                                            type="button"
                                            class="icon-btn compact delete-account-btn"
                                            data-action="remove-account"
                                            data-email="${t(e.email)}"
                                            title="${t(a("removeSavedAccount"))}"
                                            aria-label="${t(a("removeSavedAccount"))}"
                                            ${v()?"disabled":""}
                                        >
                                            ${d("trash")}
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

                                    ${u?`
                                                <span
                                                    class="saved-updated"
                                                    data-snapshot-fetched-at="${t(l.fetchedAt)}"
                                                    title="${t(`${a("updated")} ${u}`)}"
                                                >
                                                    ${t(`${a("updated")} ${u}`)}
                                                </span>
                                            `:""}
                                </div>


                            `}


                </div>

                <div class="saved-account-quota-area">
                    ${pe(l)}
                </div>
            </article>
        `}function Z(){if(o.loading&&(!o.accounts||o.accounts.length===0))return`
                <div class="saved-loading-panel" role="status" aria-live="polite">
                    <div class="saved-loading-spinner-row">
                        <span class="loading-spin-icon">${d("refresh")}</span>
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
            `;const e=Q();return o.accounts.length===0?`
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
            `:e.map(me).join("")}function he(){if(!o.preferences?.showSaved)return"";const e=Q().length,n=(o.accounts?.length||0)>3,s=!!o.loading&&(!o.accounts||o.accounts.length===0),i=!!o.loading&&(o.accounts?.length||0)>0,c=s?"\u2026":r.search.trim()?`${e}/${o.accounts.length}`:String(o.accounts.length),l=`
            <div class="saved-header-actions">
                ${i?`
                            <span
                                class="refreshing-indicator"
                                title="${t(a("updatingQuota"))}"
                                aria-label="${t(a("updatingQuota"))}"
                            >
                                <span class="loading-spin-icon">
                                    ${d("refresh")}
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
                    ${v()?"disabled":""}
                >
                    ${d("plus")}
                </button>
            </div>
        `;return`
            <section class="section saved-section">
                ${ne(a("savedAccounts"),"toggle-saved",r.savedCollapsed,l)}

                ${r.savedCollapsed?"":`
                            <div class="saved-body">
                                <div class="saved-controls">
                                    ${(o.accounts?.length||0)>0?`
                                                <div class="search-wrap">
                                                    <span
                                                        class="search-icon"
                                                        aria-hidden="true"
                                                    >
                                                        ${d("search")}
                                                    </span>

                                                    <input
                                                        id="account-search"
                                                        class="search-input"
                                                        type="search"
                                                        value="${t(r.search)}"
                                                        placeholder="${t(a("searchPlaceholder"))}"
                                                        autocomplete="off"
                                                        spellcheck="false"
                                                    >
                                                </div>
                                            `:""}

                                    ${o.current&&!P()?`
                                                <button
                                                    type="button"
                                                    class="btn block"
                                                    data-action="save"
                                                    ${v()?"disabled":""}
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
                                    ${Z()}
                                </div>
                            </div>
                        `}
            </section>
        `}function G(e,n,s,i,c){return`
            <div class="runtime-row">
                <div
                    class="runtime-symbol"
                    aria-hidden="true"
                >
                    ${t(e)}
                </div>

                <div class="runtime-copy">
                    <div class="runtime-name">
                        ${t(n)}
                    </div>

                    <div class="runtime-detail">
                        ${t(s)}
                    </div>
                </div>

                <div
                    class="runtime-state ${t(i)}"
                >
                    <span class="status-dot"></span>
                    ${t(c)}
                </div>
            </div>
        `}function fe(){if(!o.preferences?.showRuntime)return"";const e=!!o.loading,n=o.runtime||{},s=n.extension||{},i=n.process||null,c=n.health||null,l=!!s.installed,u=!!i,y=!!c?.reachable,S=l&&u&&y,A=e?"checking":S?"healthy":"warning",R=a(e?"checking":S?"ready":"disconnected");return`
            <div class="runtime-status-bar">
                <button
                    type="button"
                    class="runtime-status-pill ${t(A)}"
                    data-action="open-runtime-modal"
                    title="${t(a("antigravityStatus"))} \xB7 ${t(R)}"
                    aria-label="${t(a("antigravityStatus"))}"
                >
                    <span class="status-dot"></span>
                    <span class="runtime-status-pill-label">Antigravity:</span>
                    <span class="runtime-status-pill-value">${t(R)}</span>
                </button>
            </div>
        `}function be(){if(!r.runtimeModalOpen)return"";const e=!!o.loading,n=o.runtime||{},s=n.extension||{},i=n.process||null,c=n.health||null,l=!!s.installed,u=!!i,y=!!c?.reachable,S=l&&u&&y,A=e?"checking":S?"healthy":"warning",R=a(e?"checking":S?"ready":"disconnected");return`
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
                            <span class="status-dot ${t(A)}"></span>
                            <h2>${t(a("antigravityStatus"))}</h2>
                        </div>

                        <button
                            type="button"
                            class="icon-btn"
                            data-action="close-runtime-modal"
                            aria-label="${t(a("cancel")||"Close")}"
                            title="${t(a("cancel")||"Close")}"
                        >
                            ${d("close")}
                        </button>
                    </header>

                    <div class="runtime-modal-body">
                        <div class="runtime-panel">
                            ${G("G",a("googleExtension"),e?a("checkingExtension"):s.version?`${a("version")} ${s.version}`:a("officialExtension"),e?"checking":l?"healthy":"error",a(e?"checking":l?"connected":"disconnected"))}

                            ${G("A",a("agyBackend"),e?a("checkingBackend"):n.agyVersion?`${a("version")} ${n.agyVersion}`:a("localBackend"),e?"checking":u?"healthy":"error",a(e?"checking":u?"running":"stopped"))}

                            ${G("H",a("hub"),a(e?"checkingHub":y?"localHub":"hubConnection"),e?"checking":y?"healthy":"error",a(e?"checking":y?"connected":"disconnected"))}
                        </div>
                    </div>
                </section>
            </div>
        `}function $e(){if(!r.settingsOpen||!r.settingsDraft)return"";const e=r.settingsDraft;return`
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

                            ${H("enableLowQuotaReminder",a("lowQuotaReminder"),e.enableLowQuotaReminder)}

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
                        </div>

                        <div class="settings-group">
                            <h3>
                                ${t(a("layout"))}
                            </h3>

                            ${H("showRuntime",a("showRuntime"),e.showRuntime)}

                            ${H("showCurrent",a("showCurrent"),e.showCurrent)}

                            ${H("showSaved",a("showSaved"),e.showSaved)}
                        </div>

                        <div class="settings-group about-group">
                            <h3>
                                ${t(a("about"))}
                            </h3>

                            ${o.meta?.iconUri?`
                            <div style="text-align: center; margin: 8px 0 16px 0;">
                                <img src="${t(o.meta.iconUri)}" width="64" height="64" style="border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); vertical-align: middle;" alt="Logo" />
                            </div>`:""}

                            <div class="about-row">
                                <span>
                                    Antigravity Account Switcher
                                </span>

                                <span>
                                    v${t(o.meta?.version||"0.4.1")}
                                </span>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(a("developer"))}
                                </span>

                                <strong>
                                    ${t(o.meta?.developer||"Boy Gilang Ramadhan")}
                                </strong>
                            </div>

                            <div class="about-row">
                                <span>
                                    ${t(a("website"))}
                                </span>

                                <a
                                    href="${t(o.meta?.website||"https://boygr.com")}"
                                    data-external-url="${t(o.meta?.website||"https://boygr.com")}"
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
                            ${v()?"disabled":""}
                        >
                            ${t(a("save"))}
                        </button>
                    </footer>
                </section>
            </div>
        `}function H(e,n,s){return`
            <label class="check-row">
                <input
                    type="checkbox"
                    data-setting="${t(e)}"
                    ${s?"checked":""}
                >

                <span>
                    ${t(n)}
                </span>
            </label>
        `}function ye(){const e=o.meta||{},n=e.developer||"Boy Gilang Ramadhan",s=e.website||"https://boygr.com",i=e.version||"0.5.1";return`
            <footer class="developer-footer">
                <div class="developer-footer-copy">
                    <span class="footer-prefix">${t(a("developedBy"))}</span>
                    <a
                        href="${t(s)}"
                        data-external-url="${t(s)}"
                        title="${t(s)}"
                        class="developer-link"
                    >
                        ${t(n)}
                    </a>
                </div>

                <span class="footer-version">
                    v${t(i)}
                </span>
            </footer>
        `}function ke(){const e=r.removeCandidate;return e?`
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
                                ${t(B(e))}
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
        `:""}function g(){I(),document.documentElement.lang=M(),w.innerHTML=`
            <div
                class="app"
                aria-busy="${o.loading||v()?"true":"false"}"
            >
                <div class="content-shell">
                    ${ae()}
                    ${fe()}
                    ${ge()}
                    ${he()}
                </div>

                ${ye()}
            </div>

            ${$e()}
            ${ke()}
            ${be()}
        `,de(),W(),r.editingEmail&&window.requestAnimationFrame(()=>{const e=document.querySelector('[data-role="label-input"]');e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))})}function we(){const e=document.getElementById("saved-account-list");e&&(e.innerHTML=Z());const n=document.getElementById("account-count");if(n){const s=Q().length;n.textContent=r.search.trim()?`${s}/${o.accounts.length}`:String(o.accounts.length)}}function Se(e){const n=x(e);n&&(r.editingEmail=n.email,r.editValue=n.label||"",g())}function J(){r.editingEmail=null,r.editValue="",g()}function X(e){const n=x(e);n&&(L({type:"label",email:n.email}),f.postMessage({type:"updateLabel",email:n.email,label:r.editValue}))}function _(){const e=o.preferences||{};r.settingsDraft={theme:e.theme||"vscode",language:e.language||"auto",showCurrent:e.showCurrent!==!1,showSaved:e.showSaved!==!1,showRuntime:e.showRuntime!==!1,autoRefreshIntervalMinutes:typeof e.autoRefreshIntervalMinutes=="number"?e.autoRefreshIntervalMinutes:5,enableLowQuotaReminder:e.enableLowQuotaReminder!==!1,lowQuotaThresholdPercent:typeof e.lowQuotaThresholdPercent=="number"?e.lowQuotaThresholdPercent:20},r.settingsOpen=!0,g()}function D(){r.settingsOpen=!1,r.settingsDraft=null,g()}function Ae(){r.settingsDraft&&(L({type:"settings"}),f.postMessage({type:"saveSettings",preferences:{...r.settingsDraft}}))}w.addEventListener("input",e=>{const n=e.target;if(n instanceof HTMLInputElement&&n.id==="account-search"){r.search=n.value,k(),we();return}n instanceof HTMLInputElement&&n.dataset.role==="label-input"&&(r.editValue=n.value)}),w.addEventListener("change",e=>{const n=e.target;if(!r.settingsDraft||!(n instanceof HTMLInputElement||n instanceof HTMLSelectElement))return;const s=n.dataset.setting;if(s){if(n instanceof HTMLInputElement&&n.type==="checkbox"){r.settingsDraft[s]=n.checked,s==="enableLowQuotaReminder"&&g();return}if(s==="autoRefreshIntervalMinutes"||s==="lowQuotaThresholdPercent"){r.settingsDraft[s]=Number.parseInt(n.value,10);return}r.settingsDraft[s]=n.value}}),w.addEventListener("click",e=>{const n=e.target;if(!(n instanceof Element))return;const s=n.closest("[data-action]");if(!s)return;const i=s.dataset.action,c=s.dataset.email;if(i==="open-settings"){_();return}if(i==="cancel-settings"){D();return}if(i==="settings-backdrop"&&n===s){D();return}if(i==="save-settings"){v()||Ae();return}if(i==="toggle-current"){r.currentCollapsed=!r.currentCollapsed,k(),g();return}if(i==="toggle-saved"){r.savedCollapsed=!r.savedCollapsed,k(),g();return}if(i==="open-runtime-modal"){r.runtimeModalOpen=!0,g();return}if(i==="close-runtime-modal"||i==="runtime-modal-backdrop"&&n===s){r.runtimeModalOpen=!1,g();return}if(i==="edit-label"){v()||Se(c);return}if(i==="cancel-label"){J();return}if(i==="save-label"){v()||X(c);return}if(i==="remove-account"){const u=x(c);u&&!v()&&(r.removeCandidate=u,g());return}if(i==="cancel-remove"){r.removeCandidate=null,g();return}if(i==="confirm-remove"){const u=r.removeCandidate;u&&!v()&&(L({type:"remove",email:u.email}),f.postMessage({type:"removeAccount",email:u.email}));return}if(v())return;if(i==="switch"){const u=x(c);u&&(L({type:"switch",email:u.email}),f.postMessage({type:"switchAccount",account:u}));return}const l={add:"addAccount",save:"saveCurrent",refresh:"refresh",reauth:"reauth",signout:"signout"};l[i]&&(L({type:{add:"add",save:"save",refresh:"refresh",reauth:"reauth",signout:"signout"}[i]}),f.postMessage({type:l[i]}))}),window.addEventListener("keydown",e=>{if(e.key==="Escape"){if(r.runtimeModalOpen){r.runtimeModalOpen=!1,g();return}if(r.settingsOpen){D();return}if(r.editingEmail&&!h){J();return}b&&!h&&(b=null,$&&(clearTimeout($),$=null),g());return}if(e.key==="Enter"&&r.editingEmail&&!h){const n=document.activeElement;n instanceof HTMLInputElement&&n.dataset.role==="label-input"&&(e.preventDefault(),X(r.editingEmail))}}),w.addEventListener("click",e=>{const n=e.target;if(!(n instanceof Element))return;const s=n.closest("[data-external-url]");if(!s)return;e.preventDefault();const i=s.dataset.externalUrl;i&&f.postMessage({type:"openExternal",url:i})}),window.addEventListener("message",e=>{const n=e.data;if(!n)return;if(n.type==="openSettings"){_();return}if(n.type!=="state")return;const s=h;if(o=n.state,k(),ee(),s?.type==="remove"){r.removeCandidate=null,E(a("accountRemoved"),"success");return}if(s?.type==="label"){r.editingEmail=null,r.editValue="",E(a("labelUpdated"),"success");return}if(s?.type==="settings"){r.settingsOpen=!1,r.settingsDraft=null,E(a("settingsSaved"),"success");return}if(s&&s.type!=="refresh"){E(a("stateUpdated"),"success");return}g()}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{o.preferences?.theme==="system"&&I()}),window.setInterval(()=>{W()},3e4),g(),f.postMessage({type:"ready"})})();function enhanceSavedQuotaMetrics(f=document){const w=f.querySelectorAll(".saved-account-quota-area");for(const m of w){const o=m.querySelectorAll([".saved-family-metric",".saved-usage-metric",".saved-quota-metric",".saved-metric-row",".saved-usage-row"].join(","));for(const r of o){const h=r.querySelector(".saved-quota-main"),b=r.querySelector(".saved-quota-value");if(!h||!b)continue;const $=b.textContent?.trim()??"",C=$.match(/(-?\d+(?:\.\d+)?)\s*%/);if(!C)continue;const M=Number(C[1]);if(!Number.isFinite(M))continue;const a=Math.max(0,Math.min(100,M));let t=r.querySelector(":scope > .saved-quota-progress");if(!t){t=document.createElement("div"),t.className="saved-quota-progress",t.setAttribute("aria-hidden","true");const k=document.createElement("span");k.className="saved-quota-progress-fill",t.append(k),h.insertAdjacentElement("afterend",t)}t.style.setProperty("--saved-quota-percent",`${a}%`);let d=r.querySelector(":scope > .saved-quota-remaining");d||(d=document.createElement("div"),d.className="saved-quota-remaining",t.insertAdjacentElement("afterend",d)),d.textContent=`${$} remaining`;const p=r.querySelector([".saved-quota-reset",".saved-usage-reset",".saved-metric-reset"].join(","));if(p){const k=p.textContent?.trim()??"";p.textContent=k.replace(/^Resets\s+in\s+/i,"Reset ").replace(/^Reset\s+in\s+/i,"Reset ")}}}}let savedQuotaEnhancementQueued=!1;function queueSavedQuotaEnhancement(){savedQuotaEnhancementQueued||(savedQuotaEnhancementQueued=!0,queueMicrotask(()=>{savedQuotaEnhancementQueued=!1,enhanceSavedQuotaMetrics(document)}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{enhanceSavedQuotaMetrics(document)},{once:!0}):enhanceSavedQuotaMetrics(document);const savedQuotaObserver=new MutationObserver(()=>{queueSavedQuotaEnhancement()});savedQuotaObserver.observe(document.documentElement,{childList:!0,subtree:!0});

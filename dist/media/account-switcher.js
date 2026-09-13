"use strict";(()=>{const h=acquireVsCodeApi(),y=document.getElementById("app");if(!y)return;const k=h.getState()||{};let r={loading:!0,current:null,accounts:[],runtime:null,usage:null,usageSnapshots:{},usageError:null,error:null,preferences:{version:1,theme:"vscode",language:"auto",effectiveLanguage:"en",showCurrent:!0,showSaved:!0,showRuntime:!0,autoRefreshIntervalMinutes:5,enableLowQuotaReminder:!0,lowQuotaThresholdPercent:20},meta:{version:"0.4.0",developer:"Boy Gilang Ramadhan",website:"https://boygr.com",iconUri:""}},o={search:typeof k.search=="string"?k.search:"",currentCollapsed:!!k.currentCollapsed,savedCollapsed:!!k.savedCollapsed,runtimeCollapsed:k.runtimeCollapsed!==!1,usageCollapsed:!!k.usageCollapsed,settingsOpen:!1,settingsDraft:null,editingEmail:null,editValue:"",removeCandidate:null,runtimeModalOpen:!1},p=null,f=null,b=null;const C={en:{appName:"Antigravity Account Switcher",accountManager:"Google account manager",settings:"Settings",currentAccount:"Current account",savedAccounts:"Saved accounts",antigravityStatus:"Antigravity status",refresh:"Refresh",connected:"Connected",active:"Active",switch:"Switch",reauth:"Re-auth",signout:"Sign out",addGoogleAccount:"Add Google Account",addGoogleAccountHint:"Sign in or switch account",saveCurrentAccount:"Save Current Account",unavailable:"Antigravity account unavailable",waiting:"Waiting for Antigravity...",checking:"Checking\u2026",loadingAccount:"Loading account\u2026",checkingAccount:"Checking Antigravity account state\u2026",checkingExtension:"Checking extension status\u2026",checkingBackend:"Checking backend status\u2026",checkingHub:"Checking hub connection\u2026",noSaved:"No saved accounts",noSavedHint:"Save the current Antigravity account or add another Google account.",noMatches:"No matching accounts",noMatchesHint:"Try another label, display name, or email.",searchPlaceholder:"Search accounts",editLabel:"Edit label",save:"Save",cancel:"Cancel",removeLabel:"Clear label",accountActions:"Account actions",appearance:"Appearance",theme:"Theme",language:"Language",layout:"Layout",followVsCode:"Follow VS Code",light:"Light",dark:"Dark",system:"System",automatic:"Auto",english:"English",indonesian:"Bahasa Indonesia",showCurrent:"Show current account",showSaved:"Show saved accounts",showRuntime:"Show Antigravity status",quotaAndReminders:"Quota & Reminders",autoRefreshQuota:"Auto-refresh quota",autoRefreshOff:"Off (Manual only)",every1Minute:"Every 1 minute",every5Minutes:"Every 5 minutes (Recommended)",every15Minutes:"Every 15 minutes",every30Minutes:"Every 30 minutes",every1Hour:"Every 1 hour",lowQuotaReminder:"Low quota notification",reminderThreshold:"Warning threshold",percentRemaining:"% remaining",settingsHint:"Changes apply only after Save.",googleExtension:"Google Extension",officialExtension:"Official Antigravity extension",agyBackend:"AGY Backend",localBackend:"Local Antigravity backend",hub:"Hub",localHub:"Local Hub",hubConnection:"Antigravity hub connection",running:"Running",stopped:"Stopped",ready:"Ready",disconnected:"Unavailable",version:"Version",refreshing:"Refreshing account state...",adding:"Opening Google account flow...",saving:"Saving current account...",reauthenticating:"Re-authenticating...",signingOut:"Signing out...",switching:"Switching account...",updatingLabel:"Updating account label...",savingSettings:"Saving settings...",stateUpdated:"Account state updated.",labelUpdated:"Account label updated.",settingsSaved:"Settings saved.",collapse:"Collapse section",expand:"Expand section",currentAccountLabel:"Current account",developedBy:"Developed by",about:"About",developer:"Developer",website:"Website",removeSavedAccount:"Remove saved account",removeSavedQuestion:"Remove saved account?",removeSavedExplanation:"This only removes local Account Switcher metadata. It does not sign you out, delete your Google account, or remove Google credentials.",remove:"Remove",accountRemoved:"Saved account removed.",usage:"Usage",weeklyLimit:"Weekly limit",fiveHourLimit:"5-hour limit",weeklyShort:"Weekly",fiveHourShort:"5h",updated:"Updated",models:"models",remaining:"remaining",resetsIn:"Resets in",resetDue:"Reset due",lastUpdated:"Last updated",quotaSnapshot:"Quota snapshot",showAllModels:"Show all models",showLess:"Show less",justNow:"just now",ago:"ago",quotaUnavailable:"Usage unavailable",quotaUnavailableHint:"Antigravity did not return current quota information."},id:{appName:"Antigravity Account Switcher",accountManager:"Pengelola akun Google",settings:"Pengaturan",currentAccount:"Akun saat ini",savedAccounts:"Akun tersimpan",antigravityStatus:"Status Antigravity",refresh:"Segarkan",connected:"Terhubung",active:"Aktif",switch:"Ganti",reauth:"Autentikasi ulang",signout:"Keluar",addGoogleAccount:"Tambah Akun Google",addGoogleAccountHint:"Masuk atau ganti akun",saveCurrentAccount:"Simpan Akun Saat Ini",unavailable:"Akun Antigravity tidak tersedia",waiting:"Menunggu Antigravity...",checking:"Memeriksa\u2026",loadingAccount:"Memuat akun\u2026",checkingAccount:"Memeriksa status akun Antigravity\u2026",checkingExtension:"Memeriksa status ekstensi\u2026",checkingBackend:"Memeriksa status backend\u2026",checkingHub:"Memeriksa koneksi hub\u2026",noSaved:"Belum ada akun tersimpan",noSavedHint:"Simpan akun Antigravity saat ini atau tambahkan akun Google lain.",noMatches:"Tidak ada akun yang cocok",noMatchesHint:"Coba label, nama, atau email lainnya.",searchPlaceholder:"Cari akun",editLabel:"Edit label",save:"Simpan",cancel:"Batal",removeLabel:"Hapus label",accountActions:"Tindakan akun",appearance:"Tampilan",theme:"Tema",language:"Bahasa",layout:"Tata letak",followVsCode:"Ikuti VS Code",light:"Terang",dark:"Gelap",system:"Sistem",automatic:"Otomatis",english:"English",indonesian:"Bahasa Indonesia",showCurrent:"Tampilkan akun saat ini",showSaved:"Tampilkan akun tersimpan",showRuntime:"Tampilkan status Antigravity",quotaAndReminders:"Kuota & Pengingat",autoRefreshQuota:"Auto-refresh kuota",autoRefreshOff:"Nonaktif (Hanya manual)",every1Minute:"Setiap 1 menit",every5Minutes:"Setiap 5 menit (Disarankan)",every15Minutes:"Setiap 15 menit",every30Minutes:"Setiap 30 menit",every1Hour:"Setiap 1 jam",lowQuotaReminder:"Pemberitahuan kuota menipis",reminderThreshold:"Batas peringatan",percentRemaining:"% tersisa",settingsHint:"Perubahan baru diterapkan setelah Simpan.",googleExtension:"Ekstensi Google",officialExtension:"Ekstensi resmi Antigravity",agyBackend:"Backend AGY",localBackend:"Backend lokal Antigravity",hub:"Hub",localHub:"Hub Lokal",hubConnection:"Koneksi hub Antigravity",running:"Berjalan",stopped:"Berhenti",ready:"Siap",disconnected:"Tidak tersedia",version:"Versi",refreshing:"Menyegarkan status akun...",adding:"Membuka alur akun Google...",saving:"Menyimpan akun saat ini...",reauthenticating:"Melakukan autentikasi ulang...",signingOut:"Keluar dari akun...",switching:"Mengganti akun...",updatingLabel:"Memperbarui label akun...",savingSettings:"Menyimpan pengaturan...",stateUpdated:"Status akun diperbarui.",labelUpdated:"Label akun diperbarui.",settingsSaved:"Pengaturan disimpan.",collapse:"Ciutkan bagian",expand:"Buka bagian",currentAccountLabel:"Akun saat ini",developedBy:"Dikembangkan oleh",about:"Tentang",developer:"Developer",website:"Situs",removeSavedAccount:"Hapus akun tersimpan",removeSavedQuestion:"Hapus akun tersimpan?",removeSavedExplanation:"Ini hanya menghapus metadata lokal Account Switcher. Tindakan ini tidak mengeluarkan akun, menghapus akun Google, atau menghapus kredensial Google.",remove:"Hapus",accountRemoved:"Akun tersimpan dihapus.",usage:"Penggunaan",weeklyLimit:"Batas mingguan",fiveHourLimit:"Batas 5 jam",weeklyShort:"Mingguan",fiveHourShort:"5j",updated:"Diperbarui",models:"model",remaining:"tersisa",resetsIn:"Reset dalam",resetDue:"Waktunya reset",lastUpdated:"Terakhir diperbarui",quotaSnapshot:"Snapshot kuota",showAllModels:"Tampilkan semua model",showLess:"Tampilkan lebih sedikit",justNow:"baru saja",ago:"yang lalu",quotaUnavailable:"Penggunaan tidak tersedia",quotaUnavailableHint:"Antigravity tidak mengembalikan informasi kuota saat ini."}};function M(){return r.preferences?.effectiveLanguage==="id"?"id":"en"}function a(e){return C[M()]?.[e]??C.en[e]??e}function t(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function g(e,n="ui-icon"){const i=`class="${t(n)}" viewBox="0 0 16 16" fill="none" aria-hidden="true"`;return{refresh:`
                <svg ${i}>
                    <path
                        d="M13 4.5V1.8M13 1.8h-2.7M13 1.8A6 6 0 1 0 13.65 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,settings:`
                <svg ${i}>
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
                <svg ${i}>
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
                <svg ${i}>
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
                <svg ${i}>
                    <path
                        d="M4.2 5.2h7.6M6 5.2V3.7h4v1.5M5.1 5.2l.55 7.1h4.7l.55-7.1M6.9 7.1v3.3M9.1 7.1v3.3"
                        stroke="currentColor"
                        stroke-width="1.15"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,plus:`
                <svg ${i}>
                    <path
                        d="M8 3.2v9.6M3.2 8h9.6"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,check:`
                <svg ${i}>
                    <path
                        d="m3.2 8.2 3 3 6.6-6.6"
                        stroke="currentColor"
                        stroke-width="1.45"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,close:`
                <svg ${i}>
                    <path
                        d="m4 4 8 8M12 4l-8 8"
                        stroke="currentColor"
                        stroke-width="1.35"
                        stroke-linecap="round"
                    />
                </svg>
            `,chevronDown:`
                <svg ${i}>
                    <path
                        d="m4.2 6.2 3.8 3.6 3.8-3.6"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `,chevronRight:`
                <svg ${i}>
                    <path
                        d="m6.2 4.2 3.6 3.8-3.6 3.8"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            `}[e]||""}function m(e){return String(e??"").trim().toLowerCase()}function w(){h.setState({search:o.search,currentCollapsed:o.currentCollapsed,savedCollapsed:o.savedCollapsed,runtimeCollapsed:o.runtimeCollapsed,usageCollapsed:o.usageCollapsed})}function L(e){p=e,d()}function ee(){p=null}function E(e,n="info"){f={message:e,kind:n},b&&clearTimeout(b),b=setTimeout(()=>{f=null,b=null,d()},2600),d()}function te(){return p?{refresh:a("refreshing"),add:a("adding"),save:a("saving"),reauth:a("reauthenticating"),signout:a("signingOut"),switch:a("switching"),label:a("updatingLabel"),settings:a("savingSettings"),remove:a("removeSavedAccount")}[p.type]||"Working...":""}function v(){return!!p}function P(e,n){const i=String(e||"").trim()||String(n||"").split("@")[0],s=i.split(/\s+/).filter(Boolean);return s.length>=2?(s[0][0]+s[s.length-1][0]).toUpperCase():i.slice(0,2).toUpperCase()||"A"}function U(){if(!r.current)return null;const e=m(r.current.email);return r.accounts.find(n=>m(n.email)===e)||null}function x(e){const n=m(e);return r.accounts.find(i=>m(i.email)===n)}function B(e){return e.label||e.displayName||e.email}function Q(){const e=o.search.trim().toLowerCase();return e?r.accounts.filter(n=>[n.label,n.displayName,n.email].filter(Boolean).join(" ").toLowerCase().includes(e)):r.accounts}function I(){const e=document.documentElement,n=r.preferences?.theme||"vscode";if(e.removeAttribute("data-ag-theme"),n==="light"||n==="dark"){e.setAttribute("data-ag-theme",n);return}if(n==="system"){const i=window.matchMedia("(prefers-color-scheme: dark)").matches;e.setAttribute("data-ag-theme",i?"dark":"light")}}function ae(){return p?`
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
            `:f?`
            <div
                class="toast-host"
                aria-live="polite"
                aria-atomic="true"
            >
                <div
                    class="toast ${t(f.kind)}"
                    role="status"
                >
                    <span
                        class="toast-symbol"
                        aria-hidden="true"
                    >
                        ${f.kind==="error"?"!":"\u2713"}
                    </span>

                    <span class="toast-message">
                        ${t(f.message)}
                    </span>
                </div>
            </div>
        `:""}function ne(e,n,i,s=""){return`
            <div class="section-header">
                <button
                    type="button"
                    class="section-toggle"
                    data-action="${t(n)}"
                    aria-expanded="${i?"false":"true"}"
                    title="${t(a(i?"expand":"collapse"))}"
                >
                    <span
                        class="chevron"
                        aria-hidden="true"
                    >
                        ${g(i?"chevronRight":"chevronDown")}
                    </span>

                    <span class="section-title">
                        ${t(e)}
                    </span>
                </button>

                <div class="section-tools">
                    ${s}
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
                    ${g("check")}
                </button>

                <button
                    type="button"
                    class="icon-btn compact"
                    data-action="cancel-label"
                    data-email="${t(e.email)}"
                    title="${t(a("cancel"))}"
                    aria-label="${t(a("cancel"))}"
                >
                    ${g("close")}
                </button>
            </div>
        `}function ie(e){if(typeof e!="string")return"";try{const n=new URL(e),i=n.hostname.toLowerCase();return n.protocol!=="https:"||!(i==="googleusercontent.com"||i.endsWith(".googleusercontent.com"))?"":n.toString()}catch{return""}}function se(e,n,i,s=""){const l=ie(i),c=`
            <span class="avatar-fallback">
                ${t(P(e,n))}
            </span>
        `;return`
            <div
                class="avatar ${t(s)} ${l?"has-image":""}"
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
                            >
                        `:""}
            </div>
        `}function O(e){return typeof e!="number"||!Number.isFinite(e)?null:Math.max(0,Math.min(100,e*100))}function j(e){const n=O(e);if(n===null)return"\u2014";const i=Math.round(n*100)/100;return(Number.isInteger(i)?String(i):i.toFixed(2))+"%"}function V(e){const n=Math.max(0,Math.floor(e/6e4));if(n<1)return"<1m";const i=Math.floor(n/1440),s=Math.floor(n%1440/60),l=n%60,c=[];return i>0&&c.push(`${i}d`),s>0&&c.push(`${s}h`),i===0&&l>0&&c.push(`${l}m`),c.slice(0,2).join(" ")||"<1m"}function T(e){if(!e)return"";const n=new Date(e).getTime();if(!Number.isFinite(n))return"";const i=n-Date.now();if(i<=0){const s=new Date(e),l=String(s.getHours()).padStart(2,"0"),c=String(s.getMinutes()).padStart(2,"0"),$=s.toDateString()===new Date().toDateString()?`${l}:${c}`:`${s.getDate()}/${s.getMonth()+1} ${l}:${c}`;return`${a("resetDue")} (${$})`}return`${a("resetsIn")} `+V(i)}function q(e){if(!e)return"";const n=new Date(e).getTime();if(!Number.isFinite(n))return"";const i=Math.max(0,Date.now()-n);return i<6e4?a("justNow"):`${V(i)} `+a("ago")}function oe(e){const n=String(e?.window||"").trim().toLowerCase();return n==="weekly"?a("weeklyLimit"):n==="5h"?a("fiveHourLimit"):e?.displayName||e?.window||"Quota"}function re(e){const n={weekly:0,"5h":1};return[...Array.isArray(e)?e:[]].sort((i,s)=>{const l=String(i?.window||"").toLowerCase(),c=String(s?.window||"").toLowerCase();return(n[l]??99)-(n[c]??99)})}function le(e){const n=O(e.remainingFraction),i=j(e.remainingFraction),s=T(e.resetTime),l=oe(e),c=t(l).replace(/\s+/,"<br>");return`
            <div
                class="quota-bucket ${e.disabled?"disabled":""}"
                data-window="${t(e.window||"")}"
            >
                <div class="quota-bucket-heading">
                    <span
                        class="quota-window-name"
                        title="${t(e.description||l)}"
                    >
                        ${c}
                    </span>

                    <strong class="quota-percent">
                        ${t(i)}
                    </strong>
                </div>

                <progress
                    class="quota-progress"
                    max="100"
                    value="${n===null?0:n}"
                    aria-label="${t(l)}"
                    aria-valuetext="${t(`${i} ${a("remaining")}`)}"
                ></progress>

                <div class="quota-bucket-meta">
                    ${s?`
                                <span
                                    class="quota-reset"
                                    data-reset-at="${t(e.resetTime||"")}"
                                >
                                    ${t(s)}
                                </span>
                            `:""}
                </div>
            </div>
        `}function F(e){const n=String(e?.displayName||"").trim(),i=n.toLowerCase();return i==="gemini models"||i==="gemini"?"Gemini":i==="claude and gpt models"||i==="claude and gpt"?"Claude and GPT":n||"Quota"}function ce(e){const n=re(e.buckets),i=F(e),s=String(e?.description||"").trim();return`
            <div class="quota-group">
                <div class="quota-group-heading">
                    <span
                        class="quota-group-title"
                        title="${t(i)}"
                    >
                        ${t(i)}
                    </span>

                    ${s?`
                                <button
                                    type="button"
                                    class="quota-info-button"
                                    title="${t(s)}"
                                    aria-label="${t(`${i}: ${s}`)}"
                                >
                                    i
                                </button>
                            `:""}
                </div>

                <div class="quota-buckets">
                    ${n.map(le).join("")}
                </div>
            </div>
        `}function ue(){const e=r.usage,n=Array.isArray(e?.groups)?e.groups:[],i=e?.fetchedAt?q(e.fetchedAt):"";return`
            <div class="usage-section">
                <div class="usage-heading">
                    <span class="usage-title">
                        ${t(a("usage"))}
                    </span>

                    ${i?`
                                <span
                                    class="usage-updated"
                                    data-usage-fetched-at="${t(e.fetchedAt)}"
                                    title="${t(`${a("updated")} ${i}`)}"
                                >
                                    ${t(i)}
                                </span>
                            `:""}
                </div>

                ${n.length>0?`
                            <div class="usage-body">
                                ${n.map(ce).join("")}
                            </div>
                        `:`
                            <div class="usage-empty secondary-text">
                                ${t(r.usageError||a("quotaUnavailable"))}
                            </div>
                        `}
            </div>
        `}function de(){document.querySelectorAll(".avatar-image").forEach(e=>{e.addEventListener("error",()=>{e.hidden=!0,e.closest(".avatar")?.classList.remove("has-image")},{once:!0})})}function W(){document.querySelectorAll("[data-reset-at]").forEach(e=>{const n=T(e.dataset.resetAt),i=e.dataset.resetPrefix||"";e.textContent=n?i+n:""}),document.querySelectorAll("[data-usage-fetched-at]").forEach(e=>{e.textContent=q(e.dataset.usageFetchedAt)}),document.querySelectorAll("[data-snapshot-fetched-at]").forEach(e=>{e.textContent=q(e.dataset.snapshotFetchedAt)})}function ge(){if(!r.preferences?.showCurrent)return"";const e=!!r.loading,n=`
            <div class="section-header current-static-header">
                <div class="section-static-title">
                    <span class="section-title">
                        ${t(a("currentAccount"))}
                    </span>
                </div>
            </div>
        `;if(!r.current)return`
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
                            ${t(e?a("checkingAccount"):r.error||a("waiting"))}
                        </div>
                    </div>
                </section>
            `;const i=U(),s=r.current.displayName||i?.displayName||r.current.email,l=i&&m(o.editingEmail)===m(i.email),c=i?.label||a("currentAccountLabel"),u=`
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
                        ${se(s,r.current.email,r.current.profilePictureUrl,"current-avatar")}

                        <div class="identity">
                            <div class="identity-heading">
                                <div
                                    class="identity-name current-name"
                                    title="${t(s)}"
                                >
                                    ${t(s)}
                                </div>
                            </div>

                            <div
                                class="identity-email"
                                title="${t(r.current.email)}"
                            >
                                ${t(r.current.email)}
                            </div>

                            ${i&&l?`
                                        <div class="current-label-editor">
                                            ${N(i)}
                                        </div>

                                        <div class="current-status-row">
                                            ${u}
                                        </div>
                                    `:`
                                        <div class="current-label-row">
                                            <div class="current-label-edit">
                                                <span class="account-label">
                                                    ${t(c)}
                                                </span>

                                                ${i?`
                                                            <button
                                                                type="button"
                                                                class="edit-icon"
                                                                data-action="edit-label"
                                                                data-email="${t(i.email)}"
                                                                title="${t(a("editLabel"))}"
                                                                aria-label="${t(a("editLabel"))}"
                                                                ${v()?"disabled":""}
                                                            >
                                                                ${g("edit")}
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
        `}function K(e,n){return(Array.isArray(e?.groups)?e.groups:[]).find(s=>n(String(s.displayName||"").toLowerCase()))}function z(e,n){return(Array.isArray(e?.buckets)?e.buckets:[]).find(i=>String(i.window||"").toLowerCase()===n)}function ve(e){return j(e?.remainingFraction)}function Y(e,n){if(!n)return"";const i=z(n,"weekly"),s=z(n,"5h"),l=T(i?.resetTime),c=T(s?.resetTime),u=($,S,A,R)=>`
                <div class="saved-quota-pair">
                    <div class="saved-usage-metric">
                        <span class="saved-usage-metric-label">
                            ${t($)}
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
                    ${u(a("weeklyShort"),i,l,"saved-weekly-reset")}

                    ${u(a("fiveHourShort"),s,c,"saved-five-hour-reset")}
                </div>
            </div>
        `}function me(e){if(!e)return"";const n=K(e,s=>s.includes("gemini")),i=K(e,s=>s.includes("claude")||s.includes("gpt"));return!n&&!i?"":`
            <div class="saved-usage-summary">
                ${Y("Gemini",n)}

                ${Y("Claude + GPT",i)}
            </div>
        `}function pe(e){const n=m(r.current?.email),i=!!n&&m(e.email)===n,s=m(o.editingEmail)===m(e.email),l=!!r.loading,c=r.usageSnapshots?.[m(e.email)],u=c?.fetchedAt?q(c.fetchedAt):"";return`
            <article
                class="account-row saved-account-row ${i?"active":""}"
                data-email="${t(e.email)}"
                ${i?'aria-current="true"':""}
            >
                <div class="saved-account-rail">
                    <div
                        class="avatar small"
                        aria-hidden="true"
                    >
                        ${t(P(e.displayName||e.label,e.email))}

                        ${i?`
                                    <span
                                        class="saved-avatar-active-badge"
                                        title="${t(a("active"))}"
                                    >
                                        <span aria-hidden="true">\u2713</span>
                                    </span>
                                `:""}
                    </div>
                    ${i?`
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
                                    ${l||v()?"disabled":""}
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
                    ${s?N(e):`
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
                                            ${g("edit")}
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
                                            ${g("trash")}
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
                                                    data-snapshot-fetched-at="${t(c.fetchedAt)}"
                                                    title="${t(`${a("updated")} ${u}`)}"
                                                >
                                                    ${t(`${a("updated")} ${u}`)}
                                                </span>
                                            `:""}
                                </div>


                            `}


                </div>

                <div class="saved-account-quota-area">
                    ${me(c)}
                </div>
            </article>
        `}function Z(){const e=Q();return r.accounts.length===0?`
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
            `:e.map(pe).join("")}function he(){if(!r.preferences?.showSaved||r.loading)return"";const e=Q().length,n=(r.accounts?.length||0)>3,i=o.search.trim()?`${e}/${r.accounts.length}`:String(r.accounts.length),s=`
            <div class="saved-header-actions">
                <span
                    id="account-count"
                    class="count"
                    title="${t(a("savedAccounts"))}"
                >
                    ${t(i)}
                </span>

                <button
                    type="button"
                    class="icon-btn compact saved-add-btn"
                    data-action="add"
                    title="${t(a("addGoogleAccount"))}"
                    aria-label="${t(a("addGoogleAccount"))}"
                    ${v()?"disabled":""}
                >
                    ${g("plus")}
                </button>
            </div>
        `;return`
            <section class="section saved-section">
                ${ne(a("savedAccounts"),"toggle-saved",o.savedCollapsed,s)}

                ${o.savedCollapsed?"":`
                            <div class="saved-body">
                                <div class="saved-controls">
                                    ${(r.accounts?.length||0)>0?`
                                                <div class="search-wrap">
                                                    <span
                                                        class="search-icon"
                                                        aria-hidden="true"
                                                    >
                                                        ${g("search")}
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
                                                </div>
                                            `:""}

                                    ${r.current&&!U()?`
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
        `}function G(e,n,i,s,l){return`
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
                        ${t(i)}
                    </div>
                </div>

                <div
                    class="runtime-state ${t(s)}"
                >
                    <span class="status-dot"></span>
                    ${t(l)}
                </div>
            </div>
        `}function fe(){if(!r.preferences?.showRuntime)return"";const e=!!r.loading,n=r.runtime||{},i=n.extension||{},s=n.process||null,l=n.health||null,c=!!i.installed,u=!!s,$=!!l?.reachable,S=c&&u&&$,A=e?"checking":S?"healthy":"warning",R=a(e?"checking":S?"ready":"disconnected");return`
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
        `}function be(){if(!o.runtimeModalOpen)return"";const e=!!r.loading,n=r.runtime||{},i=n.extension||{},s=n.process||null,l=n.health||null,c=!!i.installed,u=!!s,$=!!l?.reachable,S=c&&u&&$,A=e?"checking":S?"healthy":"warning",R=a(e?"checking":S?"ready":"disconnected");return`
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
                            ${g("close")}
                        </button>
                    </header>

                    <div class="runtime-modal-body">
                        <div class="runtime-panel">
                            ${G("G",a("googleExtension"),e?a("checkingExtension"):i.version?`${a("version")} ${i.version}`:a("officialExtension"),e?"checking":c?"healthy":"error",a(e?"checking":c?"connected":"disconnected"))}

                            ${G("A",a("agyBackend"),e?a("checkingBackend"):n.agyVersion?`${a("version")} ${n.agyVersion}`:a("localBackend"),e?"checking":u?"healthy":"error",a(e?"checking":u?"running":"stopped"))}

                            ${G("H",a("hub"),a(e?"checkingHub":$?"localHub":"hubConnection"),e?"checking":$?"healthy":"error",a(e?"checking":$?"connected":"disconnected"))}
                        </div>
                    </div>
                </section>
            </div>
        `}function $e(){if(!o.settingsOpen||!o.settingsDraft)return"";const e=o.settingsDraft;return`
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

                            ${r.meta?.iconUri?`
                            <div style="text-align: center; margin: 8px 0 16px 0;">
                                <img src="${t(r.meta.iconUri)}" width="64" height="64" style="border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); vertical-align: middle;" alt="Logo" />
                            </div>`:""}

                            <div class="about-row">
                                <span>
                                    Antigravity Account Switcher
                                </span>

                                <span>
                                    v${t(r.meta?.version||"0.4.0")}
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
                            ${v()?"disabled":""}
                        >
                            ${t(a("save"))}
                        </button>
                    </footer>
                </section>
            </div>
        `}function H(e,n,i){return`
            <label class="check-row">
                <input
                    type="checkbox"
                    data-setting="${t(e)}"
                    ${i?"checked":""}
                >

                <span>
                    ${t(n)}
                </span>
            </label>
        `}function ye(){const e=r.meta||{},n=e.developer||"Boy Gilang Ramadhan",i=e.website||"https://boygr.com",s=e.version||"0.4.0";return`
            <footer class="developer-footer">
                <div class="developer-footer-copy">
                    <span class="footer-prefix">${t(a("developedBy"))}</span>
                    <a
                        href="${t(i)}"
                        data-external-url="${t(i)}"
                        title="${t(i)}"
                        class="developer-link"
                    >
                        ${t(n)}
                    </a>
                </div>

                <span class="footer-version">
                    v${t(s)}
                </span>
            </footer>
        `}function ke(){const e=o.removeCandidate;return e?`
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
        `:""}function d(){I(),document.documentElement.lang=M(),y.innerHTML=`
            <div
                class="app"
                aria-busy="${r.loading||v()?"true":"false"}"
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
        `,de(),W(),o.editingEmail&&window.requestAnimationFrame(()=>{const e=document.querySelector('[data-role="label-input"]');e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))})}function we(){const e=document.getElementById("saved-account-list");e&&(e.innerHTML=Z());const n=document.getElementById("account-count");if(n){const i=Q().length;n.textContent=o.search.trim()?`${i}/${r.accounts.length}`:String(r.accounts.length)}}function Se(e){const n=x(e);n&&(o.editingEmail=n.email,o.editValue=n.label||"",d())}function J(){o.editingEmail=null,o.editValue="",d()}function X(e){const n=x(e);n&&(L({type:"label",email:n.email}),h.postMessage({type:"updateLabel",email:n.email,label:o.editValue}))}function _(){const e=r.preferences||{};o.settingsDraft={theme:e.theme||"vscode",language:e.language||"auto",showCurrent:e.showCurrent!==!1,showSaved:e.showSaved!==!1,showRuntime:e.showRuntime!==!1,autoRefreshIntervalMinutes:typeof e.autoRefreshIntervalMinutes=="number"?e.autoRefreshIntervalMinutes:5,enableLowQuotaReminder:e.enableLowQuotaReminder!==!1,lowQuotaThresholdPercent:typeof e.lowQuotaThresholdPercent=="number"?e.lowQuotaThresholdPercent:20},o.settingsOpen=!0,d()}function D(){o.settingsOpen=!1,o.settingsDraft=null,d()}function Ae(){o.settingsDraft&&(L({type:"settings"}),h.postMessage({type:"saveSettings",preferences:{...o.settingsDraft}}))}y.addEventListener("input",e=>{const n=e.target;if(n instanceof HTMLInputElement&&n.id==="account-search"){o.search=n.value,w(),we();return}n instanceof HTMLInputElement&&n.dataset.role==="label-input"&&(o.editValue=n.value)}),y.addEventListener("change",e=>{const n=e.target;if(!o.settingsDraft||!(n instanceof HTMLInputElement||n instanceof HTMLSelectElement))return;const i=n.dataset.setting;if(i){if(n instanceof HTMLInputElement&&n.type==="checkbox"){o.settingsDraft[i]=n.checked,i==="enableLowQuotaReminder"&&d();return}if(i==="autoRefreshIntervalMinutes"||i==="lowQuotaThresholdPercent"){o.settingsDraft[i]=Number.parseInt(n.value,10);return}o.settingsDraft[i]=n.value}}),y.addEventListener("click",e=>{const n=e.target;if(!(n instanceof Element))return;const i=n.closest("[data-action]");if(!i)return;const s=i.dataset.action,l=i.dataset.email;if(s==="open-settings"){_();return}if(s==="cancel-settings"){D();return}if(s==="settings-backdrop"&&n===i){D();return}if(s==="save-settings"){v()||Ae();return}if(s==="toggle-current"){o.currentCollapsed=!o.currentCollapsed,w(),d();return}if(s==="toggle-saved"){o.savedCollapsed=!o.savedCollapsed,w(),d();return}if(s==="open-runtime-modal"){o.runtimeModalOpen=!0,d();return}if(s==="close-runtime-modal"||s==="runtime-modal-backdrop"&&n===i){o.runtimeModalOpen=!1,d();return}if(s==="edit-label"){v()||Se(l);return}if(s==="cancel-label"){J();return}if(s==="save-label"){v()||X(l);return}if(s==="remove-account"){const u=x(l);u&&!v()&&(o.removeCandidate=u,d());return}if(s==="cancel-remove"){o.removeCandidate=null,d();return}if(s==="confirm-remove"){const u=o.removeCandidate;u&&!v()&&(L({type:"remove",email:u.email}),h.postMessage({type:"removeAccount",email:u.email}));return}if(v())return;if(s==="switch"){const u=x(l);u&&(L({type:"switch",email:u.email}),h.postMessage({type:"switchAccount",account:u}));return}const c={add:"addAccount",save:"saveCurrent",refresh:"refresh",reauth:"reauth",signout:"signout"};c[s]&&(L({type:{add:"add",save:"save",refresh:"refresh",reauth:"reauth",signout:"signout"}[s]}),h.postMessage({type:c[s]}))}),window.addEventListener("keydown",e=>{if(e.key==="Escape"){if(o.runtimeModalOpen){o.runtimeModalOpen=!1,d();return}if(o.settingsOpen){D();return}if(o.editingEmail&&!p){J();return}f&&!p&&(f=null,b&&(clearTimeout(b),b=null),d());return}if(e.key==="Enter"&&o.editingEmail&&!p){const n=document.activeElement;n instanceof HTMLInputElement&&n.dataset.role==="label-input"&&(e.preventDefault(),X(o.editingEmail))}}),y.addEventListener("click",e=>{const n=e.target;if(!(n instanceof Element))return;const i=n.closest("[data-external-url]");if(!i)return;e.preventDefault();const s=i.dataset.externalUrl;s&&h.postMessage({type:"openExternal",url:s})}),window.addEventListener("message",e=>{const n=e.data;if(!n)return;if(n.type==="openSettings"){_();return}if(n.type!=="state")return;const i=p;if(r=n.state,ee(),i?.type==="remove"){o.removeCandidate=null,E(a("accountRemoved"),"success");return}if(i?.type==="label"){o.editingEmail=null,o.editValue="",E(a("labelUpdated"),"success");return}if(i?.type==="settings"){o.settingsOpen=!1,o.settingsDraft=null,E(a("settingsSaved"),"success");return}if(i&&i.type!=="refresh"){E(a("stateUpdated"),"success");return}d()}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{r.preferences?.theme==="system"&&I()}),window.setInterval(()=>{W()},3e4),d(),h.postMessage({type:"ready"})})();function enhanceSavedQuotaMetrics(h=document){const y=h.querySelectorAll(".saved-account-quota-area");for(const k of y){const r=k.querySelectorAll([".saved-family-metric",".saved-usage-metric",".saved-quota-metric",".saved-metric-row",".saved-usage-row"].join(","));for(const o of r){const p=o.querySelector(".saved-quota-main"),f=o.querySelector(".saved-quota-value");if(!p||!f)continue;const b=f.textContent?.trim()??"",C=b.match(/(-?\d+(?:\.\d+)?)\s*%/);if(!C)continue;const M=Number(C[1]);if(!Number.isFinite(M))continue;const a=Math.max(0,Math.min(100,M));let t=o.querySelector(":scope > .saved-quota-progress");if(!t){t=document.createElement("div"),t.className="saved-quota-progress",t.setAttribute("aria-hidden","true");const w=document.createElement("span");w.className="saved-quota-progress-fill",t.append(w),p.insertAdjacentElement("afterend",t)}t.style.setProperty("--saved-quota-percent",`${a}%`);let g=o.querySelector(":scope > .saved-quota-remaining");g||(g=document.createElement("div"),g.className="saved-quota-remaining",t.insertAdjacentElement("afterend",g)),g.textContent=`${b} remaining`;const m=o.querySelector([".saved-quota-reset",".saved-usage-reset",".saved-metric-reset"].join(","));if(m){const w=m.textContent?.trim()??"";m.textContent=w.replace(/^Resets\s+in\s+/i,"Reset ").replace(/^Reset\s+in\s+/i,"Reset ")}}}}let savedQuotaEnhancementQueued=!1;function queueSavedQuotaEnhancement(){savedQuotaEnhancementQueued||(savedQuotaEnhancementQueued=!0,queueMicrotask(()=>{savedQuotaEnhancementQueued=!1,enhanceSavedQuotaMetrics(document)}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{enhanceSavedQuotaMetrics(document)},{once:!0}):enhanceSavedQuotaMetrics(document);const savedQuotaObserver=new MutationObserver(()=>{queueSavedQuotaEnhancement()});savedQuotaObserver.observe(document.documentElement,{childList:!0,subtree:!0});

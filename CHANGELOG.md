# Changelog

All notable changes to the **Antigravity Account Switcher** extension will be documented in this file.

## [1.4.7] - 2026-09-20

### Improved
- **About Section Icon Centering**:
  - Applied proper flexbox-based centering (`display: flex; flex-direction: column; align-items: center`) to the `.about-group` container in Settings modal.
  - Icon/logo now horizontally centered within the About section, consistent with the `antigravity-conversation-manager` project pattern.
  - `.about-group > h3` and `.about-row` retain full-width alignment so labels and values remain correctly laid out.

---

## [1.4.6] - 2026-09-19

### Added & Improved
- **Settings Reset to Default**:
  - Added a dedicated "Reset to Default" (`Atur Ulang ke Default`) action button in the Settings modal footer.
  - Instantly resets all draft configuration preferences back to initial defaults with a visual confirmation notice prior to saving.
  - Full bilingual localization support across English (EN) and Indonesian (ID).
- **Developer Attribution & Direct Link**:
  - Updated developer branding in the persistent sidebar footer and About view to `Boy Gilang Ramadhan (BoyGR)`.
  - Configured full interactive hyperlink opening `https://boygr.com` directly via native VS Code environment handler.

---

## [1.4.5] - 2026-09-19

### Added & Improved
- **Switch Account Confirmation Dialog**:
  - Clicking the `Switch` button on any saved account now displays an interactive confirmation dialog modal before initiating the account change.
  - Presents clear account details, target email, informative explanation, and dual `Cancel` / `Switch Account` actions.
  - Fully cancelable via Cancel button, backdrop click, or keyboard Escape key.
  - Complete bilingual localization across English (EN) and Indonesian (ID) with High Contrast support.
- **Clean Developer-Centric Documentation**:
  - Extensively rewritten `README.md` to remove marketing fluff, hyperbolic buzzwords, and emoji spam.
  - Streamlined feature breakdown into 4 concise, functional pillars for clear developer onboarding.

---

## [1.4.4] - 2026-09-19

### Fixed & Restored
- **Account Switching Functionality**:
  - Restored full, unrestricted clickability for the `Switch` button across all saved accounts.
  - Removed unintended disabled lockouts and waiting state guards that previously prevented users from switching accounts while the backend connection state was initializing or disconnected.
  - Refined backend connection state evaluation so reachable backend sessions without an active user correctly settle as `disconnected` rather than endlessly retrying in `connecting`.

---

## [1.4.3] - 2026-09-19

### Added & Improved
- **Friendly Connecting State UX & Connection Lifecycle**:
  - Introduced an explicit `AntigravityConnectionState` (`connecting`, `connected`, `disconnected`, `not_installed`, `offline`) to accurately track the Antigravity extension startup and handshake lifecycle.
  - **Runtime Status Bar**: Replaced premature `Unavailable` warning pills with an animated amber pulsing dot and `Connecting...` (`Menghubungkan...`) during startup, probe, and retry periods.
  - **Current Account Card**: Replaced confusing `No Account Connected - Sign In with Google` panels with a dedicated **Connecting to Google Antigravity** state card featuring a smooth animated shimmer bar, informative hints, and a quick `Refresh` button while the backend language server establishes its session.
  - **Safe Account Switching Protection**: Saved Accounts `Switch` buttons now display a temporary `Waiting` state (`⏳ Switch` with tooltip *"Waiting for Google Antigravity connection before switching accounts..."*) to prevent broken switches or race conditions during startup.
  - **Distinct Offline & Missing Extension States**: Structured specific panels for `not_installed` and `offline` scenarios with direct `Restart Backend` and `Refresh` recovery triggers.
  - Complete bilingual support across English (EN) and Indonesian (ID).

---

## [1.4.2] - 2026-09-17

### Added & Improved
- **Active Account Deletion Protection**:
  - Prevented the currently active Antigravity account (`Active now` / `Current account`) from being accidentally deleted from Saved Accounts.
  - The delete button on the active account card is automatically locked with disabled styling, a descriptive tooltip (`Active account cannot be removed. Sign out first.`), and an interactive warning feedback banner if clicked.
  - Added robust validation in backend handlers (`removeAccount` webview message, `removeSavedAccount` context command, and `manage-accounts` menu) to guarantee that an account in active use cannot be removed until the user explicitly signs out.
- **Enhanced Empty State & Disconnected UX**:
  - Resolved an issue where deleting all saved accounts or having no connected account caused an endless loading/skeleton spinner.
  - Skeleton loader now only renders during initial uninitialized state and gracefully yields once data is loaded.
  - Replaced bland error and empty boxes with structured empty state cards:
    - **Saved Accounts Empty State**: Features an intuitive users badge, helpful description, and clear Call-to-Action button (`⭐ Save Current Account` if an active account exists, or `+ Sign In with Google` if no account is connected).
    - **Current Account Disconnected State**: Features a clean `Disconnected` status indicator, informative explanation, and dual action buttons (`+ Sign In with Google` and `🔄 Refresh`).
  - Added bilingual translations in English and Indonesian for all new empty state and protection messaging.

---

## [1.4.1] - 2026-09-17

### Fixed & Improved
- **Current Account Quota Cards Equal Height & Alignment**:
  - Integrated the comprehensive `saved-account-quota-area` layout geometry into the Current Account usage container (`current-usage-body saved-account-quota-area`).
  - Fixed uneven card heights between **Gemini** and **Claude + GPT** caused by unreset sibling margins. Both cards now strictly align to 100% matching height, matching the Saved Accounts quota cards.
  - Standardized title headers (`28px` minimum height) so Weekly and 5h quota rows and reset countdowns across Gemini and Claude + GPT align down to the pixel.

---

## [1.4.0] - 2026-09-17

### Added
- **Advanced Proxy Configuration & Routing**:
  - Introduced a dedicated **"Advanced"** settings group in the Webview Settings modal with dynamic controls for proxy routing:
    - **Proxy Mode**: Select between `System / VS Code Default` (`system`), `Manual Custom Proxy` (`manual`), and `Direct (No Proxy)` (`direct`).
    - **Proxy Server URL**: Configure custom HTTP or SOCKS5 proxy endpoint (`http://127.0.0.1:7890`, `socks5://127.0.0.1:10808`), dynamically shown when manual mode is selected.
    - **Strict SSL Verification**: Easily toggle strict SSL/TLS certificate checking for environments utilizing custom CA or internal corporate inspection proxies.
  - Added full configuration properties in `package.json` (`boygr.antigravityAccountSwitcher.proxyMode`, `proxyUrl`, `proxyStrictSSL`), synchronizing seamlessly between IDE settings and webview preferences.
  - Complete bilingual localization support in English (EN) and Indonesian (ID).
- **Guaranteed Localhost Proxy Bypass**:
  - Implemented strict localhost bypass validation ensuring all internal communications with Antigravity Language Server and Hub (`127.0.0.1`, `localhost`, `::1`) bypass any external or manual proxy configuration unconditionally, preventing routing conflicts or connection failures.

---

## [1.3.4] - 2026-09-17

### Improved
- **Current Account Quota 2-Sided Card Display**:
  - Arranged the Current Account quota section into two distinct side-by-side cards: **Gemini** on the left and **Claude + GPT** on the right, matching the saved accounts styling with card borders, backgrounds, and vertical limit hierarchies.

---

## [1.3.3] - 2026-09-17

### Added & Improved
- **Consistent Compact Quota Layout Across Current & Saved Accounts**:
  - Unified the quota layout between the **Current Account** section and **Saved Accounts** cards.
  - The Current Account section now adopts the clean, compact 2-column vertical hierarchy (`Gemini` | `Claude + GPT`) with individual lines for `Weekly` and `5h` limits and reset countdown timers, maintaining aesthetic consistency across the entire extension.
- **Dynamic Quota Replenishment & Automatic Snapshot Sync**:
  - Saved accounts' snapshot data now auto-replenishes to 100% in real-time as soon as the server-allotted `resetTime` passes, preventing misleading stale percentages.
  - Integrated `refreshExpiredManagedAccountUsageSnapshots` into background `QuotaMonitorService` cycles, ensuring all saved accounts' quota information stays accurate, realistic, and synchronized without requiring manual account switching.

---

## [1.3.2] - 2026-09-16

### Improved
- **Real-time Quota Sync for Active Account in Saved Accounts List**:
  - The saved account card for the **currently active account** now displays real-time quota data (Gemini, Claude + GPT — both Weekly and 5h buckets) identical to the live "Current Account" section, instead of relying on a potentially stale snapshot.
  - Falls back to the cached snapshot if live data is not yet available.
  - Updated tooltip to reflect "Live data" label (vs "Snapshot updated") for the active account card to make the data source clear at a glance.

---

## [1.3.1] - 2026-09-16

### Fixed & Improved (Brand Identity)
- **Status Bar Custom Extension Logo**:
  - Replaced the generic VS Code `$(account)` silhouette with the authentic **Antigravity Account Switcher** icon/logo (`$(antigravity-logo)`).
  - Packaged a lightweight, sharp vector icon font (`antigravity.woff`) derived directly from `media/antigravity.svg` via `contributes.icons`, ensuring crisp rendering and theme-adaptive coloring across dark, light, and high-contrast status bars.

---

## [1.3.0] - 2026-09-16

### Added
- **Quota Matrix Instant Search & Filter**:
  - Integrated real-time search bar inside the Quota Matrix modal, matching the Saved Accounts search design.
  - Instantly filters accounts across labels, display names, email addresses, and group tags without losing scroll or modal state.
  - Includes search clear (`✕`) button and dedicated empty state with clear search shortcut.
- **Quota Matrix Dynamic Sorting**:
  - Added quick-sort chips to arrange accounts by:
    - 🟢 **Highest Quota**: Prioritizes accounts with highest remaining quota percentage for fast switching when reaching quota limits.
    - ⏱ **Earliest Reset**: Prioritizes accounts whose replenishment window expires next.
    - 🔤 **Name A-Z**: Alphabetical sorting by account label or display name.
  - Active account remains conveniently pinned to top for easy reference.
- **Status Bar One-Click QuickSwitch**:
  - Clicking the status bar item now directly opens the multi-account QuickPick (`statusBarMenu`) for instantaneous account switching or viewing quota breakdown, reducing clicks.

---

## [1.2.14] - 2026-09-15

### Fixed (Performance)
- **Resolved Quota Matrix Modal Opening Lag/Hang**:
  - Eliminated a severe recursive re-render loop inside `updateUsageTimeLabels()`.
  - When opening the modal, newly injected DOM elements previously triggered repeated synchronous `render()` invocations and high-frequency backend refresh messages, freezing the webview UI thread.
  - `updateUsageTimeLabels()` now safely updates label text in place without recursive re-render cascades, restoring instant, lag-free opening of the Quota Matrix modal.

---

## [1.2.13] - 2026-09-15


### Fixed & Improved (UI/UX)
- **Quota Matrix Modal Layout Overlap (Redesign)**:
  - Redesigned `.matrix-card` from a single-row 3-column flex into a clean, modern **3-tiered vertical layout**:
    1. **Header Tier**: Avatar + Display Name & Email on the left; Switch Button / `✓ Connected` pill on the right.
    2. **Badges Tier**: Plan Badge, `⚡ Instant` vault indicator, Custom Group, and Label in a flexible horizontal row.
    3. **Quota Tier**: Responsive 2-column grid displaying `5h` and `Weekly` quota bars side by side with full width, percentage, and reset details.
  - Completely eliminates badge and progress bar collisions, cramped text ellipsis, and awkward wrapping on narrow sidebar widths.

### Fixed & Real-Time Enhancements
- **Real-Time Quota Replenishment on Expired Reset Windows**:
  - Added `getEffectiveRemainingFraction(bucket)` helper: when a quota bucket's `resetTime` has arrived or passed (e.g. `Reset due (18:03)` when local clock is 18:09), the quota window has completed and Google has replenished the quota back to 100%.
  - The UI now immediately reflects the restored status (100%) across **Current Account**, **Saved Accounts**, and **Quota Matrix Modal**.
  - Updated reset status text from `Reset due (HH:MM)` to `Restored (HH:MM)` / `Dipulihkan (HH:MM)`.
  - Timer interval (every 30 seconds) now automatically detects elapsed reset times, triggering a real-time re-render of progress bars without requiring a manual window click or reload.

### Fixed (Avatars & Profile Photos)
- **Google Profile Photo (Base64 Data URL Support)**:
  - Antigravity's Connect-RPC `GetUserStatus` returns genuine Google profile photos in `data:image/png;base64,...` format.
  - Fixed `safeProfilePictureUrl` validator which previously restricted URLs to `https:`, unblocking real Google profile avatars to render directly across the Active Account, Saved Accounts list, and Quota Matrix modal.
  - Added fallback to saved registry avatars if the active session temporarily lacks the image payload.

---

## [1.2.12] - 2026-09-14


### Changed & Improved (UI/UX)
- **Current Account Layout Redesign**:
  - Restructured the active account card to match the sleek horizontal badges flow of saved accounts.
  - Replaced redundant layered names with a unified header row: Custom Label / Google Display Name + inline edit button.
  - Grouped account badges into a single clean horizontal chip row: Subscription Plan (`Pro`, `Plus`, `Ultra`, `Free`), `⚡ Instant` vault indicator, Custom Group tag (`🏷️ Group`), and live connection status (`● Connected` / `Checking...`).
- **Eliminated Redundant "Last Updated" Chip from Saved Accounts**:
  - Removed the confusing `Updated Xm ago` text chip that sat beside the `⏱ Last used` badge.
  - Seamlessly integrated the exact quota snapshot timestamp into the hover tooltip of the `Last used` pill (`Last used: ... • Snapshot updated: ...`), delivering a pristine, distraction-free badge row.

---

## [1.2.11] - 2026-09-14

### Changed & Improved
- **Saved Accounts Metadata Redesign**:
  - Replaced the vertical metadata stack with a compact, modern horizontal badge row (`saved-badges-row`).
  - Optimized the visual hierarchy across all saved account cards: Subscription Plan badge $\rightarrow$ `⚡ Instant` vault indicator $\rightarrow$ `🏷️ Custom Group` tag $\rightarrow$ `⏱ Last used` pill $\rightarrow$ `Updated snapshot` timestamp.
  - Ensures responsive wrapping and clean alignment without vertical clutter.
- **Removed Workspace Association**:
  - Retired the workspace/folder association feature (`setWorkspaceAccount`, `clearWorkspaceAccount`, `autoPromptWorkspaceAccount`) to eliminate startup popups and reduce cognitive overhead.
  - Users switch accounts seamlessly with 1 click using Instant Token Swapping.
- **Refined IDE Support Hierarchy**:
  - Aligned documentation, manifest, and setup instructions to standard hierarchy: **Visual Studio Code**, **Google Antigravity Standalone IDE**, **Cursor**, and other VS Code-compatible editors.

---

## [1.2.10] - 2026-09-14

### Changed & Improved (UI/UX)
- **Relocated Quota Matrix Button**:
  - Moved the **Quota Matrix** trigger button from the VS Code Activity Bar header (`view/title`) directly into the Webview runtime status bar, positioned neatly alongside the **Antigravity: Ready** status pill.
  - Streamlined the Activity Bar title bar to only show **Refresh** and **Settings**, preventing button crowding.
- **Manifest Schema & Activation Events Optimization**:
  - Streamlined `activationEvents` to `onStartupFinished` to utilize VS Code's Automatic Activation Events and eliminate deprecation warnings.
  - Added the recommended `icon` property to the view definition in `package.json`.
  - Broadened package and documentation descriptions for full **Visual Studio Code**, **Cursor**, and **Antigravity IDE** support.

---

## [1.2.9] - 2026-09-14

### Fixed
- **Duplicate Command Manifest Registration**:
  - Removed duplicate `boygr.antigravityAccountSwitcher.diagnose` command declaration in `package.json` (`contributes.commands`), preventing VS Code extension registry warning *"Command boygr.antigravityAccountSwitcher.diagnose already registered by Antigravity Account Switcher"*.
  - Verified zero duplicate command and activation event declarations across the entire extension manifest.

---

## [1.2.8] - 2026-09-14

### Improved & Polished (UI/UX)
- **Search Clear Button & Filter Recovery**:
  - Added an inline `✕` clear button inside the Saved Accounts search field for instant 1-click query clearing.
  - Added a "Clear filter" button directly on empty search states to easily restore the full account list.
- **Relative "Last Used" Timestamp Indicators**:
  - Displayed subtle, theme-adaptive relative time pills (`Active now`, `Xm ago`, `Xh ago`, `Xd ago`) in the metadata row of each saved account card.
- **Settings Menu Descriptions & Section Dividers**:
  - Added clear, 1-line muted helper descriptions under all automation, layout, and reminder toggles in the Settings modal (explaining *Smart Quota Fallback*, *Auto Round Robin*, *Instant Switch*, etc.).
  - Added clean visual dividers between settings categories for a modern preferences panel aesthetic.

---

## [1.2.7] - 2026-09-14

### Changed & Improved
- **Saved Accounts Default Sorting (`Last used`)**:
  - Changed the default sorting strategy of saved accounts in both the Webview and Status Bar menu to **Last used** (`recent`).
  - Positioned the "Last used" option first in the sort selection dropdown for seamless, intuitive account list navigation.
  - Preserved explicit user preferences when manually switching between Quota, Name, or Last used.

---

## [1.2.6] - 2026-09-14

### Improved & Enhanced
- **Automatic-Only Account Plan Identification**:
  - Removed manual plan modification from account editor; account plans are strictly detected automatically from Antigravity Language Server / RPC data and immutable to user edits.
- **Current Account Badge Layout Alignment**:
  - Relocated the plan badge to the right side of the account name and email (`.current-identity-heading`), preventing it from obstructing or crowding the local account label and pencil edit button.
- **Google Account Profile Pictures**:
  - Added full support for Google account avatar photos across **Current Account**, **Saved Accounts**, and the **Quota Matrix Modal**.
  - Stored and persisted `profilePictureUrl` across account registry, backups, and exports.
  - Expanded Webview Content Security Policy (CSP) and URL validator to permit `googleusercontent.com`, `ggpht.com`, `gstatic.com`, and `google.com` avatar CDNs with seamless fallback to initials.

---

## [1.2.5] - 2026-09-14

### Fixed & Hardened
- **Safe Tier & Plan Parsing**:
  - Resolved `e.userTier?.trim is not a function` error when inspecting Antigravity account status by adding robust `safeExtractString` validation for all Language Server RPC payload fields (`userTier`, `g1Tier`, `tier`, `subscriptionTier`, `email`, `name`, `profilePictureUrl`).
  - Added safe fallbacks for accounts without identifiable plan metadata: instead of throwing runtime exceptions or forcing unverified plan badges, the extension gracefully hides the badge or defaults safely.
  - Hardened webview plan badge renderer and account registry import with safe string checks.

---

## [1.2.4] - 2026-09-14

### Added & Improved
- **Account Plan & Subscription Tier Badges**:
  - Automatically identifies, detects, and formats subscription plans per account (e.g. `Google AI Plus`, `Google AI Ultra`, `Google AI Pro`, `Google AI Free`, and Google One tiers) from Antigravity user status & language server RPC.
  - Displayed stylish, theme-adaptive plan badges across all account views: **Current Account**, **Saved Accounts**, and the **Quota Matrix Modal**.
  - Added interactive Plan selection buttons inside the account editor (Edit Modal) allowing users to switch or customize account plans with 1 click.
  - Full persistence of plan info in local account registry, export/import JSON backups, and workspace account mappings.
- **Smart Quota Fallback Default & Interaction**:
  - Clarified and preserved `smartQuotaFallback` enabled (`true`) by default: it initiates a non-disruptive notification with a 1-click confirmation button (`Switch to <Candidate>`), ensuring account switching only occurs upon explicit user click.

---

## [1.2.3] - 2026-09-14

### Improved & Enhanced
- **Status Bar Integration & Focus Flow**:
  - Upgraded status bar label and icon from generic `AGY` to `$(account) Antigravity Account Switcher`.
  - Clicking the status bar item now seamlessly focuses and opens the Antigravity Account Switcher view in the Activity Bar rather than opening the command palette.
- **Interface Streamlining & Quota Matrix De-duplication**:
  - Removed redundant Quota Matrix trigger pill from the webview status bar, avoiding duplicate buttons since a dedicated Quota Matrix icon already exists directly in the Activity Bar view header (`view/title`).
- **Inverted Visibility Toggles in Settings ("Hide ...")**:
  - Converted previously pre-checked visibility options into intuitive `Hide ...` toggles:
    - `Hide Antigravity status` (default: unchecked / visible)
    - `Hide current account` (default: unchecked / visible)
    - `Hide saved accounts` (default: unchecked / visible)
    - `Show 7-day quota analytics` (default: unchecked / hidden)
  - All layout checkboxes now default to unchecked for consistent user expectation.

---

## [1.2.2] - 2026-09-14

### Improved & Fixed
- **Light Mode UI/UX & High-Contrast Visual Polish**:
  - Fixed dark rectangular blocks on Saved Accounts quota panels (`Gemini` & `Claude + GPT`) in light mode by replacing editor-inherited backgrounds with `--ag-card-subtle` and `--ag-card-border`.
  - Fixed dark `#252526` pill background on Antigravity status pill (`.runtime-status-pill`) and Quota Matrix trigger button (`.quota-matrix-trigger-btn`), styling them with crisp, theme-aware surface cards and readable text colors.
  - Enhanced Quota Matrix Modal with dedicated light/dark theme variables, preventing dark overlays, invisible quota tracks, or hardcoded dark fills.
  - Fixed dark square button artifacts on Saved Accounts action buttons (Add `+`, Edit pencil, Delete trash, and Switch badge) to seamlessly adapt to light and dark themes.
  - Added clean native custom scrollbar styling (`scrollbar-color` & `::-webkit-scrollbar`) to eliminate dark scrollbar tracks on light backgrounds.
  - Ensured active account avatar checkmark badge maintains crisp white contrast across all themes.

---

## [1.2.1] - 2026-09-14

### Added
- **Quota Matrix & 7-Day Analytics Display Controls**:
  - Added user-configurable settings to toggle the visibility of the Quota Matrix overview button (`showQuotaMatrix`, default: `false`) and the 7-day quota usage analytics chart (`showQuotaAnalytics`, default: `false`).
  - Default view is now cleaner, more streamlined, and focuses on the active account and fast switching.
- **Universal Theme Naming & Reordered Options**:
  - Replaced editor-specific `"Follow VS Code"` wording with universal `"Follow Editor / IDE Theme"` (ID: `"Ikuti Tema Editor / IDE"`).
  - Reordered theme options logically: Follow Editor/IDE Theme, Dark, Light, System.
- **Reorganized Settings Hierarchy**:
  - Restructured the Settings modal and package configurations into intuitive functional groups: Appearance & Language, Layout & Display, Quota & Notifications, Account Switching & Automation, Backup & Vault, and About.

---

## [1.2.0] - 2026-09-14

### Added
- **Universal Multi-IDE Support (Antigravity IDE & Visual Studio Code)**:
  - Added native support for standalone **Antigravity IDE** (`google.antigravity` core extension).
  - Automatically identifies whether running inside standard VS Code (with `agy.exe --hub`) or standalone Antigravity IDE (with direct `language_server_windows_x64.exe`).
  - Dynamic discovery of Language Server HTTPS Connect-RPC listener ports and process CSRF token extraction.
  - Transparent dual-mode session handling: queries account information via `GetUserStatus` and quotas via `RetrieveUserQuotaSummary` directly on standalone language server without failing on unsupported interactive hub RPCs.
  - Retains 100% backward compatibility with classic VS Code and `agy.exe --hub` workflow.

---

## [1.1.0] - 2026-09-14

### Added
- **Custom Account Groups Support**:
  - Added an inline `+ Custom` group creator in the account label editor, allowing users to type and assign arbitrary group names up to 24 characters.
  - Keyboard shortcuts for rapid editing: **Enter** to confirm and apply group, **Escape** to cancel.
  - Automatic cross-account group aggregation: any custom group used across accounts is automatically gathered into quick-selection pills for other accounts.
  - Streamlined default preset groups down to `Personal` and `Work`.
  - Full automatic integration with the top group filter chips and account search.

---

## [1.0.1] - 2026-09-14

### Fixed
- **Label Editor Vertical Layout**:
  - Replaced horizontal grid styling in `.label-editor` with vertical flex column layout, preventing color picker dots and group pills from overlapping the label input box and Save button.
  - Ensured label input box expands to full available width with dedicated confirm and cancel action buttons.
- **Instant Switch Process Respawn Timing**:
  - Sent official extension reconnect signal (`syncAntigravityUi()`) immediately after terminating `agy.exe`, prompting the Antigravity extension host to instantly spawn a new worker process with the new credentials.
  - Resolved false error message *"Unable to verify the Antigravity account after authentication: No running Antigravity agy --hub process was found"*.
- **Workspace Association Startup Tolerance**:
  - Added polling tolerance during VS Code startup to wait for the Antigravity background process to finish booting before verifying workspace account links.
  - Eliminated false *"Workspace is linked to ... Switch accounts now?"* confirmation prompts when already running as the associated account.

---

## [1.0.0] - 2026-09-14

### Added
- **Instant Token Swapping (Switch Tanpa Login Browser)**:
  - 1-click seamless account switching without opening a browser or repeating OAuth login prompts.
  - Interacts directly with Windows Credential Manager (`Advapi32.dll` via PowerShell interop) to read, backup, and restore active authentication blobs under `gemini:antigravity`.
  - Secure local token encryption using VS Code's native `vscode.SecretStorage` (`context.secrets`) backed by OS DPAPI.
  - Instant process reload: cleanly cycles `agy.exe` background worker process, triggering Antigravity to immediately adopt the new account session without UI disruptions.
  - Visual `⚡ Instant` vault badge on saved account rows and Quota Matrix dashboard for all securely vaulted accounts.
- **Encrypted Token Vault Management**:
  - Automatically captures active account tokens into the encrypted vault on startup and after successful logins.
  - Graceful fallback: non-vaulted accounts trigger the official browser login once, and are then automatically vaulted for future instant switches.
  - New setting `boygr.antigravityAccountSwitcher.enableInstantSwitch` (enabled by default).
  - New command `boygr.antigravityAccountSwitcher.clearTokenVault` with full user confirmation modal.
  - "Clear Token Vault" control in the extension Settings modal.

---

## [0.9.0] - 2026-09-14

### Added
- **Multi-Account Quota Matrix Dashboard**:
  - Modal comparison view displaying real-time 5-hour and weekly quota progress bars, exact reset countdowns, and 1-click switch buttons for all saved accounts side-by-side.
  - Dedicated "Quota Matrix" trigger button in the runtime status bar and title navigation action (`boygr.antigravityAccountSwitcher.quotaOverview`).
- **Auto-Round-Robin Account Rotation**:
  - Automatically rotates to the best backup account with the highest available quota when active account quota drops to 0% exhaustion or encounters rate limit errors.
  - Built-in 60-second cooldown protection against rapid switching loops.
  - Configurable setting `boygr.antigravityAccountSwitcher.autoRoundRobin` (disabled by default for safe opt-in).
- **Subtle Quota Audio Chimes**:
  - Pure synthesized Web Audio API (`AudioContext`) melodic sound feedback on quota restoration (ascending chime) and critical quota warnings (gentle descending tone).
  - Zero external MP3/WAV dependencies, lightweight and non-intrusive.
  - Configurable setting `boygr.antigravityAccountSwitcher.enableQuotaAudio` (enabled by default).

---

## [0.8.0] - 2026-09-13

### Added
- **Account Grouping & Profiles**:
  - Categorize accounts into groups (`Personal`, `Work`, `Client`, or custom group tags) directly within the label editor.
  - Interactive group filter chips above saved accounts to filter view in 1 click.
  - Visual group badge chips rendered on active and saved accounts.
  - Search accounts by group name dynamically.
  - Group metadata preserved during JSON Export and Import.
- **Rate Limit Auto-Switch Detection**:
  - Instant failover notification when active account quota drops to 0% (exhaustion / rate limit).
  - Prominently prompts a 1-click switch to the best available backup account with the highest remaining quota.
  - Configurable setting `boygr.antigravityAccountSwitcher.autoSwitchOnExhaustion` (enabled by default).
- **Quota Analytics CSV / JSON Export**:
  - Export historical quota usage records to CSV or JSON formats for spreadsheet reporting or external telemetry.
  - New command `boygr.antigravityAccountSwitcher.exportQuotaAnalytics`.
  - In-dashboard "Export" button right beside the 7-Day Quota Analytics chart header.

---

## [0.7.0] - 2026-09-13

### Added
- **Quota Reset Alarms & Restoration Notifications**:
  - Automatically tracks exhausted or low-quota accounts and calculates exact reset completion countdowns.
  - Fires high-priority desktop notification as soon as the quota reset window completes, allowing immediate resumption of AI tasks.
  - Configurable setting `boygr.antigravityAccountSwitcher.notifyQuotaReset` (enabled by default).
- **Account Color Tags & Visual Badges**:
  - Pick personal color accents for accounts (`Blue`, `Green`, `Purple`, `Amber`, `Rose`, `Teal`) with an interactive palette dot picker in the label editor.
  - Colored indicator dots rendered next to account labels and colored avatar ring accents on both Current Account and Saved Accounts.
  - Color tag metadata fully preserved during JSON Export and Import.
- **Workspace / Project Folder Auto-Switch Association**:
  - Associate specific VS Code project folders or workspaces with default Antigravity accounts.
  - Commands `boygr.antigravityAccountSwitcher.setWorkspaceAccount` and `clearWorkspaceAccount`.
  - Automatic prompt upon opening workspace to switch to the linked account (`autoPromptWorkspaceAccount` setting).
  - Visual workspace badge and 1-click link/unlink controls in the Accounts view.
- **7-Day Quota Usage History & Analytics**:
  - Automatically records daily lowest remaining quota percentages for each account.
  - Sleek 7-day mini bar chart rendered in the accounts dashboard with color-coded consumption levels (Healthy, Warning, Critical).
  - Hover tooltip for each day showing weekday, calendar date, and minimum remaining quota percentage.

---

## [0.6.0] - 2026-09-13

### Added
- **Keyboard Shortcuts & Keybindings**:
  - `Alt+A` (`Cmd+Alt+A` on macOS) to instantly open the QuickPick Account Switcher from anywhere.
  - `Alt+Shift+A` (`Cmd+Alt+Shift+A` on macOS) to immediately refresh the Accounts View and sync quota.
- **Smart Account Sorting**:
  - Sort saved accounts dynamically by Remaining Quota (highest first), Name (A-Z), or Recently Used.
  - Dedicated sort dropdown filter integrated right next to the search box in Saved Accounts.
  - Status Bar QuickPick menu intelligently sorts accounts by remaining quota and shows live quota badges.
- **Smart Quota Fallback & 1-Click Auto-Switch**:
  - Automatically identifies the saved backup account with highest available quota when active quota drops low.
  - Direct 1-click switch notification button to switch accounts seamlessly.
  - Configurable toggle in Settings modal and `boygr.antigravityAccountSwitcher.smartQuotaFallback`.
- **Account Backup, Export & Import**:
  - Export saved accounts metadata to JSON (`boygr.antigravityAccountSwitcher.exportAccounts`).
  - Import and merge accounts from JSON files (`boygr.antigravityAccountSwitcher.importAccounts`) with deduplication.
  - 1-click Export and Import buttons inside Settings modal.
- **Antigravity Process Recovery & Reconnect**:
  - Reconnect Hub action (`boygr.antigravityAccountSwitcher.reconnectHub`) to recover dropped sessions.
  - Restart Backend action (`boygr.antigravityAccountSwitcher.restartBackend`) to terminate stuck `agy` processes and re-initialize connection.
  - Integrated Process Recovery section inside the Antigravity Status modal.

---

## [0.5.1] - 2026-09-13

### Fixed
- **Seamless Saved Accounts Persistence**:
  - Saved accounts list remains continuously visible and interactive when switching tabs or refocusing the Activity Bar view.
  - Eliminated full-view blanking during background quota synchronization.
  - Added non-disruptive inline refresh indicator (`⟳ Updating quota…`) in the header during background polling.
- **Startup Loading Skeleton**:
  - Added animated pulse skeleton placeholder and explicit loading feedback (`Loading saved accounts…`) during initial startup and account detection so the feature is immediately clear to the user.
- **Action Button Responsiveness**:
  - Quick-switch buttons in the saved accounts list remain clickable during background quota refreshes.

---

## [0.5.0] - 2026-09-13

### Added
- **Status Bar Quota Indicator**:
  - Real-time remaining quota display on VS Code's status bar (`AGY: 85%`).
  - Dynamic severity color coding: warning background at $\le 20\%$ quota, error background at $\le 10\%$ quota.
  - Rich Markdown hover tooltip showing active account email, 5-hour quota, weekly quota, next reset countdown, and quick navigation shortcuts.
  - Customizable display formats: `compact` (`AGY: 85%`), `detailed` (`AGY: 85% (1h 45m)`), and `percentageOnly` (`85%`).
  - Configurable status bar visibility (`boygr.antigravityAccountSwitcher.showStatusBarItem`).
- **1-Click Status Bar QuickPick Menu**:
  - Quick action popup accessible directly by clicking the status bar item.
  - One-click account switching between all saved Antigravity accounts with active status indicator.
  - Shortcut actions to Add / Switch Account, Open Dashboard, Refresh Quota, and Open Settings.

---

## [0.4.1] - 2026-09-13

### Added
- **Official Transparent Branding**: High-resolution 256x256 transparent PNG extension icon and matching Activity Bar vector silhouette.
- **Settings Modal Brand Integration**: Integrated official extension logo inside Settings About modal.

### Changed
- Standardized package identifier to `boygr.antigravity-account-switcher`.
- Removed redundant prefix for clean, professional marketplace presence.

---

## [0.4.0] - 2026-09-13

### Added
- **Interactive Webview Dashboard**:
  - Full-featured custom Webview in the Activity Bar with modern styling and VS Code theme integration.
  - Antigravity runtime status pill with responsive modal showing PID, Hub port, and Language Server port.
  - Active account card displaying avatar, display name, email, and action buttons.
  - Quota & Usage dashboard with 5-hour limit and weekly limit progress bars, percentage indicators, and reset countdowns.
  - Model-by-model quota breakdown accordion.
  - Scrollable saved accounts container with live search, account filtering, and active badges.
  - Skeleton placeholder screen for smooth initial load.
  - Inline label editing and delete confirmation dialogs.
  - Developer footer with safe external link handling (`boygr.com`).
- **Quota Monitor Service**:
  - Background auto-refresh service for active account quota with configurable intervals (1m, 5m, 15m, 30m, 1h).
  - Low-quota warning notifications with `[Switch Account]` and `[View Details]` quick actions.
  - Smart deduplication per quota reset window.
- **Antigravity Official UI Sync**:
  - Automatic reconnection and refresh of official Antigravity panel (`google.google-antigravity`) using internal `antigravity.reconnect` and `antigravity.triggerUpdate` hooks.
  - Graceful fallback prompt to reload window only when auto-sync is unavailable.
- **Settings & Personalization Modal**:
  - Multi-language support: English and Bahasa Indonesia.
  - Theme switching (Follow VS Code, Dark, Light, System).
  - Configurable Quota & Reminders settings directly from the UI.
  - Section visibility toggles for layout customization.
- **F5 Development Host Reliability**:
  - Configured `npm: compile` preLaunchTask for 100% reliable, crash-free launch debugging.
  - Interactive QuickPick fallback for `boygr.antigravityAccountSwitcher.switchAccount` when triggered without arguments.

### Changed
- Refactored title bar refresh command title to **"Refresh"** to accurately reflect its full-state refresh behavior.
- Shielded all sync, refresh, and auth lifecycle methods with comprehensive `try/catch` error handlers.

---

## [0.3.0] - 2026-09-12

### Added
- Enhanced GUI and Activity Bar contributions.
- Model quota caching and snapshot storage.
- Improved error handling for backend discovery.

---

## [0.2.0] - 2026-09-11

### Added
- Native TreeView account provider.
- QuickPick account management and label editing.
- Target-aware account verification.

---

## [0.1.0] - 2026-09-10

### Added
- Initial release of Antigravity Account Switcher.
- Dynamic AGY process and port discovery.
- Read Antigravity authentication status via local RPC.
- Switch Google account using Antigravity's official authentication flow.
- Verified active account detection.


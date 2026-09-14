# Changelog

All notable changes to the **Antigravity Account Switcher** extension will be documented in this file.

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


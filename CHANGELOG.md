# Changelog

All notable changes to the **Antigravity Account Switcher** extension will be documented in this file.

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


# Changelog

All notable changes to the **Antigravity Account Switcher** extension will be documented in this file.

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


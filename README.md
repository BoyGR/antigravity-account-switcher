# Antigravity Account Switcher

<p align="center">
  <img src="media/icon.png" width="128" height="128" alt="Antigravity Account Switcher Logo" />
</p>

An extension for Visual Studio Code, Google Antigravity Standalone IDE, Cursor, and other VS Code-compatible editors to manage, monitor quota, and switch Google accounts used by Google Antigravity.

---

## Overview

**Antigravity Account Switcher** is an all-in-one account management and quota monitoring extension designed for modern AI coding workflows across **Visual Studio Code**, the standalone **Google Antigravity IDE**, **Cursor**, and other VS Code-compatible editors. It extends the official Google Antigravity experience with an interactive sidebar dashboard, real-time quota tracking, background low-quota alerts, instant UI synchronization, and effortless 1-click switching between multiple Google accounts.

### Status

- **Version**: `1.2.11`
- **Supported Platforms**: Windows (with Instant Token Swapping), macOS, Linux
- **Supported IDEs**: Visual Studio Code, Google Antigravity Standalone IDE, Cursor, and other VS Code-compatible editors
- **Compatibility**: Official Google Antigravity extension `1.3.0+`, AGY backend `1.2.2+`

---

## Key Features

### 1. Universal Multi-IDE Support (VS Code, Antigravity IDE & Cursor) 🚀
- **Dual-Mode Engine**: Automatically detects and adapts whether running inside standard **Visual Studio Code**, standalone **Google Antigravity IDE**, or **Cursor** (via `agy.exe --hub` process or direct `language_server_windows_x64.exe` Connect-RPC).
- **Direct Connect-RPC & CSRF Discovery**: Dynamically extracts HTTPS listener ports and process CSRF tokens to query account status (`GetUserStatus`) and quotas (`RetrieveUserQuotaSummary`) directly without requiring an active hub process.
- **100% Backward Compatibility**: Zero breaking changes for existing Visual Studio Code, Antigravity IDE, and Cursor setups.

### 2. Interactive Sidebar Dashboard (Activity Bar)
- **Runtime Status Indicator**: Live status pill showing Antigravity connection health, PID, Hub port, and Language Server port in a detailed modal.
- **Current Account Card**:
  - Displays Google profile avatar (with CDN support and initials fallback), display name, and email.
  - **Automatic Subscription Plan Badge**: Automatically detects and displays your account tier (`Google AI Plus`, `Google AI Ultra`, `Google AI Pro`, `Google AI Free`, etc.) neatly positioned beside account credentials.
  - Quick action buttons: Re-auth, Sign Out, and Add Account.
- **Quota & Usage Monitor**:
  - Visual progress bars for **5-Hour Limit** and **Weekly Limit**.
  - Remaining percentage indicators and exact reset countdown times.
  - Expandable model quota breakdown.
- **Saved Accounts List**:
  - **Smart Default Sorting**: Defaults to **Last used** (`recent`) so your most relevant accounts are always up top, with 1-click toggling between Quota and Name.
  - **Fast Search & Instant Clear**: Real-time filtering with an inline `✕` clear button and empty-state filter recovery.
  - **Compact Horizontal Badge Row**: Neatly presents subscription plan, `⚡ Instant` vault indicator, custom group tag (`🏷️ Work`), relative last-used badge (`Active now`, `5m ago`), and snapshot updated timestamp in a clean horizontal flow.
  - **Custom Account Groups**: Assign default tags (`Personal`, `Work`) or create inline `+ Custom` groups (up to 24 characters) with rapid keyboard shortcuts (**Enter** / **Escape**).
  - Inline label editing and secure account removal dialogs.
  - Dedicated scrollable container with skeleton loading on startup.
- **Footer**: Developer attribution and links with safe external browser navigation.

### 3. Status Bar Item & Quick Navigation
- **Real-Time Quota Glance**: Directly monitors active account quota from your editor/IDE status bar (`$(account) Antigravity Account Switcher: 85%`).
- **Color-Coded Status Alerts**: Dynamic warning background when quota $\le 20\%$ and critical error background when $\le 10\%$.
- **Rich Markdown Tooltip**: Hovering reveals active account details, 5-hour quota, weekly quota, exact reset countdown, and quick links.
- **Customizable Display Formats**: Choose between `compact` (`85%`), `detailed` (`85% (1h 45m)`), and `percentageOnly`.
- **1-Click Direct Focus**: Clicking the status bar item immediately focuses and reveals the Account Switcher view in the Activity Bar. Quick menu remains accessible via `Alt+A`.

### 4. Auto-Refresh Quota & Low Quota Reminders
- **Background Quota Monitoring**: Automatically polls and refreshes active account quota at customizable intervals (1m, 5m, 15m, 30m, 1h).
- **Low Quota Notification Alert**: Displays warning notifications when quota drops below threshold (e.g. 20%) with quick action buttons:
  - `[Switch Account]`: Opens interactive account switcher.
  - `[View Details]`: Opens the account switcher dashboard.
- **Smart Quota Fallback**: Non-disruptively suggests a 1-click switch button to the saved account with the highest available quota.
- **Smart Deduplication**: Prevents alert spam by tracking notification state per reset cycle.

### 5. Antigravity UI Synchronization (No Window Reload)
- **Instant Official Panel Sync**: Automatically reconnects and refreshes the official Google Antigravity sidebar (`google.google-antigravity`) upon account switch, sign-out, or re-authentication via internal RPC hooks (`antigravity.reconnect` / `antigravity.triggerUpdate`).
- **Zero Disruptions**: Eliminates the need to reload the IDE window or lose active editor states.
- **Safe Fallback**: Provides an optional prompt to reload window only if official auto-sync cannot be confirmed.

### 6. Settings & Personalization Modal
- Accessible via the gear icon (`⚙`) on the dashboard header:
  - **Appearance**: Universal theme selection (*Follow Editor / IDE Theme*, *Dark*, *Light*, *System*) and Bilingual Language support (*English*, *Bahasa Indonesia*, *Automatic*).
  - **Layout & Section Visibility**: Intuitive `Hide ...` toggles to hide or display Antigravity Status, Current Account, Saved Accounts, Quota Matrix button, or the 7-day quota analytics chart.
  - **Descriptions & Dividers**: Clean category separators and 1-line muted descriptions under all automation and reminder toggles.
  - **Quota & Reminders**: Configure background auto-refresh interval, low quota threshold (5% - 30%), audio chimes, and reset notifications.
  - **Backup & Vault**: 1-click Export/Import of saved accounts metadata with deduplication, plus Token Vault purge.
  - **About**: Version, developer info, and website link.

### 7. Quota Reset Alarms & Restoration Notifications
- Automatically monitors exhausted or low-quota accounts and calculates exact reset countdowns.
- Notifies immediately via desktop popup when an account's quota reset window passes and quota is restored.
- Configurable via `boygr.antigravityAccountSwitcher.notifyQuotaReset`.

### 8. Account Color Tags & Visual Badges
- Assign custom color accents (`Blue`, `Green`, `Purple`, `Amber`, `Rose`, `Teal`) to any saved account.
- Renders colored indicator dots next to account labels and colored avatar ring accents on both Current Account and Saved Accounts cards.
- Preserves color tags during JSON export and import.

### 9. 7-Day Quota Usage History & Analytics
- Automatically records daily minimum remaining quota for each account.
- Renders an interactive 7-day mini bar chart in the accounts view with color-coded health indicators (Healthy, Warning, Critical).
- Detailed hover tooltips showing weekday, date, and minimum remaining quota percentage.

### 10. Account Grouping & Profile Filters
- Categorize accounts into groups (`Personal`, `Work`, or custom group tags).
- Interactive filter chips above Saved Accounts allow 1-click filtering by category.
- Group badge chips visually displayed on both Current and Saved account cards.
- Search accounts dynamically by group tag name.
- Group assignments preserved across JSON backups and imports.

### 11. Rate Limit Auto-Switch Detection
- Detects complete quota exhaustion (0% remaining / rate limit) immediately upon background refresh or model check.
- Triggers an instant error modal with a 1-click switch prompt to the best available backup account.
- Configurable via `boygr.antigravityAccountSwitcher.autoSwitchOnExhaustion`.

### 12. Quota Analytics CSV & JSON Export
- Export full historical quota records across all accounts to standard `.csv` or formatted `.json`.
- Direct "Export" button in the 7-Day Quota Analytics dashboard header.
- Accessible via command `boygr.antigravityAccountSwitcher.exportQuotaAnalytics`.

### 13. Multi-Account Quota Matrix Dashboard
- Full-screen modal comparison matrix displaying real-time 5-hour and weekly quota progress bars, exact reset countdowns, profile pictures, plan badges, and 1-click switch buttons for all saved accounts side-by-side.
- Dedicated "Quota Matrix" trigger button directly in the webview runtime status bar, right beside the Antigravity status pill.
- Accessible via command `boygr.antigravityAccountSwitcher.quotaOverview`.

### 14. Auto-Round-Robin Account Rotation
- Automatically switches to the best backup account with the highest available quota when active account quota drops to 0% exhaustion or encounters rate limit errors.
- Built-in 60-second cooldown protection against rapid switching loops.
- Configurable via `boygr.antigravityAccountSwitcher.autoRoundRobin`.

### 15. Subtle Quota Audio Chimes
- Pure synthesized Web Audio API (`AudioContext`) melodic feedback for quota restoration (ascending chime) and critical quota warnings (gentle descending tone).
- Zero external audio files required, completely lightweight and non-intrusive.
- Configurable via `boygr.antigravityAccountSwitcher.enableQuotaAudio`.

### 16. Instant Token Swapping (Switch Tanpa Login Browser) ⚡
- **True 1-Click Seamless Switching**: Switch between saved accounts instantly without opening a browser or repeating the Google OAuth login sequence.
- **Windows Credential Manager Interop**: Uses native Win32 `Advapi32.dll` credential APIs (`CredReadW`, `CredWriteW`) to back up and swap Google Antigravity authentication tokens directly under target `gemini:antigravity`.
- **Zero Third-Party Dependencies**: No external compiled binaries or node-gyp packages required; executes via lightweight PowerShell P/Invoke script.
- **Transparent Process Respawn**: Gracefully restarts the `agy.exe` background worker process, triggering the official Antigravity extension host to immediately adopt the new token without window reloads or disruptions.
- **Encrypted Local Token Vault**: Securely persists authentication blobs in the IDE's native Secret Storage (`vscode.SecretStorage` / `context.secrets`), fully encrypted using OS Data Protection API (DPAPI).
- **Graceful One-Time Fallback**: Accounts that haven't been vaulted yet simply open the browser once to authenticate; their credentials are then automatically vaulted for all subsequent 1-click instant switches.
- **Configurable & Safe**: Can be disabled anytime via `boygr.antigravityAccountSwitcher.enableInstantSwitch`, and vault contents can be purged via `boygr.antigravityAccountSwitcher.clearTokenVault`.

---

## Security Model

- **Local-Only Encrypted Storage**: Account tokens are stored exclusively within the IDE's OS-backed Secret Storage (`vscode.SecretStorage` / `context.secrets`, backed by Windows DPAPI). Tokens are never sent over the network, uploaded, or transmitted to any third-party server.
- **Credential Manager Target Scoping**: Only accesses the specific `gemini:antigravity` target created and used by the official Google Antigravity extension.
- **Memory-Only CSRF**: Hub CSRF tokens are retained strictly in memory during operation and never written to disk.
- **Non-Destructive Storage**: Does not alter the IDE's internal database (`state.vscdb`) or tamper with `.gemini` configurations.
- **Purgeable Vault**: Users can inspect vaulted accounts (`⚡ Instant` badge) and completely purge all vaulted tokens at any time via the Command Palette or Settings modal.

---

## Commands

Access these commands via the Command Palette in your IDE (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Title | Shortcut | Description |
| :--- | :--- | :--- | :--- |
| `boygr.antigravityAccountSwitcher.focusView` | **Focus Account Switcher View** | | Reveal and focus the Account Switcher sidebar |
| `boygr.antigravityAccountSwitcher.statusBarMenu` | **Status Bar Menu** | `Alt+A` (`Cmd+Alt+A`) | Open QuickPick menu to switch accounts sorted by quota |
| `boygr.antigravityAccountSwitcher.refreshAccountsView` | **Refresh** | `Alt+Shift+A` (`Cmd+Alt+Shift+A`) | Refresh runtime status, active account, quota, and saved accounts |
| `boygr.antigravityAccountSwitcher.quotaOverview` | **View Multi-Account Quota Matrix...** | | Open full-screen quota comparison matrix for all accounts |
| `boygr.antigravityAccountSwitcher.switchAccount` | **Switch Account** | | Switch to a saved account directly (instant token swap or browser login) |
| `boygr.antigravityAccountSwitcher.clearTokenVault` | **Clear Stored Token Vault...** | | Securely delete all stored account tokens from secret storage |
| `boygr.antigravityAccountSwitcher.exportAccounts` | **Export Saved Accounts...** | | Export saved accounts metadata to JSON file |
| `boygr.antigravityAccountSwitcher.importAccounts` | **Import Saved Accounts...** | | Import and merge saved accounts from JSON file |
| `boygr.antigravityAccountSwitcher.exportQuotaAnalytics` | **Export Quota Analytics (CSV/JSON)...** | | Export historical quota records to CSV or JSON file |
| `boygr.antigravityAccountSwitcher.reconnectHub` | **Reconnect Antigravity Hub** | | Force re-establish connection to local hub process |
| `boygr.antigravityAccountSwitcher.restartBackend` | **Restart Backend Process** | | Terminate stuck `agy` backend process and reload |
| `boygr.antigravityAccountSwitcher.addAccount` | **Add / Switch Google Account** | | Initiate login to register a new Google account |
| `boygr.antigravityAccountSwitcher.manageAccounts` | **Manage Accounts** | | QuickPick-based account manager menu |
| `boygr.antigravityAccountSwitcher.openSettings` | **Settings** | | Open dashboard settings modal |
| `boygr.antigravityAccountSwitcher.currentAccount` | **Current Account** | | Show active account information |
| `boygr.antigravityAccountSwitcher.authStatus` | **Auth Status** | | Inspect current authentication status |
| `boygr.antigravityAccountSwitcher.reAuth` | **Re-auth** | | Re-authenticate active Antigravity session |
| `boygr.antigravityAccountSwitcher.signOut` | **Sign Out** | | Safely log out active Antigravity account |
| `boygr.antigravityAccountSwitcher.diagnose` | **Diagnose Antigravity** | | Run diagnostics on backend connectivity |
| `boygr.antigravityAccountSwitcher.inspectBridge` | **Inspect Bridge** | | Inspect Language Server / Hub bridge |

---

## Configuration Settings

Customize behavior via your IDE Settings (`settings.json`):

```json
{
  // Show Antigravity active account quota indicator in the status bar (default: true)
  "boygr.antigravityAccountSwitcher.showStatusBarItem": true,

  // Display format for status bar indicator: "compact", "detailed", "percentageOnly" (default: "compact")
  "boygr.antigravityAccountSwitcher.statusBarFormat": "compact",

  // Show the 7-day quota usage analytics and history chart under active account (default: false)
  "boygr.antigravityAccountSwitcher.showQuotaAnalytics": false,

  // Auto-refresh quota interval in minutes (0 = manual only, default: 5)
  "boygr.antigravityAccountSwitcher.autoRefreshIntervalMinutes": 5,

  // Show notification alert when remaining quota is low (default: true)
  "boygr.antigravityAccountSwitcher.enableLowQuotaReminder": true,

  // Remaining quota threshold percentage for low quota warnings (default: 20)
  "boygr.antigravityAccountSwitcher.lowQuotaThresholdPercent": 20,

  // Suggest 1-click switch to backup account with highest quota when low (default: true)
  "boygr.antigravityAccountSwitcher.smartQuotaFallback": true,

  // Suggest immediate 1-click switch to best backup account when quota is 0% exhausted (default: true)
  "boygr.antigravityAccountSwitcher.autoSwitchOnExhaustion": true,

  // Notify when a low or exhausted account's quota reset window has finished (default: true)
  "boygr.antigravityAccountSwitcher.notifyQuotaReset": true,

  // Automatically sync official Antigravity UI on account changes (default: true)
  "boygr.antigravityAccountSwitcher.autoSyncOfficialUi": true,

  // Automatically switch to best backup account on quota exhaustion (default: false)
  "boygr.antigravityAccountSwitcher.autoRoundRobin": false,

  // Play subtle synthesized audio chimes on quota restoration or warning (default: true)
  "boygr.antigravityAccountSwitcher.enableQuotaAudio": true,

  // Enable instant 1-click token swapping without opening browser login (default: true)
  "boygr.antigravityAccountSwitcher.enableInstantSwitch": true
}
```

---

## Installation

### From GitHub Releases / VSIX Package

1. Download the latest `antigravity-account-switcher-1.2.11.vsix` from [GitHub Releases](https://github.com/BoyGR/antigravity-account-switcher/releases).

2. **Via Graphical Interface (VS Code, Antigravity IDE, or Cursor)**:
   - Open **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`).
   - Click the `...` menu at the top right of the Extensions view.
   - Select **Install from VSIX...**.
   - Choose the downloaded `.vsix` file.

3. **Via Terminal / Command Line**:
   - **Visual Studio Code**:
     ```powershell
     code --install-extension antigravity-account-switcher-1.2.11.vsix
     ```
   - **Google Antigravity Standalone IDE**:
     ```powershell
     antigravity --install-extension antigravity-account-switcher-1.2.11.vsix
     ```
   - **Cursor**:
     ```powershell
     cursor --install-extension antigravity-account-switcher-1.2.11.vsix
     ```

---

## Development & Building

```powershell
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in development mode (Press F5 in VS Code)
# Launches Extension Development Host with synchronous compilation preLaunchTask

# Build production VSIX package
npm run package:vsix
```

---

## Author & License

- **Author & Developer**: [Boy Gilang Ramadhan](https://boygr.com)
- **License**: [MIT License](LICENSE)
- **Disclaimer**: Not affiliated with or endorsed by Google. Google Antigravity is a trademark of Google LLC.

# Antigravity Account Switcher

<p align="center">
  <img src="media/icon.png" width="128" height="128" alt="Antigravity Account Switcher Logo" />
</p>

Manage, monitor, and switch Google accounts used by Google Antigravity across VS Code, Antigravity IDE, and Cursor.

---

## Overview

**Antigravity Account Switcher** makes it easy to work with multiple Google accounts in Google Antigravity without having to manually log out and repeat browser authentication every time.

It adds a dedicated sidebar view to track active quotas (5-hour and weekly limits), view reset countdowns, configure proxy routing, and switch between saved accounts with a single confirmation.

### Compatibility
- **Editors**: Visual Studio Code, Google Antigravity Standalone IDE, Cursor, and other VS Code-compatible editors.
- **Antigravity Extension**: Official Google Antigravity extension `1.3.0+`, AGY backend `1.2.2+`.
- **Platforms**: Windows (with local Token Vault), macOS, Linux.

---

## Features

### Account Management & Switching
- **Saved Accounts**: Store multiple Google accounts with custom labels, color tags, and group categories (`Work`, `Personal`, etc.).
- **Safe Switching**: Confirmation dialog before switching prevents accidental account changes.
- **Token Vault (Windows)**: Swaps credentials locally via native Windows Credential Manager / DPAPI, switching sessions without opening browser login windows each time.
- **Active Account Protection**: Prevents deleting the currently active account until signed out.

### Quota Tracking & Alerts
- **Real-Time Usage**: Live progress bars and percentages for 5-hour and weekly request limits across Gemini and Claude / GPT models.
- **Reset Timers**: Shows exact countdowns until quota buckets reset.
- **Low Quota Warnings**: Configurable desktop notifications when quota drops below a set threshold (e.g. 20%).
- **Multi-Account Matrix**: Side-by-side comparison modal to view remaining quotas across all saved accounts at once.
- **7-Day History**: Track historical quota trends and export usage records to CSV or JSON.

### Editor Integration & Status Bar
- **Status Bar Item**: Compact live quota indicator with color alerts (warning $\le 20\%$, critical $\le 10\%$).
- **IDE Sync**: Automatically signals official Antigravity extension panels on account changes without window reloads.
- **Search & Filter**: Filter saved accounts by search query or group tags.

### Proxy & Network
- **Proxy Modes**: Support for system default, direct connection, or custom manual HTTP/SOCKS5 proxy.
- **Localhost Bypass**: Guarantees internal communication with the Antigravity Language Server and Hub (`127.0.0.1`) always bypasses proxies.
- **SSL Verification Toggle**: Configurable strict SSL for enterprise or inspection environments.

---

## Commands

All commands are accessible from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
| :--- | :--- |
| `Antigravity Account Switcher: Focus View` | Opens and focuses the sidebar dashboard |
| `Antigravity Account Switcher: Status Bar Menu` (`Alt+A`) | Quick account switcher sorted by quota |
| `Antigravity Account Switcher: Refresh` (`Alt+Shift+A`) | Manually refresh account status and quotas |
| `Antigravity Account Switcher: View Multi-Account Quota Matrix...` | Opens full-screen quota comparison matrix |
| `Antigravity Account Switcher: Switch Account` | Switch to a saved account |
| `Antigravity Account Switcher: Clear Stored Token Vault...` | Purge encrypted tokens from Secret Storage |
| `Antigravity Account Switcher: Export Saved Accounts...` | Export saved accounts to JSON |
| `Antigravity Account Switcher: Import Saved Accounts...` | Import accounts from JSON backup |
| `Antigravity Account Switcher: Export Quota Analytics...` | Export quota history to CSV or JSON |
| `Antigravity Account Switcher: Restart Backend Process` | Terminate and reload the local language server process |
| `Antigravity Account Switcher: Settings` | Open webview settings modal |

---

## Configuration

Customize settings via your editor's `settings.json`:

```json
{
  // Show quota indicator in the status bar
  "boygr.antigravityAccountSwitcher.showStatusBarItem": true,

  // Status bar format: "compact", "detailed", or "percentageOnly"
  "boygr.antigravityAccountSwitcher.statusBarFormat": "compact",

  // Auto-refresh quota interval in minutes (0 = manual only)
  "boygr.antigravityAccountSwitcher.autoRefreshIntervalMinutes": 5,

  // Low quota notification reminder
  "boygr.antigravityAccountSwitcher.enableLowQuotaReminder": true,

  // Low quota warning threshold percentage
  "boygr.antigravityAccountSwitcher.lowQuotaThresholdPercent": 20,

  // Notify when an exhausted account's quota reset window completes
  "boygr.antigravityAccountSwitcher.notifyQuotaReset": true,

  // Automatically sync official Antigravity UI panels on account switch
  "boygr.antigravityAccountSwitcher.autoSyncOfficialUi": true,

  // Use local token vault for instant switching without browser login
  "boygr.antigravityAccountSwitcher.enableInstantSwitch": true
}
```

---

## Security & Privacy

- **Local Storage Only**: Account tokens and credentials stay on your machine in the editor's OS-backed Secret Storage (`vscode.SecretStorage`, protected by Windows DPAPI / Keychain).
- **No Third-Party Transmission**: Tokens are never uploaded to any remote server or external service.
- **Target Scoping**: Only accesses the `gemini:antigravity` credential target managed by the official Google extension.

---

## Installation

### From VSIX Package

1. Download the latest `antigravity-account-switcher-1.4.5.vsix` from [GitHub Releases](https://github.com/BoyGR/antigravity-account-switcher/releases).
2. Install via editor:
   - **GUI**: In the Extensions view (`Ctrl+Shift+X`), click `...` at the top right and choose **Install from VSIX...**.
   - **CLI**:
     ```powershell
     # Visual Studio Code
     code --install-extension antigravity-account-switcher-1.4.9.vsix

     # Google Antigravity IDE
     antigravity --install-extension antigravity-account-switcher-1.4.9.vsix

     # Cursor
     cursor --install-extension antigravity-account-switcher-1.4.9.vsix
     ```

---

## Development

```powershell
# Install dependencies
npm install

# Compile TypeScript and bundle with esbuild
npm run compile

# Package production VSIX
npm run package:vsix
```

---

## License

- **Author**: [Boy Gilang Ramadhan](https://boygr.com)
- **License**: [MIT License](LICENSE)
- **Disclaimer**: Not affiliated with or endorsed by Google LLC. Google Antigravity is a trademark of Google LLC.

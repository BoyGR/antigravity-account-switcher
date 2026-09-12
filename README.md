# BoyGR Antigravity Account Switcher

A private Visual Studio Code extension for managing and switching the Google account used by Google Antigravity.

## Status

Version: 0.1.0

Tested with:

- Visual Studio Code on Windows
- Google Antigravity extension 1.3.0
- AGY backend 1.2.2

This extension is currently intended for private/internal use.

## Features

- Detect the installed Google Antigravity extension.
- Detect the running AGY backend dynamically.
- Discover the Antigravity Hub and Language Server without hardcoded ports.
- Read Antigravity authentication status.
- Detect the currently active Google account.
- Save non-secret account metadata locally.
- Assign local labels to saved accounts.
- Manage saved Antigravity accounts.
- Add or switch Google accounts through Antigravity's existing Google authentication flow.
- Verify the resulting account after authentication.
- Detect wrong-account and no-change switching outcomes.

## Account Manager

Open the Visual Studio Code Command Palette and run:

    BoyGR AG: Manage Accounts

The Account Manager shows:

- the current Antigravity account;
- previously saved account metadata;
- local account labels;
- an option to add or switch Google accounts;
- account-management actions.

When switching to a saved account, the extension opens Antigravity's existing Google authentication flow.

The user still selects the intended Google account in Google's account chooser.

After authentication, the extension verifies the active account using Antigravity's backend `GetUserStatus` RPC.

A switch is considered successful only when the returned email matches the selected target account.

## Main Commands

- `BoyGR AG: Manage Accounts`
- `BoyGR AG: Current Account`
- `BoyGR AG: Status`
- `BoyGR AG: Auth Status`

Additional diagnostic and authentication commands are currently retained for development and troubleshooting.

## Security Model

This extension does not implement Google OAuth itself.

It reuses Antigravity's existing authentication flow.

The local account registry stores only non-secret metadata such as:

- email address;
- optional local label;
- display name;
- first-seen timestamp;
- last-seen timestamp.

The extension does not intentionally persist:

- Google passwords;
- access tokens;
- refresh tokens;
- ID tokens;
- Google cookies;
- Antigravity credentials;
- CSRF values;
- authentication/session blobs.

CSRF values required for local Antigravity RPC calls are kept in memory only for the duration of the operation.

The extension does not switch accounts by modifying `state.vscdb` and does not snapshot or restore the `.gemini` directory.

## How Switching Works

The switching flow is:

    Select saved account
        |
        v
    Read current account
        |
        v
    Start Antigravity Re-auth/Login
        |
        v
    Google account chooser
        |
        v
    User selects target account
        |
        v
    Rediscover AGY runtime if necessary
        |
        v
    GetUserStatus
        |
        v
    Verify returned email == target email

This means account switching is target-aware and verified, but it is not silent.

## Runtime Discovery

AGY process IDs and ports are not hardcoded.

The extension discovers the active Antigravity runtime and identifies the relevant loopback listeners dynamically.

This allows the extension to continue working when AGY restarts and receives new runtime ports.

## Compatibility

The current implementation has been tested against:

- Google Antigravity extension: 1.3.0
- AGY backend: 1.2.2

The extension relies on internal Antigravity/AGY behavior that is not a public compatibility contract.

A future Google Antigravity update may change:

- RPC service or method definitions;
- authentication behavior;
- Hub bootstrap behavior;
- Language Server transport;
- runtime process structure.

If this happens, the extension may require an update.

## Limitations

- Account switching still requires interaction with Google's official account chooser.
- The extension does not maintain independent Google authentication sessions.
- It does not provide silent or instant account switching.
- Saved accounts are metadata targets, not stored credentials or sessions.
- Compatibility with future Antigravity versions is not guaranteed.

## Requirements

- Visual Studio Code
- Official Google Antigravity extension
- A working Antigravity installation and authentication session

## Installation

Install the generated VSIX using Visual Studio Code:

    Extensions
    -> ...
    -> Install from VSIX...

Or from the command line:

    code --install-extension boygr-antigravity-account-switcher-0.1.0.vsix

## Development

Compile:

    npm run compile

Preview VSIX contents:

    npx @vscode/vsce ls

Package:

    npm run package:vsix

## Project

BoyGR Antigravity Account Switcher

Private/internal tooling by BoyGR.

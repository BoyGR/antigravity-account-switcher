(() => {
    const vscode = acquireVsCodeApi();

    const app = document.getElementById("app");

    let state = {
        loading: true,
        current: null,
        accounts: [],
        runtime: null,
        error: null,
    };

    let operation = null;
    let feedback = null;
    let feedbackTimer = null;

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function normalizeEmail(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase();
    }

    function setOperation(nextOperation) {
        operation = nextOperation;
        render();
    }

    function clearOperation() {
        operation = null;
    }

    function showFeedback(message, kind = "info") {
        feedback = {
            message,
            kind,
        };

        if (feedbackTimer) {
            clearTimeout(feedbackTimer);
        }

        feedbackTimer = setTimeout(() => {
            feedback = null;
            feedbackTimer = null;
            render();
        }, 2600);

        render();
    }

    function operationLabel() {
        if (!operation) {
            return "";
        }

        const labels = {
            refresh: "Refreshing account state...",
            add: "Opening Google account flow...",
            save: "Saving current account...",
            reauth: "Re-authenticating...",
            signout: "Signing out...",
            switch: "Switching account...",
        };

        return labels[operation.type] || "Working...";
    }

    function isBusy() {
        return Boolean(operation);
    }

    function initials(name, email) {
        const source =
            String(name || "")
                .trim() ||
            String(email || "")
                .split("@")[0];

        const parts =
            source
                .split(/\s+/)
                .filter(Boolean);

        if (parts.length >= 2) {
            return (
                parts[0][0] +
                parts[parts.length - 1][0]
            ).toUpperCase();
        }

        return source
            .slice(0, 2)
            .toUpperCase() || "A";
    }

    function currentManagedAccount() {
        if (!state.current) {
            return null;
        }

        const email =
            normalizeEmail(state.current.email);

        return state.accounts.find(
            account =>
                normalizeEmail(account.email) === email
        ) || null;
    }

    function accountTitle(account) {
        return (
            account.label ||
            account.displayName ||
            account.email
        );
    }

    function renderLoading() {
        return `
            <div class="app">
                ${renderBrand()}

                <section class="section">
                    <div class="section-header">
                        <h2 class="section-title">
                            Current account
                        </h2>
                    </div>

                    <div class="loading-card">
                        <div class="loading-line short"></div>
                        <div class="loading-line"></div>
                        <div class="loading-line short"></div>
                    </div>
                </section>

                <section class="section">
                    <div class="section-header">
                        <h2 class="section-title">
                            Saved accounts
                        </h2>
                    </div>

                    <div class="loading-card">
                        <div class="loading-line"></div>
                        <div class="loading-line short"></div>
                    </div>
                </section>
            </div>
        `;
    }

    function renderBrand() {
        return `
            <header class="brand">
                <div class="brand-mark" aria-hidden="true">
                    <div class="brand-a">A</div>
                    <div class="brand-orbit"></div>
                </div>

                <div class="brand-copy">
                    <h1 class="brand-title">
                        Antigravity
                    </h1>

                    <div class="brand-subtitle">
                        Account Switcher
                    </div>
                </div>
            </header>
        `;
    }

    function renderFeedback() {
        if (operation) {
            return `
                <div
                    class="operation-banner"
                    role="status"
                    aria-live="polite"
                >
                    <span class="operation-spinner"></span>

                    <span>
                        ${escapeHtml(operationLabel())}
                    </span>
                </div>
            `;
        }

        if (!feedback) {
            return "";
        }

        return `
            <div
                class="feedback-banner ${escapeHtml(feedback.kind)}"
                role="status"
                aria-live="polite"
            >
                <span class="feedback-symbol">
                    ${feedback.kind === "error" ? "!" : "✓"}
                </span>

                <span>
                    ${escapeHtml(feedback.message)}
                </span>
            </div>
        `;
    }

    function renderCurrent() {
        if (!state.current) {
            return `
                <section class="section">
                    <div class="section-header">
                        <h2 class="section-title">
                            Current account
                        </h2>

                        <button
                            class="icon-btn"
                            data-action="refresh"
                            title="Refresh"
                            aria-label="Refresh Antigravity account state"
                        >↻</button>
                    </div>

                    <div class="error-card">
                        <strong>
                            Antigravity account unavailable
                        </strong>

                        <div class="muted">
                            ${
                                escapeHtml(
                                    state.error ||
                                    "Waiting for Antigravity..."
                                )
                            }
                        </div>
                    </div>
                </section>
            `;
        }

        const managed =
            currentManagedAccount();

        const displayName =
            state.current.displayName ||
            managed?.displayName ||
            state.current.email;

        const label =
            managed?.label || "Current account";

        return `
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">
                        Current account
                    </h2>

                    <button
                        class="icon-btn"
                        data-action="refresh"
                        title="Refresh"
                        aria-label="Refresh Antigravity account state"
                    >↻</button>
                </div>

                <div
                    class="hero-card"
                    aria-label="Current Antigravity account"
                >
                    <div class="hero-status-row">
                        <span class="badge success">
                            <span class="status-dot" aria-hidden="true"></span>
                            Connected
                        </span>


                    </div>

                    <div class="account-main">
                        <div
                            class="avatar"
                            aria-hidden="true"
                        >
                            ${
                                escapeHtml(
                                    initials(
                                        displayName,
                                        state.current.email
                                    )
                                )
                            }
                        </div>

                        <div class="identity">
                            <div
                                class="identity-name"
                                title="${escapeHtml(displayName)}"
                            >
                                ${escapeHtml(displayName)}
                            </div>

                            <div
                                class="identity-email"
                                title="${escapeHtml(state.current.email)}"
                            >
                                ${escapeHtml(state.current.email)}
                            </div>

                            <span class="identity-label">
                                ${escapeHtml(label)}
                            </span>
                        </div>
                    </div>

                    <div class="hero-actions">
                        <button
                            class="btn secondary"
                            data-action="reauth"
                            ${isBusy() ? "disabled" : ""}
                        >
                            ↻ Re-auth
                        </button>

                        <button
                            class="btn danger"
                            data-action="signout"
                            ${isBusy() ? "disabled" : ""}
                        >
                            ⇥ Sign out
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    function renderSavedAccount(account) {
        const currentEmail =
            normalizeEmail(state.current?.email);

        const isActive =
            normalizeEmail(account.email) === currentEmail;

        const displayName =
            account.label ||
            account.displayName ||
            account.email;

        return `
            <article
                class="account-card ${isActive ? "active" : ""}"
                data-email="${escapeHtml(account.email)}"
                ${isActive ? 'aria-current="true"' : ""}
            >
                <div
                    class="avatar small"
                    aria-hidden="true"
                >
                    ${
                        escapeHtml(
                            initials(
                                account.displayName ||
                                account.label,
                                account.email
                            )
                        )
                    }
                </div>

                <div class="identity">
                    <div
                        class="identity-name"
                        title="${escapeHtml(accountTitle(account))}"
                    >
                        ${escapeHtml(accountTitle(account))}
                    </div>

                    <div
                        class="identity-email"
                        title="${escapeHtml(account.email)}"
                    >
                        ${escapeHtml(account.email)}
                    </div>
                </div>

                <div class="account-actions">
                    ${
                        isActive
                            ? `
                                <span class="badge success">
                                    <span class="status-dot" aria-hidden="true"></span>
                                    Active
                                </span>
                            `
                            : `
                                <button
                                    class="btn switch-btn"
                                    data-action="switch"
                                    data-email="${escapeHtml(account.email)}"
                                    title="Switch to ${escapeHtml(account.email)}"
                                    ${isBusy() ? "disabled" : ""}
                                >
                                    ⇄ Switch
                                </button>
                            `
                    }

                    <button
                        class="icon-btn more"
                        data-action="menu"
                        data-email="${escapeHtml(account.email)}"
                        title="Account actions for ${escapeHtml(accountTitle(account))}"
                        aria-label="Account actions for ${escapeHtml(accountTitle(account))}"
                        ${isBusy() ? "disabled" : ""}
                    >
                        ⋮
                    </button>
                </div>
            </article>
        `;
    }

    function renderSaved() {
        const cards =
            state.accounts.length
                ? state.accounts
                    .map(renderSavedAccount)
                    .join("")
                : `
                    <div class="empty-card">
                        <strong>No saved accounts</strong>
                        <div class="muted">
                            Save the current Antigravity account
                            or add another Google account.
                        </div>
                    </div>
                `;

        return `
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">
                        Saved accounts
                    </h2>

                    <span class="count">
                        ${state.accounts.length}
                    </span>
                </div>

                <div class="account-list">
                    ${cards}
                </div>

                <button
                    class="add-card"
                    data-action="add"
                    aria-label="Add or switch Google account"
                    ${isBusy() ? "disabled" : ""}
                >
                    <span class="add-icon">+</span>

                    <span>
                        <span class="add-title">
                            Add Google Account
                        </span>

                        <span class="add-subtitle">
                            Sign in or switch account
                        </span>
                    </span>
                </button>

                ${
                    state.current &&
                    !currentManagedAccount()
                        ? `
                            <button
                                class="btn secondary block"
                                data-action="save"
                                ${isBusy() ? "disabled" : ""}
                            >
                                Save Current Account
                            </button>
                        `
                        : ""
                }
            </section>
        `;
    }

    function runtimeRow(
        symbol,
        name,
        detail,
        healthy,
        status
    ) {
        return `
            <div class="runtime-row">
                <div class="runtime-icon">
                    ${symbol}
                </div>

                <div class="runtime-copy">
                    <div class="runtime-name">
                        ${escapeHtml(name)}
                    </div>

                    <div class="runtime-detail">
                        ${escapeHtml(detail)}
                    </div>
                </div>

                <div
                    class="
                        runtime-state
                        ${healthy ? "" : "error"}
                    "
                >
                    <span class="status-dot" aria-hidden="true"></span>
                    ${escapeHtml(status)}
                </div>
            </div>
        `;
    }

    function renderRuntime() {
        const runtime =
            state.runtime || {};

        const extension =
            runtime.extension || {};

        const process =
            runtime.process || null;

        const health =
            runtime.health || null;

        const extensionHealthy =
            Boolean(extension.installed);

        const processHealthy =
            Boolean(process);

        const hubHealthy =
            Boolean(health?.reachable);

        const allHealthy =
            extensionHealthy &&
            processHealthy &&
            hubHealthy;

        return `
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">
                        Antigravity status
                    </h2>

                    <div style="
                        display:flex;
                        align-items:center;
                        gap:5px;
                    ">
                        ${
                            allHealthy
                                ? `
                                    <span
                                        class="runtime-state"
                                        title="All systems operational"
                                    >
                                        <span class="status-dot" aria-hidden="true"></span>
                                        Ready
                                    </span>
                                `
                                : ""
                        }

                        <button
                            class="icon-btn"
                            data-action="refresh"
                            title="Refresh status"
                            aria-label="Refresh Antigravity runtime status"
                        >
                            ↻
                        </button>
                    </div>
                </div>

                <div class="runtime-card">
                    ${
                        runtimeRow(
                            "G",
                            "Google Extension",
                            extension.version
                                ? `Version ${extension.version}`
                                : "Official Antigravity extension",
                            extensionHealthy,
                            extensionHealthy
                                ? "Connected"
                                : "Unavailable"
                        )
                    }

                    ${
                        runtimeRow(
                            "A",
                            "AGY Backend",
                            runtime.agyVersion
                                ? `Version ${runtime.agyVersion}`
                                : "Local Antigravity backend",
                            processHealthy,
                            processHealthy
                                ? "Running"
                                : "Stopped"
                        )
                    }

                    ${
                        runtimeRow(
                            "◉",
                            "Hub",
                            hubHealthy
                                ? "Local Hub"
                                : "Antigravity hub connection",
                            hubHealthy,
                            hubHealthy
                                ? "Connected"
                                : "Unavailable"
                        )
                    }
                </div>


            </section>
        `;
    }

    function render() {
        if (state.loading) {
            app.innerHTML =
                renderLoading();

            return;
        }

        app.innerHTML = `
            <div
                class="app"
                aria-busy="${isBusy() ? "true" : "false"}"
            >
                ${renderBrand()}
                ${renderFeedback()}
                ${renderCurrent()}
                ${renderSaved()}
                ${renderRuntime()}
            </div>
        `;
    }

    function findAccount(email) {
        const normalized =
            normalizeEmail(email);

        return state.accounts.find(
            item =>
                normalizeEmail(item.email) === normalized
        );
    }

    app.addEventListener("click", event => {
        const target =
            event.target.closest("[data-action]");

        if (!target) {
            return;
        }

        const action =
            target.dataset.action;

        const email =
            target.dataset.email;

        if (isBusy()) {
            return;
        }

        if (action === "switch") {
            const account = findAccount(email);

            if (account) {
                setOperation({
                    type: "switch",
                    email: account.email,
                });

                vscode.postMessage({
                    type: "switchAccount",
                    account,
                });
            }

            return;
        }

        if (action === "menu") {
            const account = findAccount(email);

            if (account) {
                vscode.postMessage({
                    type: "accountMenu",
                    account,
                });
            }

            return;
        }

        const map = {
            add: "addAccount",
            save: "saveCurrent",
            refresh: "refresh",
            reauth: "reauth",
            signout: "signout",
        };

        if (map[action]) {
            const operationTypes = {
                add: "add",
                save: "save",
                refresh: "refresh",
                reauth: "reauth",
                signout: "signout",
            };

            setOperation({
                type: operationTypes[action],
            });

            vscode.postMessage({
                type: map[action],
            });
        }
    });

    window.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Escape" &&
                feedback &&
                !operation
            ) {
                feedback = null;

                if (feedbackTimer) {
                    clearTimeout(feedbackTimer);
                    feedbackTimer = null;
                }

                render();
            }
        }
    );

    window.addEventListener(
        "message",
        event => {
            const message = event.data;

            if (
                !message ||
                message.type !== "state"
            ) {
                return;
            }

            const previousOperation = operation;

            state = message.state;

            clearOperation();

            if (
                previousOperation &&
                previousOperation.type !== "refresh"
            ) {
                showFeedback(
                    "Account state updated.",
                    "success"
                );

                return;
            }

            render();
        }
    );

    render();

    vscode.postMessage({
        type: "ready",
    });
})();

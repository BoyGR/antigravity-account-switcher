/**
 * Network proxy utility functions.
 * Enforces localhost safety guarantee for internal Antigravity Language Server communication.
 */

export function shouldBypassProxy(host: string): boolean {
    const normalized = host.toLowerCase().trim();
    return (
        normalized === "127.0.0.1" ||
        normalized === "localhost" ||
        normalized === "::1"
    );
}

import * as vscode from "vscode";

export class Logger {
    private static channel: vscode.OutputChannel | undefined;

    public static initialize(context: vscode.ExtensionContext): void {
        if (!this.channel) {
            this.channel = vscode.window.createOutputChannel(
                "Antigravity Account Switcher",
            );
            context.subscriptions.push(this.channel);
        }
        this.info("Antigravity Account Switcher output channel initialized.");
    }

    public static getChannel(): vscode.OutputChannel {
        if (!this.channel) {
            this.channel = vscode.window.createOutputChannel(
                "Antigravity Account Switcher",
            );
        }
        return this.channel;
    }

    public static log(
        level: "INFO" | "WARN" | "ERROR" | "DEBUG",
        message: string,
        detail?: unknown,
    ): void {
        const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
        const line = `[${timestamp}] [${level}] ${message}`;
        this.getChannel().appendLine(line);
        if (detail !== undefined && detail !== null) {
            if (detail instanceof Error) {
                this.getChannel().appendLine(`  ${detail.stack || detail.message}`);
            } else if (typeof detail === "object") {
                try {
                    this.getChannel().appendLine(`  ${JSON.stringify(detail, null, 2)}`);
                } catch {
                    this.getChannel().appendLine(`  ${String(detail)}`);
                }
            } else {
                this.getChannel().appendLine(`  ${String(detail)}`);
            }
        }
    }

    public static info(message: string, detail?: unknown): void {
        this.log("INFO", message, detail);
    }

    public static warn(message: string, detail?: unknown): void {
        this.log("WARN", message, detail);
    }

    public static error(message: string, detail?: unknown): void {
        this.log("ERROR", message, detail);
    }

    public static show(preserveFocus = true): void {
        this.getChannel().show(preserveFocus);
    }
}


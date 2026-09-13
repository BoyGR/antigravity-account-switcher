const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const isProduction = process.argv.includes("--production");
const isWatch = process.argv.includes("--watch");

async function main() {
    // 1. Ensure dist and dist/media directories exist
    fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
    fs.mkdirSync(path.join(__dirname, "dist", "media"), { recursive: true });

    // 2. Extension config
    const extensionCtx = await esbuild.context({
        entryPoints: ["src/extension.ts"],
        bundle: true,
        outfile: "dist/extension.js",
        external: ["vscode"],
        format: "cjs",
        platform: "node",
        target: "node18",
        minify: isProduction,
        sourcemap: !isProduction,
        sourcesContent: false,
        logLevel: "info",
    });

    // 3. Webview JS config
    const webviewJsCtx = await esbuild.context({
        entryPoints: ["media/account-switcher.js"],
        bundle: false,
        outfile: "dist/media/account-switcher.js",
        minify: isProduction,
        sourcemap: !isProduction,
        target: ["es2020", "chrome100"],
        logLevel: "info",
    });

    // 4. Webview CSS config
    const webviewCssCtx = await esbuild.context({
        entryPoints: ["media/account-switcher.css"],
        bundle: false,
        outfile: "dist/media/account-switcher.css",
        minify: isProduction,
        logLevel: "info",
    });

    // 5. Copy media assets
    const copyAssets = () => {
        const filesToCopy = ["antigravity.svg", "icon.png"];
        for (const file of filesToCopy) {
            const src = path.join(__dirname, "media", file);
            const dest = path.join(__dirname, "dist", "media", file);
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
            }
        }
    };
    copyAssets();

    if (isWatch) {
        await Promise.all([
            extensionCtx.watch(),
            webviewJsCtx.watch(),
            webviewCssCtx.watch(),
        ]);
        console.log("esbuild is watching for file changes...");
    } else {
        await Promise.all([
            extensionCtx.rebuild(),
            webviewJsCtx.rebuild(),
            webviewCssCtx.rebuild(),
        ]);
        await Promise.all([
            extensionCtx.dispose(),
            webviewJsCtx.dispose(),
            webviewCssCtx.dispose(),
        ]);
        console.log(`esbuild finished successfully (${isProduction ? "production" : "development"}).`);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});


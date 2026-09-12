"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspectAntigravityBridge = inspectAntigravityBridge;
const vscode = __importStar(require("vscode"));
const OFFICIAL_EXTENSION_ID = 'google.google-antigravity';
function classifyValue(value) {
    if (value === null) {
        return 'null';
    }
    if (Array.isArray(value)) {
        return 'array';
    }
    return typeof value;
}
/**
 * Inspects property descriptors without invoking getters.
 *
 * This intentionally does NOT access property values when the
 * descriptor contains a getter. That prevents accidental execution
 * of extension-owned logic.
 */
function inspectObjectMembers(value, rootName, maxDepth = 2) {
    const result = [];
    const visited = new Set();
    function walk(current, currentPath, depth) {
        if (current === null ||
            (typeof current !== 'object' &&
                typeof current !== 'function')) {
            return;
        }
        const objectValue = current;
        if (visited.has(objectValue)) {
            return;
        }
        visited.add(objectValue);
        let descriptors;
        try {
            descriptors =
                Object.getOwnPropertyDescriptors(objectValue);
        }
        catch {
            return;
        }
        for (const [name, descriptor] of Object.entries(descriptors)) {
            if (name === 'length' ||
                name === 'name' ||
                name === 'prototype' ||
                name === 'caller' ||
                name === 'arguments') {
                continue;
            }
            const memberPath = currentPath.length > 0
                ? `${currentPath}.${name}`
                : name;
            if (typeof descriptor.get === 'function' ||
                typeof descriptor.set === 'function') {
                result.push({
                    path: memberPath,
                    kind: descriptor.get && descriptor.set
                        ? 'getter/setter'
                        : descriptor.get
                            ? 'getter'
                            : 'setter',
                    enumerable: descriptor.enumerable,
                    configurable: descriptor.configurable,
                });
                continue;
            }
            const memberValue = descriptor.value;
            result.push({
                path: memberPath,
                kind: classifyValue(memberValue),
                writable: descriptor.writable,
                enumerable: descriptor.enumerable,
                configurable: descriptor.configurable,
            });
            if (depth < maxDepth) {
                if (memberValue !== null &&
                    (typeof memberValue === 'object' ||
                        typeof memberValue === 'function')) {
                    walk(memberValue, memberPath, depth + 1);
                }
            }
        }
    }
    walk(value, rootName, 0);
    return result.sort((a, b) => a.path.localeCompare(b.path));
}
function isInterestingCommand(command) {
    const normalized = command.toLowerCase();
    const namespaces = [
        'antigravity',
        'google',
        'jetski',
        'agy',
    ];
    const authTerms = [
        'auth',
        'login',
        'logout',
        'sign',
        'account',
        'session',
        'user',
        'profile',
        'credential',
        'license',
    ];
    return (namespaces.some((term) => normalized.includes(term)) ||
        authTerms.some((term) => normalized.includes(term)));
}
function extractPackageCommands(packageJson) {
    const commands = packageJson?.contributes?.commands;
    if (!Array.isArray(commands)) {
        return [];
    }
    return commands
        .map((entry) => typeof entry?.command === 'string'
        ? entry.command
        : undefined)
        .filter((value) => typeof value === 'string')
        .filter(isInterestingCommand)
        .map((id) => ({
        id,
        source: 'package',
    }))
        .sort((a, b) => a.id.localeCompare(b.id));
}
function extractPackageViews(packageJson) {
    const contributes = packageJson?.contributes;
    if (!contributes) {
        return [];
    }
    const result = new Set();
    const containers = contributes.viewsContainers;
    if (containers &&
        typeof containers === 'object') {
        for (const entries of Object.values(containers)) {
            if (!Array.isArray(entries)) {
                continue;
            }
            for (const entry of entries) {
                const id = typeof entry?.id === 'string'
                    ? entry.id
                    : undefined;
                if (id) {
                    result.add(id);
                }
            }
        }
    }
    const views = contributes.views;
    if (views &&
        typeof views === 'object') {
        for (const [containerId, entries] of Object.entries(views)) {
            result.add(containerId);
            if (!Array.isArray(entries)) {
                continue;
            }
            for (const entry of entries) {
                const id = typeof entry?.id === 'string'
                    ? entry.id
                    : undefined;
                if (id) {
                    result.add(id);
                }
            }
        }
    }
    return [...result].sort();
}
function extractConfigurationKeys(packageJson) {
    const configuration = packageJson?.contributes?.configuration;
    const configurations = Array.isArray(configuration)
        ? configuration
        : configuration
            ? [configuration]
            : [];
    const result = new Set();
    for (const entry of configurations) {
        const properties = entry?.properties;
        if (!properties ||
            typeof properties !== 'object') {
            continue;
        }
        for (const key of Object.keys(properties)) {
            if (key.toLowerCase().includes('antigravity') ||
                key.toLowerCase().includes('auth') ||
                key.toLowerCase().includes('server')) {
                result.add(key);
            }
        }
    }
    return [...result].sort();
}
async function inspectAntigravityBridge() {
    const extension = vscode.extensions.getExtension(OFFICIAL_EXTENSION_ID);
    if (!extension) {
        return {
            extensionInstalled: false,
            extensionActive: false,
            exportsType: 'undefined',
            exportsAvailable: false,
            exportMembers: [],
            runtimeCommands: [],
            packageCommands: [],
            packageViews: [],
            packageConfigurationKeys: [],
        };
    }
    /*
     * Do NOT call extension.activate() here.
     *
     * M1 already tells us whether Antigravity is active.
     * This inspector must not change lifecycle state just
     * to inspect it.
     */
    const extensionExports = extension.isActive
        ? extension.exports
        : undefined;
    const allCommands = await vscode.commands.getCommands(true);
    const runtimeCommands = allCommands
        .filter(isInterestingCommand)
        .map((id) => ({
        id,
        source: 'runtime',
    }))
        .sort((a, b) => a.id.localeCompare(b.id));
    return {
        extensionInstalled: true,
        extensionActive: extension.isActive,
        extensionVersion: typeof extension.packageJSON?.version
            === 'string'
            ? extension.packageJSON.version
            : undefined,
        exportsType: classifyValue(extensionExports),
        exportsAvailable: extensionExports !== undefined &&
            extensionExports !== null,
        exportMembers: extensionExports !== undefined &&
            extensionExports !== null
            ? inspectObjectMembers(extensionExports, 'exports', 2)
            : [],
        runtimeCommands,
        packageCommands: extractPackageCommands(extension.packageJSON),
        packageViews: extractPackageViews(extension.packageJSON),
        packageConfigurationKeys: extractConfigurationKeys(extension.packageJSON),
    };
}
//# sourceMappingURL=bridge-inspector.js.map
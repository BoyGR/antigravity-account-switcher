import * as vscode from 'vscode';

const OFFICIAL_EXTENSION_ID = 'google.google-antigravity';

export interface ExportMemberInfo {
    path: string;
    kind: string;
    writable?: boolean;
    enumerable?: boolean;
    configurable?: boolean;
}

export interface CommandCandidate {
    id: string;
    source: 'runtime' | 'package';
}

export interface AntigravityBridgeInspection {
    extensionInstalled: boolean;
    extensionActive: boolean;
    extensionVersion?: string;

    exportsType: string;
    exportsAvailable: boolean;
    exportMembers: ExportMemberInfo[];

    runtimeCommands: CommandCandidate[];
    packageCommands: CommandCandidate[];

    packageViews: string[];
    packageConfigurationKeys: string[];
}

function classifyValue(value: unknown): string {
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
function inspectObjectMembers(
    value: unknown,
    rootName: string,
    maxDepth = 2,
): ExportMemberInfo[] {
    const result: ExportMemberInfo[] = [];
    const visited = new Set<object>();

    function walk(
        current: unknown,
        currentPath: string,
        depth: number,
    ): void {
        if (
            current === null ||
            (typeof current !== 'object' &&
                typeof current !== 'function')
        ) {
            return;
        }

        const objectValue = current as object;

        if (visited.has(objectValue)) {
            return;
        }

        visited.add(objectValue);

        let descriptors: PropertyDescriptorMap;

        try {
            descriptors =
                Object.getOwnPropertyDescriptors(objectValue);
        }
        catch {
            return;
        }

        for (
            const [name, descriptor]
            of Object.entries(descriptors)
        ) {
            if (
                name === 'length' ||
                name === 'name' ||
                name === 'prototype' ||
                name === 'caller' ||
                name === 'arguments'
            ) {
                continue;
            }

            const memberPath =
                currentPath.length > 0
                    ? `${currentPath}.${name}`
                    : name;

            if (
                typeof descriptor.get === 'function' ||
                typeof descriptor.set === 'function'
            ) {
                result.push({
                    path: memberPath,
                    kind:
                        descriptor.get && descriptor.set
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
                if (
                    memberValue !== null &&
                    (
                        typeof memberValue === 'object' ||
                        typeof memberValue === 'function'
                    )
                ) {
                    walk(
                        memberValue,
                        memberPath,
                        depth + 1,
                    );
                }
            }
        }
    }

    walk(value, rootName, 0);

    return result.sort((a, b) =>
        a.path.localeCompare(b.path),
    );
}

function isInterestingCommand(command: string): boolean {
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

    return (
        namespaces.some((term) =>
            normalized.includes(term),
        ) ||
        authTerms.some((term) =>
            normalized.includes(term),
        )
    );
}

function extractPackageCommands(
    packageJson: any,
): CommandCandidate[] {
    const commands =
        packageJson?.contributes?.commands;

    if (!Array.isArray(commands)) {
        return [];
    }

    return commands
        .map((entry: any) =>
            typeof entry?.command === 'string'
                ? entry.command
                : undefined,
        )
        .filter(
            (value: unknown): value is string =>
                typeof value === 'string',
        )
        .filter(isInterestingCommand)
        .map((id: string) => ({
            id,
            source: 'package' as const,
        }))
        .sort((a, b) =>
            a.id.localeCompare(b.id),
        );
}

function extractPackageViews(
    packageJson: any,
): string[] {
    const contributes = packageJson?.contributes;

    if (!contributes) {
        return [];
    }

    const result = new Set<string>();

    const containers =
        contributes.viewsContainers;

    if (
        containers &&
        typeof containers === 'object'
    ) {
        for (
            const entries
            of Object.values(containers)
        ) {
            if (!Array.isArray(entries)) {
                continue;
            }

            for (const entry of entries) {
                const id =
                    typeof (entry as any)?.id === 'string'
                        ? (entry as any).id
                        : undefined;

                if (id) {
                    result.add(id);
                }
            }
        }
    }

    const views = contributes.views;

    if (
        views &&
        typeof views === 'object'
    ) {
        for (
            const [containerId, entries]
            of Object.entries(views)
        ) {
            result.add(containerId);

            if (!Array.isArray(entries)) {
                continue;
            }

            for (const entry of entries) {
                const id =
                    typeof (entry as any)?.id === 'string'
                        ? (entry as any).id
                        : undefined;

                if (id) {
                    result.add(id);
                }
            }
        }
    }

    return [...result].sort();
}

function extractConfigurationKeys(
    packageJson: any,
): string[] {
    const configuration =
        packageJson?.contributes?.configuration;

    const configurations =
        Array.isArray(configuration)
            ? configuration
            : configuration
                ? [configuration]
                : [];

    const result = new Set<string>();

    for (const entry of configurations) {
        const properties = entry?.properties;

        if (
            !properties ||
            typeof properties !== 'object'
        ) {
            continue;
        }

        for (const key of Object.keys(properties)) {
            if (
                key.toLowerCase().includes(
                    'antigravity',
                ) ||
                key.toLowerCase().includes('auth') ||
                key.toLowerCase().includes('server')
            ) {
                result.add(key);
            }
        }
    }

    return [...result].sort();
}

export async function inspectAntigravityBridge():
    Promise<AntigravityBridgeInspection> {
    const extension =
        vscode.extensions.getExtension(
            OFFICIAL_EXTENSION_ID,
        );

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
    const extensionExports =
        extension.isActive
            ? extension.exports
            : undefined;

    const allCommands =
        await vscode.commands.getCommands(true);

    const runtimeCommands =
        allCommands
            .filter(isInterestingCommand)
            .map((id) => ({
                id,
                source: 'runtime' as const,
            }))
            .sort((a, b) =>
                a.id.localeCompare(b.id),
            );

    return {
        extensionInstalled: true,
        extensionActive: extension.isActive,
        extensionVersion:
            typeof extension.packageJSON?.version
                === 'string'
                ? extension.packageJSON.version
                : undefined,

        exportsType:
            classifyValue(extensionExports),

        exportsAvailable:
            extensionExports !== undefined &&
            extensionExports !== null,

        exportMembers:
            extensionExports !== undefined &&
            extensionExports !== null
                ? inspectObjectMembers(
                    extensionExports,
                    'exports',
                    2,
                )
                : [],

        runtimeCommands,

        packageCommands:
            extractPackageCommands(
                extension.packageJSON,
            ),

        packageViews:
            extractPackageViews(
                extension.packageJSON,
            ),

        packageConfigurationKeys:
            extractConfigurationKeys(
                extension.packageJSON,
            ),
    };
}
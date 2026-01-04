import { URL, fileURLToPath } from 'node:url';

import packageJson from './package.json' with { type: 'json' };

export const appName = 'firedragon';
export const appBasename = 'FireDragon';
export const repoUrl = packageJson.repository.url.replace(/\.git$/, '');
export const sourceDir = 'browser/firedragon';
export const version = packageJson.version;
export const firefoxVersion = packageJson.firefoxVersion;
export const objDir = 'obj';
export const editions = {
    dr460nized: {
        basename: 'firedragon',
        mozconfig: `${sourceDir}/mozconfig/edition/firedragon-dr460nized.mozconfig`,
        quasar: fileURLToPath(new URL('./branding/dr460nized/quasar.scss', import.meta.url)),
        displayName: 'Dr460nized',
    },
    catppuccin: {
        basename: 'firedragon-catppuccin',
        mozconfig: `${sourceDir}/mozconfig/edition/firedragon-catppuccin.mozconfig`,
        quasar: fileURLToPath(new URL('./branding/catppuccin/quasar.scss', import.meta.url)),
        displayName: 'Catppuccin',
    },
};
export const targets = {
    'darwin-arm64': {
        mozconfig: `${sourceDir}/mozconfig/target/darwin-arm64.mozconfig`,
        suffix: 'darwin-arm64',
        artifacts: {
            publish: ['dmg', 'update_framework_artifacts.zip'],
            dev: ['dmg', 'update_framework_artifacts.zip'],
            release: ['dmg', 'update_framework_artifacts.zip', 'mar', 'update.xml'],
        },
        packageDir: `${appName}/${appBasename}.app`,
        resourcesDir: `${appName}/${appBasename}.app/Contents/Resources`,
        binFile: appName,
        displayName: 'MacOS arm64',
    },
    'darwin-x64': {
        mozconfig: `${sourceDir}/mozconfig/target/darwin-x64.mozconfig`,
        suffix: 'darwin-x64',
        artifacts: {
            publish: ['dmg', 'update_framework_artifacts.zip'],
            dev: ['dmg', 'update_framework_artifacts.zip'],
            release: ['dmg', 'update_framework_artifacts.zip', 'mar', 'update.xml'],
        },
        packageDir: `${appName}/${appBasename}.app`,
        resourcesDir: `${appName}/${appBasename}.app/Contents/Resources`,
        binFile: appName,
        displayName: 'MacOS x64',
    },
    'linux-arm64': {
        mozconfig: `${sourceDir}/mozconfig/target/linux-arm64.mozconfig`,
        suffix: 'linux-arm64',
        artifacts: {
            publish: ['tar.xz'],
            dev: ['tar.xz'],
            release: ['tar.xz', 'mar', 'update.xml', 'AppImage'],
        },
        packageDir: appName,
        resourcesDir: appName,
        binFile: appName,
        displayName: 'Linux arm64',
    },
    'linux-x64': {
        mozconfig: `${sourceDir}/mozconfig/target/linux-x64.mozconfig`,
        suffix: 'linux-x64',
        artifacts: {
            publish: ['tar.xz'],
            dev: ['tar.xz'],
            release: ['tar.xz', 'mar', 'update.xml', 'AppImage'],
        },
        packageDir: appName,
        resourcesDir: appName,
        binFile: appName,
        displayName: 'Linux x64',
    },
    'win32-arm64': {
        mozconfig: `${sourceDir}/mozconfig/target/win32-arm64.mozconfig`,
        suffix: 'win32-arm64',
        artifacts: {
            publish: ['installer.exe', 'zip'],
            dev: ['zip'],
            release: ['installer.exe', 'zip', 'mar', 'update.xml'],
        },
        packageDir: appName,
        resourcesDir: appName,
        binFile: `${appName}.exe`,
        displayName: 'Windows arm64',
    },
    'win32-x64': {
        mozconfig: `${sourceDir}/mozconfig/target/win32-x64.mozconfig`,
        suffix: 'win32-x64',
        artifacts: {
            publish: ['installer.exe', 'zip'],
            dev: ['zip'],
            release: ['installer.exe', 'zip', 'mar', 'update.xml'],
        },
        packageDir: appName,
        resourcesDir: appName,
        binFile: `${appName}.exe`,
        displayName: 'Windows x64',
    },
};

export const cacheDir = '.cache';
export const distDir = '.dist';

// buildDir & profileDir are only used for dev builds
export const buildDir = '.build';
export const profileDir = '.profile';

export const defaultEdition = 'dr460nized';
export const defaultTarget = `${process.platform}-${process.arch}`;

export function getEdition(edition: string = defaultEdition) {
    if (edition in editions) {
        return editions[edition as keyof typeof editions];
    }
    return null;
}

export function getTarget(target: string = defaultTarget) {
    if (target in targets) {
        return targets[target as keyof typeof targets];
    }
    return null;
}

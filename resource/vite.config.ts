import firedragonVite from '@firedragon13/lib/vite';
import { globby } from 'globby';
import { defineConfig, type UserConfig } from 'vite';

export default defineConfig(async (): Promise<UserConfig> => {
    const entry: Record<string, string> = {};

    for (const fileName of await globby('**/*.sys.mts', { cwd: 'src' })) {
        entry[fileName.replace(/\.mts$/, '.mjs')] = `src/${fileName}`;
    }

    return {
        base: 'resource://firedragon/',
        build: {
            lib: {
                entry,
                formats: ['es'],
                fileName(_format, entryName) {
                    return entryName;
                },
            },
        },
        plugins: [
            firedragonVite({
                registrations: [
                    {
                        type: 'resource',
                        name: 'firedragon',
                        path: '%',
                    },
                    {
                        type: 'category',
                        category: 'app-startup',
                        entry: 'ConfigLoader',
                        value: '@firedragon/config/config-loader;1',
                        flags: {
                            process: 'main',
                        },
                    },
                    {
                        type: 'category',
                        category: 'firedragon-config-sandbox',
                        entry: 'resource://firedragon/modules/config/ConfigVersion.sys.mjs',
                        value: 'ConfigVersion.enrichConfigSandbox',
                    },
                    {
                        type: 'category',
                        category: 'browser-first-window-ready',
                        entry: 'resource://firedragon/modules/AboutNewTab.sys.mjs',
                        value: 'AboutNewTab.init',
                    },
                    {
                        type: 'category',
                        category: 'browser-window-domcontentloaded',
                        entry: 'resource://firedragon/modules/DefaultShortcutsManager.sys.mjs',
                        value: 'DefaultShortcutsManager.init',
                    },
                    {
                        type: 'category',
                        category: 'app-startup',
                        entry: 'TranslationFeatureManager',
                        value: '@firedragon/translation-feature-manager;1',
                        flags: {
                            process: 'main',
                        },
                    },
                ],
            }),
        ],
    };
});

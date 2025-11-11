import firedragonVite from '@firedragon13/lib-vite';
import { globby } from 'globby';
import { defineConfig, type UserConfig } from 'vite';

export default defineConfig(async (): Promise<UserConfig> => {
    const input: Record<string, string> = {};

    for (const fileName of await globby('**/*.sys.mts', { cwd: 'src' })) {
        input[fileName.replace(/\.mts$/, '')] = `src/${fileName}`;
    }

    return {
        base: 'resource://firedragon/',
        build: {
            assetsDir: 'vendor',
            rolldownOptions: {
                input,
                output: {
                    entryFileNames: '[name].mjs',
                },
                preserveEntrySignatures: 'strict',
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
                        category: 'firedragon/browser-startup',
                        entry: 'resource://firedragon/modules/AboutNewTabRedirector.sys.mjs',
                        value: 'AboutNewTabRedirectorManager.init',
                    },
                    {
                        type: 'category',
                        category: 'app-startup',
                        entry: 'BrowserStartup',
                        value: '@firedragon/browser-startup;1',
                        flags: {
                            application: '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}',
                        },
                    },
                    {
                        type: 'category',
                        category: 'firedragon/browser-startup',
                        entry: 'resource://firedragon/modules/ConfigLoader.sys.mjs',
                        value: 'ConfigLoader.init',
                    },
                    {
                        type: 'category',
                        category: 'browser-before-ui-startup',
                        entry: 'resource://firedragon/modules/SkinManager.sys.mjs',
                        value: 'SkinManager.loadUserJs',
                    },
                    {
                        type: 'category',
                        category: 'browser-idle-startup',
                        entry: 'resource://firedragon/modules/TranslationFeatureManager.sys.mjs',
                        value: 'TranslationFeatureManager.init',
                    },
                ],
            }),
        ],
    };
});

import { vite } from '@firedragon/build/vite';
import { globby } from 'globby';
import { type UserConfig, defineConfig } from 'vite';

export default defineConfig(async ({ mode }) => {
    const entry: Record<string, string> = {};

    for (const fileName of await globby('**/*.sys.mts', { cwd: 'src' })) {
        entry[fileName.replace(/\.mts$/, '')] = `src/${fileName}`;
    }

    return {
        base: 'resource://firedragon/',
        build: {
            minify: mode === 'production',
            lib: {
                entry,
                formats: ['es'],
            },
        },
        plugins: [
            vite({
                registrations: [
                    {
                        type: 'resource',
                        name: 'firedragon',
                        path: '%',
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
                        entry: 'resource://firedragon/modules/AboutNewTabRedirector.sys.mjs',
                        value: 'AboutNewTabRedirectorManager.init',
                    },
                    {
                        type: 'category',
                        category: 'firedragon/browser-startup',
                        entry: 'resource://firedragon/modules/config/ConfigLoader.sys.mjs',
                        value: 'ConfigLoader.loadConfig',
                    },
                    {
                        type: 'category',
                        category: 'firedragon/browser-startup',
                        entry: 'resource://firedragon/modules/SkinController.sys.mjs',
                        value: 'SkinController.onBrowserStartup',
                    },
                    {
                        type: 'category',
                        category: 'firedragon/browser-startup',
                        entry: 'resource://firedragon/modules/UblockCompat.sys.mjs',
                        value: 'UblockCompat.init',
                    },
                ],
            }),
        ],
    } as UserConfig;
});

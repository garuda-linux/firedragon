import { fileURLToPath, URL } from 'node:url';

import firedragonVite from '@firedragon13/lib-vite';
import { globby } from 'globby';
import { defineConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import AutoImport from "unplugin-auto-import/vite";
import firedragonVuePreset from '@firedragon13/lib-vue/auto-import';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
    const input: Record<string, string> = {};

    for (const fileName of await globby('src/entrypoints/*/*{.ts{,x},.css,/index.{ts{,x},css}}')) {
        input[fileName.split('/').slice(2, 4).join('-').replace(/\.(tsx?|css)$/, '')] = fileName;
    }

    const base = 'chrome://firedragon/content/';
    return {
        base,
        build: {
            assetsDir: '',
            rolldownOptions: {
                input,
            },
        },
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement(tag) {
                            return tag.startsWith('xul:');
                        },
                    },
                },
            }),
            vueI18n({
                include: [
                    fileURLToPath(new URL('./src/locales/*', import.meta.url)),
                ],
            }),
            AutoImport({
                dts: true,
                dtsMode: 'overwrite',
                imports: [
                    'vue',
                    'vue-i18n',
                    firedragonVuePreset,
                ],
                ignore: ['createApp', 'h'],
                dirs: [
                    './src/composables',
                ],
            }),
            {
                name: 'generate-inc.xhtml',
                generateBundle(_output, bundle) {
                    const files = new Map();
                    for (const chunk of Object.values(bundle)) {
                        if (chunk.type === 'chunk' && chunk.isEntry) {
                            const file = `${chunk.fileName.split('-')[0]}.inc.xhtml`;
                            if (chunk.code !== '') {
                                files.set(file, (files.get(file) ?? '') + `<script type="module" src="${base}${chunk.fileName}"></script>\n`);
                            }
                            for (const css of chunk.viteMetadata?.importedCss ?? []) {
                                files.set(file, (files.get(file) ?? '') + `<link rel="stylesheet" href="${base}${css}" />\n`);
                            }
                        }
                    }
                    for (const [fileName, source] of files) {
                        this.emitFile({
                            type: 'asset',
                            fileName,
                            source,
                        });
                    }
                },
            },
            firedragonVite({
                prefix: 'content/',
                exclude: [
                    'browser.inc.xhtml',
                    'preferences.inc.xhtml',
                ],
                registrations: [
                    {
                        type: 'content',
                        name: 'firedragon',
                        path: '%content/',
                    },
                ],
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    };
});

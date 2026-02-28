import { URL, fileURLToPath } from 'node:url';

import { vite } from '@firedragon/build/vite';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import { globby } from 'globby';
import { type Plugin, defineConfig } from 'vite';

export default defineConfig(async ({ mode }) => ({
    base: 'chrome://firedragon/content/',
    build: {
        minify: mode === 'production',
        rollupOptions: {
            input: await globby('*.html'),
        },
    },
    plugins: [
        vite({
            prefix: 'content/',
            exclude: /\.inc\.html$/,
            registrations: [
                {
                    type: 'content',
                    name: 'firedragon',
                    path: '%content/',
                },
            ],
        }),
        vueI18n({
            include: [fileURLToPath(new URL('./assets/locales/*', import.meta.url))],
        }),
        {
            name: 'firedragon/content/xhtml-fix',
            transformIndexHtml(html) {
                return html.replace(/ crossorigin/g, '').replace(/(<link[^>]*)>/g, '$1/>');
            },
        } as Plugin,
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./', import.meta.url)),
        },
    },
}));

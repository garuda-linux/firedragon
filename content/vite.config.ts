import { URL, fileURLToPath } from 'node:url';

import { vite } from '@firedragon/build/vite';
import { globby } from 'globby';
import { type Plugin, defineConfig } from 'vite';

export default defineConfig(async ({ mode }) => ({
    base: 'chrome://firedragon/content/',
    build: {
        assetsDir: '',
        minify: mode === 'production',
        rollupOptions: {
            input: [...(await globby('*.html')), ...(await globby('src/*.ts'))],
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
    plugins: [
        vite({
            prefix: 'content/',
            exclude: /\.inc\.html$/,
            preprocess: /sidebar\.xhtml/,
            registrations: [
                {
                    type: 'content',
                    name: 'firedragon',
                    path: '%content/',
                },
            ],
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

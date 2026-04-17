import { URL, fileURLToPath } from 'node:url';

import { vite } from '@firedragon/build/vite';
import { globby } from 'globby';
import { defineConfig } from 'vite';

export default defineConfig(async ({ mode }) => ({
    base: 'chrome://firedragon/content/',
    build: {
        minify: mode === 'production',
        cssCodeSplit: true,
        lib: {
            entry: await globby('src/*.ts'),
            formats: ['es'],
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
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./', import.meta.url)),
        },
    },
}));

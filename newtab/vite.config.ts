import { URL, fileURLToPath } from 'node:url';

import analog from '@analogjs/platform';
import { vite } from '@firedragon/build/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    base: 'chrome://firedragon-newtab/content/',
    resolve: {
        mainFields: ['module'],
    },
    plugins: [
        analog({
            workspaceRoot: fileURLToPath(new URL('.', import.meta.url)),
            ssr: false,
            static: true,
            prerender: {
                routes: [],
            },
        }),
        tailwindcss(),
        vite({
            prefix: 'content/newtab/',
            registrations: [
                {
                    type: 'content',
                    name: 'firedragon-newtab',
                    path: '%content/newtab/',
                },
            ],
        }),
    ],
});

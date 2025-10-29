import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import analog from "@analogjs/platform";
import tailwindcss from "@tailwindcss/vite";
import firedragonVite from "@firedragon13/lib-vite";

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
        firedragonVite({
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

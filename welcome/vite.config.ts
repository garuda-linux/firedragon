import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { unheadVueComposablesImports } from '@unhead/vue';
import firedragonVite from '@firedragon13/lib-vite';
import firedragonVuePreset from '@firedragon13/lib-vue/auto-import';

export default defineConfig({
    base: 'chrome://firedragon-welcome/content/',
    plugins: [
        vue({
            template: {
                transformAssetUrls,
            },
        }),
        vueI18n({
            include: [
                fileURLToPath(new URL('./src/locales/*', import.meta.url)),
            ],
        }),
        quasar(),
        AutoImport({
            dtsMode: 'overwrite',
            imports: [
                'vue',
                '@vueuse/core',
                'quasar',
                unheadVueComposablesImports,
                {
                    'vue-i18n': [
                        'useI18n',
                    ],
                },
                firedragonVuePreset,
            ],
            dirs: [
                './src/composables',
            ],
        }),
        firedragonVite({
            prefix: 'content/welcome/',
            registrations: [
                {
                    type: 'content',
                    name: 'firedragon-welcome',
                    path: '%content/welcome/',
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});


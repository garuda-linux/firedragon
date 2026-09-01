import { URL, fileURLToPath } from 'node:url';

import defineConfig from '@firedragon/build/wxt-config';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import devtools from 'vite-plugin-vue-devtools';

import { getEdition } from '../../config';

export default defineConfig({
    modules: ['@wxt-dev/module-vue'],
    firedragon: {
        id: 'firedragon-workspaces',
    },
    imports: {
        presets: ['@vueuse/core', 'quasar', 'vue-i18n'],
    },
    vue: {
        vite: {
            template: {
                transformAssetUrls,
            },
        },
    },
    manifest: {
        name: 'FireDragon Workspaces',
        permissions: ['contextMenus', 'sessions', 'storage', 'tabs', 'tabHide'],
        commands: {
            'switchToRelative+1': {
                description: 'Go to the next workspace',
            },
            'switchToRelative-1': {
                description: 'Go to the previous workspace',
            },
            switchToIndex0: {
                description: 'Got to first workspace',
            },
            switchToIndex1: {
                description: 'Got to second workspace',
            },
            switchToIndex2: {
                description: 'Got to third workspace',
            },
            switchToIndex3: {
                description: 'Got to fourth workspace',
            },
            switchToIndex4: {
                description: 'Got to fifth workspace',
            },
            switchToIndex5: {
                description: 'Got to sixth workspace',
            },
            switchToIndex6: {
                description: 'Got to seventh workspace',
            },
            switchToIndex7: {
                description: 'Got to eighth workspace',
            },
            switchToIndex8: {
                description: 'Got to ninth workspace',
            },
            switchToIndex9: {
                description: 'Got to tenth workspace',
            },
            'moveTabToRelative+1': {
                description: 'Move tab to the next workspace',
            },
            'moveTabToRelative-1': {
                description: 'Move tab to the previous workspace',
            },
            moveTabToIndex0: {
                description: 'Move tab to first workspace',
            },
            moveTabToIndex1: {
                description: 'Move tab to second workspace',
            },
            moveTabToIndex2: {
                description: 'Move tab to third workspace',
            },
            moveTabToIndex3: {
                description: 'Move tab to fourth workspace',
            },
            moveTabToIndex4: {
                description: 'Move tab to fifth workspace',
            },
            moveTabToIndex5: {
                description: 'Move tab to sixth workspace',
            },
            moveTabToIndex6: {
                description: 'Move tab to seventh workspace',
            },
            moveTabToIndex7: {
                description: 'Move tab to eighth workspace',
            },
            moveTabToIndex8: {
                description: 'Move tab to ninth workspace',
            },
            moveTabToIndex9: {
                description: 'Move tab to tenth workspace',
            },
        },
    },
    vite: () => ({
        plugins: [
            vueI18n({
                include: [fileURLToPath(new URL('./assets/locales/*', import.meta.url))],
            }),
            quasar({
                sassVariables: getEdition()?.quasar,
            }),
            devtools({
                appendTo: /\/entrypoints\/(index|popup|sidepanel)\/main.ts$/,
            }),
        ],
    }),
});

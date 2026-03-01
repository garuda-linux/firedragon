import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => ({
    build: {
        minify: mode === 'production',
        lib: {
            entry: {
                'experiment-api/prefs': './src/experiment-api/prefs.ts',
                'types/keyboard-shortcuts': './src/types/keyboard-shortcuts.ts',
                'vue/createStorage': './src/vue/createStorage.ts',
                'vue/usePref': './src/vue/usePref',
            },
            formats: ['es'],
        },
        rollupOptions: {
            external: ['@vue/reactivity', 'deep-equal', 'webextension-polyfill', 'wxt/browser'],
        },
    },
    plugins: [
        dts({
            entryRoot: 'src',
            include: 'src/**/*.ts',
        }),
    ],
}));

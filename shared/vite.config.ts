import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: ['./src/experiment-api.ts', './src/types.ts', './src/vue.ts'],
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
});

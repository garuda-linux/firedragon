import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: ['./src/vite.ts', './src/wxt-client.ts', './src/wxt-config.ts', './src/wxt-module.ts'],
            formats: ['es'],
        },
        rollupOptions: {
            external: ['node:fs/promises', 'node:url', 'globby', 'vite', 'wxt', 'wxt/modules', '../../config.ts'],
        },
    },
    plugins: [
        dts({
            entryRoot: 'src',
            include: 'src/**/*.ts',
        }),
    ],
});

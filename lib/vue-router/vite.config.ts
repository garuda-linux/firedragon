import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: [
                './src/index.ts',
            ],
            formats: ['es'],
        },
        rolldownOptions: {
            external: ['@vue/reactivity', 'vue-router'],
        }
    },
    plugins: [
        dts({
            entryRoot: 'src',
            include: 'src/**/*.ts',
        }),
    ],
});

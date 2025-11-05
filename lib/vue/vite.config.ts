import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: [
                './src/index.ts',
                './src/auto-import.ts'
            ],
            formats: ['es'],
        },
        rolldownOptions: {
            external: ['@vue/reactivity'],
        }
    },
    plugins: [
        dts({
            entryRoot: 'src',
            include: 'src/**/*.ts',
        }),
    ],
});

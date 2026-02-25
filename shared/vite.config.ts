import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: ['./src/types.ts'],
            formats: ['es'],
        },
        rollupOptions: {
            external: [],
        },
    },
    plugins: [
        dts({
            entryRoot: 'src',
            include: 'src/**/*.ts',
        }),
    ],
});

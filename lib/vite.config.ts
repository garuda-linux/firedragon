import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: {
                vite: 'src/vite.ts',
            },
            formats: ['es'],
        },
        rolldownOptions: {
            external: ['globby'],
        }
    },
    plugins: [
        dts({
            entryRoot: 'src',
            include: 'src/**/*.ts',
        }),
    ],
});

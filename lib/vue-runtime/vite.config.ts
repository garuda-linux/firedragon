import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => ({
    build: {
        lib: {
            entry: [
                './src/index.ts',
            ],
            formats: ['es'],
        },
        rolldownOptions: {
            external: [
                '@vue/shared',
                '@vue/runtime-core',
                '@vue/reactivity',
                'csstype',
            ],
        }
    },
    define: {
        __DEV__: mode === 'development',
        __COMPAT__: false,
        __SSR__: false,
    },
    plugins: [
        dts({
            entryRoot: 'src',
            include: 'src/**/*.ts',
        }),
    ],
}));

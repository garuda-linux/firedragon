import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: [
        'src/experiment-api/prefs.ts',
        'src/types/keyboard-shortcuts.ts',
        'src/vue/createStorage.ts',
        'src/vue/usePref.ts',
    ],
    dts: true,
    exports: true,
});

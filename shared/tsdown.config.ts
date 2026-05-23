import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: [
        'src/types/extensions.ts',
        'src/types/keyboard-shortcuts.ts',
        'src/types/sidebar.ts',
        'src/vue/createStorage.ts',
        'src/vue/toggleRefs.ts',
        'src/vue/usePref.ts',
    ],
    dts: true,
    exports: true,
});

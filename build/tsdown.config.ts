import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/vite.ts', 'src/wxt-client.ts', 'src/wxt-config.ts', 'src/wxt-module.ts'],
    dts: true,
    exports: true,
});

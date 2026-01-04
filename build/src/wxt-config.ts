import { type UserConfig, defineConfig as defineWxtConfig } from 'wxt';

export default function defineConfig(config: UserConfig) {
    config.browser = 'firefox';

    config.modules ??= [];
    config.modules.push('@firedragon/build/wxt-module');

    config.outDir = 'dist';
    config.outDirTemplate = '';

    config.webExt ??= {};
    config.webExt.disabled = true;

    config.dev ??= {};
    config.dev.server ??= {};
    config.dev.server.host = '127.0.0.1';
    config.dev.server.port = Math.floor(Math.random() * 50000) + 10000;

    return defineWxtConfig(config);
}

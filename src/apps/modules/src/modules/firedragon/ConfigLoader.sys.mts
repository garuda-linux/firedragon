import type { File } from './File.sys.mts';
import type { ConfigSandbox } from './ConfigSandbox.sys.mts';

const lazy: {
    File: typeof File,
    ConfigSandbox: typeof ConfigSandbox,
} = {};

ChromeUtils.defineESModuleGetters(lazy, {
    File: 'resource://noraneko/modules/firedragon/File.sys.mjs',
    ConfigSandbox: 'resource://noraneko/modules/firedragon/ConfigSandbox.sys.mjs',
});

declare global {
    interface fdIConfigLoader {
        loadConfig(url: string): void;
    }

    interface nsIXPCComponents_Interfaces {
        fdIConfigLoader: nsJSIID<fdIConfigLoader>;
    }
}

export class ConfigLoader implements fdIConfigLoader {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
        Ci.fdIConfigLoader,
    ]);

    observe(_subject, topic, _data): void {
        if (topic === 'app-startup') {
            this.loadConfig(lazy.File.fromDirsvc('GreD').append('firedragon.cfg').url);
        }
    }

    loadConfig(url: URL | string): void {
        const file = lazy.File.fromUrl(url);
        console.info(`[ConfigLoader] Loading config: ${file.url} (${file.path})`);
        if (file.exists()) {
            try {
                (new lazy.ConfigSandbox(file)).sandbox.loadScript(file.url);
            } catch (e) {
                console.error(`[ConfigLoader] Error while loading ${file.url}:`, e);
            }
        } else {
            console.warn(`[ConfigLoader] File does not exist: ${file.path}`);
        }
    }
}

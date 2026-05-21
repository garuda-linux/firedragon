import { SafeModeController } from 'resource://firedragon/modules/SafeModeController.sys.mjs';
import { Version } from 'resource://firedragon/modules/Version.sys.mjs';
import { ConfigContainer } from 'resource://firedragon/modules/config/ConfigContainer.sys.mjs';
import { File } from 'resource://firedragon/modules/utils/File.sys.mjs';
import { SandboxBuilder } from 'resource://firedragon/modules/utils/SandboxBuilder.sys.mjs';

export const ConfigLoader = new (class {
    readonly dirs = [
        Services.io.newURI('chrome://firedragon-config/content/'),
        File.fromDirsvc('GreD').append('config').uri,
        File.fromDirsvc('UAppData').append('config').uri,
    ];

    private find(filename: string): { source: string; uri: nsIURI } {
        let result: { source: string; uri: nsIURI } | null = null;
        for (const dir of this.dirs) {
            try {
                const uri = Services.io.newURI(dir.resolve(filename));
                const source = Cu.readUTF8URI(uri);
                result = { source, uri };
                break;
            } catch (e) {}
        }
        if (result) {
            return result;
        }
        throw `Could not find ${filename} in (${this.dirs.map((dir) => dir.spec).join(', ')})`;
    }

    private createSandbox(): SandboxBuilder {
        const sandbox = SandboxBuilder.create();

        // Browser version API
        sandbox
            .createObject('gVersion')
            .defineGetter('version', () => Version.version)
            .defineGetter('lastVersion', () => Version.lastVersion)
            .defineFunction('compare', Version.compare);

        // Console proxy API
        sandbox
            .createObject('console')
            .defineFunction('log', globalThis.console.log)
            .defineFunction('info', globalThis.console.info)
            .defineFunction('warn', globalThis.console.warn)
            .defineFunction('error', globalThis.console.error);

        // Load APIs
        sandbox
            .defineFunction(
                'getUrl',
                (dirsvc: string, ...nodes: string[]) => File.fromDirsvc(dirsvc).append(...nodes).url,
            )
            .defineFunction('load', (url: string) => {
                let source: string;
                try {
                    source = Cu.readUTF8URI(Services.io.newURI(url));
                } catch (e) {
                    console.warn(`[ConfigLoader] Could not find file ${url}`);
                    return false;
                }
                console.log(`[ConfigLoader] Loading file ${url}`);
                try {
                    Cu.evalInSandbox(source, sandbox.sandbox);
                } catch (e) {
                    throw `Error while loading file ${url}: ${e}`;
                }
                return true;
            });

        // Legacy prefcalls API
        sandbox
            .defineFunction('getenv', (name: string) => Services.env.get(name))
            .defineFunction('displayError', (funcname, message) => {
                console.error(`[${funcname}] ${message}`);
            });

        return sandbox;
    }

    loadPreset(name: string, container: ConfigContainer) {
        if (!/[a-zA-Z0-9_-]/.test(name)) {
            throw `Invalid preset name: ${name}`;
        }

        if (
            !SafeModeController.forToggle({ id: `configLoader.preset.${name}`, label: `ConfigLoader: Preset: ${name}` })
        ) {
            return;
        }

        const { source, uri } = this.find(`./presets/${name}.js`),
            sandbox = this.createSandbox();

        // FireDragon preset API
        sandbox
            .defineFunction('setDefault', container.setDefault.bind(container))
            .defineFunction('unsetDefault', container.unsetDefault.bind(container))
            .defineFunction('setOverride', container.setOverride.bind(container))
            .defineFunction('unsetOverride', container.unsetOverride.bind(container))
            .defineFunction('lock', container.lock.bind(container))
            .defineFunction('unlock', container.unlock.bind(container))
            .defineFunction('getEnv', container.getEnv.bind(container))
            .defineFunction('setEnv', container.setEnv.bind(container));

        // Legacy prefcalls API
        sandbox
            .defineFunction('defaultPref', container.setDefault.bind(container))
            .defineFunction('pref', container.setOverride.bind(container))
            .defineFunction('lockPref', (prefName: string, value: any) => {
                container.setDefault(prefName, value);
                container.lock(prefName);
            })
            .defineFunction('unlockPref', container.unlock.bind(container))
            .defineFunction('clearPref', (prefName: string) => {
                container.setOverride(prefName, null);
            })
            .defineFunction('getPref', (prefName: string, fallbackValue?: any) => {
                const value = container.getPref(prefName);
                if (value === null && fallbackValue === undefined) {
                    throw `Could not find pref ${prefName}`;
                }
                return value ?? fallbackValue;
            });

        console.log(`[ConfigLoader] Loading preset ${name} (${uri.spec})`);
        try {
            sandbox.eval(source, undefined, uri.spec, 1);
        } catch (e) {
            throw `Error while loading preset ${name} (${uri.spec}): ${e}`;
        }
    }

    loadConfig() {
        if (!SafeModeController.forToggle({ id: 'configLoader ', label: 'ConfigLoader' })) {
            return;
        }

        try {
            const { source, uri } = this.find('./firedragon.js');

            const sandbox = this.createSandbox(),
                container = new ConfigContainer();

            sandbox.defineFunction('preset', (name: string) => {
                this.loadPreset(name, container);
            });

            console.log(`[ConfigLoader] Loading config ${uri.spec}`);
            try {
                sandbox.eval(source, undefined, uri.spec, 1);
            } catch (e) {
                throw `Error while loading config ${uri.spec}: ${e}`;
            }

            container.apply();
        } catch (e) {
            console.error(`[ConfigLoader] ${e}`);
        }
    }
})();

import { File } from 'resource://firedragon/modules/File.sys.mjs';
import { Version } from 'resource://firedragon/modules/Version.sys.mjs';

export const ConfigLoader = new class {
    init(): void {
        const entry = Services.prefs.getStringPref('firedragon.cfg.entry');
        if (entry) {
            const url = new URL(entry);
            if (url.protocol === 'dirsvc:') {
                this.loadConfig(File.fromDirsvc(url.host).append(...url.pathname.replace(/^\//, '').split('/')).url);
            } else {
                this.loadConfig(entry);
            }
        }
    }

    getPrefBranch(prefRoot: string | null = null): nsIPrefBranch {
        return Services.prefs.getBranch(prefRoot);
    }

    setPrefInBranch(prefBranch: nsIPrefBranch, prefName: string, value: any): void {
        switch (typeof value) {
            case 'string':
                prefBranch.setStringPref(prefName, value);
                break;
            case 'number':
                prefBranch.setIntPref(prefName, value);
                break;
            case 'boolean':
                prefBranch.setBoolPref(prefName, value);
                break;
            default:
                throw `value must be either string, number or boolean: ${prefName}: ${value}`;
        }
    }

    pref(prefName: string, value: any): void {
        this.setPrefInBranch(this.getPrefBranch(), prefName, value);
    }

    defaultPref(prefName: string, value: any): void {
        this.setPrefInBranch(Services.prefs.getDefaultBranch(null), prefName, value);
    }

    defaultJson(prefName: string, value: any): void {
        const defaultPrefBranch = this.getPrefBranch('defaultJson.');
        const prefBranch = this.getPrefBranch();
        prefBranch.setStringPref(prefName, JSON.stringify((function updateJson(value, d, u) {
            for (const key in value) {
                if ([ value[key], d[key], u[key] ].every(x => typeof x === 'object' && x)) {
                    u[key] = updateJson(value[key], d[key], u[key]);
                } else if (d[key] === u[key]) {
                    u[key] = value[key];
                }
            }
            return u;
        })(
            value,
            JSON.parse(defaultPrefBranch.getStringPref(prefName, '{}')),
            JSON.parse(prefBranch.getStringPref(prefName, '{}')),
        )));
        defaultPrefBranch.setStringPref(prefName, JSON.stringify(value));
    }

    lockPref(prefName: string, value: any): void {
        const prefBranch = this.getPrefBranch();

        if (prefBranch.prefIsLocked(prefName)) {
            prefBranch.unlockPref(prefName);
        }

        this.defaultPref(prefName, value);

        prefBranch.lockPref(prefName);
    }

    unlockPref(prefName: string) {
        this.getPrefBranch().unlockPref(prefName);
    }

    getPref(prefName: string): any {
        const prefBranch = this.getPrefBranch();

        switch (prefBranch.getPrefType(prefName)) {
            case prefBranch.PREF_STRING:
                return prefBranch.getStringPref(prefName);
            case prefBranch.PREF_INT:
                return prefBranch.getIntPref(prefName);
            case prefBranch.PREF_BOOL:
                return prefBranch.getBoolPref(prefName);
            default:
                throw `invalid pref: ${prefName}`;
        }
    }

    clearPref(prefName: string): void {
        this.getPrefBranch().clearUserPref(prefName);
    }

    getUrl(prop: string, ...nodes: string[]): string {
        return File.fromDirsvc(prop).append(...nodes).url;
    }

    loadConfig(url: URL | string): void {
        const file = File.fromUrl(url);

        globalThis.console.info(`[ConfigLoader] Loading config: ${file.url} (${file.path})`);

        if (!file.exists()) {
            globalThis.console.warn(`[ConfigLoader] File does not exists: ${file.path}`);
            return;
        }
        if (!file.isFile()) {
            globalThis.console.error(`[ConfigLoader] Not a file: ${file.path}`);
            return;
        }

        const sandbox = Cu.Sandbox(null, {
            wantGlobalProperties: ['URL'],
        });

        // Default prefcalls
        Cu.exportFunction(this.pref.bind(this), sandbox, { defineAs: 'pref' });
        Cu.exportFunction(this.defaultPref.bind(this), sandbox, { defineAs: 'defaultPref' });
        Cu.exportFunction(this.lockPref.bind(this), sandbox, { defineAs: 'lockPref' });
        Cu.exportFunction(this.unlockPref.bind(this), sandbox, { defineAs: 'unlockPref' });
        Cu.exportFunction(this.getPref.bind(this), sandbox, { defineAs: 'getPref' });
        Cu.exportFunction(this.clearPref.bind(this), sandbox, { defineAs: 'clearPref' });

        // Special prefs
        Cu.exportFunction(this.defaultJson.bind(this), sandbox, { defineAs: 'defaultJson' });

        // Load configs
        Cu.exportFunction(this.getUrl.bind(this), sandbox, { defineAs: 'getUrl' });
        Cu.exportFunction(this.loadConfig.bind(this), sandbox, { defineAs: 'loadConfig' });

        // Config metadata
        const gConfig = Cu.createObjectIn(sandbox, { defineAs: 'gConfig' });
        Object.defineProperty(gConfig, 'path', {
            get: () => file.path,
        });
        Object.defineProperty(gConfig, 'url', {
            get: () => file.url,
        });

        // Browser version
        const gVersion = Cu.createObjectIn(sandbox, { defineAs: 'gVersion' });
        Object.defineProperties(gVersion, {
            version: {
                get: () => Version.version,
            },
            lastVersion: {
                get: () => Version.lastVersion,
            },
        });
        Cu.exportFunction(Version.compare, gVersion, { defineAs: 'compare' });

        // Console proxy
        const console = Cu.createObjectIn({ defineAs: 'console' });
        Cu.exportFunction(globalThis.console.log, console, { defineAs: 'log' });
        Cu.exportFunction(globalThis.console.info, console, { defineAs: 'info' });
        Cu.exportFunction(globalThis.console.warn, console, { defineAs: 'warn' });
        Cu.exportFunction(globalThis.console.error, console, { defineAs: 'error' });

        try {
            Services.scriptloader.loadSubScript(file.url, sandbox);
        } catch (e) {
            globalThis.console.error(`[ConfigLoader] Error while loading ${file.url}:`, e);
        }
    }
};

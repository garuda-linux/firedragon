import type { File } from './File.sys.mts';
import type { Sandbox } from './Sandbox.sys.mts';

const lazy: {
    File: typeof File,
    Sandbox: typeof Sandbox,
} = {};

ChromeUtils.defineESModuleGetters(lazy, {
    File: 'resource://noraneko/modules/firedragon/File.sys.mjs',
    Sandbox: 'resource://noraneko/modules/firedragon/Sandbox.sys.mjs',
});

export class ConfigSandbox {
    public readonly sandbox: Sandbox;

    constructor(
        private file: File,
    ) {
        this.sandbox = lazy.Sandbox.create(null, {
            wantGlobalProperties: ['URL'],
        });

        // Default prefcalls
        this.sandbox.defineFunction('pref', this.pref.bind(this));
        this.sandbox.defineFunction('defaultPref', this.defaultPref.bind(this));
        this.sandbox.defineFunction('lockPref', this.lockPref.bind(this));
        this.sandbox.defineFunction('unlockPref', this.unlockPref.bind(this));
        this.sandbox.defineFunction('getPref', this.getPref.bind(this));
        this.sandbox.defineFunction('clearPref', this.clearPref.bind(this));

        // Special prefs
        this.sandbox.defineFunction('defaultJson', this.defaultJson.bind(this));

        // Load configs
        this.sandbox.defineFunction('getUrl', this.getUrl.bind(this));
        this.sandbox.defineFunction('loadConfig', this.loadConfig.bind(this));
        this.sandbox.defineFunction('loadConfigsFrom', this.loadConfigFrom.bind(this));

        // Config metadata
        const gConfig = this.sandbox.createObjectIn('gConfig');
        gConfig.defineGetter('path', () => this.file.path);
        gConfig.defineGetter('url', () => this.file.url);

        // Console proxy
        const console = this.sandbox.createObjectIn('console');
        console.defineFunction('log', globalThis.console.log);
        console.defineFunction('info', globalThis.console.info);
        console.defineFunction('warn', globalThis.console.warn);
        console.defineFunction('error', globalThis.console.error);
    }

    private getPrefBranch(prefRoot: string | null = null): nsIPrefBranch {
        return Services.prefs.getBranch(prefRoot);
    }

    private setPrefInBranch(prefBranch: nsIPrefBranch, prefName: string, value: any): void {
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

    private pref(prefName: string, value: any): void {
        this.setPrefInBranch(this.getPrefBranch(), prefName, value);
    }

    private defaultPref(prefName: string, value: any): void {
        this.setPrefInBranch(Services.prefs.getDefaultBranch(null), prefName, value);
    }

    private defaultJson(prefName: string, value: any): void {
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

    private lockPref(prefName: string, value: any): void {
        const prefBranch = this.getPrefBranch();

        if (prefBranch.prefIsLocked(prefName)) {
            prefBranch.unlockPref(prefName);
        }

        this.defaultPref(prefName, value);

        prefBranch.lockPref(prefName);
    }

    private unlockPref(prefName: string) {
        this.getPrefBranch().unlockPref(prefName);
    }

    private getPref(prefName: string): any {
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

    private clearPref(prefName: string): void {
        this.getPrefBranch().clearUserPref(prefName);
    }

    private getUrl(prop: string, ...nodes: string[]): string {
        return lazy.File.fromDirsvc(prop).append(...nodes).url;
    }

    private loadConfig(url: URL | string): void {
        Cc['@firedragon/configloader;1'].getService(Ci.fdIConfigLoader).loadConfig(url);
    }

    private loadConfigFrom(url: URL | string): void {
        Cc['@firedragon/configloader;1'].getService(Ci.fdIConfigLoader).loadConfigsFrom(url);
    }
}

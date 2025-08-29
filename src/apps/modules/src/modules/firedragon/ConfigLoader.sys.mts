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

export class ConfigLoader {
    readonly QueryInterface = ChromeUtils.generateQI([ Ci.nsIObserver ]);

    private readonly sandbox: Sandbox;

    constructor() {
        this.sandbox = new lazy.Sandbox();

        this.sandbox.defineFunction('pref', this.pref.bind(this));
        this.sandbox.defineFunction('defaultPref', this.defaultPref.bind(this));
        this.sandbox.defineFunction('lockPref', this.lockPref.bind(this));
        this.sandbox.defineFunction('unlockPref', this.unlockPref.bind(this));
        this.sandbox.defineFunction('getPref', this.getPref.bind(this));
        this.sandbox.defineFunction('clearPref', this.clearPref.bind(this));
        this.sandbox.defineFunction('getPath', this.getPath.bind(this));
        this.sandbox.defineFunction('pathExists', this.pathExists.bind(this));
        this.sandbox.defineFunction('pathToUrl', this.pathToUrl.bind(this));
        this.sandbox.defineFunction('loadConfig', this.loadConfig.bind(this));
    }

    observe(_subject, topic, _data): void {
        if (topic === 'app-startup') {
            const cfg = lazy.File.fromDirsvc('GreD').append('firedragon.cfg');
            if (cfg.exists()) {
                this.loadConfig(cfg.url);
            }
        }
    }

    private getPrefBranch(): nsIPrefBranch {
        return Services.prefs.getBranch(null);
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

    private getPath(prop: string): string {
        return lazy.File.fromDirsvc(prop).path;
    }

    private pathExists(path: string): boolean {
        return lazy.File.fromPath(path).exists();
    }

    private pathToUrl(path: string): string {
        return lazy.File.fromPath(path).url;
    }

    private loadConfig(url: string): void {
        this.sandbox.loadScript(url);
    }
}

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

    observe(_subject, topic, _data): void {
        if (topic === 'app-startup') {
            this.loadConfig(this.getUrl('GreD', 'firedragon.cfg'));
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

    private getUrl(prop: string, ...nodes: string[]): string {
        return lazy.File.fromDirsvc(prop).append(...nodes).url;
    }

    private loadConfig(url: URL | string): void {
        const file = lazy.File.fromUrl(url);
        console.info(`ConfigLoader: Loading config: ${file.url} (${file.path})`);
        if (file.exists()) {
            try {
                this.createSandboxFor(file).loadScript(file.url);
            } catch (e) {
                console.error(`ConfigLoader: Error while loading ${file.url}:`, e);
            }
        } else {
            console.warn(`ConfigLoader: File does not exist: ${file.path}`);
        }
    }

    private createSandboxFor(file: File): Sandbox {
        const sandbox = lazy.Sandbox.create(null, {
            wantGlobalProperties: ['URL'],
        });

        // Default prefcalls
        sandbox.defineFunction('pref', this.pref.bind(this));
        sandbox.defineFunction('defaultPref', this.defaultPref.bind(this));
        sandbox.defineFunction('lockPref', this.lockPref.bind(this));
        sandbox.defineFunction('unlockPref', this.unlockPref.bind(this));
        sandbox.defineFunction('getPref', this.getPref.bind(this));
        sandbox.defineFunction('clearPref', this.clearPref.bind(this));

        // ConfigLoader specials
        sandbox.defineFunction('getUrl', this.getUrl.bind(this));
        sandbox.defineFunction('loadConfig', this.loadConfig.bind(this));

        // Config metadata
        const gConfig = sandbox.createObjectIn('gConfig');
        gConfig.defineGetter('path', () => file.path);
        gConfig.defineGetter('url', () => file.url);

        // Console proxy
        const console = sandbox.createObjectIn('console');
        console.defineFunction('log', globalThis.console.log);
        console.defineFunction('info', globalThis.console.info);
        console.defineFunction('warn', globalThis.console.warn);
        console.defineFunction('error', globalThis.console.error);

        return sandbox;
    }
}

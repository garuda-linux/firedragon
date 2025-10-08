import type { Version } from './Version.sys.mts'

const lazy: {
    Version: typeof Version,
    AppConstants,
} = {};

ChromeUtils.defineESModuleGetters(lazy, {
    Version: 'resource://noraneko/modules/firedragon/Version.sys.mjs',
    AppConstants: 'resource://gre/modules/AppConstants.sys.mjs',
});

declare global {
    interface fdIConfigVersion {
        readonly version: string;
        readonly lastVersion: string;
        compare(a: string, cmp: string, b: string): boolean;
    }

    interface nsIXPCComponents_Interfaces {
        fdIConfigVersion: nsJSIID<fdIConfigVersion>;
    }
}

export class ConfigVersion implements fdIConfigVersion {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.fdIConfigVersion,
    ]);

    public readonly version: string;
    public readonly lastVersion: string;

    constructor() {
        this.version = (new lazy.Version(lazy.AppConstants.MOZ_APP_VERSION_DISPLAY)).toString();
        this.lastVersion = (new lazy.Version(Services.prefs.getStringPref('firedragon.cfg.lastVersion', this.version))).toString()
    }

    compare(a: string, cmp: string, b: string): boolean {
        return (new lazy.Version(a)).compare(cmp, new lazy.Version(b));
    }
}

import { Version } from 'resource://firedragon/modules/Version.sys.mjs';
import { AppConstants } from 'resource://gre/modules/AppConstants.sys.mjs';

declare global {
    interface fdIConfigVersion {
        readonly version: string,
        readonly lastVersion: string,
        compare(a: string, cmp: string, b: string): boolean,
    }

    interface nsIXPCComponents_Interfaces {
        fdIConfigVersion: nsJSIID<fdIConfigVersion>
    }
}

export class ConfigVersion implements fdIConfigVersion {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.fdIConfigVersion,
    ]);

    readonly version: string;
    readonly lastVersion: string;

    constructor() {
        this.version = (new Version(AppConstants.MOZ_APP_VERSION_DISPLAY)).toString();
        this.lastVersion = (new Version(Services.prefs.getStringPref('firedragon.cfg.lastVersion', this.version))).toString()
    }

    compare(a: string, cmp: string, b: string) {
        return (new Version(a)).compare(cmp, new Version(b));
    }

    static enrichConfigSandbox(sandbox: any) {
        const configVersion = Cc['@firedragon/config/config-version;1'].getService(Ci.fdIConfigVersion);

        const gVersion = Cu.createObjectIn(sandbox, { defineAs: 'gVersion' });
        Object.defineProperty(gVersion, 'version', {
            get: () => configVersion.version,
        });
        Object.defineProperty(gVersion, 'lastVersion', {
            get: () => configVersion.lastVersion,
        });
        Cu.exportFunction(configVersion.compare.bind(configVersion), sandbox, { defineAs: 'compare' });
    }
}

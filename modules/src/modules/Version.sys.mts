import { type CompareOperator, compare } from 'compare-versions';

import { AppConstants } from 'resource://gre/modules/AppConstants.sys.mjs';

export const Version = new (class {
    readonly PREF_LAST_VERSION = 'firedragon.lastVersion';

    readonly version: string;
    readonly lastVersion: string;

    constructor() {
        this.version = `v${AppConstants.MOZ_APP_VERSION_DISPLAY}`;
        this.lastVersion = Services.prefs.getStringPref(this.PREF_LAST_VERSION, this.version);
        Services.prefs.setStringPref(this.PREF_LAST_VERSION, this.version);
    }

    compare(v1: string, operator: CompareOperator, v2: string): boolean {
        return compare(v1, v2, operator);
    }
})();

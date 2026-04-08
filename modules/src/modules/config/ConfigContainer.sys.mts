export class ConfigContainer {
    private readonly defaults = new Map<string, any>();
    private readonly overrides = new Map<string, any>();
    private readonly locks = new Set<string>();

    private readonly envVars = new Map<string, string>();

    private validate(prefName: string, value: any): void {
        if (value !== null) {
            const prefType = Services.prefs.getPrefType(prefName),
                valueType = typeof value;
            if (
                prefType === Ci.nsIPrefBranch.PREF_INVALID! &&
                valueType !== 'boolean' &&
                valueType !== 'number' &&
                valueType !== 'string'
            ) {
                throw `Invalid ${valueType} for ${prefName}, must be boolean | number | string | null`;
            }
            if (prefType === Ci.nsIPrefBranch.PREF_BOOL! && valueType !== 'boolean') {
                throw `Invalid ${valueType} for ${prefName}, must be boolean`;
            }
            if (prefType === Ci.nsIPrefBranch.PREF_INT! && valueType !== 'number') {
                throw `Invalid ${valueType} for ${prefName}, must be number`;
            }
            if (prefType === Ci.nsIPrefBranch.PREF_STRING! && valueType !== 'string') {
                throw `Invalid ${valueType} for ${prefName}, must be string`;
            }
        }
    }

    setDefault(prefName: string, value: any) {
        this.validate(prefName, value);
        this.defaults.set(prefName, value);
    }

    unsetDefault(prefName: string) {
        this.defaults.delete(prefName);
    }

    setOverride(prefName: string, value: any) {
        this.validate(prefName, value);
        this.overrides.set(prefName, value);
    }

    unsetOverride(prefName: string) {
        this.overrides.delete(prefName);
    }

    lock(prefName: string) {
        this.locks.add(prefName);
    }

    unlock(prefName: string) {
        this.locks.delete(prefName);
    }

    getPref(prefName: string): any {
        if (this.overrides.has(prefName)) {
            return this.overrides.get(prefName);
        }
        switch (Services.prefs.getPrefType(prefName)) {
            case Ci.nsIPrefBranch.PREF_BOOL:
                return Services.prefs.getBoolPref(prefName);
            case Ci.nsIPrefBranch.PREF_INT:
                return Services.prefs.getIntPref(prefName);
            case Ci.nsIPrefBranch.PREF_STRING:
                return Services.prefs.getStringPref(prefName);
        }
        if (this.defaults.has(prefName)) {
            return this.defaults.get(prefName);
        }
        return null;
    }

    getEnv(name: string): string {
        if (this.envVars.has(name)) {
            return this.envVars.get(name)!;
        }
        return Services.env.get(name);
    }

    setEnv(name: string, value: string) {
        this.envVars.set(name, value);
    }

    apply() {
        const defaultBranch = Services.prefs.getDefaultBranch('');
        for (const [prefName, value] of this.defaults) {
            this.applyPref(defaultBranch, prefName, value);
        }
        for (const prefName of this.locks) {
            Services.prefs.lockPref(prefName);
        }
        for (const [prefName, value] of this.overrides) {
            Services.prefs.clearUserPref(prefName);
            this.applyPref(Services.prefs, prefName, value);
        }

        for (const [name, value] of this.envVars) {
            Services.env.set(name, value);
        }
    }

    private applyPref(prefBranch: nsIPrefBranch, prefName: string, value: any) {
        switch (typeof value) {
            case 'boolean':
                prefBranch.setBoolPref(prefName, value);
                break;
            case 'number':
                prefBranch.setIntPref(prefName, value);
                break;
            case 'string':
                prefBranch.setStringPref(prefName, value);
                break;
        }
    }
}

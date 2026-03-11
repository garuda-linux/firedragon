export type SafeModeToggle<DefaultRequired extends boolean> = {
    id: string;
    label: string;
} & (DefaultRequired extends true ? { default: boolean } : { default?: boolean });

export const SafeModeController = new (class {
    public readonly enabled = Services.appinfo.inSafeMode;
    private readonly prefPrefix = 'firedragon.safeMode.';
    private readonly toggles = new Map<string, SafeModeToggle<true>>();

    forToggle(toggle: SafeModeToggle<false>) {
        if (this.enabled) {
            this.toggles.set(toggle.id, {
                id: toggle.id,
                label: toggle.label,
                default: toggle.default ?? false,
            });
            return this.getToggle(toggle.id);
        }
        return true;
    }

    getToggles(): SafeModeToggle<true>[] {
        return [...this.toggles.values()];
    }

    getToggle(id: string): boolean {
        const toggle = this.toggles.get(id);
        if (!toggle) {
            throw `SafeModeController: Toggle not found: ${id}`;
        }
        return Services.prefs.getBoolPref(this.prefPrefix + id, toggle.default);
    }

    setToggle(id: string, value: boolean) {
        if (!this.toggles.has(id)) {
            throw `SafeModeController: Toggle not found: ${id}`;
        }
        Services.prefs.setBoolPref(this.prefPrefix + id, value);
    }
})();

export const BuiltinAddons = new (class {
    public readonly newtab: WebExtensionPolicy;
    public readonly notes: WebExtensionPolicy;
    public readonly settings: WebExtensionPolicy;
    public readonly welcome: WebExtensionPolicy;

    constructor() {
        this.newtab = this.get('firedragon-newtab');
        this.notes = this.get('firedragon-notes');
        this.settings = this.get('firedragon-settings');
        this.welcome = this.get('firedragon-welcome');
    }

    get(name: string) {
        return WebExtensionPolicy.getByID(`${name}@firedragon.garudalinux.org`)!;
    }
})();

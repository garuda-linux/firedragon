export const BuiltinAddons = new (class {
    public readonly notes: WebExtensionPolicy;
    public readonly settings: WebExtensionPolicy;
    public readonly troubleshooting: WebExtensionPolicy;
    public readonly welcome: WebExtensionPolicy;
    public readonly workspaces: WebExtensionPolicy;

    constructor() {
        this.notes = this.get('firedragon-notes');
        this.settings = this.get('firedragon-settings');
        this.troubleshooting = this.get('firedragon-troubleshooting');
        this.welcome = this.get('firedragon-welcome');
        this.workspaces = this.get('firedragon-workspaces');
    }

    get(name: string) {
        return WebExtensionPolicy.getByID(`${name}@firedragon.garudalinux.org`)!;
    }
})();

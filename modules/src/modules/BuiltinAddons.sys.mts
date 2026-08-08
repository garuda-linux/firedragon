export const BuiltinAddons = new (class {
    public readonly notes: WebExtensionPolicy;
    public readonly qrCode: WebExtensionPolicy;
    public readonly settings: WebExtensionPolicy;
    public readonly startpage: WebExtensionPolicy;
    public readonly troubleshooting: WebExtensionPolicy;
    public readonly welcome: WebExtensionPolicy;
    public readonly workspaces: WebExtensionPolicy;

    constructor() {
        this.notes = this.get('firedragon-notes');
        this.qrCode = this.get('firedragon-qr-code');
        this.settings = this.get('firedragon-settings');
        this.startpage = this.get('firedragon-startpage');
        this.troubleshooting = this.get('firedragon-troubleshooting');
        this.welcome = this.get('firedragon-welcome');
        this.workspaces = this.get('firedragon-workspaces');
    }

    get(name: string) {
        return WebExtensionPolicy.getByID(`${name}@firedragon.garudalinux.org`)!;
    }

    getAll(): WebExtensionPolicy[] {
        return [
            this.notes,
            this.qrCode,
            this.settings,
            this.startpage,
            this.troubleshooting,
            this.welcome,
            this.workspaces,
        ];
    }
})();

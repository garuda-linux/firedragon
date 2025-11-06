export const SkinManager = new class {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
    ]);

    readonly PREF = 'firedragon.skin';
    readonly BASE_URI = 'chrome://firedragon/skin';

    protected readonly styleSheetService = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);

    protected previousSkin: string = '';

    init() {
        Services.prefs.addObserver(this.PREF, this);
        this.update();
    }

    observe(_subject: any, topic: string, _data: any) {
        if (topic === 'nsPref:changed') {
            this.update();
        }
    }

    protected update() {
        if (this.previousSkin) {
            this.styleSheetService.unregisterSheet(this.getChromeCssUri(this.previousSkin), Ci.nsIStyleSheetService.USER_SHEET!);
            this.styleSheetService.unregisterSheet(this.getContentCssUri(this.previousSkin), Ci.nsIStyleSheetService.USER_SHEET!);
        }

        const skin = this.previousSkin = Services.prefs.getStringPref(this.PREF);
        if (skin) {
            this.styleSheetService.loadAndRegisterSheet(this.getChromeCssUri(skin), Ci.nsIStyleSheetService.USER_SHEET!);
            this.styleSheetService.loadAndRegisterSheet(this.getContentCssUri(skin), Ci.nsIStyleSheetService.USER_SHEET!);

            this.loadUserJs(skin);
        }
    }

    protected getChromeCssUri(skin: string) {
        return Services.io.newURI(`${this.BASE_URI}/${skin}/userChrome.css`);
    }

    protected getContentCssUri(skin: string) {
        return Services.io.newURI(`${this.BASE_URI}/${skin}/userContent.css`);
    }

    protected loadUserJs(skin: string) {
        const defaultBranch = Services.prefs.getDefaultBranch(null);

        function user_pref(key: string, value: boolean | number | string) {
            if (key !== 'toolkit.legacyUserProfileCustomizations.stylesheets') {
                switch (typeof value) {
                    case 'boolean':
                        defaultBranch.setBoolPref(key, value);
                        break;
                    case 'number':
                        defaultBranch.setIntPref(key, value);
                        break;
                    case 'string':
                        defaultBranch.setStringPref(key, value);
                        break;
                }
            }
        }

        const sandbox = Cu.Sandbox(null, {});
        Cu.exportFunction(user_pref, sandbox, { defineAs: 'user_pref' });

        Services.scriptloader.loadSubScript(`${this.BASE_URI}/${skin}/user.js`, sandbox);
    }
};

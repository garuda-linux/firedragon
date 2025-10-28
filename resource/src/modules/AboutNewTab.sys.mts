import { AboutNewTab as BrowserAboutNewTab } from 'resource:///modules/AboutNewTab.sys.mjs';

export const AboutNewTab = new class {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
    ]);

    readonly PREF = 'firedragon.newtab.enable';

    init() {
        Services.prefs.addObserver(this.PREF, this);
        this.update();
    }

    observe(_subject: any, topic: string, data: any) {
        if (topic === 'nsPref:changed' && data === this.PREF) {
            this.update();
        }
    }

    update() {
        if (Services.prefs.getBoolPref(this.PREF, true)) {
            BrowserAboutNewTab.newTabURL = 'about:firedragon-newtab';
        } else {
            BrowserAboutNewTab.resetNewTabURL();
        }
    }
};

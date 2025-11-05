import { AppConstants } from 'resource://gre/modules/AppConstants.sys.mjs';

export const TranslationFeatureManager = new class {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
    ]);

    readonly PREF = 'firedragon.translations.enable';
    readonly PREFS = [
        'firedragon.translations.enable',
        'browser.translations.enable',
        'services.settings.server',
    ];

    init() {
        for (const pref of this.PREFS) {
            Services.prefs.addObserver(pref, this);
        }
        this.update();
    }

    observe(_subject: any, topic: string, data: any) {
        if (topic === 'nsPref:changed' && this.PREFS.includes(data)) {
            this.update();
        }
    }

    update() {
        if (Services.prefs.getBoolPref(this.PREF)) {
            Services.prefs.setBoolPref('browser.translations.enable', true);
            Services.prefs.setStringPref('services.settings.server', AppConstants.REMOTE_SETTINGS_SERVER_URL);
        } else {
            Services.prefs.setBoolPref('browser.translations.enable', false);
            Services.prefs.setStringPref('services.settings.server', 'https://%.invalid');
        }
    }
}

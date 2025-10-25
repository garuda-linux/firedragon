import { AppConstants } from 'resource://gre/modules/AppConstants.sys.mjs';

export class TranslationFeatureManager {
    static QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
    ]);

    constructor() {
        Services.prefs.addObserver('firedragon.translations.enable', this);
    }

    observe() {
        if (Services.prefs.getBoolPref('firedragon.translations.enable')) {
            Services.prefs.setBoolPref('browser.translations.enable', true);
            Services.prefs.setStringPref('services.settings.server', AppConstants.REMOTE_SETTINGS_SERVER_URL);
        } else {
            Services.prefs.setBoolPref('browser.translations.enable', false);
            Services.prefs.setStringPref('services.settings.server', 'https://%.invalid');
        }
    }
}

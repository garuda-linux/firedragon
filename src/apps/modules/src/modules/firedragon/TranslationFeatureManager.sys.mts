const lazy: {
    AppConstants,
} = {};

ChromeUtils.defineESModuleGetters(lazy, {
    AppConstants: 'resource://gre/modules/AppConstants.sys.mjs',
});

export class TranslationFeatureManager {
    static QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
    ]);

    constructor() {
        Services.prefs.addObserver('firedragon.translations.enable', this);
        Services.prefs.addObserver('browser.translations.enable', this);
        Services.prefs.addObserver('services.settings.server', this);
    }

    observe(subject, topic, data): void {
        if (Services.prefs.getBoolPref('firedragon.translations.enable', false)) {
            console.info('[TranslationFeatureManager] Enable translation feature')
            Services.prefs.setBoolPref('browser.translations.enable', true);
            Services.prefs.setStringPref('services.settings.server', lazy.AppConstants.REMOTE_SETTINGS_SERVER_URL);
        } else {
            console.info('[TranslationFeatureManager] Disable translation feature')
            Services.prefs.setBoolPref('browser.translations.enable', false);
            Services.prefs.setStringPref('services.settings.server', 'https://%.invalid');
        }
    }
}

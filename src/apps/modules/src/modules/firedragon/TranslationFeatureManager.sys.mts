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

    private get firedragonTranslations() {
        return Services.prefs.getBoolPref('firedragon.translations.enable', false);
    }

    private set firedragonTranslations(value) {
        Services.prefs.setBoolPref('firedragon.translations.enable', value);
    }

    private get browserTranslations() {
        return Services.prefs.getBoolPref('browser.translations.enable', false);
    }

    private set browserTranslations(value) {
        Services.prefs.setBoolPref('browser.translations.enable', value);
    }

    private get settingsServerIsRemoveSettingsServerUrl() {
        return Services.prefs.getStringPref('services.settings.server', 'https://%.invalid') === lazy.AppConstants.REMOTE_SETTINGS_SERVER_URL;
    }

    private set settingsServerIsRemoveSettingsServerUrl(value) {
        Services.prefs.setStringPref('services.settings.server', value ? lazy.AppConstants.REMOTE_SETTINGS_SERVER_URL : 'https://%.invalid');
    }

    observe(_subject, topic, _data): void {
        // Automatically enable new pref when translation was already correctly enabled previously
        if (topic === 'app-startup' && this.browserTranslations && this.settingsServerIsRemoveSettingsServerUrl) {
            this.firedragonTranslations = true;
        }

        // Enable or disable translation related prefs based on new pref
        if (this.firedragonTranslations) {
            console.info('[TranslationFeatureManager] Enable translation feature')
            this.browserTranslations = true;
            this.settingsServerIsRemoveSettingsServerUrl = true;
        } else {
            console.info('[TranslationFeatureManager] Disable translation feature')
            this.browserTranslations = false;
            this.settingsServerIsRemoveSettingsServerUrl = false;
        }
    }
}

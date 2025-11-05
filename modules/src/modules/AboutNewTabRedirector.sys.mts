import { AboutRedirector } from 'resource://firedragon/modules/AboutRedirector.sys.mjs';

const PREF = 'firedragon.newtab.enable';
const URI = 'chrome://firedragon-newtab/content/index.html';

export class AboutNewTabRedirector extends AboutRedirector {
    getURI(_aURI: nsIURI): nsIURI {
        return Services.io.newURI(URI);
    }
}

export class AboutNewTabRedirectorFactory implements nsIFactory {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIFactory,
    ]);

    protected readonly instance = new AboutNewTabRedirector();

    createInstance<T extends nsIID>(iid: T): nsQIResult<T> {
        return this.instance.QueryInterface(iid);
    }
}

export const AboutNewTabRedirectorManager = new class {
    readonly registrar: nsIComponentRegistrar;

    constructor() {
        this.registrar = Components.manager as unknown as nsIComponentRegistrar;
        try {
            this.registrar = this.registrar.QueryInterface!(Ci.nsIComponentRegistrar);
        } catch (_) {}
    }

    init() {
        if (Services.prefs.getBoolPref(PREF)) {
            this.registrar.registerFactory(
                Services.uuid.generateUUID(),
                'about:home',
                '@mozilla.org/network/protocol/about;1?what=home',
                new AboutNewTabRedirectorFactory(),
            );
            this.registrar.registerFactory(
                Services.uuid.generateUUID(),
                'about:newtab',
                '@mozilla.org/network/protocol/about;1?what=newtab',
                new AboutNewTabRedirectorFactory(),
            );
        }
    }
};

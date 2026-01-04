export class AboutRedirector implements nsIAboutModule {
    readonly QueryInterface = ChromeUtils.generateQI([Ci.nsIAboutModule]);

    newChannel(aURI: nsIURI, aLoadInfo: nsILoadInfo): nsIChannel {
        const channel = Services.io.newChannelFromURIWithLoadInfo(this.getChromeURI(aURI), aLoadInfo);
        channel.originalURI = aURI;
        channel.owner = Services.scriptSecurityManager.getSystemPrincipal();
        return channel;
    }

    getURIFlags(_aURI: nsIURI): u32 {
        return Ci.nsIAboutModule.ALLOW_SCRIPT! | Ci.nsIAboutModule.IS_SECURE_CHROME_UI!;
    }

    getChromeURI(_aURI: nsIURI): nsIURI {
        return Services.io.newURI('chrome://firedragon/content/about.html');
    }
}

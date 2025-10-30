export class AboutRedirector implements nsIAboutModule {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIAboutModule,
    ]);

    getURI(aURI: nsIURI): nsIURI {
        return Services.io.newURI(`chrome://${aURI.filePath}/content/index.html`);
    }

    newChannel(aURI: nsIURI, aLoadInfo: nsILoadInfo): nsIChannel {
        const channel = Services.io.newChannelFromURIWithLoadInfo(this.getURI(aURI), aLoadInfo);
        channel.owner = Services.scriptSecurityManager.getSystemPrincipal();
        channel.originalURI = aURI;
        return channel;
    }

    getURIFlags(_aURI: nsIURI): u32 {
        return Ci.nsIAboutModule.ALLOW_SCRIPT! | Ci.nsIAboutModule.IS_SECURE_CHROME_UI!;
    }

    getChromeURI(aURI: nsIURI): nsIURI {
        return this.getURI(aURI);
    }
}

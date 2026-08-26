export const SkinController = new (class {
    readonly PREF = 'firedragon.skin';
    readonly BASE_URI = 'chrome://firedragon/skin';

    protected readonly styleSheetService = Cc['@mozilla.org/content/style-sheet-service;1'].getService(
        Ci.nsIStyleSheetService,
    );

    readonly chromeCss: nsIPreloadedStyleSheet | null = null;
    readonly contentCss: nsIPreloadedStyleSheet | null = null;

    constructor() {
        this.chromeCss = this.styleSheetService.preloadSheet(
            Services.io.newURI(`${this.BASE_URI}/firedragonChrome.css`),
            Ci.nsIStyleSheetService.USER_SHEET!,
        );
        this.contentCss = this.styleSheetService.preloadSheet(
            Services.io.newURI(`${this.BASE_URI}/firedragonContent.css`),
            Ci.nsIStyleSheetService.USER_SHEET!,
        );
    }

    onBrowserStartup() {
        this.registerWindowActor();
    }

    protected registerWindowActor() {
        ChromeUtils.registerWindowActor('FDSkin', {
            allFrames: true,
            child: {
                esModuleURI: 'resource://firedragon/actors/FDSkinChild.sys.mjs',
                events: {
                    DOMDocElementInserted: {},
                },
            },
        });
    }
})();

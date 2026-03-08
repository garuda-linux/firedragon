import { SandboxBuilder } from 'resource://firedragon/modules/utils/SandboxBuilder.sys.mjs';

export const SkinManager = new (class {
    readonly PREF = 'firedragon.skin';
    readonly BASE_URI = 'chrome://firedragon/skin';

    protected readonly styleSheetService = Cc['@mozilla.org/content/style-sheet-service;1'].getService(
        Ci.nsIStyleSheetService,
    );

    readonly skin: string;

    readonly chromeCss: nsIPreloadedStyleSheet | null = null;
    readonly contentCss: nsIPreloadedStyleSheet | null = null;

    constructor() {
        this.skin = Services.prefs.getStringPref(this.PREF);

        if (this.skin) {
            this.chromeCss = this.styleSheetService.preloadSheet(
                Services.io.newURI(`${this.BASE_URI}/${this.skin}/userChrome.css`),
                Ci.nsIStyleSheetService.USER_SHEET!,
            );
            this.contentCss = this.styleSheetService.preloadSheet(
                Services.io.newURI(`${this.BASE_URI}/${this.skin}/userContent.css`),
                Ci.nsIStyleSheetService.USER_SHEET!,
            );
        }
    }

    onBrowserStartup() {
        this.loadUserJs();
        this.registerWindowActor();
    }

    protected loadUserJs() {
        const defaultBranch = Services.prefs.getDefaultBranch(null);

        SandboxBuilder.create()
            .defineFunction('user_pref', (key: string, value: boolean | number | string) => {
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
            })
            .load(`${this.BASE_URI}/${this.skin}/user.js`);
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

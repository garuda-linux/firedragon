import { BrowserUtils } from 'resource://gre/modules/BrowserUtils.sys.mjs';

export class BrowserStartup {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
    ]);

    observe(_subject: any, topic: string, _data: any): void {
        if (topic === 'app-startup') {
            this.registerActors();

            BrowserUtils.callModulesFromCategory({
                categoryName: 'firedragon/browser-startup',
            });
        }
    }

    protected registerActors() {
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
}

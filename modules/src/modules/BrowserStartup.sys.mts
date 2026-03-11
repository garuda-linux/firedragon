// @ts-ignore
import { BrowserUtils } from 'resource://gre/modules/BrowserUtils.sys.mjs';

export class BrowserStartup {
    readonly QueryInterface = ChromeUtils.generateQI([Ci.nsIObserver]);

    observe(_subject: any, topic: string, _data: any): void {
        if (topic === 'app-startup') {
            BrowserUtils.callModulesFromCategory({
                categoryName: 'firedragon/browser-startup',
            });
        }
    }
}

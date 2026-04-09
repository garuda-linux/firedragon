// @ts-ignore
import { AddonManager } from 'resource://gre/modules/AddonManager.sys.mjs';
// @ts-ignore
import { setTimeout } from 'resource://gre/modules/Timer.sys.mjs';

export const UblockCompat = new (class implements nsIObserver {
    readonly QueryInterface = ChromeUtils.generateQI([Ci.nsIObserver]);

    init() {
        Services.prefs.addObserver('firedragon.config.prefetch.enable', this);
    }

    async observe(_subject: any, topic: string, data: any) {
        if (topic === 'nsPref:changed' && data === 'firedragon.config.prefetch.enable') {
            // Make sure uBlock is restarted at lease 2 times + the browser restart itself when changing prefetching to properly update its setting
            await (await AddonManager.getAddonByID('uBlock0@raymondhill.net')).reload();
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            await (await AddonManager.getAddonByID('uBlock0@raymondhill.net')).reload();
        }
    }
})();

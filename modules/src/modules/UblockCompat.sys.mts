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
            // https://github.com/gorhill/uBlock/blob/e2bd8c146c63b6ff02ee4ac11dcd46d22c9fb7bd/platform/common/vapi-background.js#L1456
            const addon = await AddonManager.getAddonByID('uBlock0@raymondhill.net');
            if (addon) {
                await addon.reload();
                await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
                await addon.reload();
            }
        }
    }
})();

const { SkinManager } = ChromeUtils.importESModule('resource://firedragon/modules/SkinManager.sys.mjs');

import Component from '@/Component';

window.fdSkin = new class extends Component {
    init() {
        if (SkinManager.chromeCss) {
            windowUtils.addSheet(SkinManager.chromeCss, Ci.nsIStyleSheetService.USER_SHEET!);
        }
    }
};

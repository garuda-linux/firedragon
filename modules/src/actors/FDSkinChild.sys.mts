import { SkinManager } from 'resource://firedragon/modules/SkinManager.sys.mjs';

export class FFSkinChild extends JSWindowActorChild {
    handleEvent() {
        if (SkinManager.contentCss) {
            this.contentWindow!.windowUtils.addSheet(SkinManager.contentCss, Ci.nsIStyleSheetService.USER_SHEET!);
        }
    }
}

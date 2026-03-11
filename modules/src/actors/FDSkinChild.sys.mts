import { SkinController } from 'resource://firedragon/modules/SkinController.sys.mjs';

export class FFSkinChild extends JSWindowActorChild {
    handleEvent() {
        if (SkinController.contentCss) {
            this.contentWindow!.windowUtils.addSheet(SkinController.contentCss, Ci.nsIStyleSheetService.USER_SHEET!);
        }
    }
}

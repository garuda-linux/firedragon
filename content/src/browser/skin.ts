const { SkinController } = ChromeUtils.importESModule(
    'resource://firedragon/modules/SkinController.sys.mjs',
) as typeof import('resource://firedragon/modules/SkinController.sys.mjs');

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        if (SkinController.enabledChromeCss && SkinController.chromeCss) {
            windowUtils.addSheet(SkinController.chromeCss, Ci.nsIStyleSheetService.USER_SHEET!);
        }
    },
    { once: true },
);

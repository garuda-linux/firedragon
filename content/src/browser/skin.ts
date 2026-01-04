const { SkinManager } = ChromeUtils.importESModule(
    'resource://firedragon/modules/SkinManager.sys.mjs',
) as typeof import('resource://firedragon/modules/SkinManager.sys.mjs');

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        if (SkinManager.chromeCss) {
            windowUtils.addSheet(SkinManager.chromeCss, Ci.nsIStyleSheetService.USER_SHEET!);
        }
    },
    { once: true },
);

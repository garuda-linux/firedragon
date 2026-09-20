const { PrivateContainer } = ChromeUtils.importESModule(
    'resource://firedragon/modules/PrivateContainer.sys.mjs',
) as typeof import('resource://firedragon/modules/PrivateContainer.sys.mjs');

window.addEventListener(
    'DOMContentLoaded',
    () => {
        const { gBrowser } = window,
            { tabContainer } = gBrowser;

        let tabCloseTimeout: any = null;
        tabContainer.addEventListener('TabClose', () => {
            clearTimeout(tabCloseTimeout);
            tabCloseTimeout = setTimeout(() => {
                PrivateContainer.maybeClearData();
            }, 1e3);
        });
    },
    { once: true },
);

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const { CustomizableUI } = window;

        CustomizableUI.createWidget({
            id: 'firedragon-close-private-tabs',
            type: 'button',
            l10nId: 'firedragon-close-private-tabs',
            removable: true,
            defaultArea: CustomizableUI.AREA_NAVBAR,
            defaultPosition: 'before:downloads-button',
            showInPrivateBrowsing: false,
            onCommand(event: XULCommandEvent) {
                PrivateContainer.closeTabs(event.view!);
            },
        });
    },
    { once: true },
);

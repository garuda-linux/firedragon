const { PrivateContainer } = ChromeUtils.importESModule(
    'resource://firedragon/modules/PrivateContainer.sys.mjs',
) as typeof import('resource://firedragon/modules/PrivateContainer.sys.mjs');

window.addEventListener(
    'DOMContentLoaded',
    () => {
        const { gBrowser } = window,
            { tabContainer, _createTab, _createBrowserForTab } = gBrowser;

        gBrowser._createTab = (options: any) => {
            const tab = _createTab.call(gBrowser, options);

            if (tab.userContextId === PrivateContainer.userContextId) {
                tab.setAttribute('historydisabled', 'true');
            }

            return tab;
        };

        gBrowser._createBrowserForTab = (tab: any, options: any) => {
            const { browser, ...rest } = _createBrowserForTab.call(gBrowser, tab, options);

            if (tab.userContextId === PrivateContainer.userContextId) {
                browser.setAttribute('disablehistory', 'true');
                browser.setAttribute('disableglobalhistory', 'true');

                browser.disableGlobalHistory?.();
                browser.docShell && (browser.docShell.useGloablHistory = false);
                browser.browsingContext && (browser.browsingContext.useGloablHistory = true);
            }

            return { browser, ...rest };
        };

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

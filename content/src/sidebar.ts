const lazy = {} as {
    PrivateContainer: typeof import('resource://firedragon/modules/PrivateContainer.sys.mjs').PrivateContainer;
};
ChromeUtils.defineESModuleGetters(lazy, {
    PrivateContainer: 'resource://firedragon/modules/PrivateContainer.sys.mjs',
});

document!.addEventListener(
    'DOMContentLoaded',
    async () => {
        const urlSearchParams = new URLSearchParams(window.location.search.substring(1)),
            userContextId = urlSearchParams.get('userContextId')!,
            url = urlSearchParams.get('url')!;

        const stack: XULElement = document!.querySelector('#webext-panels-stack')!,
            browser: XULBrowserElement = document!.createXULElement('browser') as XULBrowserElement;

        browser.setAttribute('id', 'webext-panels-browser');
        browser.setAttribute('type', 'content');
        browser.setAttribute('flex', '1');
        browser.setAttribute('disablehistory', 'true');
        browser.setAttribute('disableglobalhistory', 'true');
        browser.setAttribute('messagemanagergroup', 'browsers');
        browser.setAttribute('context', 'contentAreaContextMenu');
        browser.setAttribute('tooltip', 'aHTMLTooltip');
        browser.setAttribute('autocompletepopup', 'PopupAutoComplete');
        browser.setAttribute('remote', 'true');
        browser.setAttribute('maychangeremoteness', 'true');
        browser.setAttribute('usercontextid', userContextId);
        browser.setAttribute('src', url);

        stack.append(browser);

        if (parseInt(userContextId) === lazy.PrivateContainer.userContextId) {
            lazy.PrivateContainer.disableBrowserHistory(browser);

            ++lazy.PrivateContainer.additionalUsages;
            window.addEventListener(
                'beforeunload',
                () => {
                    browser.destroy();
                    browser.remove();
                    --lazy.PrivateContainer.additionalUsages;
                    lazy.PrivateContainer.maybeClearData();
                },
                { once: true },
            );
        }
    },
    { once: true },
);

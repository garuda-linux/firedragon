declare global {
    interface XULBrowserElement extends XULElement, nsIWebNavigation {}
}

let browser: Promise<XULBrowserElement>;
function getBrowser() {
    return (browser ??= new Promise((resolve) => {
        const stack: XULElement = document!.createXULElement('stack');
        stack.setAttribute('flex', '1');
        stack.setAttribute('id', 'webext-panels-stack');
        document!.documentElement!.appendChild(stack);

        const browser: XULBrowserElement = document!.createXULElement('browser') as XULBrowserElement;
        browser.setAttribute('id', 'webext-panels-browser');
        browser.setAttribute('type', 'content');
        browser.setAttribute('flex', '1');
        browser.setAttribute('disableglobalhistory', 'true');
        browser.setAttribute('messagemanagergroup', 'webext-browsers');
        browser.setAttribute('context', 'contentAreaContextMenu');
        browser.setAttribute('tooltip', 'aHTMLTooltip');
        browser.setAttribute('autocompletepopup', 'PopupAutoComplete');
        browser.setAttribute('remote', 'false');
        browser.setAttribute('maychangeremoteness', 'true');

        browser.addEventListener('XULFrameLoaderCreated', () => {
            resolve(browser);
        });

        stack.append(browser);
    }));
}

window.loadURL = async function (url: string) {
    const uri = Services.io.newURI(url),
        triggeringPrincipal = Services.scriptSecurityManager.createContentPrincipal(uri, {});

    (await getBrowser()).loadURI(uri, { triggeringPrincipal });
};

const lazy: {
    BuiltinAddons: typeof import('resource://firedragon/modules/BuiltinAddons.sys.mjs').BuiltinAddons;
} = {} as any;
ChromeUtils.defineESModuleGetters(lazy, {
    BuiltinAddons: 'resource://firedragon/modules/BuiltinAddons.sys.mjs',
});

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const urlbar = document.querySelector('#urlbar')!;
        function update() {
            const identityBox = urlbar.querySelector('#identity-box')!,
                identityIconBox = identityBox.querySelector('#identity-icon-box')!;
            identityIconBox.hidden =
                identityBox.classList.contains('extensionPage') &&
                lazy.BuiltinAddons.getAll()
                    .map((addon) => addon.mozExtensionHostname)
                    .includes(gBrowser.currentURI.host);
        }
        new MutationObserver(update).observe(urlbar, {
            subtree: true,
            childList: true,
            attributes: false,
            characterData: true,
        });
        update();
    },
    { once: true },
);

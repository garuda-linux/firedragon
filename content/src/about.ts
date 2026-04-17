const { BuiltinAddons } = ChromeUtils.importESModule(
    'resource://firedragon/modules/BuiltinAddons.sys.mjs',
) as typeof import('resource://firedragon/modules/BuiltinAddons.sys.mjs');

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        location.href = BuiltinAddons.get(location.pathname).getURL('index.html') + location.hash;
    },
    { once: true },
);

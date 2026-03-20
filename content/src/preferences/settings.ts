const { BuiltinAddons } = ChromeUtils.importESModule(
    'resource://firedragon/modules/BuiltinAddons.sys.mjs',
) as typeof import('resource://firedragon/modules/BuiltinAddons.sys.mjs');

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        const fragment: DocumentFragment = window.MozXULElement.parseXULToFragment(`
            <richlistitem
                class="category"
                align="center"
                data-l10n-id="firedragon-settings"
                data-l10n-attrs="tooltiptext"
            >
                <image class="category-icon" src="chrome://branding/content/about-logo.png" />
                <label class="category-name" flex="1" data-l10n-id="firedragon-settings-title"></label>
            </richlistitem>
        `);
        fragment.querySelector('richlistitem')?.addEventListener('click', () => {
            location.href = BuiltinAddons.settings.getURL('index.html');
        });

        document!.querySelector('#categories')!.append(fragment);
    },
    { once: true },
);

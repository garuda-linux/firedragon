import { h } from '@/utils/render';

const { BuiltinAddons } = ChromeUtils.importESModule(
    'resource://firedragon/modules/BuiltinAddons.sys.mjs',
) as typeof import('resource://firedragon/modules/BuiltinAddons.sys.mjs');

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        document!.querySelector('#categories')!.append(
            h('moz-page-nav-button', {
                iconsrc: 'chrome://branding/content/about-logo.png',
                'data-l10n-id': 'firedragon-settings-title',
                on: {
                    click() {
                        location.href = BuiltinAddons.settings.getURL('index.html');
                    },
                },
            }),
        );
    },
    { once: true },
);

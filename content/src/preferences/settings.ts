import { t } from '@/utils/i18n';

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
                tooltiptext="${t('preferences.settings.tooltip')}"
            >
                <image class="category-icon" src="chrome://branding/content/about-logo.png" />
                <label class="category-name" flex="1">${t('preferences.settings.label')}</label>
            </richlistitem>
        `);
        fragment.querySelector('richlistitem')?.addEventListener('click', () => {
            location.href = BuiltinAddons.settings.getURL('index.html');
        });

        document!.querySelector('#categories')!.append(fragment);
    },
    { once: true },
);

import { effect, shallowRef } from '@vue/reactivity';

import { useBoolPref } from '@/composables/usePref';
import { t } from '@/utils/i18n';

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        const enabled = useBoolPref('firedragon.moveTabToWindow.enable');
        const targets = shallowRef<Window[]>([]);

        const tabContextMenu = document!.querySelector('#tabContextMenu')!;

        const menu = document!.createXULElement('menu');
        menu.id = 'context_MoveTabToWindow';
        menu.label = t('browser.moveTabToWindow.label');
        tabContextMenu.insertBefore(menu, document!.querySelector('#context_moveTabOptions')!);

        const menupopup = document!.createXULElement('menupopup');
        menu.append(menupopup);

        effect(() => {
            menu.hidden = !enabled.value;
            menu.disabled = targets.value.length === 0;

            menupopup.innerHTML = '';
            for (const target of targets.value) {
                const item = document!.createXULElement('menuitem');
                item.label = target.document!.title;
                item.addEventListener('command', () => {
                    const selectedTabs = window.TabContextMenu.contextTab.multiselected
                        ? window.gBrowser.selectedTabs
                        : [window.TabContextMenu.contextTab];
                    for (const selectedTab of selectedTabs) {
                        target.gBrowser.adoptTab(selectedTab);
                    }
                });
                menupopup.append(item);
            }
        });

        tabContextMenu.addEventListener('popupshowing', () => {
            targets.value = window.BrowserWindowTracker.getOrderedWindows({
                private: window.PrivateBrowsingUtils.isWindowPrivate(window),
            }).filter((w: ChromeWindow) => w !== window);
        });
    },
    { once: true },
);

import { effect, shallowRef } from '@vue/reactivity';

import { useBoolPref } from '@/composables/usePref';
import { t } from '@/utils/i18n';
import { h, insertBefore } from '@/utils/render.ts';

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        const enabled = useBoolPref('firedragon.moveTabToWindow.enable');
        const targets = shallowRef<Window[]>([]);

        const menupopup = h('xul:menupopup');
        const menu = h(
            'xul:menu',
            {
                id: 'context_MoveTabToWindow',
                label: t('browser.moveTabToWindow.label'),
            },
            [menupopup],
        );
        insertBefore(menu, '#context_moveTabOptions');

        effect(() => {
            menu.hidden = !enabled.value;
            menu.disabled = targets.value.length === 0;

            menupopup.innerHTML = '';
            for (const target of targets.value) {
                menupopup.append(
                    h('menuitem', {
                        label: target.document!.title,
                        on: {
                            command() {
                                const selectedTabs = window.TabContextMenu.contextTab.multiselected
                                    ? window.gBrowser.selectedTabs
                                    : [window.TabContextMenu.contextTab];
                                for (const selectedTab of selectedTabs) {
                                    target.gBrowser.adoptTab(selectedTab);
                                }
                            },
                        },
                    }),
                );
            }
        });

        document!.querySelector('#tabContextMenu')!.addEventListener('popupshowing', () => {
            targets.value = window.BrowserWindowTracker.getOrderedWindows({
                private: window.PrivateBrowsingUtils.isWindowPrivate(window),
            }).filter((w: ChromeWindow) => w !== window);
        });
    },
    { once: true },
);

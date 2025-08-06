import { render } from '@nora/solid-xul';
import i18next from "i18next";
import { For } from 'solid-js';
import { addI18nObserver } from "../../../../i18n/config.ts";

const lazy: {
    BrowserWindowTracker: any,
    PrivateBrowsingUtils: any,
} = {} as any;

ChromeUtils.defineESModuleGetters(lazy, {
    BrowserWindowTracker: 'resource:///modules/BrowserWindowTracker.sys.mjs',
    PrivateBrowsingUtils: 'resource://gre/modules/PrivateBrowsingUtils.sys.mjs',
});

export class TabMoveToWindow {
    constructor() {
        this.createContextMenu();
    }

    getAvailableWindows(): ChromeWindow[] {
        return lazy.BrowserWindowTracker
            .getOrderedWindows({
                private: lazy.PrivateBrowsingUtils.isWindowPrivate(globalThis.window),
            })
            .filter((w: ChromeWindow) => w !== globalThis.window);
    }

    createContextMenu() {
        render(
            () => (
                <xul:menu
                    id='context_MoveTabToWindow'
                    label={i18next.t('tab.moveToWindow.label')}
                >
                    <xul:menupopup
                        id='MoveTabToWindow_ContextMenu'
                        onPopupShowing={() => this.createContextMenuItems()}
                    />
                </xul:menu>
            ),
            document?.getElementById('tabContextMenu'),
            {
                marker: document?.getElementById('context_moveTabOptions') as unknown as XULElement,
            },
        );

        addI18nObserver(() => {
            document.getElementById('context_MoveTabToWindow')!.setAttribute('label', i18next.t('tab.moveToWindow.label'));
        });

        document?.getElementById('tabContextMenu')?.addEventListener('popupshowing', () => {
            const menuItem = document.getElementById('context_MoveTabToWindow')!;
            menuItem.hidden = !Services.prefs.getBoolPref('browser.tabs.moveToWindow', true);
            if (!menuItem.hidden) {
                menuItem.disabled = this.getAvailableWindows().length === 0;
            }
        });
    }

    createContextMenuItems() {
        const menuElem = document?.getElementById('MoveTabToWindow_ContextMenu');
        while (menuElem?.firstChild) {
            const child = menuElem.firstChild as XULElement;
            child.remove();
        }

        render(
            () => (
                <For each={this.getAvailableWindows()}>
                    {(window) => (
                        <xul:menuitem
                            label={window.document.title}
                            onCommand={() => this.moveTabToWindow(window)}
                        />
                    )}
                </For>
            ),
            document?.getElementById('MoveTabToWindow_ContextMenu'),
        );
    }

    moveTabToWindow(window: ChromeWindow) {
        const selectedTabs = globalThis.TabContextMenu.contextTab.multiselected
            ? globalThis.gBrowser.selectedTabs
            : [globalThis.TabContextMenu.contextTab];
        for (const selectedTab of selectedTabs) {
            window.gBrowser.adoptTab(selectedTab);
        }
    }
}

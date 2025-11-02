import { useBoolPref } from '@firedragon13/lib-vue';

import Component from '@/Component';
import { createApp, h, mountBefore } from '@/vue';

import view from '@/views/moveTabToWindow.vue';

window.fdMoveTabToWindow = new class extends Component {
    protected enabled = useBoolPref('firedragon.moveTabToWindow.enable', true);
    protected targets = shallowRef<Window[]>([]);

    init() {
        const tabContextMenu = document!.querySelector('#tabContextMenu')!;

        mountBefore(createApp(() => h(view, {
            enabled: this.enabled.value,
            targets: this.targets.value,
            onMoveTab: this.moveTab.bind(this),
        })), tabContextMenu, '#context_moveTabOptions');

        tabContextMenu.addEventListener('popupshowing', this.updateTargets.bind(this));
    }

    updateTargets(): void {
        this.targets.value = window.BrowserWindowTracker
            .getOrderedWindows({
                private: window.PrivateBrowsingUtils.isWindowPrivate(window),
            })
            .filter((w: ChromeWindow) => w !== window);
    }

    moveTab(target: Window) {
        const selectedTabs = window.TabContextMenu.contextTab.multiselected
            ? window.gBrowser.selectedTabs
            : [window.TabContextMenu.contextTab];
        for (const selectedTab of selectedTabs) {
            target.gBrowser.adoptTab(selectedTab);
        }
    }
};

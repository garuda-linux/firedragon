import Component from '@/Component.ts';
import i18n from '@/i18n.ts';

window.fdUndoCloseTab = new class extends Component {
    init() {
        window.CustomizableUI.createWidget({
            id: 'undo-close-tab',
            type: 'button',
            label: i18n.global.t('undoCloseTab.label'),
            tooltiptext: i18n.global.t('undoCloseTab.tooltiptext'),
            removable: true,
            onCommand(event: XULCommandEvent) {
                (event.view?.document?.querySelector('#toolbar-context-undoCloseTab') as XULElement).doCommand();
            },
        });

        setTimeout(() => {
            if (Services.prefs.getBoolPref('firedragon.undoCloseTab.defaultWidget', true)) {
                Services.prefs.setBoolPref('firedragon.undoCloseTab.defaultWidget', false);
                window.CustomizableUI.addWidgetToArea('undo-close-tab', window.CustomizableUI.AREA_NAVBAR, 3);
            }
        });
    }
};

import { t } from '@/utils/i18n';

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        window.CustomizableUI.createWidget({
            id: 'undo-close-tab',
            type: 'button',
            label: t('browser.undoCloseTab.label'),
            tooltiptext: t('browser.undoCloseTab.tooltiptext'),
            removable: true,
            onCommand(event: XULCommandEvent) {
                window.SessionWindowUI.undoCloseTab(event.view);
            },
        });

        setTimeout(() => {
            if (Services.prefs.getBoolPref('firedragon.undoCloseTab.defaultWidget', true)) {
                Services.prefs.setBoolPref('firedragon.undoCloseTab.defaultWidget', false);
                window.CustomizableUI.addWidgetToArea('undo-close-tab', window.CustomizableUI.AREA_NAVBAR, 3);
            }
        });
    },
    { once: true },
);

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        const { CustomizableUI } = window;

        CustomizableUI.createWidget({
            id: 'firedragon-undo-close-tab',
            type: 'button',
            l10nId: 'firedragon-undo-close-tab',
            removable: true,
            defaultArea: CustomizableUI.AREA_NAVBAR,
            defaultPosition: 'after:forward-button',
            onCommand(event: XULCommandEvent) {
                window.SessionWindowUI.undoCloseTab(event.view);
            },
        });
    },
    { once: true },
);

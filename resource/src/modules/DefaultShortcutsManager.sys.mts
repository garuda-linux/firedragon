const PREF = 'firedragon.defaultShortcuts.enable';

export const DefaultShortcutsManager = {
    elements: null as NodeListOf<Element> | null,

    init(window: Window) {
        this.elements = window.document!.querySelector('#mainKeyset > *');
        if (!Services.prefs.getBoolPref(PREF)) {
            this.disable();
        }
        Services.prefs.addObserver(PREF, () => {
            if (Services.prefs.getBoolPref(PREF)) {
                this.enable();
            } else {
                this.disable();
            }
        })
    },

    enable() {
        this.elements.forEach((element) => {
            element.setAttribute('disabled', false);
        });
    },

    disable() {
        this.elements.forEach((element) => {
            element.setAttribute('disabled', true);
        });
    },
};

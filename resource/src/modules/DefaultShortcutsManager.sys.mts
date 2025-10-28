export const DefaultShortcutsManager = new class {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
    ]);

    readonly PREF = 'firedragon.defaultShortcuts.enable';

    elements!: NodeListOf<Element>;

    init(window: Window) {
        this.elements = window.document!.querySelectorAll('#mainKeyset > *');
        Services.prefs.addObserver(this.PREF, this);
        this.update();
    }

    observe(_subject: any, topic: string, data: any) {
        if (topic === 'nsPref:changed' && data === this.PREF) {
            this.update();
        }
    }

    update() {
        if (Services.prefs.getBoolPref(this.PREF, true)) {
            this.enable();
        } else {
            this.disable();
        }
    }

    enable() {
        this.elements.forEach((element) => {
            element.setAttribute('disabled', false);
        });
    }

    disable() {
        this.elements.forEach((element) => {
            element.setAttribute('disabled', true);
        });
    }
};

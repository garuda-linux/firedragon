import Component from '@/Component.ts';

window.fdDefaultShortcuts = new class extends Component {
    readonly QueryInterface = ChromeUtils.generateQI([
        Ci.nsIObserver,
    ]);

    readonly PREF = 'firedragon.defaultShortcuts.enable';

    protected elements: NodeListOf<Element>;

    constructor() {
        super();

        Services.prefs.addObserver(this.PREF, this);
    }

    init() {
        this.elements = window.document!.querySelectorAll('#mainKeyset > *');

        this.update();
    }

    observe(_subject: any, topic: string, data: any) {
        if (topic === 'nsPref:changed' && data === this.PREF) {
            this.update();
        }
    }

    update() {
        const state = String(!Services.prefs.getBoolPref(this.PREF, true));
        this.elements.forEach((el: Element) => {
            el.setAttribute('disabled', state);
        });
    }
};

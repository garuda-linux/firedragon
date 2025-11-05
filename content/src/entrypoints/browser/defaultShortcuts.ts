import Component from '@/Component.ts';

window.fdDefaultShortcuts = new class extends Component {
    protected readonly pref = useBoolPref('firedragon.defaultShortcuts.enable');
    protected readonly elements = shallowRef<Element[]>([]);

    init() {
        this.elements.value = window.document!.querySelectorAll('#mainKeyset > *');

        watchEffect(() => {
            const state = String(!this.pref.value);
            this.elements.value.forEach((el: Element) => {
                el.setAttribute('disabled', state);
            });
        });
    }
};

import { effect } from '@vue/reactivity';

import { useBoolPref } from '@/composables/usePref';

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        const pref = useBoolPref('firedragon.defaultShortcuts.enable');
        const elements = document!.querySelectorAll('#mainKeyset > *');

        effect(() => {
            const disabled = String(!pref.value);
            elements.forEach((el) => {
                el.setAttribute('disabled', disabled);
            });
        });
    },
    { once: true },
);

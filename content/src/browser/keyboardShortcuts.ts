import { type Shortcut } from '@firedragon/shared/types';
import { effect } from '@vue/reactivity';

import { useBoolPref, useStringPref } from '@/composables/usePref';

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        const enableDefaults = useBoolPref('firedragon.keyboardShortcuts.defaults', true);
        const customShortcuts = useStringPref('firedragon.keyboardShortcuts.custom', '[]');

        const defaults = document!.querySelector('#mainKeyset')!;
        effect(() => {
            const disabled = String(!enableDefaults.value);
            defaults.childNodes.forEach((el) => {
                (el as Element).setAttribute('disabled', disabled);
            });
        });

        let custom: Element | undefined;
        effect(() => {
            custom?.remove();

            custom = document!.createXULElement('keyset');
            custom.setAttribute('id', 'firedragonKeyset');

            const shortcuts = JSON.parse(customShortcuts.value) as Shortcut[];
            for (const shortcut of shortcuts) {
                const key = document!.createXULElement('key');
                if (shortcut.modifiers.length > 0) {
                    key.setAttribute('modifiers', shortcut.modifiers.join(','));
                }
                if (shortcut.key.startsWith('VK_')) {
                    key.setAttribute('keycode', shortcut.key);
                } else {
                    key.setAttribute('key', shortcut.key);
                }
                key.setAttribute('command', shortcut.command);
                custom.append(key);
            }

            document!.body!.insertBefore(custom, defaults.nextSibling);
        });
    },
    { once: true },
);

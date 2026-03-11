import { type KeyboardShortcut } from '@firedragon/shared/types/keyboard-shortcuts';
import { effect } from '@vue/reactivity';

import { useBoolPref, useStringPref } from '@/composables/usePref';
import { h, insertBefore } from '@/utils/render.ts';

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

            custom = h('xul:keyset', { id: 'firedragonKeyset' });

            const shortcuts = JSON.parse(customShortcuts.value) as KeyboardShortcut[];
            for (const shortcut of shortcuts) {
                const key = h('xul:key', {
                    command: shortcut.command,
                });
                if (shortcut.modifiers.length > 0) {
                    key.setAttribute('modifiers', shortcut.modifiers.join(','));
                }
                if (shortcut.key.startsWith('VK_')) {
                    key.setAttribute('keycode', shortcut.key);
                } else {
                    key.setAttribute('key', shortcut.key);
                }
                custom.append(key);
            }

            insertBefore(custom, defaults.nextSibling!);
        });
    },
    { once: true },
);

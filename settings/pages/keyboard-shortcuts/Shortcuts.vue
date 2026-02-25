<script lang="ts" setup>
    import { type Shortcut, ShortcutCommand, ShortcutKey, ShortcutModifier } from '@firedragon/shared/types';
    import { createId } from '@paralleldrive/cuid2';

    import type { Transformer } from '@/composables/usePref';

    const { t } = useI18n();

    const shortcuts = await useStringPref('firedragon.keyboardShortcuts.custom', '[]', {
        transformer: JSON as Transformer<string, Shortcut[]>,
    });

    function deleteShortcut(index: number) {
        shortcuts.value.splice(index, 1);
    }

    const newShortcut = ref({
        command: null,
        modifiers: [],
        key: null,
    });

    function addShortcut() {
        shortcuts.value.push({
            id: createId(),
            modifiers: newShortcut.value.modifiers,
            key: newShortcut.value.key as unknown as ShortcutKey,
            command: newShortcut.value.command as unknown as ShortcutCommand,
        });
        newShortcut.value = {
            command: null,
            modifiers: [],
            key: null,
        };
    }
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_keyboard" class="q-mb-xs q-mr-xs" />
                {{ t('pages.keyboardShortcuts.shortcuts.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <q-item v-for="(shortcut, i) in shortcuts" :key="`${shortcut.id}`">
                <q-item-section>
                    <q-select
                        v-model="shortcut.command"
                        :options="Object.entries(ShortcutCommand)"
                        emit-value
                        map-options
                        option-value="1"
                        :option-label="(option) => $t(`pages.keyboardShortcuts.shortcuts.command.options.${option[0]}`)"
                        :label="$t('pages.keyboardShortcuts.shortcuts.command.title')"
                    />
                </q-item-section>
                <q-item-section>
                    <q-select
                        multiple
                        v-model="shortcut.modifiers"
                        :options="Object.entries(ShortcutModifier)"
                        emit-value
                        map-options
                        option-value="1"
                        :option-label="
                            (option) => $t(`pages.keyboardShortcuts.shortcuts.modifiers.options.${option[0]}`)
                        "
                        :label="$t('pages.keyboardShortcuts.shortcuts.modifiers.title')"
                    />
                </q-item-section>
                <q-item-section>
                    <q-select
                        v-model="shortcut.key"
                        :options="Object.entries(ShortcutKey)"
                        emit-value
                        map-options
                        option-value="1"
                        :option-label="(option) => $t(`pages.keyboardShortcuts.shortcuts.key.options.${option[0]}`)"
                        :label="$t('pages.keyboardShortcuts.shortcuts.key.title')"
                    />
                </q-item-section>
                <q-item-section side>
                    <q-btn flat round icon="sym_o_delete" @click="deleteShortcut(i)" />
                </q-item-section>
            </q-item>
            <q-separator />
            <q-item>
                <q-item-section>
                    <q-select
                        v-model="newShortcut.command"
                        :options="Object.entries(ShortcutCommand)"
                        emit-value
                        map-options
                        option-value="1"
                        :option-label="(option) => $t(`pages.keyboardShortcuts.shortcuts.command.options.${option[0]}`)"
                        :label="$t('pages.keyboardShortcuts.shortcuts.command.title')"
                    />
                </q-item-section>
                <q-item-section>
                    <q-select
                        multiple
                        v-model="newShortcut.modifiers"
                        :options="Object.entries(ShortcutModifier)"
                        emit-value
                        map-options
                        option-value="1"
                        :option-label="
                            (option) => $t(`pages.keyboardShortcuts.shortcuts.modifiers.options.${option[0]}`)
                        "
                        :label="$t('pages.keyboardShortcuts.shortcuts.modifiers.title')"
                    />
                </q-item-section>
                <q-item-section>
                    <q-select
                        v-model="newShortcut.key"
                        :options="Object.entries(ShortcutKey)"
                        emit-value
                        map-options
                        option-value="1"
                        :option-label="(option) => $t(`pages.keyboardShortcuts.shortcuts.key.options.${option[0]}`)"
                        :label="$t('pages.keyboardShortcuts.shortcuts.key.title')"
                    />
                </q-item-section>
                <q-item-section side>
                    <q-btn
                        flat
                        round
                        icon="sym_o_add"
                        @click="addShortcut"
                        :disable="!newShortcut.key || !newShortcut.command"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>

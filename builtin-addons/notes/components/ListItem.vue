<script setup lang="ts">
    const {
        id,
        showUp = false,
        showDown = false,
    } = defineProps<{ id: string; showUp?: boolean; showDown?: boolean }>();
    const emit = defineEmits<{
        delete: [];
        up: [];
        down: [];
    }>();

    const { t } = useI18n();

    const note = await useSyncExtStorage(() => `note:${id}`, undefined);
</script>

<template>
    <q-item clickable v-ripple :to="`/${id}`" v-if="note">
        <q-item-section>
            <q-item-label>{{ note.title }}</q-item-label>
            <q-item-label caption lines="2" v-html="note.content"></q-item-label>
        </q-item-section>
        <q-item-section side v-if="showUp">
            <q-btn icon="sym_o_arrow_drop_up" dense flat @click="emit('up')" :aria-label="t('list.up')" />
        </q-item-section>
        <q-item-section side v-if="showDown">
            <q-btn icon="sym_o_arrow_drop_down" dense flat @click="emit('down')" :aria-label="t('list.down')" />
        </q-item-section>
        <q-item-section side>
            <q-btn icon="sym_o_delete" dense flat @click="emit('delete')" :aria-label="t('list.delete')" />
        </q-item-section>
    </q-item>
</template>

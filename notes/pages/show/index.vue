<script setup lang="ts">
    const { t } = useI18n();
    const route = useRoute();

    const note = await useSyncExtStorage(() => `note:${route.params.id}`, undefined);
</script>

<template>
    <template v-if="note">
        <div class="column fit">
            <div class="col-auto">
                <q-input v-model="note.title" :label="t('show.title')" />
            </div>
            <div class="col">
                <q-editor v-model="note.content" class="fit" />
            </div>
        </div>
    </template>
</template>

<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';

    const { t } = useI18n();
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_settings" class="q-mb-xs q-mr-xs" />
                {{ t('pages.keyboardShortcuts.general.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <BoolPrefItem
                pref="firedragon.keyboardShortcuts.defaults"
                :title="t('pages.keyboardShortcuts.general.enableDefaultShortcuts.title')"
                :description="t('pages.keyboardShortcuts.general.enableDefaultShortcuts.description')"
            />
        </q-list>
    </q-card>
</template>

<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';

    const { t } = useI18n();
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_side_navigation" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.sidebar.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <BoolPrefItem pref="userChrome.sidebar.overlap" :title="t('pages.design-lepton.sidebar.sidebarOverlap.title')" />
        </q-list>
    </q-card>
</template>

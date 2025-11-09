<script lang="ts" setup>
    import BoolPrefItemWithUndo from '@/components/BoolPrefItemWithUndo.vue';

    const { t } = useI18n();
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_new_window" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.newTab.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <BoolPrefItemWithUndo pref="userContent.newTab.field_border" :title="t('pages.design-lepton.newTab.newTabFieldBorder.title')" :description="t('pages.design-lepton.default')" />
            <BoolPrefItemWithUndo pref="userContent.newTab.full_icon" :title="t('pages.design-lepton.newTab.newTabFullIcon.title')" :description="t('pages.design-lepton.default')" />
            <BoolPrefItemWithUndo pref="userContent.newTab.animate" :title="t('pages.design-lepton.newTab.newTabAnimate.title')" :description="t('pages.design-lepton.default')" />
            <BoolPrefItemWithUndo pref="userContent.newTab.searchbar" :title="t('pages.design-lepton.newTab.newTabSearchbar.title')" :description="t('pages.design-lepton.default')" />
        </q-list>
    </q-card>
</template>

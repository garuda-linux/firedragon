<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';

    const { t } = useI18n();
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_dropdown" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.panel.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <BoolPrefItem pref="userChrome.panel.remove_strip" :title="t('pages.design-lepton.panel.panelRemoveStrip.title')" />
            <BoolPrefItem pref="userChrome.panel.full_width_separator" :title="t('pages.design-lepton.panel.panelFullWidthSeparator.title')" />
            <BoolPrefItem pref="userChrome.panel.full_width_padding" :title="t('pages.design-lepton.panel.panelFullWidthPadding.title')" />
        </q-list>
    </q-card>
</template>

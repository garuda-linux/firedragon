<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import BoolPrefItemWithUndo from '@/components/BoolPrefItemWithUndo.vue';

    const { t } = useI18n();

    const advancedSettings = useBoolPref('firedragon.settings.design.lepton.advanced');

    const themeProtonColor = useBoolPref('userChrome.theme.proton_color');
;
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_settings" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.theme.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <template v-if="advancedSettings">
                <BoolPrefItemWithUndo pref="userChrome.theme.built_in_contrast" :title="t('pages.design-lepton.theme.themeBuiltInContrast.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.theme.system_default" :title="t('pages.design-lepton.theme.themeSystemDefault.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.theme.proton_color" :title="t('pages.design-lepton.theme.themeProtonColor.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.theme.proton_chrome" :title="t('pages.design-lepton.theme.themeProtonChrome.title')" :description="t('pages.design-lepton.default')" :inset-level="1" :disable="!themeProtonColor" />
                <BoolPrefItemWithUndo pref="userChrome.theme.fully_color" :title="t('pages.design-lepton.theme.themeFullyColor.title')" :description="t('pages.design-lepton.default')" :inset-level="1" :disable="!themeProtonColor" />
                <BoolPrefItemWithUndo pref="userChrome.theme.fully_dark" :title="t('pages.design-lepton.theme.themeFullyDark.title')" :description="t('pages.design-lepton.default')" :inset-level="1" :disable="!themeProtonColor" />
                <q-separator spaced />
            </template>
            <BoolPrefItem pref="userChrome.theme.proton_color.dark_blue_accent" :title="t('pages.design-lepton.theme.themeProtonColorDarkBlueAccent.title')" />
            <BoolPrefItem pref="userChrome.theme.monospace" :title="t('pages.design-lepton.theme.themeMonospace.title')" />
        </q-list>
    </q-card>
</template>

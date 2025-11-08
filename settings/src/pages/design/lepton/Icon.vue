<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import BoolPrefItemWithUndo from '@/components/BoolPrefItemWithUndo.vue';

    const { t } = useI18n();

    const advancedSettings = useBoolPref('firedragon.settings.design.lepton.advanced');
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_settings" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.icon.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <template v-if="advancedSettings">
                <BoolPrefItemWithUndo pref="userChrome.icon.panel" :title="t('pages.design-lepton.icon.iconPanel.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.icon.library" :title="t('pages.design-lepton.icon.iconLibrary.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.icon.context_menu" :title="t('pages.design-lepton.icon.iconContextMenu.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.icon.global_menu" :title="t('pages.design-lepton.icon.iconGlobalMenu.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.icon.global_menubar" :title="t('pages.design-lepton.icon.iconGlobalMenubar.title')" :description="t('pages.design-lepton.default')" />
                <q-separator spaced />
                <BoolPrefItemWithUndo pref="userChrome.icon.panel_full" :title="t('pages.design-lepton.icon.iconPanelFull.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.icon.panel_photon" :title="t('pages.design-lepton.icon.iconPanelPhoton.title')" :description="t('pages.design-lepton.distribution')" />
                <q-separator spaced />
            </template>
            <BoolPrefItem pref="userChrome.icon.disabled" :title="t('pages.design-lepton.icon.iconDisabled.title')" />
            <BoolPrefItem pref="userChrome.icon.account_image_to_right" :title="t('pages.design-lepton.icon.iconAccountImageToRight.title')" />
            <BoolPrefItem pref="userChrome.icon.account_label_to_right" :title="t('pages.design-lepton.icon.iconAccountLabelToRight.title')" />
            <BoolPrefItem pref="userChrome.icon.menu.full" :title="t('pages.design-lepton.icon.iconMenuFull.title')" />
            <BoolPrefItem pref="userChrome.icon.global_menu.mac" :title="t('pages.design-lepton.icon.iconGlobalMenuMac.title')" />
        </q-list>
    </q-card>
</template>

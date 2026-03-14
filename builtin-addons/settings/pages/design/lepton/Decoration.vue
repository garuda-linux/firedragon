<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import BoolPrefItemWithUndo from '@/components/BoolPrefItemWithUndo.vue';

    const { t } = useI18n();

    const advancedSettings = await useBoolPref('firedragon.settings.design.lepton.advanced');
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_animation" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.decoration.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <template v-if="advancedSettings">
                <BoolPrefItemWithUndo
                    pref="userChrome.decoration.cursor"
                    :title="t('pages.design-lepton.decoration.decorationCursor.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.decoration.field_border"
                    :title="t('pages.design-lepton.decoration.decorationFieldBorder.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.decoration.download_panel"
                    :title="t('pages.design-lepton.decoration.decorationDownloadPanel.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.decoration.animate"
                    :title="t('pages.design-lepton.decoration.decorationAnimate.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <q-separator spaced />
            </template>
            <BoolPrefItem
                pref="userChrome.decoration.disable_panel_animate"
                :title="t('pages.design-lepton.decoration.decorationDisablePanelAnimate.title')"
            />
            <BoolPrefItem
                pref="userChrome.decoration.disable_sidebar_animate"
                :title="t('pages.design-lepton.decoration.decorationDisableSidebarAnimate.title')"
            />
        </q-list>
    </q-card>
</template>

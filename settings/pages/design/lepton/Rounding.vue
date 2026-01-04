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
                <q-icon name="sym_o_rounded_corner" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.rounding.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <template v-if="advancedSettings">
                <BoolPrefItemWithUndo
                    pref="userChrome.rounding.square_tab"
                    :title="t('pages.design-lepton.rounding.roundingSquareTab.title')"
                    :description="t('pages.design-lepton.distribution')"
                />
                <q-separator spaced />
            </template>
            <BoolPrefItem
                pref="userChrome.rounding.square_panel"
                :title="t('pages.design-lepton.rounding.roundingSquarePanel.title')"
            />
            <BoolPrefItem
                pref="userChrome.rounding.square_panelitem"
                :title="t('pages.design-lepton.rounding.roundingSquarePanelitem.title')"
            />
            <BoolPrefItem
                pref="userChrome.rounding.square_menupopup"
                :title="t('pages.design-lepton.rounding.roundingSquareMenupopup.title')"
            />
            <BoolPrefItem
                pref="userChrome.rounding.square_menuitem"
                :title="t('pages.design-lepton.rounding.roundingSquareMenuitem.title')"
            />
            <BoolPrefItem
                pref="userChrome.rounding.square_field"
                :title="t('pages.design-lepton.rounding.roundingSquareField.title')"
            />
            <BoolPrefItem
                pref="userChrome.rounding.square_checklabel"
                :title="t('pages.design-lepton.rounding.roundingSquareChecklabel.title')"
            />
        </q-list>
    </q-card>
</template>

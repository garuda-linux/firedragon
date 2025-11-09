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
                <q-icon name="sym_o_play_arrow" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.player.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <template v-if="advancedSettings">
                <BoolPrefItemWithUndo pref="userContent.player.ui" :title="t('pages.design-lepton.player.playerUi.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userContent.player.icon" :title="t('pages.design-lepton.player.playerIcon.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userContent.player.noaudio" :title="t('pages.design-lepton.player.playerNoaudio.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userContent.player.size" :title="t('pages.design-lepton.player.playerSize.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userContent.player.click_to_play" :title="t('pages.design-lepton.player.playerClickToPlay.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userContent.player.animate" :title="t('pages.design-lepton.player.playerAnimate.title')" :description="t('pages.design-lepton.default')" />
                <q-separator spaced />
            </template>
            <BoolPrefItem pref="userContent.player.ui.twoline" :title="t('pages.design-lepton.player.playerUiTwoline.title')" />
        </q-list>
    </q-card>
</template>

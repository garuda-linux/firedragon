<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import BoolPrefItemWithUndo from '@/components/BoolPrefItemWithUndo.vue';

    const { t } = useI18n();
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_fullscreen" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.fullscreen.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <BoolPrefItem
                pref="userChrome.fullscreen.overlap"
                :title="t('pages.design-lepton.fullscreen.fullscreenOverlap.title')"
                :description="t('pages.design-lepton.default')"
            />
            <BoolPrefItem
                pref="userChrome.fullscreen.show_bookmarkbar"
                :title="t('pages.design-lepton.fullscreen.fullscreenShowBookmarkbar.title')"
                :description="t('pages.design-lepton.default')"
            />
        </q-list>
    </q-card>
</template>

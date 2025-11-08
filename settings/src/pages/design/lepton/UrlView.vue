<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';

    const { t } = useI18n();
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_input" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.urlView.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <BoolPrefItem pref="userChrome.urlView.move_icon_to_left" :title="t('pages.design-lepton.urlView.urlViewMoveIconToLeft.title')" />
            <BoolPrefItem pref="userChrome.urlView.go_button_when_typing" :title="t('pages.design-lepton.urlView.urlViewGoButtonWhenTyping.title')" />
            <BoolPrefItem pref="userChrome.urlView.always_show_page_actions" :title="t('pages.design-lepton.urlView.urlViewAlwaysShowPageActions.title')" />
        </q-list>
    </q-card>
</template>

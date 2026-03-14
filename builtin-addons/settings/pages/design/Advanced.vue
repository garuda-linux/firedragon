<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';

    const { t } = useI18n();

    promptRestartOnChange(
        await useBoolPref('toolkit.legacyUserProfileCustomizations.stylesheets'),
        t('pages.design.advanced.allowUserChromeCss.restartDialog.title'),
        t('pages.design.advanced.allowUserChromeCss.restartDialog.message'),
    );
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_settings" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design.advanced.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <BoolPrefItem
                pref="toolkit.legacyUserProfileCustomizations.stylesheets"
                :title="t('pages.design.advanced.allowUserChromeCss.title')"
                :description="t('pages.design.advanced.allowUserChromeCss.description')"
            />
        </q-list>
    </q-card>
</template>

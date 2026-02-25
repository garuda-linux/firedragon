<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import ToggleItem from '@/components/ToggleItem.vue';

    const { t } = useI18n();

    const autoUpdateExtensions = toggleRefs(
        [await useBoolPref('extensions.update.enabled'), await useBoolPref('extensions.update.autoUpdateDefault')],
        [true, true],
        [false, false],
    );
    const enableMiddleClickPaste = toggleRefs(
        [await useBoolPref('clipboard.autocopy'), await useBoolPref('middlemouse.paste')],
        [true, true],
        [false, false],
    );

    promptRestartOnChange(
        await useBoolPref('identity.fxaccounts.enabled'),
        t('pages.home.browserBehaviour.enableSync.restartDialog.title'),
        t('pages.home.browserBehaviour.enableSync.restartDialog.message'),
    );
    promptRestartOnChange(
        await useBoolPref('firedragon.hidePasswdmgr'),
        t('pages.home.browserBehaviour.hidePasswdmgr.restartDialog.title'),
        t('pages.home.browserBehaviour.hidePasswdmgr.restartDialog.message'),
    );
    promptRestartOnChange(
        await useBoolPref('firedragon.newtab.enable'),
        t('pages.home.browserBehaviour.enableNewTab.restartDialog.title'),
        t('pages.home.browserBehaviour.enableNewTab.restartDialog.message'),
    );
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_settings" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.browserBehaviour.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <ToggleItem
                :title="t('pages.home.browserBehaviour.autoUpdateExtensions.title')"
                :description="t('pages.home.browserBehaviour.autoUpdateExtensions.description')"
                v-model="autoUpdateExtensions"
            />
            <BoolPrefItem
                pref="identity.fxaccounts.enabled"
                :title="t('pages.home.browserBehaviour.enableSync.title')"
                :description="t('pages.home.browserBehaviour.enableSync.description')"
            />
            <ToggleItem
                :title="t('pages.home.browserBehaviour.enableMiddleClickPaste.title')"
                :description="t('pages.home.browserBehaviour.enableMiddleClickPaste.description')"
                v-model="enableMiddleClickPaste"
            />
            <BoolPrefItem
                pref="firedragon.hidePasswdmgr"
                :title="t('pages.home.browserBehaviour.hidePasswdmgr.title')"
                :description="t('pages.home.browserBehaviour.hidePasswdmgr.description')"
            />
            <BoolPrefItem
                pref="firedragon.translations.enable"
                :title="t('pages.home.browserBehaviour.enableTranslations.title')"
                :description="t('pages.home.browserBehaviour.enableTranslations.description')"
            />
            <BoolPrefItem
                pref="firedragon.newtab.enable"
                :title="t('pages.home.browserBehaviour.enableNewTab.title')"
                :description="t('pages.home.browserBehaviour.enableNewTab.description')"
            />
        </q-list>
    </q-card>
</template>

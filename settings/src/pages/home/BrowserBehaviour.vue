<script lang="ts" setup>
    const { t } = useI18n();
    const { dialog } = useQuasar();

    function restartOnChange(ref: Ref<any>, title: string, message: string) {
        watch(ref, () => {
            dialog({
                title,
                message,
                persistent: true,
                cancel: true,
            }).onOk(() => {
                Services.startup.quit(Ci.nsIAppStartup.eAttemptQuit! | Ci.nsIAppStartup.eRestart!);
            });
        });
    }

    const autoUpdateExtensions = toggleRefs(
        [useBoolPref('extensions.update.enabled'), useBoolPref('extensions.update.autoUpdateDefault')],
        [true, true],
        [false, false],
    );
    const enableSync = useBoolPref('identity.fxaccounts.enabled');
    restartOnChange(
        enableSync,
        t('pages.home.browserBehaviour.enableSync.restartDialog.title'),
        t('pages.home.browserBehaviour.enableSync.restartDialog.message'),
    );
    const enableMiddleClickPaste = toggleRefs(
        [useBoolPref('clipboard.autocopy'), useBoolPref('middlemouse.paste')],
        [true, true],
        [false, false],
    );
    const allowUserChromeCss = useBoolPref('toolkit.legacyUserProfileCustomizations.stylesheets');
    restartOnChange(
        allowUserChromeCss,
        t('pages.home.browserBehaviour.allowUserChromeCss.restartDialog.title'),
        t('pages.home.browserBehaviour.allowUserChromeCss.restartDialog.message'),
    );
    const hidePasswdmgr = useBoolPref('firedragon.hidePasswdmgr');
    restartOnChange(
        hidePasswdmgr,
        t('pages.home.browserBehaviour.hidePasswdmgr.restartDialog.title'),
        t('pages.home.browserBehaviour.hidePasswdmgr.restartDialog.message'),
    );
    const enableTranslations = useBoolPref('firedragon.translations.enable');
    const enableDefaultShortcuts = useBoolPref('firedragon.defaultShortcuts.enable');
    const enableNewTab = useBoolPref('firedragon.newtab.enable');
    restartOnChange(
        enableNewTab,
        t('pages.home.browserBehaviour.enableNewTab.restartDialog.title'),
        t('pages.home.browserBehaviour.enableNewTab.restartDialog.message'),
    );
    watch(enableNewTab, console.log);
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="settings" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.browserBehaviour.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.browserBehaviour.autoUpdateExtensions.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.browserBehaviour.autoUpdateExtensions.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="autoUpdateExtensions" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.browserBehaviour.enableSync.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.browserBehaviour.enableSync.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableSync" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.browserBehaviour.enableMiddleClickPaste.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.browserBehaviour.enableMiddleClickPaste.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableMiddleClickPaste" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.browserBehaviour.allowUserChromeCss.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.browserBehaviour.allowUserChromeCss.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="allowUserChromeCss" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.browserBehaviour.hidePasswdmgr.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.browserBehaviour.hidePasswdmgr.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="hidePasswdmgr" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.browserBehaviour.enableTranslations.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.browserBehaviour.enableTranslations.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableTranslations" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.browserBehaviour.enableDefaultShortcuts.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.browserBehaviour.enableDefaultShortcuts.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableDefaultShortcuts" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.browserBehaviour.enableNewTab.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.browserBehaviour.enableNewTab.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableNewTab" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>

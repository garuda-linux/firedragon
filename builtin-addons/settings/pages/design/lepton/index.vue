<script setup lang="ts">
    import Autohide from '@/pages/design/lepton/Autohide.vue';
    import Centered from '@/pages/design/lepton/Centered.vue';
    import Decoration from '@/pages/design/lepton/Decoration.vue';
    import Fullscreen from '@/pages/design/lepton/Fullscreen.vue';
    import Hidden from '@/pages/design/lepton/Hidden.vue';
    import Icon from '@/pages/design/lepton/Icon.vue';
    import NewTab from '@/pages/design/lepton/NewTab.vue';
    import Padding from '@/pages/design/lepton/Padding.vue';
    import Page from '@/pages/design/lepton/Page.vue';
    import Panel from '@/pages/design/lepton/Panel.vue';
    import Player from '@/pages/design/lepton/Player.vue';
    import Rounding from '@/pages/design/lepton/Rounding.vue';
    import Tab from '@/pages/design/lepton/Tab.vue';
    import Tabbar from '@/pages/design/lepton/Tabbar.vue';
    import Theme from '@/pages/design/lepton/Theme.vue';
    import UrlView from '@/pages/design/lepton/UrlView.vue';

    const { t } = useI18n();

    const advancedSettings = await useBoolPref('firedragon.settings.design.lepton.advanced');

    const firedragonNewtab = await useBoolPref('firedragon.newtab.enabled');

    async function reset() {
        for (const prefName of await browser.firedragon.getChildList('userChrome')) {
            browser.firedragon.clearUserPref(prefName);
        }
        for (const prefName of await browser.firedragon.getChildList('userContent')) {
            browser.firedragon.clearUserPref(prefName);
        }
    }
</script>

<template>
    <q-page padding>
        <div class="column q-gutter-lg">
            <div>
                <h1 class="text-h5 q-mt-none q-mb-sm">{{ t('pages.design-lepton.title') }}</h1>
                <div class="row q-gutter-lg">
                    <div class="col-grow">
                        <div class="text-subtitle1 q-mb-sm">
                            {{ t('pages.design-lepton.default') }}
                        </div>
                        <div>
                            <a href="https://github.com/black7375/Firefox-UI-Fix/wiki/Options" target="_blank">{{
                                t('pages.design-lepton.link')
                            }}</a>
                        </div>
                    </div>
                    <div class="self-end">
                        <q-toggle v-model="advancedSettings" :label="t('pages.design-lepton.advanced')" />
                    </div>
                    <div class="self-end">
                        <q-btn color="primary" @click="reset">{{ t('pages.design-lepton.reset') }}</q-btn>
                    </div>
                </div>
            </div>
            <Theme />
            <Decoration />
            <Autohide />
            <Hidden />
            <Centered />
            <Rounding />
            <Padding />
            <UrlView />
            <Tabbar />
            <Tab />
            <Panel />
            <Fullscreen v-if="advancedSettings" />
            <Icon />
            <Player />
            <NewTab v-if="!firedragonNewtab && advancedSettings" />
            <Page />
        </div>
    </q-page>
</template>

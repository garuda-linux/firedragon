<script setup lang="ts">
    import Autohide from '@/pages/design/lepton/Autohide.vue';
    import Centered from '@/pages/design/lepton/Centered.vue';
    import Decoration from '@/pages/design/lepton/Decoration.vue';
    import Fullscreen from '@/pages/design/lepton/Fullscreen.vue';
    import Hidden from '@/pages/design/lepton/Hidden.vue';
    import Icon from '@/pages/design/lepton/Icon.vue';
    import Panel from '@/pages/design/lepton/Panel.vue';
    import Padding from '@/pages/design/lepton/Padding.vue';
    import Rounding from '@/pages/design/lepton/Rounding.vue';
    import Tab from '@/pages/design/lepton/Tab.vue';
    import Tabbar from '@/pages/design/lepton/Tabbar.vue';
    import Theme from '@/pages/design/lepton/Theme.vue';
    import UrlView from '@/pages/design/lepton/UrlView.vue';

    const { t } = useI18n();

    const advancedSettings = useBoolPref('firedragon.settings.design.lepton.advanced');

    function reset() {
        for (const prefName of Services.prefs.getChildList('userChrome')) {
            Services.prefs.clearUserPref(prefName);
        }
    }
</script>

<template>
    <q-page padding>
        <h1 class="text-h5 q-mt-none q-mb-sm">{{ t('pages.design-lepton.title') }}</h1>
        <div class="row q-gutter-lg">
            <div class="col-grow">
                <div class="text-subtitle1 q-mb-sm">{{ t('pages.design-lepton.description') }}</div>
                <div class="q-mb-lg">
                    <a href="https://github.com/black7375/Firefox-UI-Fix/wiki/Options" target="_blank">{{ t('pages.design-lepton.link') }}</a>
                </div>
            </div>
            <div class="self-end">
                <q-toggle v-model="advancedSettings" :label="t('pages.design-lepton.advanced')" class="q-mb-lg" />
            </div>
            <div class="self-end">
                <q-btn color="primary" class="q-mb-lg" @click="reset">{{ t('pages.design-lepton.reset') }}</q-btn>
            </div>
        </div>
        <Theme class="q-mb-lg" />
        <Decoration class="q-mb-lg" />
        <Autohide class="q-mb-lg" />
        <Hidden class="q-mb-lg" />
        <Centered class="q-mb-lg" />
        <Rounding class="q-mb-lg" />
        <Padding class="q-mb-lg" />
        <UrlView class="q-mb-lg" />
        <Tabbar class="q-mb-lg" />
        <Tab class="q-mb-lg" />
        <Panel class="q-mb-lg" />
        <Fullscreen class="q-mb-lg" v-if="advancedSettings" />
        <Icon />
    </q-page>
</template>

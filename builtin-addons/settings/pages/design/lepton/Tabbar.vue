<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';

    const { t } = useI18n();

    const tabbarOnBottom = await useBoolPref('userChrome.tabbar.on_bottom');
    const tabbarOneLiner = await useBoolPref('userChrome.tabbar.one_liner');
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_tabs" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.tabbar.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <BoolPrefItem
                pref="userChrome.tabbar.as_titlebar"
                :title="t('pages.design-lepton.tabbar.tabbarAsTitlebar.title')"
            />
            <BoolPrefItem
                pref="userChrome.tabbar.on_bottom"
                :title="t('pages.design-lepton.tabbar.tabbarOnBottom.title')"
            />
            <BoolPrefItem
                pref="userChrome.tabbar.on_bottom.above_bookmark"
                :title="t('pages.design-lepton.tabbar.tabbarOnBottomAboveBookmark.title')"
                :inset-level="1"
                :disable="!tabbarOnBottom"
            />
            <BoolPrefItem
                pref="userChrome.tabbar.on_bottom.menubar_on_top"
                :title="t('pages.design-lepton.tabbar.tabbarOnBottomMenubarOnTop.title')"
                :inset-level="1"
                :disable="!tabbarOnBottom"
            />
            <BoolPrefItem
                pref="userChrome.tabbar.on_bottom.hidden_single_tab"
                :title="t('pages.design-lepton.tabbar.tabbarOnBottomHiddenSingleTab.title')"
                :inset-level="1"
                :disable="!tabbarOnBottom"
            />
            <BoolPrefItem
                pref="userChrome.tabbar.one_liner"
                :title="t('pages.design-lepton.tabbar.tabbarOneLiner.title')"
            />
            <BoolPrefItem
                pref="userChrome.tabbar.one_liner.combine_navbar"
                :title="t('pages.design-lepton.tabbar.tabbarOneLinerCombineNavbar.title')"
                :inset-level="1"
                :disable="!tabbarOneLiner"
            />
            <BoolPrefItem
                pref="userChrome.tabbar.one_liner.tabbar_first"
                :title="t('pages.design-lepton.tabbar.tabbarOneLinerTabbarFirst.title')"
                :inset-level="1"
                :disable="!tabbarOneLiner"
            />
            <BoolPrefItem
                pref="userChrome.tabbar.one_liner.responsive"
                :title="t('pages.design-lepton.tabbar.tabbarOneLinerResponsive.title')"
                :inset-level="1"
                :disable="!tabbarOneLiner"
            />
        </q-list>
    </q-card>
</template>

<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import Item from '@/components/Item.vue';
    import TypeSelect from '@/components/TypeSelect.vue';

    const { t } = useI18n();

    const autohideTab = await useBoolPref('userChrome.autohide.tab');
    const autohideTabOpacity = await useBoolPref('userChrome.autohide.tab.opacity');
    const autohideTabBlur = await useBoolPref('userChrome.autohide.tab.blur');
    const autohideTabType = computed({
        get: () =>
            !autohideTab.value
                ? 'none'
                : autohideTabOpacity.value
                  ? 'opacity'
                  : autohideTabBlur.value
                    ? 'blur'
                    : 'default',
        set: (value) => {
            autohideTab.value = value !== 'none';
            autohideTabOpacity.value = value === 'opacity';
            autohideTabBlur.value = value === 'blur';
        },
    });
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_visibility_off" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.autohide.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <Item :title="t('pages.design-lepton.autohide.autohideTab.title')">
                <TypeSelect
                    v-model="autohideTabType"
                    :options="['none', 'default', 'opacity', 'blur']"
                    translation-key="pages.design-lepton.autohide.autohideTab.type"
                />
            </Item>
            <BoolPrefItem
                pref="userChrome.autohide.navbar"
                :title="t('pages.design-lepton.autohide.autohideNavbar.title')"
            />
            <BoolPrefItem
                pref="userChrome.autohide.bookmarkbar"
                :title="t('pages.design-lepton.autohide.autohideBookmarkbar.title')"
            />
            <BoolPrefItem
                pref="userChrome.autohide.sidebar"
                :title="t('pages.design-lepton.autohide.autohideSidebar.title')"
            />
            <BoolPrefItem
                pref="userChrome.autohide.fill_urlbar"
                :title="t('pages.design-lepton.autohide.autohideFillUrlbar.title')"
            />
            <BoolPrefItem
                pref="userChrome.autohide.back_button"
                :title="t('pages.design-lepton.autohide.autohideBackButton.title')"
            />
            <BoolPrefItem
                pref="userChrome.autohide.forward_button"
                :title="t('pages.design-lepton.autohide.autohideForwardButton.title')"
            />
            <BoolPrefItem
                pref="userChrome.autohide.page_action"
                :title="t('pages.design-lepton.autohide.autohidePageAction.title')"
            />
            <BoolPrefItem
                pref="userChrome.autohide.toolbar_overlap"
                :title="t('pages.design-lepton.autohide.autohideToolbarOverlap.title')"
            />
        </q-list>
    </q-card>
</template>

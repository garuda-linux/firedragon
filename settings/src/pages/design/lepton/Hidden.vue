<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import TypeSelect from '@/components/TypeSelect.vue';
    import Item from "@/components/Item.vue";

    const { t } = useI18n();

    const hiddenTabIcon = useBoolPref('userChrome.hidden.tab_icon');
    const hiddenTabIconAlways = useBoolPref('userChrome.hidden.tab_icon.always');
    const hiddenTabIconType = computed({
        get: () => !hiddenTabIcon.value ? 'none' : hiddenTabIconAlways.value ? 'always' : 'default',
        set: (value) => {
            hiddenTabIcon.value = value !== 'none';
            hiddenTabIconAlways.value = value === 'always';
        },
    });

    const hiddenSidebarHeader = useBoolPref('userChrome.hidden.sidebar_header');
    const hiddenSidebarHeaderVerticalTabOnly = useBoolPref('userChrome.hidden.sidebar_header.vertical_tab_only');
    const hiddenSidebarHeaderType = computed({
        get: () => !hiddenSidebarHeader.value ? 'none' : hiddenSidebarHeaderVerticalTabOnly.value ? 'verticalTabOnly' : 'default',
        set: (value) => {
            hiddenSidebarHeader.value = value !== 'none';
            hiddenSidebarHeaderVerticalTabOnly.value = value === 'verticalTabOnly';
        },
    });

    const hiddenBookmarkbarIcon = useBoolPref('userChrome.hidden.bookmarkbar_icon');
    const hiddenBookmarkbarLabel = useBoolPref('userChrome.hidden.bookmarkbar_label');
    const hiddenBookmarkbarType = computed({
        get: () => hiddenBookmarkbarIcon.value ? 'icon' : hiddenBookmarkbarLabel.value ? 'label' : 'none',
        set: (value) => {
            hiddenBookmarkbarIcon.value = value === 'icon';
            hiddenBookmarkbarLabel.value = value === 'label';
        },
    });
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_visibility" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.hidden.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <Item :title="t('pages.design-lepton.hidden.hiddenTabIcon.title')">
                <TypeSelect v-model="hiddenTabIconType" :options="['none', 'default', 'always']" translation-key="pages.design-lepton.hidden.hiddenTabIcon.type" />
            </Item>
            <BoolPrefItem pref="userChrome.hidden.tab_icon" :title="t('pages.design-lepton.hidden.hiddenTabbar.title')" />
            <BoolPrefItem pref="userChrome.hidden.navbar" :title="t('pages.design-lepton.hidden.hiddenNavbar.title')" />
            <Item :title="t('pages.design-lepton.hidden.hiddenSidebarHeader.title')">
                <TypeSelect v-model="hiddenSidebarHeaderType" :options="['none', 'default', 'verticalTabOnly']" translation-key="pages.design-lepton.hidden.hiddenSidebarHeader.type" />
            </Item>
            <BoolPrefItem pref="userChrome.hidden.urlbar_iconbox" :title="t('pages.design-lepton.hidden.hiddenUrlbarIconbox.title')" />
            <Item :title="t('pages.design-lepton.hidden.hiddenBookmarkbar.title')">
                <TypeSelect v-model="hiddenBookmarkbarType" :options="['none', 'icon', 'label']" translation-key="pages.design-lepton.hidden.hiddenBookmarkbar.type" />
            </Item>
            <BoolPrefItem pref="userChrome.hidden.disabled_menu" :title="t('pages.design-lepton.hidden.hiddenDisabledMenu.title')" />
        </q-list>
    </q-card>
</template>

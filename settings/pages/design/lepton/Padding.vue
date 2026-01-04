<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import BoolPrefItemWithUndo from '@/components/BoolPrefItemWithUndo.vue';
    import Item from '@/components/Item.vue';
    import TypeSelect from '@/components/TypeSelect.vue';

    const { t } = useI18n();

    const advancedSettings = await useBoolPref('firedragon.settings.design.lepton.advanced');

    const paddingFirstTab = await useBoolPref('userChrome.padding.first_tab');
    const paddingFirstTabAlways = await useBoolPref('userChrome.padding.first_tab.always');
    const paddingFirstTabType = computed({
        get: () => (!paddingFirstTab.value ? 'none' : paddingFirstTabAlways.value ? 'always' : 'default'),
        set: (value) => {
            paddingFirstTab.value = value !== 'none';
            paddingFirstTabAlways.value = value === 'always';
        },
    });

    const paddingDragSpace = await useBoolPref('userChrome.padding.drag_space');
    const paddingDragSpaceMaximized = await useBoolPref('userChrome.padding.drag_space.maximized');
    const paddingDragSpaceType = computed({
        get: () => (!paddingDragSpace.value ? 'none' : paddingDragSpaceMaximized.value ? 'maximized' : 'default'),
        set: (value) => {
            paddingDragSpace.value = value !== 'none';
            paddingDragSpaceMaximized.value = value === 'maximized';
        },
    });
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_border_outer" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.padding.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <template v-if="advancedSettings">
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.tabbar_width"
                    :title="t('pages.design-lepton.padding.paddingTabbarWidth.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.tabbar_height"
                    :title="t('pages.design-lepton.padding.paddingTabbarHeight.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.toolbar_button"
                    :title="t('pages.design-lepton.padding.paddingToolbarButton.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.navbar_width"
                    :title="t('pages.design-lepton.padding.paddingNavbarWidth.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.urlbar"
                    :title="t('pages.design-lepton.padding.paddingUrlbar.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.bookmarkbar"
                    :title="t('pages.design-lepton.padding.paddingBookmarkbar.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.infobar"
                    :title="t('pages.design-lepton.padding.paddingInfobar.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.menu"
                    :title="t('pages.design-lepton.padding.paddingMenu.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.bookmark_menu"
                    :title="t('pages.design-lepton.padding.paddingBookmarkMenu.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.global_menubar"
                    :title="t('pages.design-lepton.padding.paddingGlobalMenubar.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.panel"
                    :title="t('pages.design-lepton.padding.paddingPanel.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userChrome.padding.popup_panel"
                    :title="t('pages.design-lepton.padding.paddingPopupPanel.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <q-separator spaced />
            </template>
            <Item :title="t('pages.design-lepton.padding.paddingFirstTab.title')">
                <TypeSelect
                    v-model="paddingFirstTabType"
                    :options="['none', 'default', 'always']"
                    translation-key="pages.design-lepton.padding.paddingFirstTab.type"
                />
            </Item>
            <Item :title="t('pages.design-lepton.padding.paddingDragSpace.title')">
                <TypeSelect
                    v-model="paddingDragSpaceType"
                    :options="['none', 'default', 'maximized']"
                    translation-key="pages.design-lepton.padding.paddingDragSpace.type"
                />
            </Item>
            <BoolPrefItem
                pref="userChrome.padding.menu_compact"
                :title="t('pages.design-lepton.padding.paddingMenuCompact.title')"
            />
            <BoolPrefItem
                pref="userChrome.padding.bookmark_menu.compact"
                :title="t('pages.design-lepton.padding.paddingBookmarkMenuCompact.title')"
            />
            <BoolPrefItem
                pref="userChrome.padding.panel_header"
                :title="t('pages.design-lepton.padding.paddingPanelHeader.title')"
            />
            <BoolPrefItem
                pref="userChrome.padding.urlView_result"
                :title="t('pages.design-lepton.padding.paddingUrlViewResults.title')"
            />
        </q-list>
    </q-card>
</template>

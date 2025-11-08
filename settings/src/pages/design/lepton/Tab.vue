<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import BoolPrefItemWithUndo from '@/components/BoolPrefItemWithUndo.vue';
    import Item from "@/components/Item.vue";
    import TypeSelect from "@/components/TypeSelect.vue";

    const { t } = useI18n();

    const advancedSettings = useBoolPref('firedragon.settings.design.lepton.advanced');

    const tabStaticSeparator = useBoolPref('userChrome.tab.static_separator');

    const tabCloseButtonAtHover = useBoolPref('userChrome.tab.close_button_at_hover');
    const tabCloseButtonAtHoverAlways = useBoolPref('userChrome.tab.close_button_at_hover.always');
    const tabCloseButtonAtHoverType = computed({
        get: () => !tabCloseButtonAtHover.value ? 'none' : tabCloseButtonAtHoverAlways.value ? 'always' : 'default',
        set: (value) => {
            tabCloseButtonAtHover.value = value !== 'none';
            tabCloseButtonAtHoverAlways.value = value === 'always';
        },
    });

    const tabCloseButtonAtPinned = useBoolPref('userChrome.tab.close_button_at_pinned');
    const tabCloseButtonAtPinnedAlways = useBoolPref('userChrome.tab.close_button_at_pinned.always');
    const tabCloseButtonAtPinnedType = computed({
        get: () => !tabCloseButtonAtPinned.value ? 'none' : tabCloseButtonAtPinnedAlways.value ? 'always' : 'default',
        set: (value) => {
            tabCloseButtonAtPinned.value = value !== 'none';
            tabCloseButtonAtPinnedAlways.value = value === 'always';
        },
    });
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_tab" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.tab.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <template v-if="advancedSettings">
                <BoolPrefItemWithUndo pref="userChrome.tab.multi_selected" :title="t('pages.design-lepton.tab.tabMultiSelected.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.unloaded" :title="t('pages.design-lepton.tab.tabUnloaded.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.letters_cleary" :title="t('pages.design-lepton.tab.tabLettersCleary.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.sound_hide_label" :title="t('pages.design-lepton.tab.tabSoundHideLabel.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.sound_with_favicons" :title="t('pages.design-lepton.tab.tabSoundWithFavicons.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.pip" :title="t('pages.design-lepton.tab.tabPip.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.container" :title="t('pages.design-lepton.tab.tabContainer.title')" :description="t('pages.design-lepton.default')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.crashed" :title="t('pages.design-lepton.tab.tabCrashed.title')" :description="t('pages.design-lepton.default')" />
                <q-separator spaced />
                <BoolPrefItemWithUndo pref="userChrome.tab.connect_to_window" :title="t('pages.design-lepton.tab.tabConnectToWindow.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.color_like_toolbar" :title="t('pages.design-lepton.tab.tabColorLikeToolbar.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.lepton_like_padding" :title="t('pages.design-lepton.tab.tabLeptonLikePadding.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.photon_like_padding" :title="t('pages.design-lepton.tab.tabPhotonLikePadding.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.dynamic_separator" :title="t('pages.design-lepton.tab.tabDynamicSeparator.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.static_separator" :title="t('pages.design-lepton.tab.tabStaticSeparator.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.static_separator.selected_accent" :title="t('pages.design-lepton.tab.tabStaticSeparatorSelectedAccent.title')" :description="t('pages.design-lepton.distribution')" :inset-level="1" :disable="!tabStaticSeparator" />
                <BoolPrefItemWithUndo pref="userChrome.tab.newtab_button_like_tab" :title="t('pages.design-lepton.tab.tabNewtabButtonLikeTab.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.newtab_button_smaller" :title="t('pages.design-lepton.tab.tabNewtabButtonSmaller.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.newtab_button_proton" :title="t('pages.design-lepton.tab.tabNewtabButtonProton.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.box_shadow" :title="t('pages.design-lepton.tab.tabBoxShadow.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.bottom_rounded_corner" :title="t('pages.design-lepton.tab.tabBottomRoundedCorner.title')" :description="t('pages.design-lepton.distribution')" />
                <BoolPrefItemWithUndo pref="userChrome.tab.photon_like_contextline" :title="t('pages.design-lepton.tab.tabPhotonLikeContextline.title')" :description="t('pages.design-lepton.distribution')" />
                <q-separator spaced />
            </template>
            <BoolPrefItem pref="userChrome.tab.always_show_tab_icon" :title="t('pages.design-lepton.tab.tabAlwaysShowTabIcon.title')" />
            <Item :title="t('pages.design-lepton.tab.tabCloseButtonAtHover.title')">
                <TypeSelect v-model="tabCloseButtonAtHoverType" :options="['none', 'default', 'always']" translation-key="pages.design-lepton.tab.tabCloseButtonAtHover.type" />
            </Item>
            <Item :title="t('pages.design-lepton.tab.tabCloseButtonAtPinned.title')">
                <TypeSelect v-model="tabCloseButtonAtPinnedType" :options="['none', 'default', 'always']" translation-key="pages.design-lepton.tab.tabCloseButtonAtPinned.type" />
            </Item>
            <BoolPrefItem pref="userChrome.tab.close_button_at_pinned.background" :title="t('pages.design-lepton.tab.tabCloseButtonAtPinnedBackground.title')" :inset-level="1" :disable="!tabCloseButtonAtPinned" />
            <BoolPrefItemWithUndo pref="userChrome.tab.sound_show_label" :title="t('pages.design-lepton.tab.tabSoundShowLabel.title')" />
        </q-list>
    </q-card>
</template>

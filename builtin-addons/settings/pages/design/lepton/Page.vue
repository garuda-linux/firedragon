<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import BoolPrefItemWithUndo from '@/components/BoolPrefItemWithUndo.vue';
    import Item from '@/components/Item.vue';
    import TypeSelect from '@/components/TypeSelect.vue';

    const { t } = useI18n();

    const advancedSettings = await useBoolPref('firedragon.settings.design.lepton.advanced');

    const pageProtonColor = await useBoolPref('userContent.page.proton_color');

    const pageProtonColorDarkBlueAccent = await useBoolPref('userContent.page.proton_color.dark_blue_accent');
    const pageProtonColorSystemAccent = await useBoolPref('userContent.page.proton_color.system_accent');
    const widgetNonNativeThemeUseThemeAccent = await useBoolPref('widget.non-native-theme.use-theme-accent');
    const pageProtonColorType = computed({
        get: () =>
            pageProtonColorDarkBlueAccent.value
                ? 'darkBlueAccent'
                : pageProtonColorSystemAccent.value
                  ? 'systemAccent'
                  : 'none',
        set: (value) => {
            pageProtonColorDarkBlueAccent.value = value === 'darkBlueAccent';
            pageProtonColorSystemAccent.value = widgetNonNativeThemeUseThemeAccent.value = value === 'systemAccent';
        },
    });
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_article" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.page.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <template v-if="advancedSettings">
                <BoolPrefItemWithUndo
                    pref="userContent.page.illustration"
                    :title="t('pages.design-lepton.page.pageIllustration.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userContent.page.proton_color"
                    :title="t('pages.design-lepton.page.pageProtonColor.title')"
                    :description="t('pages.design-lepton.default')"
                />
                <BoolPrefItemWithUndo
                    pref="userContent.page.dark_mode"
                    :title="t('pages.design-lepton.page.pageDarkMode.title')"
                    :description="t('pages.design-lepton.default')"
                    :inset-level="1"
                    :disable="!pageProtonColor"
                />
                <BoolPrefItemWithUndo
                    pref="userContent.page.proton"
                    :title="t('pages.design-lepton.page.pageProton.title')"
                    :description="t('pages.design-lepton.default')"
                    :inset-level="1"
                    :disable="!pageProtonColor"
                />
                <q-separator spaced />
            </template>
            <Item :title="t('pages.design-lepton.page.pageProtonColor2.title')" :disable="!pageProtonColor">
                <TypeSelect
                    v-model="pageProtonColorType"
                    :options="['none', 'darkBlueAccent', 'systemAccent']"
                    translation-key="pages.design-lepton.page.pageProtonColor2.type"
                    :disable="!pageProtonColor"
                />
            </Item>
            <BoolPrefItem
                pref="userContent.page.monospace"
                :title="t('pages.design-lepton.page.pageMonospace.title')"
            />
        </q-list>
    </q-card>
</template>

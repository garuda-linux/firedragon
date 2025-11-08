<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import Item from '@/components/Item.vue';
    import TypeSelect from '@/components/TypeSelect.vue';

    const { t } = useI18n();

    const centeredTab = useBoolPref('userChrome.centered.tab');
    const centeredTabLabel = useBoolPref('userChrome.centered.tab.label');
    const centeredTabType = computed({
        get: () => !centeredTab.value ? 'none' : centeredTabLabel.value ? 'label' : 'default',
        set: (value) => {
            centeredTab.value = value !== 'none';
            centeredTabLabel.value = value === 'label';
        },
    });
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_align_horizontal_center" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design-lepton.centered.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <Item :title="t('pages.design-lepton.centered.centeredTab.title')">
                <TypeSelect v-model="centeredTabType" :options="['none', 'default', 'label']" translation-key="pages.design-lepton.centered.centeredTab.type" />
            </Item>
            <BoolPrefItem pref="userChrome.centered.urlbar" :title="t('pages.design-lepton.centered.centeredUrlbar.title')" />
            <BoolPrefItem pref="userChrome.centered.bookmarkbar" :title="t('pages.design-lepton.centered.centeredBookmarkbar.title')" />
        </q-list>
    </q-card>
</template>

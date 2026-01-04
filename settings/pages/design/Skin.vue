<script lang="ts" setup>
    import Item from '@/components/Item.vue';

    const { t } = useI18n();

    const { dark } = useQuasar();

    const skin = await useStringPref('firedragon.skin');

    promptRestartOnChange(
        skin,
        t('pages.design.skin.restartDialog.title'),
        t('pages.design.skin.restartDialog.message'),
    );
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_design_services" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design.skin.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <Item :title="t('pages.design.skin.proton.title')" :description="t('pages.design.skin.proton.description')">
                <template #avatar>
                    <q-img src="@/assets/design/skin/proton-dark.svg" width="150px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/proton-light.svg" width="150px" v-else />
                </template>
                <q-radio v-model="skin" val="" />
            </Item>
            <Item :title="t('pages.design.skin.lepton.title')" :description="t('pages.design.skin.lepton.description')">
                <template #avatar>
                    <q-img src="@/assets/design/skin/lepton-dark.svg" width="150px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/lepton-light.svg" width="150px" v-else />
                </template>
                <template #addon>
                    <q-btn to="/design/lepton" icon="sym_o_settings" flat round />
                </template>
                <q-radio v-model="skin" val="lepton" />
            </Item>
            <Item
                :title="t('pages.design.skin.lepton-photon.title')"
                :description="t('pages.design.skin.lepton-photon.description')"
            >
                <template #avatar>
                    <q-img src="@/assets/design/skin/lepton-photon-dark.svg" width="150px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/lepton-photon-light.svg" width="150px" v-else />
                </template>
                <template #addon>
                    <q-btn to="/design/lepton" icon="sym_o_settings" flat round />
                </template>
                <q-radio v-model="skin" val="lepton-photon" />
            </Item>
            <Item
                :title="t('pages.design.skin.lepton-proton.title')"
                :description="t('pages.design.skin.lepton-proton.description')"
            >
                <template #avatar>
                    <q-img src="@/assets/design/skin/lepton-proton-dark.svg" width="150px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/lepton-proton-light.svg" width="150px" v-else />
                </template>
                <template #addon>
                    <q-btn to="/design/lepton" icon="sym_o_settings" flat round />
                </template>
                <q-radio v-model="skin" val="lepton-proton" />
            </Item>
        </q-list>
    </q-card>
</template>

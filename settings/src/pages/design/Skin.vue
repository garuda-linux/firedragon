<script lang="ts" setup>
    const { t } = useI18n();

    const { dark } = useQuasar();

    const skin = useStringPref('firedragon.skin');
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="design_services" class="q-mb-xs q-mr-xs" />
                {{ t('pages.design.skin.title') }}
            </h2>
        </q-card-section>
        <q-list class="q-mb-lg">
            <q-item tag="label" clickable v-ripple>
                <q-item-section avatar>
                    <q-img src="@/assets/design/skin/proton-dark.svg" width="100px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/proton-light.svg" width="100px" v-else />
                </q-item-section>
                <q-item-section>{{ t('pages.design.skin.proton.title') }}</q-item-section>
                <q-item-section side>
                    <q-radio v-model="skin" val="" />
                </q-item-section>
            </q-item>
            <q-item tag="label" clickable v-ripple>
                <q-item-section avatar>
                    <q-img src="@/assets/design/skin/fluerial-dark.svg" width="100px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/fluerial-light.svg" width="100px" v-else />
                </q-item-section>
                <q-item-section>{{ t('pages.design.skin.fluerial.title') }}</q-item-section>
                <q-item-section side>
                    <q-radio v-model="skin" val="fluerial" />
                </q-item-section>
            </q-item>
            <q-item tag="label" clickable v-ripple>
                <q-item-section avatar>
                    <q-img src="@/assets/design/skin/lepton-dark.svg" width="100px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/lepton-light.svg" width="100px" v-else />
                </q-item-section>
                <q-item-section>{{ t('pages.design.skin.lepton.title') }}</q-item-section>
                <q-item-section side>
                    <q-radio v-model="skin" val="lepton" />
                </q-item-section>
            </q-item>
            <q-item tag="label" clickable v-ripple>
                <q-item-section avatar>
                    <q-img src="@/assets/design/skin/lepton-photon-dark.svg" width="100px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/lepton-photon-light.svg" width="100px" v-else />
                </q-item-section>
                <q-item-section>{{ t('pages.design.skin.lepton-photon.title') }}</q-item-section>
                <q-item-section side>
                    <q-radio v-model="skin" val="lepton-photon" />
                </q-item-section>
            </q-item>
            <q-item tag="label" clickable v-ripple>
                <q-item-section avatar>
                    <q-img src="@/assets/design/skin/lepton-proton-dark.svg" width="100px" v-if="dark.isActive" />
                    <q-img src="@/assets/design/skin/lepton-proton-light.svg" width="100px" v-else />
                </q-item-section>
                <q-item-section>{{ t('pages.design.skin.lepton-proton.title') }}</q-item-section>
                <q-item-section side>
                    <q-radio v-model="skin" val="lepton-proton" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>
<script lang="ts" setup>
    import ToggleItem from '@/components/ToggleItem.vue';

    const { t } = useI18n();

    const enableIPv6 = toggleRefs([await useBoolPref('network.dns.disableIPv6')], [false], [true]);
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_cloud" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.networking.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <ToggleItem
                :title="t('pages.home.networking.enableIPv6.title')"
                :description="t('pages.home.networking.enableIPv6.description')"
                v-model="enableIPv6"
            />
        </q-list>
    </q-card>
</template>

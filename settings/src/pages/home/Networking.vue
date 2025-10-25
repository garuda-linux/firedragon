<script lang="ts" setup>
    const { t } = useI18n();

    const enableIPv6 = toggleRefs(
        [useBoolPref('network.dns.disableIPv6')],
        [false],
        [true],
    );
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="cloud" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.networking.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.networking.enableIPv6.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.networking.enableIPv6.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableIPv6" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>

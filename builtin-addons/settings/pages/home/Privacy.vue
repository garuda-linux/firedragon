<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import ToggleItem from '@/components/ToggleItem.vue';

    const { t } = useI18n();

    const limitCrossOriginReferrers = toggleRefs([await useIntPref('network.http.referer.XOriginPolicy')], [2], [0]);
    const autoRefuseCookies = toggleRefs(
        [
            await useIntPref('cookiebanners.service.mode'),
            await useIntPref('cookiebanners.service.mode.privateBrowsing'),
        ],
        [1, 1],
        [0, 0],
    );

    promptRestartOnChange(
        await useBoolPref('firedragon.config.prefetch.enable'),
        t('pages.home.privacy.enablePrefetchConfig.restartDialog.title'),
        t('pages.home.privacy.enablePrefetchConfig.restartDialog.message'),
    );
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_visibility" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.privacy.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <BoolPrefItem
                pref="firedragon.config.prefetch.enable"
                :title="t('pages.home.privacy.enablePrefetchConfig.title')"
                :description="t('pages.home.privacy.enablePrefetchConfig.description')"
            />
            <ToggleItem
                :title="t('pages.home.privacy.limitCrossOriginReferrers.title')"
                :description="t('pages.home.networking.limitCrossOriginReferrers.description')"
                v-model="limitCrossOriginReferrers"
            />
            <ToggleItem
                :title="t('pages.home.privacy.autoRefuseCookies.title')"
                :description="t('pages.home.networking.autoRefuseCookies.description')"
                v-model="autoRefuseCookies"
            />
        </q-list>
    </q-card>
</template>

<script lang="ts" setup>
    import { useIntPref } from "@/composables/usePref.ts";

    const { t } = useI18n();

    const limitCrossOriginReferrers = toggleRefs(
        [useIntPref('network.http.referer.XOriginPolicy')],
        [2],
        [0],
    );
    const autoRefuseCookies = toggleRefs(
        [useIntPref('cookiebanners.service.mode'), useIntPref('cookiebanners.service.mode.privateBrowsing')],
        [1, 1],
        [0, 0],
    );
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="visibility" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.privacy.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.privacy.limitCrossOriginReferrers.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.privacy.limitCrossOriginReferrers.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="limitCrossOriginReferrers" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.privacy.autoRefuseCookies.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.privacy.autoRefuseCookies.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="autoRefuseCookies" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>

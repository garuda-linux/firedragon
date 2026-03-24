<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import ToggleItem from '@/components/ToggleItem.vue';

    const { t } = useI18n();

    const enableSafeBrowsing = toggleRefs(
        [
            await useBoolPref('browser.safebrowsing.malware.enabled'),
            await useBoolPref('browser.safebrowsing.phishing.enabled'),
            await useBoolPref('browser.safebrowsing.blockedURIs.enabled'),
            await useStringPref('browser.safebrowsing.provider.google4.gethashURL'),
            await useStringPref('browser.safebrowsing.provider.google4.updateURL'),
            await useStringPref('browser.safebrowsing.provider.google.gethashURL'),
            await useStringPref('browser.safebrowsing.provider.google.updateURL'),
        ],
        [
            true,
            true,
            true,
            'https://safebrowsing.googleapis.com/v4/fullHashes:find?$ct=application/x-protobuf&key=%GOOGLE_SAFEBROWSING_API_KEY%&$httpMethod=POST',
            'https://safebrowsing.googleapis.com/v4/threatListUpdates:fetch?$ct=application/x-protobuf&key=%GOOGLE_SAFEBROWSING_API_KEY%&$httpMethod=POST',
            'https://safebrowsing.google.com/safebrowsing/gethash?client=SAFEBROWSING_ID&appver=%MAJOR_VERSION%&pver=2.2',
            'https://safebrowsing.google.com/safebrowsing/downloads?client=SAFEBROWSING_ID&appver=%MAJOR_VERSION%&pver=2.2&key=%GOOGLE_SAFEBROWSING_API_KEY%',
        ],
        [false, false, false, '', '', '', ''],
    );
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_security" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.security.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <BoolPrefItem
                pref="security.tls.enable_0rtt_data"
                :title="t('pages.home.security.enable0rtt.title')"
                :description="t('pages.home.security.enable0rtt.description')"
            />
            <BoolPrefItem
                pref="security.OCSP.require"
                :title="t('pages.home.security.enforceOCSP.title')"
                :description="t('pages.home.security.enforceOCSP.description')"
            />
            <ToggleItem
                :title="t('pages.home.security.enableSafeBrowsing.title')"
                :description="t('pages.home.security.enableSafeBrowsing.description')"
                v-model="enableSafeBrowsing"
            />
            <BoolPrefItem
                pref="browser.safebrowsing.downloads.enabled"
                :title="t('pages.home.security.scanDownloads.title')"
                :description="t('pages.home.security.scanDownloads.description')"
                :inset-level="1"
                :disable="!enableSafeBrowsing"
            />
        </q-list>
    </q-card>
</template>

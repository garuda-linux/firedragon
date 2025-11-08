<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import ToggleItem from '@/components/ToggleItem.vue';

    const { t } = useI18n();

    const enforceOCSP = useBoolPref('security.OCSP.require');
    const enableSafeBrowsing = toggleRefs(
        [
            useBoolPref('browser.safebrowsing.malware.enabled'),
            useBoolPref('browser.safebrowsing.phishing.enabled'),
            useBoolPref('browser.safebrowsing.blockedURIs.enabled'),
            useStringPref('browser.safebrowsing.provider.google4.gethashURL'),
            useStringPref('browser.safebrowsing.provider.google4.updateURL'),
            useStringPref('browser.safebrowsing.provider.google.gethashURL'),
            useStringPref('browser.safebrowsing.provider.google.updateURL'),
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
        [
            false,
            false,
            false,
            '',
            '',
            '',
        ],
    );
    const scanDownloads = useBoolPref('browser.safebrowsing.downloads.enabled');
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
            <BoolPrefItem pref="security.OCSP.require" :title="t('pages.home.security.enforceOCSP.title')" :description="t('pages.home.security.enforceOCSP.description')" />
            <ToggleItem :title="t('pages.home.security.enableSafeBrowsing.title')" :description="t('pages.home.security.enableSafeBrowsing.description')" v-model="enableSafeBrowsing" />
            <BoolPrefItem pref="browser.safebrowsing.downloads.enabled" :title="t('pages.home.security.scanDownloads.title')" :description="t('pages.home.security.scanDownloads.description')" :inset-level="1" :disable="!enableSafeBrowsing" />
        </q-list>
    </q-card>
</template>

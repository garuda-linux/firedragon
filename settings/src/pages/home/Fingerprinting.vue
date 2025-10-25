<script lang="ts" setup>
    import toggleRefs from "@/composables/toggleRefs.ts";

    const { t } = useI18n();

    const enableRFP = useBoolPref('privacy.resistFingerprinting');
    const enableLetterboxing = useBoolPref('privacy.resistFingerprinting.letterboxing');
    const enableWebGL = toggleRefs(
        [useBoolPref('webgl.disabled')],
        [false],
        [true],
    );
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="fingerprint" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.fingerprinting.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.fingerprinting.enableRFP.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.fingerprinting.enableRFP.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableRFP" />
                </q-item-section>
            </q-item>
            <q-item tag="label" class="q-pl-xl" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.fingerprinting.enableLetterboxing.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.fingerprinting.enableLetterboxing.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableLetterboxing" />
                </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>{{ t('pages.home.fingerprinting.enableWebGL.title') }}</q-item-label>
                    <q-item-label caption>{{ t('pages.home.fingerprinting.enableWebGL.description') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-toggle v-model="enableWebGL" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>

<script lang="ts" setup>
    import BoolPrefItem from '@/components/BoolPrefItem.vue';
    import ToggleItem from '@/components/ToggleItem.vue';

    const { t } = useI18n();

    const enableRFP = await useBoolPref('privacy.resistFingerprinting');
    const enableWebGL = toggleRefs([await useBoolPref('webgl.disabled')], [false], [true]);
    const enableWebGLPrompt = await useBoolPref('librewolf.webgl.prompt');
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_fingerprint" class="q-mb-xs q-mr-xs" />
                {{ t('pages.home.fingerprinting.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <BoolPrefItem
                pref="privacy.resistFingerprinting"
                :title="t('pages.home.fingerprinting.enableRFP.title')"
                :description="t('pages.home.fingerprinting.enableRFP.description')"
            />
            <BoolPrefItem
                pref="privacy.resistFingerprinting.letterboxing"
                :title="t('pages.home.fingerprinting.enableLetterboxing.title')"
                :description="t('pages.home.fingerprinting.enableLetterboxing.description')"
                :inset-level="1"
                :disable="!enableRFP"
            />
            <ToggleItem
                :title="t('pages.home.fingerprinting.enableWebGL.title')"
                :description="t('pages.home.fingerprinting.enableWebGL.description')"
                v-model="enableWebGL"
            />
            <BoolPrefItem
                pref="librewolf.webgl.prompt"
                :title="t('pages.home.fingerprinting.enableWebGLPrompt.title')"
                :description="t('pages.home.fingerprinting.enableWebGLPrompt.description')"
                :inset-level="1"
                :disable="!enableWebGL"
            />
            <BoolPrefItem
                pref="librewolf.webgl.prompt.hide"
                :title="t('pages.home.fingerprinting.hideWebGLPrompt.title')"
                :description="t('pages.home.fingerprinting.hideWebGLPrompt.description')"
                :inset-level="2"
                :disable="!enableWebGL || !enableWebGLPrompt"
            />
        </q-list>
    </q-card>
</template>

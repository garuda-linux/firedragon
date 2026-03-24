<script setup lang="ts">
    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();

    const hidePasswdmgr = await useBoolPref('firedragon.hidePasswdmgr');
    const enable0rtt = await useBoolPref('security.tls.enable_0rtt_data');
    const enableRFP = await useBoolPref('privacy.resistFingerprinting');
    const enablePrefetchConfig = await useBoolPref('firedragon.config.prefetch.enable');
</script>

<template>
    <p>
        <q-checkbox v-model="hidePasswdmgr" :label="t('steps.quickSettings.hidePasswdmgr')" />
        <br />
        <q-checkbox v-model="enable0rtt" :label="t('steps.quickSettings.enable0rtt')" />
        <br />
        <q-checkbox v-model="enableRFP" :label="t('steps.quickSettings.enableRFP')" />
        <br />
        <q-checkbox v-model="enablePrefetchConfig" :label="t('steps.quickSettings.enablePrefetchConfig')" />
    </p>
    <p>
        <q-btn color="primary" icon="sym_o_arrow_forward" @click="emit('next')">{{
            t('steps.quickSettings.next')
        }}</q-btn>
    </p>
</template>

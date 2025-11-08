<script lang="ts" setup>
    import BrowserBehaviour from '@/pages/home/BrowserBehaviour.vue';
    import Networking from '@/pages/home/Networking.vue';
    import Fingerprinting from '@/pages/home/Fingerprinting.vue';
    import Security from '@/pages/home/Security.vue';

    const { t } = useI18n();
</script>

<template>
    <q-page padding>
        <h1 class="text-h5 q-mt-none q-mb-sm">{{ t('pages.home.title') }}</h1>
        <div class="text-subtitle1 q-mb-lg">{{ t('pages.home.description') }}</div>
        <BrowserBehaviour class="q-mb-lg" />
        <Networking class="q-mb-lg" />
        <Fingerprinting class="q-mb-lg" />
        <Security />
    </q-page>
</template>

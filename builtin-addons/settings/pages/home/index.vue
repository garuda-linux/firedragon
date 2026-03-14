<script lang="ts" setup>
    import BrowserBehaviour from '@/pages/home/BrowserBehaviour.vue';
    import Fingerprinting from '@/pages/home/Fingerprinting.vue';
    import Networking from '@/pages/home/Networking.vue';
    import Security from '@/pages/home/Security.vue';

    const { t } = useI18n();
</script>

<template>
    <q-page padding>
        <div class="column q-gutter-lg">
            <div>
                <h1 class="text-h5 q-mt-none q-mb-sm">{{ t('pages.home.title') }}</h1>
                <div class="text-subtitle1">{{ t('pages.home.description') }}</div>
            </div>
            <BrowserBehaviour />
            <Networking />
            <Fingerprinting />
            <Security />
        </div>
    </q-page>
</template>

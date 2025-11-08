<script lang="ts" setup>
    import Advanced from '@/pages/design/Advanced.vue';
    import Skin from '@/pages/design/Skin.vue';

    const { t } = useI18n();
</script>

<template>
    <q-page padding>
        <h1 class="text-h5 q-mt-none q-mb-sm">{{ t('pages.design.title') }}</h1>
        <div class="text-subtitle1 q-mb-lg">{{ t('pages.design.description') }}</div>
        <Skin class="q-mb-lg" />
        <Advanced />
    </q-page>
</template>

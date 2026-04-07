<script lang="ts" setup>
    import Urls from '@/pages/sidebar/Urls.vue';

    const { t } = useI18n();
</script>

<template>
    <q-page padding>
        <div class="column q-gutter-lg">
            <div>
                <h1 class="text-h5 q-mt-none q-mb-sm">{{ t('pages.sidebar.title') }}</h1>
                <div class="text-subtitle1">{{ t('pages.sidebar.description') }}</div>
            </div>

            <Urls />
        </div>
    </q-page>
</template>

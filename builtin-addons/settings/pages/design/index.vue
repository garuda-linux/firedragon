<script lang="ts" setup>
    import Advanced from '@/pages/design/Advanced.vue';
    import Skin from '@/pages/design/Skin.vue';

    const { t } = useI18n();
</script>

<template>
    <q-page padding>
        <div class="column q-gutter-lg">
            <div>
                <h1 class="text-h5 q-mt-none q-mb-sm">{{ t('pages.design.title') }}</h1>
                <div class="text-subtitle1">{{ t('pages.design.description') }}</div>
            </div>
            <Skin />
            <Advanced />
        </div>
    </q-page>
</template>

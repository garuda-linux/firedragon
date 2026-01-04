<script lang="ts" setup>
    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();

    const loading = ref(false);
    async function makeDefault() {
        loading.value = true;
        await browser.browser.setDefault();
        loading.value = false;
    }
</script>

<template>
    <h1 class="text-h3">{{ t('steps.default.header') }}</h1>
    <p>{{ t('steps.default.text') }}</p>
    <p>
        <q-btn color="primary" icon="sym_o_open_in_browser" :loading="loading" @click="makeDefault">{{
            t('steps.default.makeDefault')
        }}</q-btn>
    </p>
    <p>
        <q-btn color="primary" icon="sym_o_arrow_forward" @click="emit('next')">{{ t('steps.default.next') }}</q-btn>
    </p>
</template>

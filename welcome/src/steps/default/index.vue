<script lang="ts" setup>
    import { ShellService } from 'moz-src:///browser/components/shell/ShellService.sys.mjs';

    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();

    const loading = ref(false);
    async function makeDefault() {
        loading.value = true;
        await ShellService.setDefaultBrowser();
        loading.value = false;
    }
</script>

<template>
    <h1 class="text-h3">{{ t('steps.default.header') }}</h1>
    <p>{{ t('steps.default.text') }}</p>
    <p>
        <q-btn color="primary" icon="open_in_browser" :loading="loading" @click="makeDefault">{{ t('steps.default.makeDefault') }}</q-btn>
    </p>
    <p>
        <q-btn color="primary" icon="arrow_forward" @click="emit('next')">{{ t('steps.default.next') }}</q-btn>
    </p>
</template>

<script lang="ts" setup>
    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();
</script>

<template>
    <h1 class="text-h3">{{ t('steps.welcome.header') }}</h1>
    <p>{{ t('steps.welcome.text1') }}</p>
    <p>{{ t('steps.welcome.text2') }}</p>
    <p>
        <q-btn color="primary" icon="sym_o_arrow_forward" @click="emit('next')">{{ t('steps.welcome.next') }}</q-btn>
    </p>
</template>

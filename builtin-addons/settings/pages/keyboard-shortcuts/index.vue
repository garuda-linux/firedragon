<script lang="ts" setup>
    import General from '@/pages/keyboard-shortcuts/General.vue';
    import Shortcuts from '@/pages/keyboard-shortcuts/Shortcuts.vue';

    const { t } = useI18n();
</script>

<template>
    <q-page padding>
        <div class="column q-gutter-lg">
            <div>
                <h1 class="text-h5 q-mt-none q-mb-sm">{{ t('pages.keyboardShortcuts.title') }}</h1>
                <div class="text-subtitle1">{{ t('pages.keyboardShortcuts.description') }}</div>
            </div>

            <General />
            <Shortcuts />
        </div>
    </q-page>
</template>

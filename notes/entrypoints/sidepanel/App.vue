<script setup lang="ts">
    import { useHead } from '@unhead/vue';

    const { t } = useI18n();

    useHead({
        title: t('title'),
    });
</script>

<template>
    <suspense>
        <q-layout view="hHh LpR fFf">
            <q-page-container>
                <router-view />
            </q-page-container>
        </q-layout>
    </suspense>
</template>

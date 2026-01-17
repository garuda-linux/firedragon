<script setup lang="ts">
    import { useHead } from '@unhead/vue';

    import List from '@/components/List.vue';

    const { t } = useI18n();

    useHead({
        title: t('title'),
    });
</script>

<template>
    <suspense>
        <q-layout view="hHh LpR fFf">
            <q-page-container>
                <q-page>
                    <List new-position="bottom" />
                </q-page>
            </q-page-container>
        </q-layout>
    </suspense>
</template>

<script setup lang="ts">
    import ToggleItem from '@/components/ToggleItem.vue';

    const { pref, title, description, insetLevel, disable } = defineProps<{
        pref: string;
        title: string;
        description?: string;
        insetLevel?: number;
        disable?: boolean;
    }>();

    const value = await useBoolPref(pref);
</script>

<template>
    <ToggleItem :title="title" :description="description" :inset-level="insetLevel" :disable="disable" v-model="value">
        <template #avatar v-if="$slots.avatar">
            <slot name="avatar" />
        </template>
        <template #addon v-if="$slots.addon">
            <slot name="addon" />
        </template>
    </ToggleItem>
</template>

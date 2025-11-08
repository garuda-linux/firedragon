<script setup lang="ts">
    import Item from '@/components/Item.vue';

    const { title, description, insetLevel, disable } = defineProps<{
        title: string;
        description?: string;
        insetLevel?: number;
        disable?: boolean;
    }>();
    const value = defineModel<boolean>();
</script>

<template>
    <Item :title="title" :description="description" :inset-level="insetLevel" :disable="disable">
        <template #avatar v-if="$slots.avatar">
            <slot name="avatar" />
        </template>
        <template #addon v-if="$slots.addon">
            <slot name="addon" />
        </template>
        <q-toggle v-model="value" :disable="disable" />
    </Item>
</template>

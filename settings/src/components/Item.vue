<script setup lang="ts">
    const { title, description, insetLevel, disable } = defineProps<{
        title: string;
        description?: string;
        insetLevel?: number;
        disable?: boolean;
    }>();
</script>

<template>
    <q-item tag="label" :inset-level="insetLevel" :disable="disable" clickable v-ripple>
        <q-item-section avatar v-if="$slots.avatar">
            <slot name="avatar" />
        </q-item-section>
        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
            <q-item-label caption v-if="description">{{ description }}</q-item-label>
        </q-item-section>
        <q-item-section side v-id="$slots.addon">
            <slot name="addon" />
        </q-item-section>
        <q-item-section side>
            <slot />
        </q-item-section>
    </q-item>
</template>

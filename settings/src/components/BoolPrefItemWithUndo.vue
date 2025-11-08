<script setup lang="ts">
    import BoolPrefItem from '@/components/BoolPrefItem.vue';

    const { pref, title, description, insetLevel, disable } = defineProps<{
        pref: string;
        title: string;
        description?: string;
        insetLevel?: number;
        disable?: boolean;
    }>();

    const {
        value: hasUserValue,
        clear: clearUserValue,
    } = usePrefHasUserValue(pref);
</script>

<template>
    <BoolPrefItem :pref="pref" :title="title" :description="description" :inset-level="insetLevel" :disable="disable">
        <template #avatar v-if="$slots.avatar">
            <slot name="avatar" />
        </template>
        <template #addon v-if="hasUserValue">
            <q-btn icon="sym_o_undo" flat round @click="clearUserValue" />
        </template>
    </BoolPrefItem>
</template>

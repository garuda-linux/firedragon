<script lang="ts" setup>
    const { t } = useI18n();

    const { options, translationKey } = defineProps<{
        options: string[],
        translationKey: string,
    }>();
    const value = defineModel<string>();
</script>

<template>
    <q-select v-model="value" :options="options" :display-value="t(`${translationKey}.${value}`)">
        <template #option="{ itemProps, opt }">
            <q-item v-bind="itemProps">
                <q-item-section>
                    <q-item-label>{{ t(`${translationKey}.${opt}`) }}</q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

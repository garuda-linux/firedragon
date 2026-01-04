<script lang="ts" setup>
    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();

    const { state: engines, isReady } = useAsyncState(async () => await browser.searchEngine.getAll(), null);

    const engine = ref(await browser.searchEngine.getDefault());
    watch(engine, ({ id }) => {
        browser.searchEngine.setDefault(id);
    });
</script>

<template>
    <h1 class="text-h3">{{ t('steps.search.header') }}</h1>
    <p>{{ t('steps.search.text') }}</p>
    <p>
        <q-select v-model="engine" :options="engines!" option-label="name" option-value="id" v-if="isReady">
            <template #prepend>
                <q-img :src="engine.icon" width="32px" v-if="engine.icon" />
            </template>
            <template #option="{ itemProps, opt }">
                <q-item v-bind="itemProps">
                    <q-item-section avatar>
                        <q-img :src="opt.icon" width="32px" v-if="opt.icon" />
                    </q-item-section>
                    <q-item-section>{{ opt.name }}</q-item-section>
                </q-item>
            </template>
        </q-select>
        <q-skeleton type="QInput" v-else />
    </p>
    <p>
        <q-btn color="primary" icon="sym_o_arrow_forward" @click="emit('next')">{{ t('steps.search.next') }}</q-btn>
    </p>
</template>

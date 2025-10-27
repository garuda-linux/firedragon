<script lang="ts" setup>
    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();

    async function mapEngine(engine: any) {
        return {
            id: engine.id,
            name: engine.name,
            icon: await engine.getIconURL(),
        };
    }

    const {
        state: engines,
        isReady,
    } = useAsyncState(async () => await Promise.all((await Services.search.getVisibleEngines()).map(mapEngine)), null);

    const engine = ref(await mapEngine(Services.search.defaultEngine));
    watch(engine, ({ id }) => {
        const engine = Services.search.getEngineById(id);
        Services.search.setDefault(engine, Services.search.CHANGE_REASON_UITOUR!);
        Services.search.setDefaultPrivate(engine, Services.search.CHANGE_REASON_UITOUR!);
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
        <q-btn color="primary" icon="arrow_forward" @click="emit('next')">{{ t('steps.search.next') }}</q-btn>
    </p>
</template>

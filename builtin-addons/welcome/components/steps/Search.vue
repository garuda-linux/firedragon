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

    const privateEngine = ref(await browser.searchEngine.getPrivateDefault());
    watch(privateEngine, ({ id }) => {
        browser.searchEngine.setPrivateDefault(id);
    });

    const [separatePrivateDefault, suggest, suggestUrlbar, suggestionsFirst, suggestPrivate] = await Promise.all([
        useBoolPref('browser.search.separatePrivateDefault'),
        useBoolPref('browser.search.suggest.enabled'),
        useBoolPref('browser.urlbar.suggest.searches'),
        useBoolPref('browser.urlbar.showSearchSuggestionsFirst'),
        useBoolPref('browser.search.suggest.enabled.private'),
    ]);
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
        <q-checkbox v-model="separatePrivateDefault" :label="t('steps.search.separatePrivateDefault')" />
        <template v-if="separatePrivateDefault">
            <br />
            <q-select v-model="privateEngine" :options="engines!" option-label="name" option-value="id" v-if="isReady">
                <template #prepend>
                    <q-img :src="privateEngine.icon" width="32px" v-if="privateEngine.icon" />
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
        </template>
    </p>
    <p>
        <q-checkbox
            :model-value="suggest && suggestUrlbar"
            @update:model-value="(value) => ([suggest, suggestUrlbar] = [value, value])"
            :label="t('steps.search.suggest')"
        />
        <template v-if="suggest">
            <br />
            <q-checkbox v-model="suggestionsFirst" :label="t('steps.search.suggestionsFirst')" class="q-ml-lg" />
            <br />
            <q-checkbox v-model="suggestPrivate" :label="t('steps.search.suggestPrivate')" class="q-ml-lg" />
        </template>
    </p>
    <p>
        <q-btn color="primary" icon="sym_o_arrow_forward" @click="emit('next')">{{ t('steps.search.next') }}</q-btn>
    </p>
</template>

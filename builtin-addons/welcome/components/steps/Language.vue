<script lang="ts" setup>
    const { t, locale } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();

    const { state: availableLangPacks, isReady } = useAsyncState<Browser.language.LanguagePack[] | null>(
        () => browser.language.getLanguagePacks(),
        null,
    );
    const { state: localeInfo, execute: refreshLocaleInfo } = useAsyncState<Browser.language.LocaleInfo | null>(
        () => browser.language.getLocaleInfo(),
        null,
    );

    const langPack = computed({
        get: () =>
            availableLangPacks.value?.find(
                (langPack: any) => langPack.target_locale === localeInfo.value?.appLocaleRaw,
            ),
        set: async (langPack) => {
            if (langPack) {
                locale.value = langPack.target_locale;
                await browser.language.setLanguagePack(langPack);
                await refreshLocaleInfo();
            }
        },
    });
</script>

<template>
    <h1 class="text-h3">{{ t('steps.language.header') }}</h1>
    <p>System locale: {{ localeInfo?.displayNames?.systemLanguage }}</p>
    <p>App locale: {{ localeInfo?.displayNames?.appLanguage }}</p>
    <p>
        <q-select v-model="langPack" :options="availableLangPacks!" option-label="name" v-if="isReady" />
        <q-skeleton type="QInput" v-else />
    </p>
    <p>
        <q-btn color="primary" icon="sym_o_arrow_forward" @click="emit('next')">{{ t('steps.language.next') }}</q-btn>
    </p>
</template>

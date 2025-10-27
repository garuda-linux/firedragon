<script lang="ts" setup>
    import { LangPackMatcher } from 'resource://gre/modules/LangPackMatcher.sys.mjs';
    import { MozIntl } from 'resource://gre/modules/mozIntl.sys.mjs';

    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();

    const {
        state: availableLangPacks,
        isReady,
    } = useAsyncState<any[] | null>(() => LangPackMatcher.mockable.getAvailableLangpacks(), null);

    const localeInfo = computedWithControl([], () => LangPackMatcher.getAppAndSystemLocaleInfo());

    const langPack = computed({
        get: () => availableLangPacks.value?.find((langPack: any) => langPack.target_locale === localeInfo.value.appLocaleRaw),
        set: async (langPack) => {
            await LangPackMatcher.ensureLangPackInstalled(langPack);
            LangPackMatcher.setRequestedAppLocales([langPack.target_locale]);
            localeInfo.trigger();
        },
    });

    const mozIntl = new MozIntl();
    function getLocaleDisplayName(locale: string) {
        return mozIntl.getLocaleDisplayNames(
            undefined,
            [locale],
            { preferNative: true },
        )[0];
    }
    function getLangPackDisplayName(langPack: any) {
        return getLocaleDisplayName(langPack.target_locale);
    }
</script>

<template>
    <h1 class="text-h3">{{ t('steps.language.header') }}</h1>
    <p>System locale: {{ getLocaleDisplayName(localeInfo.systemLocaleRaw) }}</p>
    <p>App locale: {{ getLocaleDisplayName(localeInfo.appLocaleRaw) }}</p>
    <p>
        <q-select v-model="langPack" :options="availableLangPacks!" :option-label="getLangPackDisplayName" v-if="isReady" />
        <q-skeleton type="QInput" v-else />
    </p>
    <p>
        <q-btn color="primary" icon="arrow_forward" @click="emit('next')">{{ t('steps.language.next') }}</q-btn>
    </p>
</template>

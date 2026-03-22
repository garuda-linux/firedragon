<script setup lang="ts">
    import { useHead } from '@unhead/vue';

    import Logo from '@/components/Logo.vue';
    import Appearance from '@/components/steps/Appearance.vue';
    import Default from '@/components/steps/Default.vue';
    import Finish from '@/components/steps/Finish.vue';
    import Language from '@/components/steps/Language.vue';
    import QuickSettings from '@/components/steps/QuickSettings.vue';
    import Search from '@/components/steps/Search.vue';
    import Welcome from '@/components/steps/Welcome.vue';

    const { t } = useI18n();

    useHead({
        title: t('title'),
    });

    const step = ref(1);

    function close() {
        browser.browser.open('about:home');
    }
</script>

<template>
    <suspense>
        <q-layout view="hHh LpR fFf">
            <q-header class="bg-primary text-white" elevated>
                <q-toolbar>
                    <q-avatar class="q-mr-sm">
                        <Logo />
                    </q-avatar>
                    <q-toolbar-title>{{ t('title') }}</q-toolbar-title>
                </q-toolbar>
            </q-header>

            <q-page-container>
                <q-page>
                    <q-stepper color="primary" header-nav vertical v-model="step">
                        <q-step :name="1" :title="t('steps.welcome.title')" icon="sym_o_home" :header-nav="step > 1">
                            <Welcome @next="step++" />
                        </q-step>
                        <q-step
                            :name="2"
                            :title="t('steps.language.title')"
                            icon="sym_o_language"
                            :header-nav="step > 2"
                        >
                            <Language @next="step++" />
                        </q-step>
                        <q-step
                            :name="3"
                            :title="t('steps.appearance.title')"
                            icon="sym_o_color_lens"
                            :header-nav="step > 3"
                        >
                            <Appearance @next="step++" />
                        </q-step>
                        <q-step :name="4" :title="t('steps.search.title')" icon="sym_o_search" :header-nav="step > 4">
                            <Search @next="step++" />
                        </q-step>
                        <q-step
                            :name="5"
                            :title="t('steps.quickSettings.title')"
                            icon="sym_o_settings"
                            :header-nav="step > 5"
                        >
                            <QuickSettings @next="step++" />
                        </q-step>
                        <q-step
                            :name="6"
                            :title="t('steps.default.title')"
                            icon="sym_o_open_in_browser"
                            :header-nav="step > 6"
                        >
                            <Default @next="step++" />
                        </q-step>
                        <q-step :name="7" :title="t('steps.finish.title')" icon="sym_o_check" :header-nav="step > 7">
                            <Finish @next="close" />
                        </q-step>
                    </q-stepper>
                </q-page>
            </q-page-container>
        </q-layout>
    </suspense>
</template>

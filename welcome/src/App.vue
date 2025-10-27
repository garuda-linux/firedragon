<script lang="ts" setup>
    import Welcome from '@/steps/welcome/index.vue';
    import Language from '@/steps/language/index.vue';
    import Appearance from '@/steps/appearence/index.vue';
    import Search from '@/steps/search/index.vue';
    import Default from '@/steps/default/index.vue';
    import Finish from '@/steps/finish/index.vue';

    const { t } = useI18n();

    useHead({
        title: () => t('title'),
    });

    const step = ref(1);

    function close() {
        location.href = 'about:firedragon-newtab';
    }
</script>

<template>
    <q-layout view="hHh LpR fFf">
        <q-header class="bg-primary text-white" elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar class="q-mr-md">
                        <img src="chrome://branding/content/about-logo.png" alt="FireDragon" />
                    </q-avatar>
                    {{ t('title') }}
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <q-page padding>
                <Suspense>
                    <q-stepper color="primary" header-nav vertical v-model="step">
                        <q-step :name="1" :title="t('steps.welcome.title')" icon="home" :header-nav="step > 1">
                            <Welcome @next="step++" />
                        </q-step>
                        <q-step :name="2" :title="t('steps.language.title')" icon="language" :header-nav="step > 2">
                            <Language @next="step++" />
                        </q-step>
                        <q-step :name="3" :title="t('steps.appearance.title')" icon="color_lens" :header-nav="step > 3">
                            <Appearance @next="step++" />
                        </q-step>
                        <q-step :name="4" :title="t('steps.search.title')" icon="search" :header-nav="step > 4">
                            <Search @next="step++" />
                        </q-step>
                        <q-step :name="5" :title="t('steps.default.title')" icon="open_in_browser" :header-nav="step > 5">
                            <Default @next="step++" />
                        </q-step>
                        <q-step :name="6" :title="t('steps.finish.title')" icon="check" :header-nav="step > 6">
                            <Finish @next="close" />
                        </q-step>
                    </q-stepper>
                </Suspense>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

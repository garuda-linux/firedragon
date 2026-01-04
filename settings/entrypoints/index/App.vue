<script setup lang="ts">
    import { useHead } from '@unhead/vue';

    import Logo from '@/components/Logo.vue';

    const { t } = useI18n();

    useHead({
        title: t('title'),
    });
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

            <q-drawer side="left" show-if-above>
                <q-scroll-area class="fit">
                    <q-list padding>
                        <q-item @click="browser.browser.open('about:preferences')" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="sym_o_arrow_back" />
                            </q-item-section>
                            <q-item-section>{{ t('back') }}</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item to="/" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="sym_o_home" />
                            </q-item-section>
                            <q-item-section>{{ t('pages.home.title') }}</q-item-section>
                        </q-item>
                        <q-item to="/design" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon name="sym_o_design_services" />
                            </q-item-section>
                            <q-item-section>{{ t('pages.design.title') }}</q-item-section>
                        </q-item>
                    </q-list>
                </q-scroll-area>
            </q-drawer>

            <q-page-container>
                <router-view />
            </q-page-container>
        </q-layout>
    </suspense>
</template>

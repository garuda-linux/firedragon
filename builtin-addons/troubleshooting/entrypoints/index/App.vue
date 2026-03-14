<script setup lang="ts">
    import { useHead } from '@unhead/vue';

    import Logo from '@/components/Logo.vue';
    import Toggle from '@/components/Toggle.vue';

    const { t } = useI18n();

    useHead({
        title: t('title'),
    });

    const isSafeMode = useAsyncState(() => browser.safeMode.isSafeMode(), null);
    const toggles = useAsyncState(() => browser.safeMode.getToggles(), null);
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
                <q-page padding>
                    <q-list v-if="isSafeMode.isReady.value && toggles.isReady.value">
                        <q-item>
                            <q-item-section>
                                <q-btn-group flat>
                                    <q-btn
                                        flat
                                        :label="t('restart.safeMode')"
                                        @click="browser.safeMode.enterSafeMode()"
                                    />
                                    <q-btn
                                        flat
                                        :label="t('restart.normalMode')"
                                        @click="browser.safeMode.exitSafeMode()"
                                        v-if="isSafeMode.state.value"
                                    />
                                </q-btn-group>
                            </q-item-section>
                        </q-item>
                        <template v-if="isSafeMode.state.value">
                            <Toggle :toggle="toggle" v-for="toggle in toggles.state.value" :key="toggle.id" />
                        </template>
                    </q-list>
                </q-page>
            </q-page-container>
        </q-layout>
    </suspense>
</template>

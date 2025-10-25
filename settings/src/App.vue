<script lang="ts" setup>
    const { t } = useI18n();

    useHead({
        title: () => t('title'),
    });
</script>

<template>
    <q-layout view="hHh LpR fFf">
        <q-header class="bg-primary text-white" elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        <img src="chrome://branding/content/about-logo.png" alt="FireDragon" />
                    </q-avatar>
                    {{ t('title') }}
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer side="left" show-if-above>
            <q-scroll-area class="fit">
                <q-list padding>
                    <q-item to="/" clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon name="home" />
                        </q-item-section>
                        <q-item-section>{{ t('pages.home.title') }}</q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

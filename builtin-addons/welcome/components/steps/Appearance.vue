<script lang="ts" setup>
    const { t } = useI18n();

    const emit = defineEmits<{
        (e: 'next'): void;
    }>();

    const theme = await useIntPref('layout.css.prefers-color-scheme.content-override');
</script>

<template>
    <h1 class="text-h3">{{ t('steps.appearance.header') }}</h1>
    <p>{{ t('steps.appearance.text') }}</p>
    <q-list class="q-mb-lg">
        <q-item tag="label" clickable v-ripple>
            <q-item-section avatar>
                <q-icon name="sym_o_contrast" />
            </q-item-section>
            <q-item-section>{{ t('steps.appearance.theme.system') }}</q-item-section>
            <q-item-section side>
                <q-radio v-model="theme" :val="2" />
            </q-item-section>
        </q-item>
        <q-item tag="label" clickable v-ripple>
            <q-item-section avatar>
                <q-icon name="sym_o_light_mode" />
            </q-item-section>
            <q-item-section>{{ t('steps.appearance.theme.light') }}</q-item-section>
            <q-item-section side>
                <q-radio v-model="theme" :val="1" />
            </q-item-section>
        </q-item>
        <q-item tag="label" clickable v-ripple>
            <q-item-section avatar>
                <q-icon name="sym_o_dark_mode" />
            </q-item-section>
            <q-item-section>{{ t('steps.appearance.theme.dark') }}</q-item-section>
            <q-item-section side>
                <q-radio v-model="theme" :val="0" />
            </q-item-section>
        </q-item>
    </q-list>
    <p>
        <q-btn color="primary" icon="sym_o_arrow_forward" @click="emit('next')">{{ t('steps.appearance.next') }}</q-btn>
    </p>
</template>

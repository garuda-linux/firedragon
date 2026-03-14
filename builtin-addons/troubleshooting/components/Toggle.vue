<script setup lang="ts">
    const { toggle } = defineProps<{ toggle: { id: string; label: string } }>();

    const value = ref(await browser.safeMode.getToggle(toggle.id));

    watch(
        () => toggle,
        async (toggle) => {
            value.value = await browser.safeMode.getToggle(toggle.id);
        },
    );

    watch(value, (value) => {
        browser.safeMode.setToggle(toggle.id, value);
    });
</script>

<template>
    <q-item tag="label" clickable v-ripple>
        <q-item-section>{{ toggle.label }}</q-item-section>
        <q-item-section side>
            <q-toggle v-model="value" />
        </q-item-section>
    </q-item>
</template>

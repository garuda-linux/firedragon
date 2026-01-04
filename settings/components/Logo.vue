<script setup lang="ts">
    const logo = await browser.browser.getLogo();
</script>

<template>
    <q-img :src="logo" alt="FireDragon" />
</template>

<script setup lang="ts">
    const logo = await browser.firedragon.getLogo();
</script>

<template>
    <q-img :src="logo" alt="FireDragon" />
</template>

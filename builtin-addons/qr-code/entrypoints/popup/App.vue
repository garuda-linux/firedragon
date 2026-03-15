<script setup lang="ts">
    import { useHead } from '@unhead/vue';
    import QRCodeStyling from 'qr-code-styling';

    const { t } = useI18n();

    useHead({
        title: t('title'),
    });

    const container = ref<HTMLCanvasElement>();

    onMounted(async () => {
        const [tab, image] = await Promise.all([
            browser.tabs.query({ active: true, currentWindow: true }),
            browser.browser.getLogo(),
        ]);
        if (container.value && tab[0]) {
            const color = getComputedStyle(container.value)?.getPropertyValue('--q-primary');
            const qrqCode = new QRCodeStyling({
                data: tab[0].url,
                image,
                backgroundOptions: {
                    color: 'transparent',
                },
                dotsOptions: {
                    color: color,
                    type: 'rounded',
                },
                cornersSquareOptions: {
                    type: 'extra-rounded',
                },
                cornersDotOptions: {
                    type: 'extra-rounded',
                },
            });
            qrqCode.append(container.value);
        }
    });
</script>

<template>
    <suspense>
        <q-layout view="hHh LpR fFf">
            <q-page-container>
                <q-page>
                    <div ref="container" />
                </q-page>
            </q-page-container>
        </q-layout>
    </suspense>
</template>

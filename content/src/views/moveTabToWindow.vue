<script lang="ts" setup>
    const { t } = useI18n();

    const { enabled, targets } = defineProps<{
        enabled: boolean,
        targets: Window[],
    }>();
    const emit = defineEmits<{
        moveTab: [Window],
    }>();

    const keys = new WeakMap<Window, symbol>();
    function keyFor(target: Window) {
        if (!keys.has(target)) {
            keys.set(target, Symbol());
        }
        return keys.get(target)!;
    }
</script>

<template>
    <xul:menu id="context_MoveTabToWindow" :label="t('moveTabToWindow.contextMenu.title')" :hidden="!enabled" :disabled="targets.length === 0">
        <xul:menupopup id="MoveTabToWindow_ContextMenu">
            <xul:menuitem :label="target.document!.title" @command="emit('moveTab', target)" v-for="target in targets" :key="keyFor(target)" />
        </xul:menupopup>
    </xul:menu>
</template>

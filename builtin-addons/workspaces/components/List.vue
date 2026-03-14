<script setup lang="ts">
    const { editable } = defineProps<{
        editable: boolean;
    }>();

    const { t } = useI18n();

    const { dialog } = useQuasar();

    const windowId = (await browser.windows.getCurrent()).id!;

    const [workspaces, activeWorkspaceId] = (await Promise.all([
        trpc.getWorkspaces.query({}).then(ref),
        trpc.getActiveWorkspaceForWindow.query({ windowId }).then(ref),
    ])) as [Ref<Workspace[]>, Ref<WorkspaceId>];
    onScopeDispose(
        trpc.onWorkspacesChanged.subscribe(
            {},
            {
                onData(data) {
                    workspaces.value = data;
                },
            },
        ).unsubscribe,
    );
    onScopeDispose(
        trpc.onWindowDataChanged.subscribe(
            { windowId },
            {
                async onData() {
                    activeWorkspaceId.value = await trpc.getActiveWorkspaceForWindow.query({ windowId });
                },
            },
        ).unsubscribe,
    );

    function newWorkspace() {
        dialog({
            prompt: {
                model: '',
                type: 'text',
                isValid: (val) => val.trim().length > 0,
            },
        }).onOk((model) => {
            trpc.createWorkspace.mutate({
                workspace: {
                    name: model,
                },
            });
        });
    }
    function editWorkspace(workspace: Workspace) {
        dialog({
            prompt: {
                model: workspace.name,
                type: 'text',
                isValid: (val) => val.trim().length > 0,
            },
        }).onOk((model) => {
            trpc.updateWorkspace.mutate({
                workspace: {
                    ...workspace,
                    name: model,
                },
            });
        });
    }
</script>

<template>
    <q-list>
        <template v-if="editable">
            <q-item>
                <q-item-section>
                    <q-btn icon="sym_o_add_2" :label="t('list.add')" flat @click="newWorkspace" />
                </q-item-section>
            </q-item>
            <q-separator />
        </template>
        <q-item
            :active="workspace.id === activeWorkspaceId"
            clickable
            v-ripple
            @click="trpc.switchWorkspace.mutate({ windowId, workspaceId: workspace.id })"
            v-for="(workspace, i) in workspaces"
            :key="workspace.id"
        >
            <q-item-section>{{ workspace.name }}</q-item-section>
            <q-item-section side v-if="editable">
                <q-btn-group flat>
                    <q-btn
                        dense
                        flat
                        icon="sym_o_arrow_drop_up"
                        @click="trpc.moveWorkspace.mutate({ workspaceId: workspace.id, direction: -1 })"
                        v-if="i > 0"
                    />
                    <q-btn
                        dense
                        flat
                        icon="sym_o_arrow_drop_down"
                        @click="trpc.moveWorkspace.mutate({ workspaceId: workspace.id, direction: 1 })"
                        v-if="i < workspaces.length - 1"
                    />
                    <q-btn icon="sym_o_edit" dense flat @click.stop="editWorkspace(workspace)" />
                    <q-btn
                        icon="sym_o_delete"
                        :disable="workspace.id === DEFAULT_WORKSPACE_ID"
                        dense
                        flat
                        @click.stop="trpc.deleteWorkspace.mutate({ workspaceId: workspace.id })"
                    />
                </q-btn-group>
            </q-item-section>
        </q-item>
    </q-list>
</template>

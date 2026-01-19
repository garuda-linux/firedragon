<script setup lang="ts">
    import { createId } from '@paralleldrive/cuid2';

    import ListItem from '@/components/ListItem.vue';

    const { t } = useI18n();
    const router = useRouter();

    const split = await useLocalExtStorage('split', 50);
    const notes = await useSyncExtStorage('notes', []);

    async function addNote() {
        const id = createId();
        await syncExtStorage.setItem(`note:${id}`, {
            title: '',
            content: '',
        });
        notes.value.push(id);
        router.push(`/${id}`);
    }

    async function deleteNote(index: number, id: string) {
        notes.value = notes.value.filter((_, i) => i !== index);
        await syncExtStorage.removeItem(`note:${id}`);
    }

    async function moveNote(from: number, to: number) {
        [notes.value[from], notes.value[to]] = [notes.value[to], notes.value[from]];
    }
</script>

<template>
    <q-page>
        <q-splitter horizontal v-model="split" class="fullscreen">
            <template v-slot:before>
                <q-list>
                    <q-item>
                        <q-item-section>
                            <q-btn icon="sym_o_add_2" :label="t('list.add')" flat @click="addNote" />
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <list-item
                        :id="note"
                        :show-up="i > 0"
                        :show-down="i < notes.length - 1"
                        @delete="deleteNote(i, note)"
                        @up="moveNote(i, i - 1)"
                        @down="moveNote(i, i + 1)"
                        v-for="(note, i) in notes"
                    />
                </q-list>
            </template>
            <template v-slot:after>
                <router-view />
            </template>
        </q-splitter>
    </q-page>
</template>

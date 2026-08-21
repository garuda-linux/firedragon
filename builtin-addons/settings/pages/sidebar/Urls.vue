<script lang="ts" setup>
    import type { SidebarUrl } from '@firedragon/shared/types/sidebar';
    import { createId } from '@paralleldrive/cuid2';

    import type { Transformer } from '@/composables/usePref';

    const { t } = useI18n();

    const urls = await useStringPref('firedragon.sidebar.urls', '[]', {
        transformer: JSON as Transformer<string, SidebarUrl[]>,
    });
    const { state: contextualIdentities } = useAsyncState<Browser.conextualIdentities.ContextualIdentity[]>(
        async () =>
            (await browser.contextualIdentities.query({})).map((contextualIdentity: any) => {
                contextualIdentity.userContextId = contextualIdentity.cookieStoreId.substring(
                    'firefox-container-'.length,
                );
                return contextualIdentity;
            }),
        [],
    );

    function deleteUrl(index: number) {
        urls.value.splice(index, 1);
    }

    const newUrl = ref({
        name: '',
        url: '',
        icon: 'default',
        iconUrl: null,
        userContextId: 0,
    });

    function addShortcut() {
        urls.value.push({
            id: createId(),
            name: newUrl.value.name,
            url: newUrl.value.url,
            icon: newUrl.value.icon,
            iconUrl: newUrl.value.iconUrl,
            userContextId: newUrl.value.userContextId,
        });
        newUrl.value = {
            name: '',
            url: '',
            icon: 'default',
            iconUrl: '',
            userContextId: 0,
        };
    }
</script>

<template>
    <q-card>
        <q-card-section>
            <h2 class="text-h6 no-margin">
                <q-icon name="sym_o_keyboard" class="q-mb-xs q-mr-xs" />
                {{ t('pages.sidebar.urls.title') }}
            </h2>
        </q-card-section>
        <q-list>
            <q-item v-for="(url, i) in urls" :key="`${url.id}`">
                <q-item-section>
                    <q-input v-model="url.name" debounce="500" :label="$t('pages.sidebar.urls.name')" />
                </q-item-section>
                <q-item-section>
                    <q-input v-model="url.url" debounce="500" :label="$t('pages.sidebar.urls.url')" />
                </q-item-section>
                <q-item-section side>
                    <q-checkbox
                        :model-value="url.icon === 'custom'"
                        @update:model-value="(val) => (url.icon = val ? 'custom' : 'default')"
                    />
                </q-item-section>
                <q-item-section>
                    <q-input
                        v-model="url.iconUrl"
                        debounce="500"
                        :disable="url.icon !== 'custom'"
                        :label="$t('pages.sidebar.urls.iconUrl')"
                    />
                </q-item-section>
                <q-item-section>
                    <q-select
                        v-model="url.userContextId"
                        :options="[{ name: 'Default', userContextId: 0 }, ...contextualIdentities]"
                        emit-value
                        map-options
                        option-label="name"
                        option-value="userContextId"
                        :label="$t('pages.sidebar.urls.userContextId')"
                    />
                </q-item-section>
                <q-item-section side>
                    <q-btn flat round icon="sym_o_delete" @click="deleteUrl(i)" />
                </q-item-section>
            </q-item>
            <q-separator />
            <q-item>
                <q-item-section>
                    <q-input v-model="newUrl.name" debounce="500" :label="$t('pages.sidebar.urls.name')" />
                </q-item-section>
                <q-item-section>
                    <q-input v-model="newUrl.url" debounce="500" :label="$t('pages.sidebar.urls.url')" />
                </q-item-section>
                <q-item-section side>
                    <q-checkbox
                        :model-value="newUrl.icon === 'custom'"
                        @update:model-value="(val) => (newUrl.icon = val ? 'custom' : 'default')"
                    />
                </q-item-section>
                <q-item-section>
                    <q-input
                        v-model="newUrl.iconUrl"
                        debounce="500"
                        :disable="newUrl.icon !== 'custom'"
                        :label="$t('pages.sidebar.urls.iconUrl')"
                    />
                </q-item-section>
                <q-item-section v-if="contextualIdentities">
                    <q-select
                        v-model="newUrl.userContextId"
                        :options="[{ name: 'Default', cookieStoreId: 0 }, ...contextualIdentities]"
                        emit-value
                        map-options
                        option-label="name"
                        option-value="cookieStoreId"
                        :label="$t('pages.sidebar.urls.userContextId')"
                    />
                </q-item-section>
                <q-item-section side>
                    <q-btn flat round icon="sym_o_add" @click="addShortcut" :disable="!newUrl.name || !newUrl.url" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-card>
</template>

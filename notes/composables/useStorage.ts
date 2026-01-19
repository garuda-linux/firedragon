import type { ExtensionStorage } from '@webext-core/storage';
import deepEqual from 'deep-equal';

import { localExtStorage, syncExtStorage } from '@/utils/storage';

function createStorage<T extends Record<string, any>>(storage: ExtensionStorage<T>) {
    return async function <K extends keyof T>(key: MaybeRefOrGetter<K>, defaults: MaybeRefOrGetter<Required<T>[K]>) {
        const keyRef: Ref<K> = toRef(key) as Ref<K>;
        const value: Ref<Required<T>[K]> = ref((await storage.getItem(keyRef.value)) ?? toValue(defaults));
        const { pause, resume } = watchPausable(
            value,
            (value) => {
                storage.setItem(keyRef.value, toRaw(value));
            },
            { deep: true },
        );
        async function onChange(newValue: Required<T>[K], oldValue: Required<T>[K] | null) {
            if (!deepEqual(newValue, oldValue)) {
                pause();
                value.value = newValue;
                await nextTick();
                resume();
            }
        }
        let removeListener = storage.onChange(keyRef.value, onChange);
        watch(keyRef, async (key) => {
            value.value = (await storage.getItem(key)) ?? toValue(defaults);
            removeListener();
            removeListener = storage.onChange(key, onChange);
        });
        return value;
    };
}

export const useLocalExtStorage = createStorage(localExtStorage);
export const useSyncExtStorage = createStorage(syncExtStorage);

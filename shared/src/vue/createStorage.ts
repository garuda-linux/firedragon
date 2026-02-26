import { type MaybeRefOrGetter, type Ref, ref, toRaw, toRef, toValue, watch } from '@vue/reactivity';
import type { ExtensionStorage } from '@webext-core/storage';
import deepEqual from 'deep-equal';

export function createStorage<T extends Record<string, any>>(storage: ExtensionStorage<T>) {
    return async function <K extends keyof T>(key: MaybeRefOrGetter<K>, defaults: MaybeRefOrGetter<Required<T>[K]>) {
        const keyRef: Ref<K> = toRef(key) as Ref<K>;
        const value: Ref<Required<T>[K]> = ref((await storage.getItem(keyRef.value)) ?? toValue(defaults));
        const { pause, resume } = watch(
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
                await new Promise((resolve) => setTimeout(resolve, 0));
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

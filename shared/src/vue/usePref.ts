import {
    type MaybeRefOrGetter,
    type Ref,
    getCurrentScope,
    onScopeDispose,
    ref,
    toRef,
    toValue,
    watch,
} from '@vue/reactivity';
import { browser } from 'wxt/browser';

export type Transformer<T, R> =
    | {
          deserialize(value: T): R;
          serialize(value: R): T;
      }
    | {
          parse(value: T): R;
          stringify(value: R): T;
      };

export interface PrefOptions<T, R> {
    transformer?: Transformer<T, R>;
}

function createUsePref<T>(
    get: (aPrefName: string, aDefaultValue?: T) => Promise<T>,
    set: (aPrefName: string, aValue: T) => void,
) {
    return async function <R = T>(
        aPrefName: MaybeRefOrGetter<string>,
        aDefaultValue?: MaybeRefOrGetter<T>,
        options: PrefOptions<T, R> = {},
    ) {
        function deserialize(value: any) {
            if (options.transformer) {
                if ('deserialize' in options.transformer) {
                    return options.transformer.deserialize(value);
                }
                return options.transformer.parse(value);
            }
            return value;
        }
        function serialize(value: any) {
            if (options.transformer) {
                if ('serialize' in options.transformer) {
                    return options.transformer.serialize(value);
                }
                return options.transformer.stringify(value);
            }
            return value;
        }

        const prefName = toRef(aPrefName);
        const value: Ref<R> = ref(deserialize(await get(prefName.value, toValue(aDefaultValue))));

        watch(
            value,
            (value) => {
                set(prefName.value, serialize(value));
            },
            { deep: true },
        );

        async function onChange(aPrefName: string) {
            if (aPrefName === prefName.value) {
                value.value = deserialize(await get(prefName.value, toValue(aDefaultValue)));
            }
        }
        browser.prefs.onPrefChanged.addListener(onChange);

        if (getCurrentScope()) {
            onScopeDispose(() => {
                browser.prefs.onPrefChanged.removeListener(onChange);
            });
        }

        return value;
    };
}

export const useBoolPref = createUsePref(browser.prefs.getBoolPref, browser.prefs.setBoolPref);
export const useIntPref = createUsePref(browser.prefs.getIntPref, browser.prefs.setIntPref);
export const useStringPref = createUsePref(browser.prefs.getStringPref, browser.prefs.setStringPref);

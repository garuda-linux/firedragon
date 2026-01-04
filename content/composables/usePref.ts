import { type MaybeRefOrGetter, ref, toRef, toValue, watch } from '@vue/reactivity';

function createUsePref<T>(
    get: (aPrefName: string, aDefaultValue?: T) => T,
    set: (aPrefName: string, aValue: T) => void,
) {
    return function (aPrefName: MaybeRefOrGetter<string>, aDefaultValue?: MaybeRefOrGetter<T>) {
        const prefName = toRef(aPrefName);
        const value = ref(get(prefName.value, toValue(aDefaultValue)));

        watch(value, (value) => {
            set(prefName.value, value);
        });

        Services.prefs.addObserver('', (_subject, _topic, data) => {
            if (data === prefName.value) {
                value.value = get(prefName.value, toValue(aDefaultValue));
            }
        });

        return value;
    };
}

export const useBoolPref = createUsePref(Services.prefs.getBoolPref, Services.prefs.setBoolPref);
export const useIntPref = createUsePref(Services.prefs.getIntPref, Services.prefs.setIntPref);
export const useStringPref = createUsePref(Services.prefs.getStringPref, Services.prefs.setStringPref);

function usePref<T>(aPrefName: MaybeRefOrGetter<string>, aDefaultValue: MaybeRefOrGetter<T> | undefined, get: (aPrefName: string, aDefaultValue?: T) => T, set: (aPrefName: string, aValue: T) => void) {
    const prefName = toRef(aPrefName);
    const value = ref(get(prefName.value, toValue(aDefaultValue)));
    function onChange() {
        value.value = get(prefName.value, toValue(aDefaultValue));
    }
    Services.prefs.addObserver(prefName.value, onChange);
    watch(prefName, (prefName, oldPrefName) => {
        value.value = get(prefName, toValue(aDefaultValue));
        Services.prefs.removeObserver(oldPrefName, onChange);
        Services.prefs.addObserver(prefName, onChange);
    });
    watch(value, (value) => {
        set(prefName.value, value);
    });
    return value;
}

export function useBoolPref(aPrefName: MaybeRefOrGetter<string>, aDefaultValue?: MaybeRefOrGetter<boolean>) {
    return usePref(aPrefName, aDefaultValue, Services.prefs.getBoolPref, Services.prefs.setBoolPref);
}

export function useIntPref(aPrefName: MaybeRefOrGetter<string>, aDefaultValue?: MaybeRefOrGetter<number>) {
    return usePref(aPrefName, aDefaultValue, Services.prefs.getIntPref, Services.prefs.setIntPref);
}

export function useStringPref(aPrefName: MaybeRefOrGetter<string>, aDefaultValue?: MaybeRefOrGetter<string>) {
    return usePref(aPrefName, aDefaultValue, Services.prefs.getStringPref, Services.prefs.setStringPref);
}

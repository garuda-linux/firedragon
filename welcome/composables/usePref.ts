function createUsePref<T>(
    get: (aPrefName: string, aDefaultValue?: T) => Promise<T>,
    set: (aPrefName: string, aValue: T) => void,
) {
    return async function (aPrefName: MaybeRefOrGetter<string>, aDefaultValue?: MaybeRefOrGetter<T>) {
        const prefName = toRef(aPrefName);
        const value = ref(await get(prefName.value, toValue(aDefaultValue)));

        watch(value, (value) => {
            set(prefName.value, value);
        });

        async function onChange(aPrefName: string) {
            if (aPrefName === prefName.value) {
                value.value = await get(prefName.value, toValue(aDefaultValue));
            }
        }
        browser.prefs.onPrefChanged.addListener(onChange);
        tryOnScopeDispose(() => {
            browser.prefs.onPrefChanged.removeListener(onChange);
        });

        return value;
    };
}

export const useBoolPref = createUsePref(browser.prefs.getBoolPref, browser.prefs.setBoolPref);
export const useIntPref = createUsePref(browser.prefs.getIntPref, browser.prefs.setIntPref);
export const useStringPref = createUsePref(browser.prefs.getStringPref, browser.prefs.setStringPref);

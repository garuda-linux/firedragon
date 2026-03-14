export default async function usePrefHasUserValue(aPrefName: MaybeRefOrGetter<string>) {
    const prefName = toRef(aPrefName);
    const prefHasUserValue = ref(await browser.prefs.prefHasUserValue(prefName.value));

    async function onChange(aPrefName: string) {
        if (aPrefName === prefName.value) {
            prefHasUserValue.value = await browser.prefs.prefHasUserValue(prefName.value);
        }
    }
    browser.prefs.onPrefChanged.addListener(onChange);
    tryOnScopeDispose(() => {
        browser.prefs.onPrefChanged.removeListener(onChange);
    });

    return {
        value: prefHasUserValue,
        clear() {
            browser.prefs.clearUserPref(prefName.value);
        },
    };
}

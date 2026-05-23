export default async function usePrefHasUserValue(aPrefName: MaybeRefOrGetter<string>) {
    const prefName = toRef(aPrefName);
    const prefHasUserValue = ref(await browser.firedragon.prefHasUserValue(prefName.value));

    async function onChange(aPrefName: string) {
        if (aPrefName === prefName.value) {
            prefHasUserValue.value = await browser.firedragon.prefHasUserValue(prefName.value);
        }
    }
    browser.firedragon.onPrefChanged.addListener(onChange);
    tryOnScopeDispose(() => {
        browser.firedragon.onPrefChanged.removeListener(onChange);
    });

    return {
        value: prefHasUserValue,
        clear() {
            browser.firedragon.clearUserPref(prefName.value);
        },
    };
}

export default function usePrefHasUserValue(aPrefName: MaybeRefOrGetter<string>) {
    const prefName = toRef(aPrefName);
    const prefHasUserValue = ref(Services.prefs.prefHasUserValue(prefName.value));
    function onChange() {
        prefHasUserValue.value = Services.prefs.prefHasUserValue(prefName.value);
    }
    Services.prefs.addObserver(prefName.value, onChange);
    watch(prefName, (prefName, oldPrefName) => {
        prefHasUserValue.value = Services.prefs.prefHasUserValue(prefName);
        Services.prefs.removeObserver(oldPrefName, onChange);
        Services.prefs.addObserver(prefName, onChange);
    });
    return {
        value: prefHasUserValue,
        clear() {
            Services.prefs.clearUserPref(prefName.value);
        },
    };
}

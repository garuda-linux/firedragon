export default function toggleRefs<T extends any[]>(
    refs: { [key in keyof T]: Ref<T[key]> },
    trueValues: T,
    falseValues: T,
) {
    return computed({
        get: () => refs.every((ref, i) => ref.value === trueValues[i]),
        set: (state) =>
            refs.forEach((ref, i) => {
                ref.value = state ? trueValues[i] : falseValues[i];
            }),
    });
}

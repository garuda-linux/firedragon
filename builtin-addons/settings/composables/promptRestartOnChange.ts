export default function promptRestartOnChange(ref: Ref, title: string, message: string) {
    const { dialog } = useQuasar();

    watch(ref, () => {
        dialog({
            title,
            message,
            persistent: true,
            cancel: true,
        }).onOk(() => {
            browser.firedragon.restart();
        });
    });
}

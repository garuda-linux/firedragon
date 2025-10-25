export default function restartOnChange(ref: Ref<any>, title: string, message: string) {
    const { dialog } = useQuasar();

    watch(ref, () => {
        dialog({
            title,
            message,
            persistent: true,
            cancel: true,
        }).onOk(() => {
            Services.startup.quit(Ci.nsIAppStartup.eAttemptQuit! | Ci.nsIAppStartup.eRestart!);
        });
    });
}

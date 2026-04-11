export default defineExperimentApi({
    registration: {
        scope: 'parent',
        events: ['startup'],
    },
    definitions: {},
    main() {
        const lazy: any = {};

        ChromeUtils.defineESModuleGetters(lazy, {
            ExtensionSettingsStore: 'resource://gre/modules/ExtensionSettingsStore.sys.mjs',
        });

        return class extends ExtensionAPI {
            constructor(extension: Extension) {
                super(extension);

                this.onStartup();
            }

            async onStartup() {
                await lazy.ExtensionSettingsStore.initialize();
                await lazy.ExtensionSettingsStore.addSetting(
                    this.extension.id,
                    'tabHideNotification',
                    this.extension.id,
                    true,
                    () => false,
                );
            }

            getAPI(context: any): any {
                return {};
            }
        };
    },
});

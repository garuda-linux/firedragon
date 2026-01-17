export default defineExperimentApi({
    registration: {
        scope: 'parent',
        events: ['startup'],
    },
    definitions: {},
    main() {
        const lazy = {};

        ChromeUtils.defineESModuleGetters(lazy, {
            BuiltinAddons: 'resource://firedragon/modules/BuiltinAddons.sys.mjs',
            ExtensionSettingsStore: 'resource://gre/modules/ExtensionSettingsStore.sys.mjs',
        });

        return class extends ExtensionAPI {
            constructor(extension: any) {
                super(extension);

                this.onStartup();
            }

            async onStartup() {
                await lazy.ExtensionSettingsStore.initialize();
                await lazy.ExtensionSettingsStore.addSetting(
                    lazy.BuiltinAddons.workspaces.id,
                    'tabHideNotification',
                    lazy.BuiltinAddons.workspaces.id,
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

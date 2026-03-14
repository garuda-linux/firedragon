declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace safeMode {
            export function isSafeMode(): Promise<boolean>;
            export function enterSafeMode(): void;
            export function exitSafeMode(): void;
            export function getToggles(): Promise<{ id: string; label: string; default: boolean }[]>;
            export function getToggle(id: string): Promise<boolean>;
            export function setToggle(id: string, value: boolean): void;
        }
    }
}

export default defineExperimentApi({
    registration: {
        scope: 'parent',
        paths: [['safeMode']],
    },
    definitions: {
        namespace: 'safeMode',
        functions: [
            {
                name: 'isSafeMode',
                type: 'function',
                async: true,
                parameters: [],
                returns: {
                    type: 'boolean',
                },
            },
            {
                name: 'enterSafeMode',
                type: 'function',
                parameters: [],
            },
            {
                name: 'exitSafeMode',
                type: 'function',
                parameters: [],
            },
            {
                name: 'getToggles',
                type: 'function',
                async: true,
                parameters: [],
                returns: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                            },
                            label: {
                                type: 'string',
                            },
                            default: {
                                type: 'boolean',
                            },
                        },
                    },
                },
            },
            {
                name: 'getToggle',
                type: 'function',
                async: true,
                parameters: [
                    {
                        name: 'id',
                        type: 'string',
                    },
                ],
                returns: {
                    type: 'boolean',
                },
            },
            {
                name: 'setToggle',
                type: 'function',
                parameters: [
                    {
                        name: 'id',
                        type: 'string',
                    },
                    {
                        name: 'value',
                        type: 'boolean',
                    },
                ],
            },
        ],
    },
    main() {
        const { BrowserWindowTracker } = ChromeUtils.importESModule('resource:///modules/BrowserWindowTracker.sys.mjs');
        const { SafeModeController } = ChromeUtils.importESModule(
            'resource://firedragon/modules/SafeModeController.sys.mjs',
        ) as typeof import('resource://firedragon/modules/SafeModeController.sys.mjs');

        return class extends ExtensionAPI {
            getAPI(_context: any) {
                return {
                    safeMode: {
                        async isSafeMode(): Promise<boolean> {
                            return SafeModeController.enabled;
                        },
                        enterSafeMode(): void {
                            const window = BrowserWindowTracker.getTopWindow();
                            Services.obs.notifyObservers(window, 'restart-in-safe-mode');
                        },
                        exitSafeMode(): void {
                            Services.startup.quit(Ci.nsIAppStartup.eForceQuit! | Ci.nsIAppStartup.eRestart!);
                        },
                        async getToggles(): Promise<{ id: string; label: string; default: boolean }[]> {
                            return SafeModeController.getToggles();
                        },
                        async getToggle(id: string): Promise<boolean> {
                            return SafeModeController.getToggle(id);
                        },
                        setToggle(id: string, value: boolean): void {
                            SafeModeController.setToggle(id, value);
                        },
                    },
                };
            }
        };
    },
});

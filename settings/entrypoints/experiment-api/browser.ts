declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace browser {
            export function getLogo(): Promise<string>;
            export function restart(): void;
            export function open(url: string): void;
        }
    }
}

export default defineExperimentApi({
    registration: {
        scope: 'parent',
        paths: [['browser']],
    },
    definitions: {
        namespace: 'browser',
        functions: [
            {
                name: 'getLogo',
                type: 'function',
                async: true,
                parameters: [],
                returns: {
                    type: 'string',
                },
            },
            {
                name: 'restart',
                type: 'function',
                parameters: [],
            },
            {
                name: 'open',
                type: 'function',
                parameters: [
                    {
                        name: 'url',
                        type: 'string',
                    },
                ],
            },
        ],
    },
    main() {
        const { ExtensionParent } = ChromeUtils.importESModule('resource://gre/modules/ExtensionParent.sys.mjs');

        return class extends ExtensionAPI {
            getAPI(_context: any) {
                return {
                    browser: {
                        getLogo(): Promise<string> {
                            return ExtensionUtils.makeDataURI('chrome://branding/content/about-logo.png');
                        },
                        restart(): void {
                            Services.startup.quit(Ci.nsIAppStartup.eAttemptQuit! | Ci.nsIAppStartup.eRestart!);
                        },
                        open(url: string): void {
                            ExtensionParent.apiManager.global.tabTracker.activeTab.linkedBrowser.loadURI(
                                Services.io.newURI(url),
                                {
                                    triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
                                },
                            );
                        },
                    },
                };
            }
        };
    },
});

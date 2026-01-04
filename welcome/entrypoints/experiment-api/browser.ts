declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace browser {
            export function getLogo(): Promise<string>;
            export function setDefault(): Promise<void>;
            export function open(url: string): void;
        }
    }
}

export default defineExperimentApi({
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
            name: 'setDefault',
            type: 'function',
            async: true,
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
    main() {
        const { ShellService } = ChromeUtils.importESModule('moz-src:///browser/components/shell/ShellService.sys.mjs');
        const { ExtensionParent } = ChromeUtils.importESModule('resource://gre/modules/ExtensionParent.sys.mjs');

        return class extends ExtensionAPI {
            getAPI(_context: any) {
                return {
                    browser: {
                        getLogo(): Promise<string> {
                            return ExtensionUtils.makeDataURI('chrome://branding/content/about-logo.png');
                        },
                        async setDefault(): Promise<void> {
                            await ShellService.setDefaultBrowser();
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

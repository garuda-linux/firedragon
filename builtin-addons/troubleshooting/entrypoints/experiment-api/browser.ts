declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace browser {
            export function getLogo(): Promise<string>;
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
        ],
    },
    main() {
        return class extends ExtensionAPI {
            getAPI(_context: any) {
                return {
                    browser: {
                        getLogo(): Promise<string> {
                            return ExtensionUtils.makeDataURI('chrome://branding/content/about-logo.png');
                        },
                    },
                };
            }
        };
    },
});

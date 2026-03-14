import type { TypeDefinition } from '@firedragon/build/wxt-client';

declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace searchEngine {
            export interface SearchEngine {
                id: string;
                name: string;
                icon: string;
            }

            export function getAll(): Promise<SearchEngine[]>;
            export function getDefault(): Promise<SearchEngine>;
            export function setDefault(id: string): void;
        }
    }
}

const searchEngineType: TypeDefinition = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        icon: {
            type: 'string',
        },
    },
};

export default defineExperimentApi({
    registration: {
        scope: 'parent',
        paths: [['searchEngine']],
    },
    definitions: {
        namespace: 'searchEngine',
        functions: [
            {
                name: 'getAll',
                type: 'function',
                async: true,
                parameters: [],
                returns: {
                    type: 'array',
                    items: searchEngineType,
                },
            },
            {
                name: 'getDefault',
                type: 'function',
                async: true,
                parameters: [],
                returns: searchEngineType,
            },
            {
                name: 'setDefault',
                type: 'function',
                parameters: [
                    {
                        name: 'id',
                        type: 'string',
                    },
                ],
            },
        ],
    },
    main() {
        async function mapSearchEngine(engine: any): Promise<Browser.searchEngine.SearchEngine> {
            return {
                id: engine.id,
                name: engine.name,
                icon: await engine.getIconURL(),
            };
        }

        return class extends ExtensionAPI {
            getAPI(_context: any) {
                return {
                    searchEngine: {
                        async getAll(): Promise<Browser.searchEngine.SearchEngine[]> {
                            return Promise.all((await Services.search.getVisibleEngines()).map(mapSearchEngine));
                        },
                        async getDefault(): Promise<Browser.searchEngine.SearchEngine> {
                            return mapSearchEngine(await Services.search.defaultEngine);
                        },
                        setDefault(id: string) {
                            const engine = Services.search.getEngineById(id);
                            Services.search.setDefault(engine, Services.search.CHANGE_REASON_UITOUR!);
                            Services.search.setDefaultPrivate(engine, Services.search.CHANGE_REASON_UITOUR!);
                        },
                    },
                };
            }
        };
    },
});

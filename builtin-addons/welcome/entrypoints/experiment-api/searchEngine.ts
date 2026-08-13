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
            export function getPrivateDefault(): Promise<SearchEngine>;
            export function setPrivateDefault(id: string): void;
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
            {
                name: 'getPrivateDefault',
                type: 'function',
                async: true,
                parameters: [],
                returns: searchEngineType,
            },
            {
                name: 'setPrivateDefault',
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
        const { SearchService } = ChromeUtils.importESModule(
            'moz-src:///toolkit/components/search/SearchService.sys.mjs',
        );

        async function mapSearchEngine(engine: any): Promise<Browser.searchEngine.SearchEngine> {
            return {
                id: engine.id,
                name: engine.name,
                icon: await ExtensionUtils.makeDataURI(await engine.getIconURL()),
            };
        }

        return class extends ExtensionAPI {
            getAPI(_context: any) {
                return {
                    searchEngine: {
                        async getAll(): Promise<Browser.searchEngine.SearchEngine[]> {
                            return Promise.all((await SearchService.getVisibleEngines()).map(mapSearchEngine));
                        },
                        async getDefault(): Promise<Browser.searchEngine.SearchEngine> {
                            return mapSearchEngine(SearchService.defaultEngine);
                        },
                        setDefault(id: string) {
                            const engine = SearchService.getEngineById(id);
                            SearchService.setDefault(engine, SearchService.CHANGE_REASON.UITOUR!);
                        },
                        async getPrivateDefault(): Promise<Browser.searchEngine.SearchEngine> {
                            return mapSearchEngine(SearchService.defaultPrivateEngine);
                        },
                        setPrivateDefault(id: string) {
                            const engine = SearchService.getEngineById(id);
                            SearchService.setDefaultPrivate(engine, SearchService.CHANGE_REASON.UITOUR!);
                        },
                    },
                };
            }
        };
    },
});

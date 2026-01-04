import type { TypeDefinition } from '@firedragon/build/wxt-client';

declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace language {
            export interface LocaleInfo {
                systemLocaleRaw: string;
                appLocaleRaw: string;
                displayNames: {
                    systemLanguage: string;
                    appLanguage: string;
                };
            }
            export interface LanguagePack {
                target_locale: string;
                name: string;
                url: string;
                hash: string;
            }

            export function getLocaleInfo(): Promise<LocaleInfo>;
            export function getLanguagePacks(): Promise<LanguagePack[]>;
            export function setLanguagePack(languagePack: LanguagePack): Promise<void>;
        }
    }
}

const localeInfoType: TypeDefinition = {
    type: 'object',
    properties: {
        systemLocaleRaw: {
            type: 'string',
        },
        appLocaleRaw: {
            type: 'string',
        },
        displayNames: {
            type: 'object',
            properties: {
                systemLanguage: {
                    type: 'string',
                },
                appLanguage: {
                    type: 'string',
                },
            },
        },
    },
};
const languagePackType: TypeDefinition = {
    type: 'object',
    properties: {
        target_locale: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        url: {
            type: 'string',
        },
        hash: {
            type: 'string',
        },
    },
};

export default defineExperimentApi({
    namespace: 'language',
    functions: [
        {
            name: 'getLocaleInfo',
            type: 'function',
            async: true,
            parameters: [],
            returns: localeInfoType,
        },
        {
            name: 'getLanguagePacks',
            type: 'function',
            async: true,
            parameters: [],
            returns: {
                type: 'array',
                items: languagePackType,
            },
        },
        {
            name: 'setLanguagePack',
            type: 'function',
            async: true,
            parameters: [
                {
                    name: 'languagePack',
                    ...languagePackType,
                },
            ],
        },
    ],
    main() {
        const { LangPackMatcher } = ChromeUtils.importESModule('resource://gre/modules/LangPackMatcher.sys.mjs');
        const { MozIntl } = ChromeUtils.importESModule('resource://gre/modules/mozIntl.sys.mjs');

        const mozIntl = new MozIntl();
        function getLocaleDisplayName(locale: string): string {
            return mozIntl.getLocaleDisplayNames(undefined, [locale], { preferNative: true })[0];
        }

        return class extends ExtensionAPI {
            getAPI(_context: any) {
                return {
                    language: {
                        getLocaleInfo(): Browser.language.LocaleInfo {
                            return LangPackMatcher.getAppAndSystemLocaleInfo();
                        },
                        async getLanguagePacks(): Promise<Browser.language.LanguagePack[]> {
                            return (await LangPackMatcher.mockable.getAvailableLangpacks()).map(
                                (langPack: Omit<Browser.language.LanguagePack, 'name'>) => ({
                                    ...langPack,
                                    name: getLocaleDisplayName(langPack.target_locale),
                                }),
                            );
                        },
                        async setLanguagePack(languagePack: Browser.language.LanguagePack): Promise<void> {
                            await LangPackMatcher.ensureLangPackInstalled(languagePack);
                            LangPackMatcher.setRequestedAppLocales([languagePack.target_locale]);
                        },
                    },
                };
            }
        };
    },
});

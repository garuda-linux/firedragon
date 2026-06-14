declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace firedragon {
            export function getLogo(): Promise<string>;
            export function restart(): void;
            export function open(url: string): void;
            export function setDefault(): Promise<void>;

            export const onPrefChanged: events.Event<(aPrefName: string) => void>;

            export function getBoolPref(aPrefName: string, aDefaultValue?: boolean): Promise<boolean>;
            export function setBoolPref(aPrefName: string, aValue: boolean): void;
            export function getIntPref(aPrefName: string, aDefaultValue?: number): Promise<number>;
            export function setIntPref(aPrefName: string, aValue: number): void;
            export function getStringPref(aPrefName: string, aDefaultValue?: string): Promise<string>;
            export function setStringPref(aPrefName: string, aValue: string): void;

            export function prefHasUserValue(aPrefName: string): Promise<boolean>;
            export function clearUserPref(aPrefName: string): void;

            export function getChildList(aStartingAt: string): Promise<string[]>;

            export function getSearchSuggestions(searchString: string): Promise<string[]>;
        }
    }
}

declare module 'webextension-polyfill' {
    export const firedragon: typeof import('@wxt-dev/browser').browser.firedragon;
}

declare global {
    export interface Extension {
        readonly id: string;
    }
    export abstract class ExtensionAPI {
        readonly extension: Extension;

        protected constructor(extension: Extension);

        abstract getAPI(context: any): any;
    }
    export namespace ExtensionCommon {
        export class EventManager {
            constructor(options: {
                context: any;
                name: string;
                register(fire: { async: (data: any) => void }): () => void;
            });

            api(): any;
        }
    }
    export namespace ExtensionUtils {
        export function makeDataURI(iconUrl: string): Promise<string>;
    }
    export namespace ExtensionParent {
        export const apiManager: any;
    }
}

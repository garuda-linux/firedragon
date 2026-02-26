import { defineExperimentApi } from '@firedragon/build/wxt-client';

declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace prefs {
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
        }
    }
}

export function prefs() {
    return defineExperimentApi({
        registration: {
            scope: 'parent',
            paths: [['prefs']],
        },
        definitions: {
            namespace: 'prefs',
            events: [
                {
                    name: 'onPrefChanged',
                    type: 'function',
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                    ],
                },
            ],
            functions: [
                {
                    name: 'getBoolPref',
                    type: 'function',
                    async: true,
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                        {
                            name: 'aDefaultValue',
                            type: 'boolean',
                            optional: true,
                        },
                    ],
                    returns: {
                        type: 'boolean',
                        optional: true,
                    },
                },
                {
                    name: 'setBoolPref',
                    type: 'function',
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                        {
                            name: 'aValue',
                            type: 'boolean',
                        },
                    ],
                },
                {
                    name: 'getIntPref',
                    type: 'function',
                    async: true,
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                        {
                            name: 'aDefaultValue',
                            type: 'integer',
                            optional: true,
                        },
                    ],
                    returns: {
                        type: 'integer',
                        optional: true,
                    },
                },
                {
                    name: 'setIntPref',
                    type: 'function',
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                        {
                            name: 'aValue',
                            type: 'integer',
                        },
                    ],
                },
                {
                    name: 'getStringPref',
                    type: 'function',
                    async: true,
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                        {
                            name: 'aDefaultValue',
                            type: 'string',
                            optional: true,
                        },
                    ],
                    returns: {
                        type: 'string',
                        optional: true,
                    },
                },
                {
                    name: 'setStringPref',
                    type: 'function',
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                        {
                            name: 'aValue',
                            type: 'string',
                        },
                    ],
                },
                {
                    name: 'prefHasUserValue',
                    type: 'function',
                    async: true,
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                    ],
                    returns: {
                        type: 'boolean',
                    },
                },
                {
                    name: 'clearUserPref',
                    type: 'function',
                    parameters: [
                        {
                            name: 'aPrefName',
                            type: 'string',
                        },
                    ],
                },
                {
                    name: 'getChildList',
                    type: 'function',
                    async: true,
                    parameters: [
                        {
                            name: 'aStartingAt',
                            type: 'string',
                        },
                    ],
                    returns: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
            ],
        },
        main() {
            return class extends ExtensionAPI {
                getAPI(context: any) {
                    return {
                        prefs: {
                            onPrefChanged: new ExtensionCommon.EventManager({
                                context,
                                name: 'prefs.onPrefChanged',
                                register(fire) {
                                    const observer = (_subject: any, _topic: string, data: string) => {
                                        fire.async(data);
                                    };
                                    Services.prefs.addObserver('', observer);
                                    return () => {
                                        Services.prefs.removeObserver('', observer);
                                    };
                                },
                            }).api(),

                            getBoolPref(aPrefName: string, aDefaultValue?: boolean): boolean {
                                return Services.prefs.getBoolPref(aPrefName, aDefaultValue);
                            },
                            setBoolPref(aPrefName: string, aValue: boolean): void {
                                Services.prefs.setBoolPref(aPrefName, aValue);
                            },
                            getIntPref(aPrefName: string, aDefaultValue?: number): number {
                                return Services.prefs.getIntPref(aPrefName, aDefaultValue);
                            },
                            setIntPref(aPrefName: string, aValue: number): void {
                                Services.prefs.setIntPref(aPrefName, aValue);
                            },
                            getStringPref(aPrefName: string, aDefaultValue?: string): string {
                                return Services.prefs.getStringPref(aPrefName, aDefaultValue);
                            },
                            setStringPref(aPrefName: string, aValue: string): void {
                                Services.prefs.setStringPref(aPrefName, aValue);
                            },

                            prefHasUserValue(aPrefName: string): boolean {
                                return Services.prefs.prefHasUserValue(aPrefName);
                            },
                            clearUserPref(aPrefName: string): void {
                                Services.prefs.clearUserPref(aPrefName);
                            },

                            getChildList(aStartingAt: string): string[] {
                                return Services.prefs.getChildList(aStartingAt);
                            },
                        },
                    };
                }
            };
        },
    });
}

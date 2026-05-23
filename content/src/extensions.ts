/// <reference types="@firedragon/shared/types/extensions" />

const { ExtensionParent } = ChromeUtils.importESModule('resource://gre/modules/ExtensionParent.sys.mjs');

globalThis.firedragon = class extends ExtensionAPI {
    getAPI(context) {
        return {
            firedragon: {
                getLogo(): Promise<string> {
                    return ExtensionUtils.makeDataURI('chrome://branding/content/about-logo.png');
                },
                restart() {
                    Services.startup.quit(Ci.nsIAppStartup.eAttemptQuit! | Ci.nsIAppStartup.eRestart!);
                },
                open(url: string) {
                    ExtensionParent.apiManager.global.tabTracker.activeTab.linkedBrowser.loadURI(
                        Services.io.newURI(url),
                        {
                            triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
                        },
                    );
                },

                onPrefChanged: new ExtensionCommon.EventManager({
                    context,
                    name: 'prefs.onPrefChanged',
                    register(fire: any) {
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

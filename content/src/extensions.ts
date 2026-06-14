/// <reference types="@firedragon/shared/types/extensions" />

const lazy: any = {};

ChromeUtils.defineESModuleGetters(lazy, {
    PrivateBrowsingUtils: 'resource://gre/modules/PrivateBrowsingUtils.sys.mjs',
    SearchService: 'moz-src:///toolkit/components/search/SearchService.sys.mjs',
    SearchSuggestionController: 'moz-src:///toolkit/components/search/SearchSuggestionController.sys.mjs',
    ShellService: 'moz-src:///browser/components/shell/ShellService.sys.mjs',
});

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
                async setDefault() {
                    await lazy.ShellService.setDefaultBrowser();
                },
                getNewTabURL(): string {
                    return AboutNewTab.newTabURL;
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

                async getSearchSuggestions(searchString: string): Promise<string[]> {
                    const browser = ExtensionParent.apiManager.global.tabTracker.activeTab.linkedBrowser;
                    const privateMode = lazy.PrivateBrowsingUtils.isBrowserPrivate(browser);
                    const userContextId = browser!.ownerGlobal!.gBrowser.selectedBrowser.getAttribute('userContextId');
                    const controller = new lazy.SearchSuggestionController();
                    const engine = privateMode
                        ? lazy.SearchService.defaultPrivateEngine
                        : lazy.SearchService.defaultEngine;
                    const searchSuggestions = await controller.fetch({
                        searchString,
                        inPrivateBrowsing: privateMode,
                        engine,
                        userContextId: userContextId,
                    });
                    return [...searchSuggestions.local, ...searchSuggestions.remote].map(
                        (searchSuggestion) => searchSuggestion.value,
                    );
                },
            },
        };
    }
};

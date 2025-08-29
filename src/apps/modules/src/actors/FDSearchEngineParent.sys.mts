const lazy: any = {};

ChromeUtils.defineESModuleGetters(lazy, {
    SearchSuggestionController: 'moz-src:///toolkit/components/search/SearchSuggestionController.sys.mjs',
    ExtensionUtils: 'resource://gre/modules/ExtensionUtils.sys.mjs',
    PrivateBrowsingUtils: 'resource://gre/modules/PrivateBrowsingUtils.sys.mjs',
    FormHistory: "resource://gre/modules/FormHistory.sys.mjs",
    BrowserUtils: "resource://gre/modules/BrowserUtils.sys.mjs",
});

export class FDSearchEngineParent extends JSWindowActorParent {
    receiveMessage(message: ReceiveMessageArgument) {
        switch (message.name) {
            case 'GetVisibleEngines':
                return this.GetVisibleEngines();
            case 'GetDefaultEngine':
                return this.GetDefaultEngine();
            case 'EngineOffersSuggestions':
                return this.EngineOffersSuggestions(message.data.engineId);
            case 'FetchSuggestions':
                return this.FetchSuggestions(message.data.engineId, message.data.searchTerm);
            case 'PerformSearch':
                return this.PerformSearch(message.data.engineId, message.data.searchTerm);
        }
        throw `Unknown message: ${message.name}`;
    }

    private async mapEngine(engine: nsISearchEngine): Partial<nsISearchEngine> {
        let iconURL = await engine.getIconURL();
        if (iconURL && (iconURL.startsWith("blob:") || iconURL.startsWith("moz-extension:"))) {
            iconURL = await lazy.ExtensionUtils.makeDataURI(iconURL);
        }
        return {
            name: engine.name,
            iconURL: iconURL,
            identifier: engine.identifier,
            id: engine.id || engine.identifier,
            telemetryId: engine.telemetryId || "",
            description: engine.description || "",
            hidden: !!engine.hidden,
            alias: engine.alias || "",
            aliases: Array.isArray(engine.aliases) ? engine.aliases : [],
            domain: engine.searchUrlDomain || "",
            isAppProvided: !!engine.isAppProvided,
        };
    }

    private mapSearchSuggestions(searchSuggestionEntry: any): any {
        return {
            value: searchSuggestionEntry.value,
        };
    }

    private get browser() {
        return this.browsingContext.top.embedderElement;
    }

    private get privateMode() {
        return lazy.PrivateBrowsingUtils.isBrowserPrivate(this.browser);
    }

    async GetVisibleEngines() {
        return Promise.all((await Services.search.getVisibleEngines()).map(this.mapEngine));
    }

    GetDefaultEngine() {
        const engine = this.privateMode ? defaultPrivateEngine : Services.search.defaultEngine;
        return this.mapEngine(engine);
    }

    EngineOffersSuggestions(engineId: string) {
        const engine = Services.search.getEngineById(engineId);
        return lazy.SearchSuggestionController.engineOffersSuggestions(engine);
    }

    async FetchSuggestions(engineId: string, searchTerm: string) {
        const controller = new lazy.SearchSuggestionController();
        const engine = Services.search.getEngineById(engineId);
        const userContextId = this.browser.ownerGlobal.gBrowser.selectedBrowser.getAttribute('userContextId');
        const suggestions = await controller.fetch(searchTerm, this.privateMode, engine, userContextId);
        return {
            local: suggestions.local.map(this.mapSearchSuggestions),
            remote: suggestions.remote.map(this.mapSearchSuggestions),
        };
    }

    async PerformSearch(engineId: string, searchTerm: string) {
        const engine = Services.search.getEngineById(engineId);
        const submission = engine.getSubmission(searchTerm);
        if (lazy.FormHistory.enabled && !this.privateMode && searchTerm.length <= lazy.SearchSuggestionController.SEARCH_HISTORY_MAX_VALUE_LENGTH) {
            const controller = new lazy.SearchSuggestionController();
            await lazy.FormHistory.update({
                op: "bump",
                fieldname: controller.formHistoryParam,
                value: searchTerm,
                source: engine.name,
            });
        }
        this.browser.loadURI(submission.uri, {
            postData: submission.postData,
            triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({
                userContextId: this.browser.ownerGlobal.gBrowser.selectedBrowser.getAttribute('userContextId'),
            }),
        });
    }
}

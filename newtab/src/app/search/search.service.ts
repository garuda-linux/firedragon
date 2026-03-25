import { Injectable } from '@angular/core';

const { FormHistory } = ChromeUtils.importESModule('resource://gre/modules/FormHistory.sys.mjs');
const { PrivateBrowsingUtils } = ChromeUtils.importESModule('resource://gre/modules/PrivateBrowsingUtils.sys.mjs');
const { SearchService: MozSearchService } = ChromeUtils.importESModule(
    'moz-src:///toolkit/components/search/SearchService.sys.mjs',
);
const { DEFAULT_FORM_HISTORY_PARAM, SearchSuggestionController } = ChromeUtils.importESModule(
    'moz-src:///toolkit/components/search/SearchSuggestionController.sys.mjs',
);

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private browser: Element;
    private privateMode: boolean;
    private userContextId: number;

    constructor() {
        this.browser = browsingContext.top.embedderElement;
        this.privateMode = PrivateBrowsingUtils.isBrowserPrivate(this.browser);
        this.userContextId = this.browser.ownerGlobal.gBrowser.selectedBrowser.getAttribute('userContextId');
    }

    getDefaultEngine() {
        return this.privateMode ? MozSearchService.defaultPrivateEngine : MozSearchService.defaultEngine;
    }

    async fetchSuggestions(engineId: string, searchString: string) {
        const controller = new SearchSuggestionController();
        const engine = MozSearchService.getEngineById(engineId);
        return await controller.fetch({
            searchString,
            inPrivateBrowsing: this.privateMode,
            engine,
            userContextId: this.userContextId,
        });
    }

    async performSearch(engineId: string, searchTerm: string) {
        const engine = MozSearchService.getEngineById(engineId);
        const submission = engine.getSubmission(searchTerm);
        if (
            FormHistory.enabled &&
            !this.privateMode &&
            searchTerm.length <= SearchSuggestionController.SEARCH_HISTORY_MAX_VALUE_LENGTH
        ) {
            await FormHistory.update({
                op: 'bump',
                fieldname: DEFAULT_FORM_HISTORY_PARAM,
                value: searchTerm,
                source: engine.name,
            });
        }
        this.browser.loadURI(submission.uri, {
            postData: submission.postData,
            triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({
                userContextId: this.userContextId,
            }),
        });
    }
}

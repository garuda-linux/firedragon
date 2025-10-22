import { Injectable } from '@angular/core';
import { FormHistory } from 'resource://gre/modules/FormHistory.sys.mjs';
import { PrivateBrowsingUtils } from 'resource://gre/modules/PrivateBrowsingUtils.sys.mjs';
import { SearchSuggestionController } from 'moz-src:///toolkit/components/search/SearchSuggestionController.sys.mjs';

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
        return this.privateMode ? Services.search.defaultPrivateEngine : Services.search.defaultEngine;
    }

    async fetchSuggestions(engineId: string, searchString: string) {
        const controller = new SearchSuggestionController();
        const engine = Services.search.getEngineById(engineId);
        return await controller.fetch({
            searchString,
            inPrivateBrowsing: this.privateMode,
            engine,
            userContextId: this.userContextId,
        });
    }

    async performSearch(engineId: string, searchTerm: string) {
        const engine = Services.search.getEngineById(engineId);
        const submission = engine.getSubmission(searchTerm);
        if (FormHistory.enabled && !this.privateMode && searchTerm.length <= SearchSuggestionController.SEARCH_HISTORY_MAX_VALUE_LENGTH) {
            const controller = new SearchSuggestionController();
            await FormHistory.update({
                op: 'bump',
                fieldname: controller.formHistoryParam,
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

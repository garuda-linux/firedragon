interface ContextualIdentity {
    userContextId: number;
    public: boolean;
    icon: string;
    color: string;
    name?: string;
    l10nId?: string;
    firedragonPrivateContainer?: boolean;
}

const lazy = {} as {
    ContextualIdentityService: {
        _lastUserContextId: number;
        _identities: ContextualIdentity[];
        ensureDataReady(): void;
        saveSoon(): void;
        getIdentityObserverOutput(identity: ContextualIdentity): unknown & nsISupports;
        countContainerTabs(userContextId: number): number;
        closeContainerTabs(userContextId: number): Promise<void>;
    };
};

ChromeUtils.defineESModuleGetters(lazy, {
    ContextualIdentityService: 'moz-src:///toolkit/components/contextualidentity/ContextualIdentityService.sys.mjs',
});

declare global {
    interface XULBrowserElement extends XULElement, nsIWebNavigation {
        [key: string]: any;
    }
}

export const PrivateContainer = new (class {
    public readonly userContextId: number;

    public additionalUsages: number = 0;

    constructor() {
        lazy.ContextualIdentityService.ensureDataReady();

        this.userContextId = this.getOrCreatePrivateContainer();
    }

    disableBrowserHistory(browser: XULBrowserElement) {
        browser.setAttribute('disablehistory', 'true');
        browser.setAttribute('disableglobalhistory', 'true');

        browser.disableGlobalHistory?.();
        browser.docShell && (browser.docShell.useGloablHistory = false);
        browser.browsingContext && (browser.browsingContext.useGloablHistory = true);
    }

    closeTabs({ gBrowser }: WindowProxy) {
        gBrowser.removeTabs(gBrowser.tabs.filter((tab: any) => tab.userContextId === this.userContextId));
    }

    isInUse(): boolean {
        return lazy.ContextualIdentityService.countContainerTabs(this.userContextId) + this.additionalUsages > 0;
    }

    maybeClearData() {
        if (!this.isInUse()) {
            Services.clearData.deleteDataFromOriginAttributesPattern({
                userContextId: this.userContextId,
            });
        }
    }

    private getOrCreatePrivateContainer(): number {
        return (
            lazy.ContextualIdentityService._identities.find(
                (identity: ContextualIdentity) => identity.firedragonPrivateContainer,
            )?.userContextId ?? this.createPrivateContainer()
        );
    }

    private createPrivateContainer(): number {
        const userContextId = ++lazy.ContextualIdentityService._lastUserContextId,
            identity: ContextualIdentity = {
                userContextId,
                public: true,
                icon: 'chill',
                color: 'purple',
                l10nId: 'firedragon-private-container',
                firedragonPrivateContainer: true,
            };
        lazy.ContextualIdentityService._identities.push(identity);
        lazy.ContextualIdentityService.saveSoon();
        Services.obs.notifyObservers(
            lazy.ContextualIdentityService.getIdentityObserverOutput(identity),
            'contextual-identity-created',
        );
        return userContextId;
    }
})();

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
    ContextualIdentityService: 'resource://gre/modules/ContextualIdentityService.sys.mjs',
});

export const PrivateContainer = new (class {
    public readonly userContextId: number;

    constructor() {
        lazy.ContextualIdentityService.ensureDataReady();

        this.userContextId = this.getOrCreatePrivateContainer();
    }

    closeTabs({ gBrowser }: WindowProxy) {
        gBrowser.removeTabs(gBrowser.tabs.filter((tab: any) => tab.userContextId === this.userContextId));
    }

    maybeClearData() {
        if (lazy.ContextualIdentityService.countContainerTabs(this.userContextId) === 0) {
            Services.clearData.deleteDataFromOriginAttributesPattern({
                userContextId: this.userContextId,
            });
        }
    }

    private getOrCreatePrivateContainer(): number {
        return (
            lazy.ContextualIdentityService._identities.find(
                (userContext: any) => userContext.firedragonPrivateContainer,
            )?.userContextId ?? this.createPrivateContainer()
        );
    }

    private createPrivateContainer(): number {
        const userContextId = ++lazy.ContextualIdentityService._lastUserContextId,
            identity = {
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

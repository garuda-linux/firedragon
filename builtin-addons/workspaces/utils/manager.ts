import { createId } from '@paralleldrive/cuid2';
import { EventEmitter } from 'eventemitter3';
import PQueue from 'p-queue';

declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace browserAction {
            export interface TitleDetails {
                windowId?: number;
            }
        }
        export namespace contextMenus {
            export enum ContextType {
                TAB = 'tab',
            }

            export interface OnShownData extends Browser.contextMenus.OnClickData {
                contexts: ContextType[];
                menuIds: (string | number)[];
            }

            export function refresh(): Promise<void>;

            export const onShown: Browser.events.Event<(info: OnShownData, tab: Browser.tabs.Tab | undefined) => void>;
        }
        export namespace tabs {
            interface Tab {
                hidden: boolean;
            }

            export function hide(tabIds: number | number[]): Promise<void>;
            export function show(tabIds: number | number[]): Promise<void>;
        }
    }
}

function mod(a: number, b: number): number {
    return ((a % b) + b) % b;
}

export class WorkspacesManager extends EventEmitter<{
    workspacesChanged: [Workspace[]];
    tabDataChanged: [TabId];
    windowDataChanged: [WindowId];
}> {
    public readonly initialized: Promise<WorkspacesManager>;

    private readonly storageQueue = new PQueue({ concurrency: 1 });
    private readonly sessionQueue = new PQueue({ concurrency: 1 });
    private readonly activationQueue = new PQueue({ concurrency: 1 });
    private readonly redrawQueue = new PQueue({ concurrency: 1 });

    private workspaces!: Workspace[];

    constructor() {
        super();

        this.initialized = (async () => {
            await this.initializeData();

            this.setupContextMenu();
            this.registerEventListeners();

            this.updateTitles();

            return this;
        })();
    }

    private async initializeData(): Promise<void> {
        await this.storageQueue.add(async () => {
            this.workspaces = (await localExtStorage.getItem('workspaces')) ?? [
                {
                    id: DEFAULT_WORKSPACE_ID,
                    name: 'Default',
                },
            ];
            this.storeData();
        });

        await this.sessionQueue.add(async () => {
            await Promise.all([
                browser.tabs.query({ pinned: false }).then((tabs) =>
                    Promise.all(
                        tabs.map(async (tab) => {
                            await updateTabData(
                                tab.id!,
                                'workspaceId',
                                (workspaceId) => workspaceId ?? DEFAULT_WORKSPACE_ID,
                            );

                            if (tab.active) {
                                await setTabData(tab.id!, 'isActiveTab', true);
                            }
                        }),
                    ),
                ),
                browser.windows.getAll().then((windows) =>
                    Promise.all(
                        windows.map(async (window) => {
                            await updateWindowData(
                                window.id!,
                                'workspaceId',
                                (workspaceId) => workspaceId ?? DEFAULT_WORKSPACE_ID,
                            );
                        }),
                    ),
                ),
            ]);
        });
    }

    private setupContextMenu(): void {
        browser.contextMenus.create({
            id: CONTEXT_MENU_ID,
            title: t('menu.title'),
            contexts: ['tab'],
        });

        const menuItems: string[] = [];
        browser.contextMenus.onShown.addListener(async (info, tab) => {
            if (info.menuIds.includes(CONTEXT_MENU_ID)) {
                let menuItem;
                while ((menuItem = menuItems.pop())) {
                    browser.contextMenus.remove(menuItem);
                }

                const workspaceId = await getTabData(tab!.id!, 'workspaceId')!;
                for (const workspace of this.workspaces) {
                    const id = zMenuItemId.encode(workspace.id);
                    menuItems.push(id);
                    browser.contextMenus.create({
                        id,
                        parentId: CONTEXT_MENU_ID,
                        title: workspace.name,
                        contexts: ['tab'],
                        enabled: workspace.id !== workspaceId,
                    });
                }

                browser.contextMenus.refresh();
            }
        });
        browser.contextMenus.onClicked.addListener(async (info, tab) => {
            const workspaceId = zMenuItemId.safeParse(info.menuItemId);
            if (workspaceId.success) {
                const windowId = tab!.windowId!,
                    tabs = tab!.highlighted
                        ? await browser.tabs.query({ windowId, pinned: false, highlighted: true })
                        : [tab!];
                await Promise.all(
                    tabs.map(async (tab) => {
                        await setTabData(tab.id!, 'workspaceId', workspaceId.data);
                        this.emit('tabDataChanged', tab.id!);
                    }),
                );
                this.redraw();
            }
        });
    }

    private registerEventListeners(): void {
        browser.tabs.onCreated.addListener(async (tab) => {
            if (!tab.pinned) {
                const workspaceId = await updateTabData(tab.id!, 'workspaceId', async (workspaceId) =>
                    workspaceId && tab.hidden
                        ? workspaceId
                        : ((await getWindowData(tab.windowId!, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID),
                );
                this.emit('tabDataChanged', tab.id!);
                if (tab.active) {
                    this.updateActiveTab(tab.id!, tab.windowId!, workspaceId!);
                    this.storeData();
                }
            }
        });
        browser.tabs.onAttached.addListener(async (tabId, { newWindowId }) => {
            const workspaceId = (await getWindowData(newWindowId!, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID;

            await setTabData(tabId, 'workspaceId', workspaceId);
            this.emit('tabDataChanged', tabId);

            if ((await browser.tabs.get(tabId).catch(() => null))?.active) {
                this.updateActiveTab(tabId, newWindowId, workspaceId);
            }
        });
        browser.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
            const workspaceId = await getTabData(tabId, 'workspaceId');
            if (workspaceId) {
                this.updateActiveTab(tabId, windowId, workspaceId);
            }
        });
        browser.tabs.onUpdated.addListener(async (tabId, onUpdateInfo) => {
            if ('pinned' in onUpdateInfo) {
                if (onUpdateInfo.pinned) {
                    await removeTabData(tabId, 'workspaceId');
                } else {
                    const tab = await browser.tabs.get(tabId);
                    await setTabData(
                        tabId,
                        'workspaceId',
                        (await getWindowData(tab.windowId!, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID,
                    );
                }
                this.emit('tabDataChanged', tabId);
            }
        });

        browser.windows.onCreated.addListener(async (window) => {
            await updateWindowData(window.id!, 'workspaceId', (workspaceId) => workspaceId ?? DEFAULT_WORKSPACE_ID);
            this.emit('windowDataChanged', window.id!);
            this.updateTitles();
        });

        browser.commands.onCommand.addListener(async (command, tab) => {
            if (tab) {
                const { windowId } = tab;
                switch (command) {
                    case 'switchToRelative+1':
                    case 'switchToRelative-1':
                    case 'moveTabToRelative+1':
                    case 'moveTabToRelative-1':
                        const workspaceId = this.getRelativeWorkspace(
                            (await getWindowData(tab.windowId!, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID,
                            parseInt(command.slice(-2)),
                        ).id;
                        switch (command.slice(0, -10)) {
                            case 'switchTo':
                                await setWindowData(windowId, 'workspaceId', workspaceId);
                                this.emit('windowDataChanged', windowId);
                                break;
                            case 'moveTabTo':
                                await setTabData(tab.id!, 'workspaceId', workspaceId);
                                this.emit('tabDataChanged', tab.id!);
                                break;
                        }
                        break;
                    case 'switchToIndex0':
                    case 'switchToIndex1':
                    case 'switchToIndex2':
                    case 'switchToIndex3':
                    case 'switchToIndex4':
                    case 'switchToIndex5':
                    case 'switchToIndex6':
                    case 'switchToIndex7':
                    case 'switchToIndex8':
                    case 'switchToIndex9':
                    case 'moveTabToIndex0':
                    case 'moveTabToIndex1':
                    case 'moveTabToIndex2':
                    case 'moveTabToIndex3':
                    case 'moveTabToIndex4':
                    case 'moveTabToIndex5':
                    case 'moveTabToIndex6':
                    case 'moveTabToIndex7':
                    case 'moveTabToIndex8':
                    case 'moveTabToIndex9':
                        const workspace = this.workspaces[parseInt(command.slice(-1))];
                        if (workspace) {
                            switch (command.slice(0, -6)) {
                                case 'switchTo':
                                    await setWindowData(windowId, 'workspaceId', workspace.id);
                                    this.emit('windowDataChanged', windowId);
                                    break;
                                case 'moveTabTo':
                                    await setTabData(tab.id!, 'workspaceId', workspace.id);
                                    this.emit('tabDataChanged', tab.id!);
                                    break;
                            }
                        }
                        break;
                }
                this.redraw();
                this.updateTitles();
            }
        });
    }

    private getData(): {
        workspaces: Workspace[];
    } {
        return structuredClone({
            workspaces: this.workspaces,
        });
    }

    private async storeData(): Promise<void> {
        const { workspaces } = this.getData();
        await this.storageQueue.add(async () => {
            await Promise.all([localExtStorage.setItem('workspaces', workspaces)]);
        });
    }

    private async updateActiveTab(tabId: TabId, windowId: WindowId, workspaceId: WorkspaceId): Promise<void> {
        await this.activationQueue.add(async () => {
            await Promise.all(
                (await browser.tabs.query({ windowId })).map(async (tab) => {
                    const tabWorkspaceId = (await getTabData(tab.id!, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID;
                    if (tabWorkspaceId === workspaceId) {
                        await setTabData(tab.id!, 'isActiveTab', tab.id === tabId);
                    }
                }),
            );
        });
    }

    getWorkspaces(): Workspace[] {
        return this.workspaces;
    }

    getRelativeWorkspace(workspaceId: WorkspaceId, relative: number): Workspace {
        const index = this.workspaces.findIndex((workspace) => workspace.id === workspaceId);
        return this.workspaces[mod(index + relative, this.workspaces.length)]!;
    }

    async getActiveWorkspaceForWindow(windowId: WindowId): Promise<WorkspaceId> {
        return (await getWindowData(windowId, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID;
    }

    createWorkspace(workspace: Omit<Workspace, 'id'>): void {
        this.workspaces.push({
            id: createId(),
            ...workspace,
        });
        this.emit('workspacesChanged', this.workspaces);
        this.storeData();
    }

    updateWorkspace(workspace: Workspace): void {
        this.workspaces = this.workspaces.map((ws) => (ws.id === workspace.id ? workspace : ws));
        this.emit('workspacesChanged', this.workspaces);
        this.storeData();
    }

    moveWorkspace(workspaceId: WorkspaceId, direction: -1 | 1): void {
        const i = this.workspaces.findIndex((workspace) => workspace.id === workspaceId);
        [this.workspaces[i], this.workspaces[i + direction]] = [this.workspaces[i + direction], this.workspaces[i]];
        this.emit('workspacesChanged', this.workspaces);
        this.storeData();
    }

    async deleteWorkspace(workspaceId: WorkspaceId): Promise<void> {
        if (workspaceId !== DEFAULT_WORKSPACE_ID) {
            this.workspaces = this.workspaces.filter((workspace) => workspace.id !== workspaceId);
            this.emit('workspacesChanged', this.workspaces);
            this.storeData();

            await Promise.all([
                browser.tabs.query({ pinned: false }).then((tabs) =>
                    Promise.all(
                        tabs.map(async (tab) => {
                            if ((await getTabData(tab.id!, 'workspaceId')) === workspaceId) {
                                await setTabData(tab.id!, 'workspaceId', DEFAULT_WORKSPACE_ID);
                                this.emit('tabDataChanged', tab.id!);
                            }
                        }),
                    ),
                ),
                browser.windows.getAll().then((windows) =>
                    Promise.all(
                        windows.map(async (window) => {
                            if ((await getWindowData(window.id!, 'workspaceId')) === workspaceId) {
                                await setWindowData(window.id!, 'workspaceId', DEFAULT_WORKSPACE_ID);
                                this.emit('windowDataChanged', window.id!);
                            }
                        }),
                    ),
                ),
            ]);
            this.redraw();
            this.updateTitles();
        }
    }

    async switchWorkspace(windowId: WindowId, workspaceId: WorkspaceId): Promise<void> {
        await setWindowData(windowId, 'workspaceId', workspaceId);
        this.emit('windowDataChanged', windowId);
        this.redraw();
        this.updateTitles();
    }

    private async redraw() {
        await this.redrawQueue.add(async () => {
            await Promise.all(
                (await browser.windows.getAll()).map(async (window) => {
                    const windowId = window.id!,
                        tabs = await browser.tabs.query({ windowId: windowId, pinned: false }),
                        workspaceId = (await getWindowData(windowId, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID,
                        tabsToShow: number[] = [],
                        tabsToHide: number[] = [];
                    let activeTab: number | null = null;

                    await Promise.all(
                        tabs.map(async (tab) => {
                            const [tabWorkspaceId, isActiveTab] = await Promise.all([
                                getTabData(tab.id!, 'workspaceId'),
                                getTabData(tab.id!, 'isActiveTab'),
                            ]);
                            if ((tabWorkspaceId ?? DEFAULT_WORKSPACE_ID) === workspaceId) {
                                tabsToShow.push(tab.id!);
                                if (isActiveTab) {
                                    activeTab = tab.id!;
                                }
                            } else {
                                tabsToHide.push(tab.id!);
                            }
                        }),
                    );

                    await browser.tabs.show(tabsToShow);

                    if (activeTab) {
                        await browser.tabs.update(activeTab, { active: true });
                    } else if (tabsToShow.length > 0) {
                        await browser.tabs.update(tabsToShow[0], { active: true });
                    } else {
                        await browser.tabs.create({ windowId, active: true });
                    }

                    await browser.tabs.hide(tabsToHide);
                }),
            );
        });
    }

    private async updateTitles() {
        await Promise.all(
            (await browser.windows.getAll()).map(async (window) => {
                const windowId = window.id!,
                    workspaceId = (await getWindowData(windowId, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID,
                    workspace = this.workspaces.find((workspace) => workspace.id === workspaceId);

                browser.browserAction.setTitle({
                    title: workspace?.name ?? '',
                    windowId,
                });
            }),
        );
    }
}

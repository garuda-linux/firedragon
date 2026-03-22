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

export class WorkspacesManager extends EventEmitter<{
    workspacesChanged: [Workspace[]];
    tabDataChanged: [TabId];
    windowDataChanged: [WindowId];
}> {
    public readonly initialized: Promise<WorkspacesManager>;

    private readonly storageQueue = new PQueue({ concurrency: 1 });
    private readonly sessionQueue = new PQueue({ concurrency: 1 });
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
                            const workspaceId = await updateTabData(
                                tab.id!,
                                'workspaceId',
                                (workspaceId) => workspaceId ?? DEFAULT_WORKSPACE_ID,
                            );

                            if (tab.active) {
                                await updateWindowData(tab.windowId!, 'activeTabs', (activeTabs) => ({
                                    ...(activeTabs ?? {}),
                                    [workspaceId]: tab.id!,
                                }));
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
                    if (workspace.id !== workspaceId) {
                        const id = zMenuItemId.encode(workspace.id);
                        menuItems.push(id);
                        browser.contextMenus.create({
                            id,
                            parentId: CONTEXT_MENU_ID,
                            title: workspace.name,
                            contexts: ['tab'],
                        });
                    }
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
                    await updateWindowData(tab.windowId!, 'activeTabs', (activeTabs) => ({
                        ...(activeTabs ?? {}),
                        [workspaceId]: tab.id!,
                    }));
                    this.emit('windowDataChanged', tab.windowId!);
                }
            }
        });
        browser.tabs.onAttached.addListener(async (tabId, { newWindowId }) => {
            await setTabData(
                tabId,
                'workspaceId',
                (await getWindowData(newWindowId!, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID,
            );
            this.emit('tabDataChanged', tabId);
        });
        browser.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
            const workspaceId = await getTabData(tabId, 'workspaceId');
            if (workspaceId) {
                updateWindowData(windowId, 'activeTabs', (activeTabs) => ({
                    ...(activeTabs ?? {}),
                    [workspaceId]: tabId,
                }));
                this.emit('windowDataChanged', windowId);
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

    getWorkspaces(): Workspace[] {
        return this.workspaces;
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

                    await Promise.all(
                        tabs.map(async (tab) => {
                            if (((await getTabData(tab.id!, 'workspaceId')) ?? DEFAULT_WORKSPACE_ID) === workspaceId) {
                                tabsToShow.push(tab.id!);
                            } else {
                                tabsToHide.push(tab.id!);
                            }
                        }),
                    );

                    await browser.tabs.show(tabsToShow);

                    const activeTab = (await getWindowData(windowId, 'activeTabs'))?.[workspaceId];
                    if (
                        activeTab &&
                        tabsToShow.includes(activeTab) &&
                        (await browser.tabs.get(activeTab).catch(() => null))
                    ) {
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

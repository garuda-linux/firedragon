declare module '@wxt-dev/browser' {
    export namespace Browser {
        export namespace sessions {
            export function getTabValue(tabId: number, key: string): Promise<any>;
            export function getWindowValue(windowId: number, key: string): Promise<any>;
            export function removeTabValue(tabId: number, key: string): Promise<void>;
            export function removeWindowValue(windowId: number, key: string): Promise<void>;
            export function setTabValue(tabId: number, key: string, value: any): Promise<void>;
            export function setWindowValue(windowId: number, key: string, value: any): Promise<void>;
        }
    }
}

export interface TabData {
    workspaceId: WorkspaceId;
}
export interface WindowData {
    workspaceId: WorkspaceId;
    activeTabs: Record<WorkspaceId, TabId>;
}

export function getTabData<K extends keyof TabData>(tabId: TabId, key: K): Promise<TabData[K] | undefined> {
    return browser.sessions.getTabValue(tabId, key);
}
export function getWindowData<K extends keyof WindowData>(
    windowId: WindowId,
    key: K,
): Promise<WindowData[K] | undefined> {
    return browser.sessions.getWindowValue(windowId, key);
}
export async function removeTabData(tabId: TabId, key: keyof TabData): Promise<void> {
    await browser.sessions.removeTabValue(tabId, key);
}
export async function removeWindowData(windowId: WindowId, key: keyof WindowData): Promise<void> {
    await browser.sessions.removeWindowValue(windowId, key);
}
export async function setTabData<K extends keyof TabData>(tabId: TabId, key: K, value: TabData[K]): Promise<void> {
    await browser.sessions.setTabValue(tabId, key, value);
}
export async function setWindowData<K extends keyof WindowData>(
    windowId: WindowId,
    key: K,
    value: WindowData[K],
): Promise<void> {
    await browser.sessions.setWindowValue(windowId, key, value);
}
export async function updateTabData<K extends keyof TabData>(
    tabId: TabId,
    key: K,
    update: (value: TabData[K] | undefined) => TabData[K] | Promise<TabData[K]>,
): Promise<TabData[K]> {
    const value = await update(await getTabData(tabId, key));
    await setTabData(tabId, key, value);
    return value;
}
export async function updateWindowData<K extends keyof WindowData>(
    windowId: WindowId,
    key: K,
    update: (value: WindowData[K] | undefined) => WindowData[K] | Promise<WindowData[K]>,
): Promise<WindowData[K]> {
    const value = await update(await getWindowData(windowId, key));
    await setWindowData(windowId, key, value);
    return value;
}

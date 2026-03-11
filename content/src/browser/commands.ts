import { h, insertBefore } from '@/utils/render.ts';

const COMMANDS: Record<string, (window: Window, e: Event) => void> = {
    firedragon_duplicateTab: ({ gBrowser }) => {
        gBrowser.duplicateTab(gBrowser.selectedTab);
    },
    firedragon_openHomePage: ({ BrowserCommands }) => {
        BrowserCommands.home();
    },
    firedragon_openPreferences: ({ openPreferences }) => {
        openPreferences();
    },
    firedragon_openPreferencesPrivacy: ({ openPreferences }) => {
        openPreferences('panePrivacy');
    },
    firedragon_openPreferencesSearch: ({ openPreferences }) => {
        openPreferences('paneSearch');
    },
    firedragon_openPreferencesSync: ({ openPreferences }) => {
        openPreferences('paneSync');
    },
    firedragon_reloadAllTabs: ({ gBrowser }) => {
        gBrowser.reloadTabs(gBrowser.tabs);
    },
    firedragon_sidebarHide: ({ SidebarController }) => {
        SidebarController.hide();
    },
    firedragon_sidebarReversePosition: ({ SidebarController }) => {
        SidebarController.reversePosition();
    },
    firedragon_sidebarToggle: ({ SidebarController }) => {
        SidebarController.toggle();
    },
    firedragon_viewBookmarksSidebar: ({ SidebarController }) => {
        SidebarController.toggle('viewBookmarksSidebar');
    },
    firedragon_viewBookmarksToolbar: ({ BookmarkingUI }) => {
        BookmarkingUI.toggleBookmarksToolbar('shortcut');
    },
    firedragon_viewHistorySidebar: ({ SidebarController }) => {
        SidebarController.toggle('viewHistorySidebar');
    },
    firedragon_viewTabsSidebar: ({ SidebarController }) => {
        SidebarController.toggle('viewTabsSidebar');
    },
};

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        const commandSet = h('xul:commandset', { id: 'firedragonCommandSet' });

        commandSet.addEventListener('command', (event: Event) => {
            for (const [id, action] of Object.entries(COMMANDS)) {
                if (id === (event.target as Element).id) {
                    action(window, event);
                }
            }
        });

        for (const id of Object.keys(COMMANDS)) {
            commandSet.append(h('xul:command', { id }));
        }

        insertBefore(commandSet, document!.querySelector('#mainCommandSet')!.nextSibling!);
    },
    { once: true },
);

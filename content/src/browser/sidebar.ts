import type { SidebarUrl } from '@firedragon/shared/src/types/sidebar.ts';
import { effect } from '@vue/reactivity';
import PQueue from 'p-queue';

import { useStringPref } from '@/composables/usePref.ts';

const { ExtensionUtils } = ChromeUtils.importESModule('resource://gre/modules/ExtensionUtils.sys.mjs');

window!.addEventListener(
    'DOMContentLoaded',
    () => {
        const { SidebarController } = window;

        const sidebarUrls = useStringPref('firedragon.sidebar.urls', '[]');

        const queue = new PQueue({ concurrency: 1 });
        let added = new Set<string>();
        effect(() => {
            queue.add(async () => {
                const urls: SidebarUrl[] = await Promise.all(
                    JSON.parse(sidebarUrls.value).map(async ({ icon, iconUrl, url, ...rest }: SidebarUrl) => {
                        if (icon === 'default') {
                            iconUrl = `https://icons.duckduckgo.com/ip2/${Services.io.newURI(url).host}.ico`;
                        }
                        iconUrl = await ExtensionUtils.makeDataURI(iconUrl);
                        return {
                            icon,
                            iconUrl,
                            url,
                            ...rest,
                        } as SidebarUrl;
                    }),
                );

                const toRemove = new Set(added);
                for (const { id, name, iconUrl, url, userContextId = 0 } of urls) {
                    added.add(id);
                    toRemove.delete(id);
                    const urlSearchParams = new URLSearchParams();
                    urlSearchParams.set('url', url);
                    urlSearchParams.set('userContextId', userContextId.toString());
                    SidebarController.sidebars.set(id, {
                        name: id,
                        title: name,
                        url: 'chrome://firedragon/content/sidebar.xhtml?' + urlSearchParams.toString(),
                        menuId: `menu_${id}`,
                        label: name,
                        icon: `url(${iconUrl})`,
                        iconUrl,
                        extensionId: id,
                    });
                    SidebarController.toolsAndExtensions.set(id, {
                        name: id,
                        view: id,
                        extensionId: id,
                        icon: `url(${iconUrl})`,
                        iconUrl,
                        tooltiptext: name,
                        disabled: false,
                    });
                }
                for (const id of toRemove) {
                    SidebarController.sidebars.delete(id);
                    SidebarController.toolsAndExtensions.delete(id);
                }
                window.dispatchEvent(new CustomEvent('SidebarItemChanged'));
            });
        });
    },
    { once: true },
);

import { AboutNewTab as BrowserAboutNewTab } from 'resource:///modules/AboutNewTab.sys.mjs';

export const AboutNewTab = {
    init() {
        BrowserAboutNewTab.newTabURL = 'about:firedragon-newtab';
    },
};

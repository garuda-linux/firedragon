import { Injectable } from '@angular/core';

import { AboutNewTab } from 'resource:///modules/AboutNewTab.sys.mjs';

@Injectable({
    providedIn: 'root',
})
export default class TopPagesService {
    getTopSites() {
        return AboutNewTab.getTopSites();
    }
}

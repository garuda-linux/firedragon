import { createApp as _createApp, h, type App } from '@firedragon13/lib-vue-runtime';

import i18n from '@/i18n';

export function createApp(...args: Parameters<typeof _createApp>): App {
    const app = _createApp(...args);

    app.use(i18n);

    return app;
}

export function mountBefore(app: App, parent: Element | string, marker: Element | string) {
    if (typeof parent === 'string') {
        parent = document!.querySelector(parent)!;
    }
    if (typeof marker === 'string') {
        marker = document!.querySelector(marker)!;
    }

    const fragment = document!.createDocumentFragment();
    app.mount(fragment);
    parent.insertBefore(fragment, marker)
}

export { h };

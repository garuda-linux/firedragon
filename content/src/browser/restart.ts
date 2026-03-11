import { t } from '@/utils/i18n.ts';
import { h, insertBefore } from '@/utils/render.ts';

document!.addEventListener(
    'DOMContentLoaded',
    () => {
        const fragment = (document!.querySelector('#appMenu-viewCache') as HTMLTemplateElement).content;

        fragment.append(
            h('xul:panelview', { id: 'PanelUI-restart' }, [
                h('xul:vbox', { class: 'panel-subview-body' }, [
                    h('xul:toolbarbutton', {
                        closemenu: 'none',
                        class: 'subviewbutton',
                        label: t('browser.restart.normalRestart'),
                        on: {
                            command() {
                                Services.startup.quit(Ci.nsIAppStartup.eForceQuit! | Ci.nsIAppStartup.eRestart!);
                            },
                        },
                    }),
                    h('xul:toolbarseparator'),
                    h('xul:toolbarbutton', {
                        closemenu: 'none',
                        class: 'subviewbutton',
                        label: t('browser.restart.clearCacheRestart'),
                        on: {
                            command() {
                                Services.appinfo.invalidateCachesOnRestart();
                                Services.startup.quit(Ci.nsIAppStartup.eAttemptQuit! | Ci.nsIAppStartup.eRestart!);
                            },
                        },
                    }),
                    h('xul:toolbarbutton', {
                        closemenu: 'none',
                        class: 'subviewbutton',
                        label: t('browser.restart.safeModeRestart'),
                        on: {
                            command() {
                                Services.obs.notifyObservers(window as nsISupports, 'restart-in-safe-mode');
                            },
                        },
                    }),
                ]),
            ]),
        );

        insertBefore(
            h('xul:toolbarbutton', {
                closemenu: 'none',
                class: 'subviewbutton subviewbutton-nav',
                label: t('browser.restart.label'),
                on: {
                    command(e: Event) {
                        window.PanelUI.showSubView('PanelUI-restart', e.target);
                    },
                },
            }),
            fragment.querySelector('#appMenu-quit-button2')!,
        );
    },
    { once: true },
);

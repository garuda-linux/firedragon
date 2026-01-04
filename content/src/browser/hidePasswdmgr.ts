document!.addEventListener(
    'DOMContentLoaded',
    () => {
        if (Services.prefs.getBoolPref('firedragon.hidePasswdmgr')) {
            window.PanelMultiView.getViewNode(document, 'appMenu-passwords-button').remove();
        }
    },
    { once: true },
);

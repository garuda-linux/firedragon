import Component from "@/Component.ts";

window.fdHidePasswdmgr = new class extends Component {
    init() {
        if (Services.prefs.getBoolPref('firedragon.hidePasswdmgr')) {
            window.PanelMultiView.getViewNode(document, 'appMenu-passwords-button').remove();
        }
    }
};

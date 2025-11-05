import Component from "@/Component";

window.fdHidePasswdmgr = new class extends Component {
    init() {
        if (Services.prefs.getBoolPref('firedragon.hidePasswdmgr')) {
            setTimeout(() => {
                document!.querySelector('#passwordsGroup')!.remove();
            });
        }
    }
};

document!.addEventListener('paneshown', function listener(e: CustomEvent) {
    if (e.detail.category === 'panePrivacy' && Services.prefs.getBoolPref('firedragon.hidePasswdmgr')) {
        document!.removeEventListener('paneshown', listener);
        document!.querySelector('#passwordsGroup')!.remove();
    }
});

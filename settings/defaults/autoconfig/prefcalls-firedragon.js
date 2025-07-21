/* global gSandbox, displayError */

function getPath(prop) {
    try {
        return Services.dirsvc.get(prop, Ci.nsIFile).path;
    } catch (e) {
        displayError('getPath', e);
    }
    return undefined;
}
Cu.exportFunction(getPath, gSandbox, { defineAs: 'getPath' });

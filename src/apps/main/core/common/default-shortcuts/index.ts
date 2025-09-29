/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { noraComponent, NoraComponentBase } from "@core/utils/base";

@noraComponent(import.meta.hot)
export default class DefaultShortcuts extends NoraComponentBase {
    static PREF = 'firedragon.defaultShortcuts.enable';
    static PREF_DEFAULT = true;

    static FLOORP_PREF = 'floorp.custom.shortcutkeysandactions.remove.fx.actions';

    elements: NodeListOf<Element>;

    init() {
        // Migrate old Floorp pref to FireDragon pref
        if (Services.prefs.prefHasUserValue(DefaultShortcuts.FLOORP_PREF)) {
            Services.prefs.setBoolPref(DefaultShortcuts.PREF, !Services.prefs.getBoolPref(DefaultShortcuts.FLOORP_PREF));
            Services.prefs.clearUserPref(DefaultShortcuts.FLOORP_PREF);
        }

        document.addEventListener('DOMContentLoaded', () => {
            this.elements = document.querySelectorAll('#mainKeyset > *');
            if (!this.getPref()) {
                this.disable();
            }
            Services.prefs.addObserver(DefaultShortcuts.PREF, () => {
                if (this.getPref()) {
                    this.enable();
                } else {
                    this.disable();
                }
            });
        });
    }

    getPref(): boolean {
        return Services.prefs.getBoolPref(DefaultShortcuts.PREF, DefaultShortcuts.PREF_DEFAULT);
    }

    enable() {
        this.elements.forEach((element) => {
            element.setAttribute('disabled', false);
        });
    }

    disable() {
        this.elements.forEach((element) => {
            element.setAttribute('disabled', true);
        });
    }
}

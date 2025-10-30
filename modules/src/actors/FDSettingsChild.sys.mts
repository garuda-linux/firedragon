export class FDSettingsChild extends JSWindowActorChild {
    static init() {
        ChromeUtils.registerWindowActor('FDSettings', {
            child: {
                esModuleURI: 'resource://firedragon/actors/FDSettingsChild.sys.mjs',
                events: {
                    DOMContentLoaded: {},
                },
            },
            matches: ['about:preferences*', 'about:settings*'],
        });
    }

    handleEvent() {
        const fragment: DocumentFragment = this.contentWindow!.MozXULElement.parseXULToFragment(`
            <richlistitem
                class="category"
                align="center"
                tooltiptext="FireDragon Settings"
            >
                <image class="category-icon" src="chrome://branding/content/about-logo.png" />
                <label class="category-name" flex="1">FireDragon Settings</label>
            </richlistitem>
        `);
        fragment.querySelector('richlistitem')?.addEventListener('click', () => {
            this.contentWindow!.location.href = 'about:firedragon-settings';
        });

        this.contentWindow!.document!.querySelector('#categories')!.append(fragment);
    }
}

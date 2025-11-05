import Component from "@/Component";

window.fdSettings = new class extends Component {
    init() {
        const fragment: DocumentFragment = window.MozXULElement.parseXULToFragment(`
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
            location.href = 'about:firedragon-settings';
        });

        document!.querySelector('#categories')!.append(fragment);
    }
};

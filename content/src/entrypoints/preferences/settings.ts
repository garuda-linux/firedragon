import Component from "@/Component";
import { t } from '@/i18n.ts';

window.fdSettings = new class extends Component {
    init() {
        const fragment: DocumentFragment = window.MozXULElement.parseXULToFragment(`
            <richlistitem
                class="category"
                align="center"
                tooltiptext="FireDragon Settings"
            >
                <image class="category-icon" src="chrome://branding/content/about-logo.png" />
                <label class="category-name" flex="1">${t('settings.label')}</label>
            </richlistitem>
        `);
        fragment.querySelector('richlistitem')?.addEventListener('click', () => {
            location.href = 'about:firedragon-settings';
        });

        document!.querySelector('#categories')!.append(fragment);
    }
};

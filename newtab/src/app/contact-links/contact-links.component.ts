import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Panel } from 'primeng/panel';

import { contactLinks } from '../../config';
import type { ContactLinks } from '../types';

@Component({
    selector: 'app-contact-links',
    imports: [Panel],
    templateUrl: './contact-links.component.html',
    styleUrl: './contact-links.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLinksComponent {
    contactLinks = signal<ContactLinks>(contactLinks);
}

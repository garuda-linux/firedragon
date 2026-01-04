import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ConfigService } from '../../config/config.service';
import { ContactLinksComponent } from '../contact-links/contact-links.component';
import { JokesComponent } from '../jokes/jokes.component';
import { LinksComponent } from '../links/links.component';
import { SearchComponent } from '../search/search.component';
import { TopPagesComponent } from '../top-pages/top-pages.component';

@Component({
    selector: 'app-home',
    imports: [CommonModule, SearchComponent, JokesComponent, LinksComponent, ContactLinksComponent, TopPagesComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    protected readonly configService = inject(ConfigService);
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslocoDirective } from "@jsverse/transloco";
import { ConfigService } from "../../config/config.service";
import { Button } from "primeng/button";
import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
} from "primeng/autocomplete";
import type { SearchEngine } from "./interfaces";

@Component({
  selector: "app-search",
  imports: [
    FormsModule,
    NgOptimizedImage,
    TranslocoDirective,
    Button,
    AutoComplete,
  ],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  searchEngine = signal<SearchEngine | null>(null);
  searchTerm = signal<string>("");
  suggestions = signal<string[]>([]);

  protected readonly configService = inject(ConfigService);
  logoSource = computed(() => {
    if (this.configService.settings().logo === "custom") {
      return this.configService.settings().logoUrl;
    } else if (this.configService.settings().logo === "none") {
      return this.configService.settings().logo;
    } else {
      return "chrome://branding/content/about-logo.png";
    }
  });

  ngOnInit(): void {
    FDSearchEngine.GetDefaultEngine().then((value) => {
      this.searchEngine.set(value);
    });
  }

  /**
   * Open the search engine URL in a new tab with the search term.
   */
  async search() {
    const searchEngine = this.searchEngine();
    if (searchEngine) {
      await FDSearchEngine.PerformSearch(searchEngine.id, this.searchTerm());

      this.searchTerm.set("");
      this.suggestions.set([]);
    }
  }

  /**
   * Handle the autocomplete event and update the suggestions.
   * @param $event The autocomplete event.
   */
  async autocomplete($event: AutoCompleteCompleteEvent) {
    const searchEngine = this.searchEngine();
    if (searchEngine) {
      const suggestions = await FDSearchEngine.FetchSuggestions(
        searchEngine.id,
        this.searchTerm(),
      );
      this.suggestions.set([
        ...suggestions.local,
        ...suggestions.remote,
      ].map((entry) => entry.value));
    } else {
      this.suggestions.set([]);
    }
  }
}

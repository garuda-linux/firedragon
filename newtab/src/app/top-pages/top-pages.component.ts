import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { TopPage } from "./interfaces";
import { Panel } from "primeng/panel";
import { ConfigService } from "../../config/config.service";
import TopPagesService from "./top-pages.service";

@Component({
  selector: "app-top-pages",
  templateUrl: "./top-pages.component.html",
  styleUrl: "./top-pages.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Panel,
  ],
})
export class TopPagesComponent implements OnInit {
  protected readonly configService = inject(ConfigService);
  protected readonly topPagesService = inject(TopPagesService);

  gridCols = computed(() =>
    `col-span-${this.configService.settings().gridCols} cursor-pointer p-2 text-center`
  );
  pages = signal<TopPage[]>([]);

  ngOnInit(): void {
    this.fetchTopPages();

    setInterval(() => {
      this.fetchTopPages();
    }, 30000);
  }

  fetchTopPages(): void {
      this.pages.set(this.topPagesService.getTopSites());
  }

  /**
   * Sorts the top pages by frecency in descending order.
   * @param topPages The array of top pages to sort.
   */
  prepareTopPages(topPages: TopPage[]): TopPage[] {
    return topPages
      .sort((a, b) => b.frecency - a.frecency)
      .map((page) => {
        return {
          ...page,
          title: page.title.length > 20
            ? `${page.title.slice(0, 20)}...`
            : page.title,
          favicon: page.favicon ||
            "chrome://branding/content/about-logo.png",
        };
      })
      .slice(0, this.configService.settings().topPagesLimit);
  }
}

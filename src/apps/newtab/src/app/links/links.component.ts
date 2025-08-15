import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import type { ServiceLinks } from "../types";
import { serviceLinks } from "../../config";
import { ConfigService } from "../../config/config.service";
import { Panel } from "primeng/panel";

@Component({
  selector: "app-links",
  imports: [Panel],
  templateUrl: "./links.component.html",
  styleUrl: "./links.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinksComponent {
  links = signal<ServiceLinks>(serviceLinks);

  protected readonly configService = inject(ConfigService);

  gridCols = computed(() =>
    `col-span-${this.configService.settings().gridCols} cursor-pointer p-2 text-center`
  );
}

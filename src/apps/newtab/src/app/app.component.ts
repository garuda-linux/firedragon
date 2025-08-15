import { NgClass, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  type OnInit,
  Renderer2,
  signal,
} from "@angular/core";
import { RouterModule, type RouterOutlet } from "@angular/router";
import { ScrollTop } from "primeng/scrolltop";
import { routeAnimations } from "./app.routes";
import { TranslocoDirective, TranslocoService } from "@jsverse/transloco";
import { MessageToastService, ShellComponent } from "@garudalinux/core";
import { ConfigService } from "../config/config.service";
import { menubarItems } from "../config";
import type { MenuBarLink } from "./types";
import { Avatar } from "primeng/avatar";
import type { ToastMessageOptions } from "primeng/api";

@Component({
  imports: [
    RouterModule,
    NgOptimizedImage,
    ScrollTop,
    ShellComponent,
    TranslocoDirective,
    Avatar,
    NgClass,
  ],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageToastService],
})
export class AppComponent implements OnInit {
  items = signal<MenuBarLink[]>(menubarItems);

  protected readonly configService = inject(ConfigService);

  logoLink = computed(() => {
    if (this.configService.settings().logo === "custom") {
      return this.configService.settings().logoUrl;
    }
    if (this.configService.settings().logo === "none") {
      return this.configService.settings().logo;
    }
    return "chrome://branding/content/about-logo.png";
  });

  private readonly el = inject(ElementRef);
  private readonly messageToastService = inject(MessageToastService);
  private readonly renderer = inject(Renderer2);
  private readonly translocoService = inject(TranslocoService);

  welcomeText = computed<string>(() => {
    const user: string = this.configService.settings().username !== ""
      ? this.configService.settings().username
      : this.translocoService.translate("menu.defaultUser");
    if (this.configService.settings().welcomeText !== "") {
      return `${this.configService.settings().welcomeText} ${user}!`;
    }
    return this.translocoService.translate("menu.welcome", { user });
  });

  async ngOnInit(): Promise<void> {
    while (!this.configService.initialized()) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.configService.initConfig(this.renderer, this.el);
  }

  /**
   * Returns the animation state of the next page for page transitions
   * @param outlet Router outlet element
   * @returns The animation state of the target route
   */
  prepareRoute(outlet: RouterOutlet): string {
    return outlet.activatedRouteData["animationState"];
  }

  /**
   * Display an easter egg message ;)
   */
  displayEasterEgg() {
    const oneToSix: number = Math.floor(Math.random() * 5) + 1;
    const oneToTwenty: number = Math.floor(Math.random() * 20) + 1;

    const title: string = this.translocoService.translate(
      `easterEggs.easterEgg${oneToTwenty}.title`,
    );
    const content: string = this.translocoService.translate(
      `easterEggs.easterEgg${oneToTwenty}.content`,
    );
    const options: ToastMessageOptions = {
      sticky: true,
      life: 10000,
      icon: "pi pi-spinner pi-spin",
    };

    switch (oneToSix) {
      case 1:
        this.messageToastService.info(title, content, "top-center", options);
        break;
      case 2:
        this.messageToastService.error(title, content, "top-center", options);
        break;
      case 3:
        this.messageToastService.success(title, content, "top-center", options);
        break;
      case 4:
        this.messageToastService.warn(title, content, "top-center", options);
        break;
      case 5:
        this.messageToastService.secondary(
          title,
          content,
          "top-center",
          options,
        );
        break;
    }
  }
}

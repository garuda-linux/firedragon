import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Renderer2,
  signal,
  type WritableSignal,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import type { LogoList, WallpaperList } from "../types";
import { logos, type Wallpaper, wallpapers } from "../../config";
import { Checkbox } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { Select } from "primeng/select";
import { InputText } from "primeng/inputtext";
import type { AppSettings } from "../../config/interfaces";
import { ConfigService } from "../../config/config.service";
import { TranslocoDirective, TranslocoService } from "@jsverse/transloco";
import { TitleComponent } from "../title/title.component";
import { Button } from "primeng/button";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { Panel } from "primeng/panel";
import { type FileSelectEvent, FileUpload } from "primeng/fileupload";
import { MessageToastService } from "@garudalinux/core";
import { MenuEditorComponent } from "../menu-editor/menu-editor.component";
import { type AvailableJokeSources, jokeSources } from "../jokes/jokes";
import { type AppTheme, themes } from "../theme";
import { LinksEditorComponent } from "../links-editor/links-editor.component";
import { LangPipe } from "../lang/lang.pipe";
import { InputNumber } from "primeng/inputnumber";

@Component({
  selector: "app-settings",
  imports: [
    Checkbox,
    FormsModule,
    Select,
    InputText,
    InputNumber,
    TranslocoDirective,
    TitleComponent,
    Button,
    ConfirmDialog,
    TableModule,
    Panel,
    FileUpload,
    MenuEditorComponent,
    LinksEditorComponent,
  ],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.css",
  providers: [MessageService, ConfirmationService, LangPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  activeJoke = signal<AvailableJokeSources>("dev-excuses");
  activeTheme = signal<AppTheme>("Catppuccin Mocha/Latte Aura");
  autoGridCols = signal<boolean>(true);
  avatarEnabled = signal<boolean>(true);
  avatarUrl = signal<string>("");
  blurBackground = signal<number>(0);
  blurStrength = signal<number>(4);
  customTitle = signal<string>("");
  defaultLinks = signal<boolean>(true);
  darkMode = signal<boolean>(true);
  fitWallpaper = signal<string>("cover");
  gridCols = signal<number>(3);
  jokesEnabled = signal<boolean>(true);
  language = signal<string>("en");
  logo = signal<string>("default");
  logoUrl = signal<string>("");
  showNews = signal<boolean>(true);
  topPagesEnabled = signal<boolean>(true);
  topPagesLimit = signal<number>(6);
  username = signal<string>("");
  wallpaper = signal<Wallpaper>("");
  wallpaperUrl = signal<string>("");
  welcomeText = signal<string>("");

  protected readonly availableLanguages: {
    name: string;
    prettyName: string;
  }[] = [];
  protected readonly availableThemes: string[] = Object.keys(themes).sort();
  protected readonly configService = inject(ConfigService);
  protected readonly jokeSources = jokeSources.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  protected readonly logos: LogoList = logos;
  protected readonly wallpapers: WallpaperList = wallpapers;

  private readonly confirmationService = inject(ConfirmationService);
  private readonly document = inject(DOCUMENT);
  private readonly el = inject(ElementRef);
  private readonly langPipe = inject(LangPipe);
  private readonly messageToastService = inject(MessageToastService);
  private readonly renderer = inject(Renderer2);
  private readonly translocoService = inject(TranslocoService);

  constructor() {
    effect(() => {
      const settings: AppSettings = this.configService.settings();
      const settingsKeys = this as unknown as {
        [key: string]: WritableSignal<any>;
      };
      for (const key of Object.keys(settingsKeys)) {
        if (Object.prototype.hasOwnProperty.call(settings, key)) {
          settingsKeys[key].set(settings[key]);
        }
      }
    });

    for (const lang of this.translocoService.getAvailableLangs() as string[]) {
      this.availableLanguages.push({
        name: lang,
        prettyName: this.langPipe.transform(lang),
      });
    }
    this.language.set(this.translocoService.getActiveLang());
  }

  /**
   * Update the configuration value in both the service and the store.
   * @param key Key of the configuration to update
   * @param value New value for the configuration
   */
  updateConfig(key: string, value: any) {
    this.configService.updateConfig(key, value, this.renderer, this.el);
  }

  /**
   * Download the current settings as a JSON file.
   */
  downloadSettings() {
    const settings: AppSettings = this.configService.settings();
    const dataStr: string = "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(settings));
    const downloadAnchorNode: HTMLAnchorElement = this.document.createElement(
      "a",
    );
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `settings-${new Date().toISOString().split("T")[0]}.json`,
    );
    this.document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  /**
   * Restore settings from a JSON file, after confirmation.
   * @param $event The event containing the file data
   */
  restoreSettings($event: FileSelectEvent) {
    this.confirmationService.confirm({
      message: this.translocoService.translate("settings.confirmRestore"),
      header: this.translocoService.translate("settings.confirmHeader"),
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        await this.configService.restoreSettings(
          $event.currentFiles[0],
          this.renderer,
          this.el,
        );
        this.messageToastService.success(
          this.translocoService.translate("settings.success"),
          this.translocoService.translate("settings.settingsRestored"),
        );
      },
    });
  }

  /**
   * Reset settings to default values, after confirmation.
   */
  resetSettings() {
    this.confirmationService.confirm({
      message: this.translocoService.translate("settings.confirmReset"),
      header: this.translocoService.translate("settings.confirmHeader"),
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.configService.resetSettings(this.renderer, this.el);
        this.messageToastService.success(
          this.translocoService.translate("settings.success"),
          this.translocoService.translate("settings.settingsReset"),
        );
      },
    });
  }
}

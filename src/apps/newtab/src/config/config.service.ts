import {
  effect,
  type ElementRef,
  inject,
  Injectable,
  type Renderer2,
  signal,
} from "@angular/core";
import type { AppSettings } from "./interfaces";
import { Title } from "@angular/platform-browser";
import { WallpaperService } from "../app/wallpaper/wallpaper.service";
import { menubarItems, serviceLinks } from "../config";
import { usePreset } from "@primeng/themes";
import {
  type AppTheme,
  backgroundColors,
  scrollbarColors,
  themes,
} from "../app/theme";
import { DOCUMENT } from "@angular/common";
import { TranslocoService } from "@jsverse/transloco";
import { rpc } from "../lib/rpc/rpc";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private readonly pref = "firedragon.newtab.config";

  defaultSettings: AppSettings = {
    activeJoke: "dev-excuses",
    activeTheme: "Catppuccin Mocha/Latte Aura",
    avatarEnabled: true,
    avatarUrl: "",
    autoGridCols: true,
    blurBackground: false,
    blurStrength: 1,
    customLinks: serviceLinks,
    customMenuLinks: menubarItems,
    customTitle: "",
    defaultLinks: false,
    darkMode: true,
    disableAutofocus: false,
    fitWallpaper: true,
    gridCols: 3,
    jokesEnabled: true,
    language: "en",
    languageChanged: false,
    logo: "chrome://branding/content/about-logo.png",
    logoUrl: "",
    topPagesEnabled: true,
    topPagesLimit: 6,
    username: "",
    wallpaper: "none",
    wallpaperUrl: "",
    welcomeText: "",
  };

  initialized = signal<boolean>(false);
  settings = signal<AppSettings>(this.defaultSettings);

  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly translocoService = inject(TranslocoService);
  private readonly wallpaperService: WallpaperService;

  constructor() {
    this.initStore().then((pendingConfigUpdate) => {
      if (pendingConfigUpdate) {
        this.settings.update((prev) => ({ ...prev, ...pendingConfigUpdate }));
      }
      this.initialized.set(true);
    });

    this.wallpaperService = new WallpaperService(this);

    if (!this.settings().languageChanged) {
      const lang: string = navigator.language.includes("-")
        ? navigator.language.split("-")[0]
        : navigator.language;
      if (
        (this.translocoService.getAvailableLangs() as string[]).includes(lang)
      ) {
        this.translocoService.setActiveLang(lang);
      }
    } else {
      this.translocoService.setActiveLang(this.settings().language);
    }

    effect(() => {
      rpc.setStringPref(this.pref, JSON.stringify(this.settings()));
    });
  }

  /**
   * Update configuration value in both the service and the store.
   * @param key The configuration key to update.
   * @param value The new value for the configuration key.
   * @param renderer The renderer to use for DOM manipulation.
   * @param el The element reference to the DOM element.
   * @param write Whether to write the value FireDragon's settings store.
   */
  updateConfig(
    key: string,
    value: any,
    renderer?: Renderer2,
    el?: ElementRef,
    write = true,
  ): void {
    this.settings.update((prev: AppSettings) => ({ ...prev, [key]: value }));
    if (write) {
      rpc.setStringPref(this.pref, JSON.stringify(this.settings()));
    }
    void this.syncSetting(key, value, renderer, el);
  }

  /**
   * Initializes the configuration settings, specifically here because
   * we have renderer and element references.
   * @param renderer The renderer to use for DOM manipulation.
   * @param el The element reference to the DOM element.
   */
  initConfig(renderer: Renderer2, el: ElementRef) {
    for (const key of Object.keys(this.settings())) {
      const value = this.settings()[key];
      void this.syncSetting(key, value, renderer, el);
    }
  }

  /**
   * Restores settings from a file.
   * @param file The file containing the settings to restore.
   * @param renderer The renderer to use for DOM manipulation.
   * @param el The element reference to the DOM element.
   */
  async restoreSettings(
    file: File,
    renderer: Renderer2,
    el: ElementRef,
  ): Promise<void> {
    const buffer: ArrayBuffer = await file.arrayBuffer();
    const blob: Blob = new Blob([buffer], { type: "application/json" });
    const content: string = await blob.text();

    try {
      const settings = JSON.parse(content) as Partial<AppSettings>;
      this.iterateSettings(settings, renderer, el);
      rpc.setStringPref(this.pref, JSON.stringify(settings));
    } catch (error) {
      console.error("Error parsing settings file:", error);
    }
  }

  /**
   * Resets the settings to their default values.
   * @param renderer The renderer to use for DOM manipulation.
   * @param el The element reference to the DOM element.
   */
  resetSettings(renderer: Renderer2, el: ElementRef): void {
    const settings = this.defaultSettings as { [key: string]: any };
    rpc.setStringPref(this.pref, JSON.stringify(settings));
    this.iterateSettings(settings, renderer, el);
  }

  /**
   * Iterates through the settings and updates the configuration.
   * @param settings The settings object containing key-value pairs to update.
   * @param renderer The renderer to use for DOM manipulation.
   * @param el The element reference to the DOM element.
   * @private
   */
  private iterateSettings(
    settings: { [key: string]: unknown },
    renderer?: Renderer2,
    el?: ElementRef,
  ) {
    for (const key of Object.keys(settings)) {
      if (Object.prototype.hasOwnProperty.call(this.settings(), key)) {
        this.updateConfig(key, settings[key], renderer, el);
      } else {
        console.warn(`Key "${key}" not found in settings, ignoring`);
      }
    }
  }

  /**
   * Initializes the settings signal, overwriting the default settings with saved ones.
   * @returns A promise that resolves to the saved settings or an empty object if none are found.
   * @private
   */
  private async initStore(): Promise<Partial<AppSettings>> {
    const settings: { [key: string]: any } = {};
    const savedSettings: string | null = await rpc.getStringPref(this.pref);

    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (err: any) {
        console.error("Error parsing settings:", err);
        return {};
      }
    }

    return settings;
  }

  /**
   * Synchronizes a specific setting with the current state.
   * @param key The configuration key to synchronize.
   * @param value The new value for the configuration key.
   * @param renderer The renderer to use for DOM manipulation.
   * @param el The element reference to the DOM element.
   * @private
   */
  private async syncSetting(
    key: string,
    value: any,
    renderer?: Renderer2,
    el?: ElementRef,
  ) {
    switch (key) {
      case "customTitle": {
        if (!this.settings().customTitle) {
          // await firstValueFrom(
          //   this.translocoService.load(this.settings().language),
          // );
        } else {
          this.title.setTitle(value);
        }
        break;
      }
      case "wallpaper": {
        if (renderer && el) {
          this.wallpaperService.loadWallpaper(
            value,
            renderer,
            el,
            this.settings().wallpaperUrl,
          );
        }
        break;
      }
      case "fitWallpaper":
      case "blurBackground":
      case "blurStrength": {
        if (renderer && el) {
          this.wallpaperService.applyWallpaperStyle(
            key,
            this.settings().blurBackground,
            renderer,
            el,
          );
        }
        break;
      }
      case "activeTheme": {
        usePreset(themes[value]);
        this.handleMiscColors(this.settings().darkMode);
        break;
      }
      case "darkMode": {
        this.handleMiscColors(value as boolean);
        break;
      }
      case "language": {
        this.translocoService.setActiveLang(value);
        break;
      }
    }
  }

  /**
   * Handles setting background and scrollbar colors, as well as dark mode.
   * @param value The value of the dark mode setting.
   * @private
   */
  private handleMiscColors(value: boolean) {
    const activeTheme: AppTheme = this.settings().activeTheme;

    let scrollbarColor: string;
    let backgroundColor: string;

    if (activeTheme.includes("Catppuccin")) {
      const flavors = this.settings().activeTheme.includes("Mocha")
        ? "primary"
        : "alt";

      if (value) {
        if (flavors === "primary") {
          scrollbarColor = scrollbarColors.primary.dark;
          backgroundColor = backgroundColors.primary.dark;
        } else {
          scrollbarColor = scrollbarColors.alt.dark;
          backgroundColor = backgroundColors.alt.dark;
        }
      } else {
        if (flavors === "primary") {
          scrollbarColor = scrollbarColors.primary.light;
          backgroundColor = backgroundColors.primary.light;
        } else {
          scrollbarColor = scrollbarColors.alt.light;
          backgroundColor = backgroundColors.alt.light;
        }
      }
    } else if (activeTheme.includes("Vo1ded")) {
      if (value) {
        scrollbarColor = scrollbarColors.vo1ded.dark;
        backgroundColor = backgroundColors.vo1ded.dark;
      } else {
        scrollbarColor = scrollbarColors.vo1ded.light;
        backgroundColor = backgroundColors.vo1ded.light;
      }
    }

    if (value) {
      this.document.documentElement.classList.add("p-dark");
    } else {
      this.document.documentElement.classList.remove("p-dark");
    }
    this.document.documentElement.style.backgroundColor = backgroundColor!;
    this.document.documentElement.style.scrollbarColor = scrollbarColor!;
  }
}

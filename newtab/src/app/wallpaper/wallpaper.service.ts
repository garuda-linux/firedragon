import { type ElementRef, Injectable, type Renderer2 } from "@angular/core";
import { ConfigService } from "../../config/config.service";

@Injectable({
  providedIn: "root",
})
export class WallpaperService {
  private prevBlurStrength: null | number = null;
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  /**
   * Loads the wallpaper based on the provided wallpaper type.
   * @param wallpaper The type of wallpaper to load. Can be 'custom', 'none', or a URL.
   * @param renderer Renderer2 to manipulate the DOM.
   * @param el ElementRef to the body element.
   * @param url Optional URL for the custom wallpaper, if applicable.
   */
  loadWallpaper(
    wallpaper: string,
    renderer: Renderer2,
    el: ElementRef,
    url?: string,
  ): void {
    if (wallpaper === "custom") {
      this.loadWallpaperExecutor(el, renderer, url ?? "");
    } else if (wallpaper === "none") {
      this.loadWallpaperExecutor(el, renderer, null);
    } else if (wallpaper !== "") {
      this.loadWallpaperExecutor(el, renderer, wallpaper);
    }
  }

  /**
   * Loads a new startpage background.
   * @param el ElementRef to the body element.
   * @param renderer Renderer2 to the body element.
   * @param wallpaper URL to the wallpaper to load.
   */
  loadWallpaperExecutor(
    el: ElementRef,
    renderer: Renderer2,
    wallpaper: string | null,
  ): void {
    if (wallpaper === null) {
      renderer.removeStyle(
        el.nativeElement.ownerDocument.body,
        "backgroundImage",
      );
    } else {
      renderer.setStyle(
        el.nativeElement.ownerDocument.body,
        "background-image",
        `url(${wallpaper})`,
      );
    }
  }

  /**
   * Apply wallpaper style to the body element.
   * @param kind Kind of wallpaper style to apply.
   * @param value Value to apply.
   * @param renderer Renderer2 to the origin element.
   * @param el ElementRef to the origin element.
   */
  applyWallpaperStyle(
    kind: string,
    value: boolean,
    renderer: Renderer2,
    el: ElementRef,
  ): void {
    switch (kind) {
      case "fitWallpaper":
        this.applyBgContain(el, renderer, value);
        break;
      case "blurBackground":
        this.applyBgBlur(el, renderer, value);
        break;
      case "blurStrength":
        if (!this.configService.settings().blurBackground) {
          return;
        }
        this.applyBgBlur(el, renderer, value);
        break;
      default:
        this.applyBgContain(el, renderer, false);
        this.applyBgBlur(el, renderer, false);
        break;
    }
  }

  /**
   * Apply background blur style to the body element.
   * @param el ElementRef to the body element.
   * @param renderer Renderer2 to the body element.
   * @param apply Whether to apply the style or not.
   */
  applyBgBlur(el: ElementRef, renderer: Renderer2, apply = true): void {
    const strength = this.configService.settings().blurStrength;
    if (apply) {
      if (this.prevBlurStrength) {
        renderer.removeClass(
          el.nativeElement.ownerDocument.body,
          `background-blurred-${this.prevBlurStrength}`,
        );
      }
      this.prevBlurStrength = strength;
      renderer.addClass(
        el.nativeElement.ownerDocument.body,
        `background-blurred-${strength}`,
      );
    } else {
      renderer.removeClass(
        el.nativeElement.ownerDocument.body,
        `background-blurred-${strength}`,
      );
    }
  }

  /**
   * Apply background contain style to the body element.
   * @param el ElementRef to the body element.
   * @param renderer Renderer2 to the body element.
   * @param apply Whether to apply the style or not.
   */
  applyBgContain(el: ElementRef, renderer: Renderer2, apply = true): void {
    if (apply) {
      renderer.addClass(el.nativeElement.ownerDocument.body, "bg-contain");
    } else {
      renderer.removeClass(el.nativeElement.ownerDocument.body, "bg-contain");
    }
  }
}

import { Injectable, OnDestroy, Provider } from "@angular/core";
import {
  LocationChangeListener,
  LocationStrategy,
  PlatformLocation,
} from "@angular/common";

export function normalizeQueryParams(params: string): string {
  return params && params[0] !== "?" ? `?${params}` : params;
}

@Injectable()
export class HashLocationStrategy extends LocationStrategy
  implements OnDestroy {
  private _removeListenerFns: (() => void)[] = [];

  constructor(
    private _platformLocation: PlatformLocation,
  ) {
    super();
  }

  ngOnDestroy(): void {
    while (this._removeListenerFns.length) {
      this._removeListenerFns.pop()!();
    }
  }

  override onPopState(fn: LocationChangeListener): void {
    this._removeListenerFns.push(
      this._platformLocation.onPopState(fn),
      this._platformLocation.onHashChange(fn),
    );
  }

  override getBaseHref(): string {
    return "";
  }

  override path(includeHash: boolean = false): string {
    const path = this._platformLocation.hash ?? "#";
    return path.length > 0 ? path.substring(1) : path;
  }

  override prepareExternalUrl(internal: string): string {
    return internal.length > 0 ? "#" + internal : internal;
  }

  override pushState(
    state: any,
    title: string,
    path: string,
    queryParams: string,
  ) {
    location.hash = this.prepareExternalUrl(
      path + normalizeQueryParams(queryParams),
    );
  }

  override replaceState(
    state: any,
    title: string,
    path: string,
    queryParams: string,
  ) {
    location.hash = this.prepareExternalUrl(
      path + normalizeQueryParams(queryParams),
    );
  }

  override forward(): void {
    this._platformLocation.forward();
  }

  override back(): void {
    this._platformLocation.back();
  }

  override getState(): unknown {
    return null;
  }

  override historyGo(relativePosition: number = 0): void {
    this._platformLocation.historyGo?.(relativePosition);
  }
}

export function provideHashLocationStrategy(): Provider {
  return {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  };
}

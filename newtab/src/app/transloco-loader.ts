import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { Translation, TranslocoLoader } from "@jsverse/transloco";

@Injectable({ providedIn: "root" })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`i18n/${lang}.json`);
  }
}

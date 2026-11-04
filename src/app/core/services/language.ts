import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { en_US, NzI18nService, th_TH } from 'ng-zorro-antd/i18n';
import { translations } from '../18n';

export type Language = 'th' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly i18n = inject(NzI18nService);
  private readonly selected = signal<Language>('th');
  readonly language = this.selected.asReadonly();
  readonly text = computed(() => translations[this.language()]);

  constructor() {
    let language: Language = 'th';
    try {
      if (this.document.defaultView?.localStorage.getItem('poxprime.language') === 'en') {
        language = 'en';
      }
    } catch {
      /* Use Thai when browser storage is unavailable. */
    }
    this.setLanguage(language);
  }

  setLanguage(language: Language): void {
    this.selected.set(language);
    this.document.documentElement.lang = language;
    this.i18n.setLocale(language === 'th' ? th_TH : en_US);
    try {
      this.document.defaultView?.localStorage.setItem('poxprime.language', language);
    } catch {
      /* Language switching also works without browser storage. */
    }
  }
}

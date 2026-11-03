import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { en_US, NzI18nService, th_TH } from 'ng-zorro-antd/i18n';
import { translations } from '../18n.js';

export type Language = 'th' | 'en';

export interface UserTranslations {
  title: string;
  deposit: string;
  userInformation: string;
  bankAccount: string;
  cryptoWallet: string;
  userVerify: string;
  personalDetails: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  referralCode: string;
  memberSince: string;
  addBank: string;
  noBank: string;
  bankHint: string;
  addWallet: string;
  noWallet: string;
  walletHint: string;
  verificationStatus: string;
  notVerified: string;
  verifyNow: string;
  verifyHint: string;
  notProvided: string;
  verifyMenuTitle: string;
  kycVerification: string;
  kycDescription: string;
  verified: string;
  pending: string;
  rejected: string;
  documentType: string;
  updatedAt: string;
  rejectionReason: string;
  authenticator: string;
  authenticatorHint: string;
  enabled: string;
  notEnabled: string;
  setup: string;
  phoneVerification: string;
  phoneVerifiedHint: string;
  emailVerification: string;
  emailVerifiedHint: string;
  manage: string;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly i18n = inject(NzI18nService);
  private readonly selected = signal<Language>('th');
  readonly language = this.selected.asReadonly();
  readonly text = computed(() => translations[this.language()]);
  readonly loginText = computed(() => this.text().authLogin);
  readonly registerText = computed(() => this.text().register);
  readonly userText = computed<UserTranslations>(() => this.text().user as UserTranslations);

  constructor() {
    let language: Language = 'th';
    try {
      if (this.document.defaultView?.localStorage.getItem('poxprime.language') === 'en') {
        language = 'en';
      }
    } catch { /* Use Thai when browser storage is unavailable. */ }
    this.setLanguage(language);
  }

  setLanguage(language: Language): void {
    this.selected.set(language);
    this.document.documentElement.lang = language;
    this.i18n.setLocale(language === 'th' ? th_TH : en_US);
    try {
      this.document.defaultView?.localStorage.setItem('poxprime.language', language);
    } catch { /* Language switching also works without browser storage. */ }
  }
}

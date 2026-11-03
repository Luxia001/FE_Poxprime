import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { LoginData } from '../../features/auth/models/login.model';

export const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  sessionUid: 'sessionUid',
} as const;

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  private readonly window = inject(DOCUMENT).defaultView;

  save(data: Pick<LoginData, 'accessToken' | 'refreshToken' | 'sessionUid'>): void {
    try {
      const storage = this.window?.localStorage;
      if (!storage) return;
      storage.setItem(AUTH_STORAGE_KEYS.accessToken, data.accessToken);
      storage.setItem(AUTH_STORAGE_KEYS.refreshToken, data.refreshToken);
      storage.setItem(AUTH_STORAGE_KEYS.sessionUid, data.sessionUid);
    } catch { /* Login still works when browser storage is unavailable. */ }
  }

  get accessToken(): string {
    return this.get(AUTH_STORAGE_KEYS.accessToken);
  }

  get sessionUid(): string {
    return this.get(AUTH_STORAGE_KEYS.sessionUid);
  }

  get refreshToken(): string {
    return this.get(AUTH_STORAGE_KEYS.refreshToken);
  }

  isAuthenticated(): boolean {
    return Boolean(this.accessToken && this.refreshToken && this.sessionUid);
  }

  clear(): void {
    try {
      const storage = this.window?.localStorage;
      if (!storage) return;
      Object.values(AUTH_STORAGE_KEYS).forEach((key) => storage.removeItem(key));
    } catch { /* Nothing to clear when browser storage is unavailable. */ }
  }

  private get(key: string): string {
    try {
      return this.window?.localStorage.getItem(key) ?? '';
    } catch {
      return '';
    }
  }
}

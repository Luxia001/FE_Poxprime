import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import QRCode from 'qrcode';
import { finalize } from 'rxjs';
import { TotpApi } from '../../../services/verify/google.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [ReactiveFormsModule, NzIconModule, RouterLink, NzButtonModule, NzInputModule],
  selector: 'app-google-auth',
  styleUrl: './google-auth.css',
  templateUrl: './google-auth.html',
})
export class GoogleAuth {
  readonly totpApi = inject(TotpApi);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly qrDataUrl = signal('');
  readonly secret = signal('');
  readonly urlCode = signal('');
  readonly backupCodes = signal<string[]>([]);
  readonly verifying = signal(false);
  readonly verified = signal(false);
  readonly isEnabled = computed(() => this.verified() || this.totpApi.status()?.isEnabled === true);
  readonly copied = signal(false);
  readonly copiedKey = signal<'url' | 'secret' | null>(null);
  private copyTimer?: ReturnType<typeof setTimeout>;
  readonly otp = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
  });

  constructor() {
    this.totpApi.loadStatus();
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copyTimer));

    this.otp.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const code = Array.isArray(value) ? value.join('') : (value ?? '');
      if (/^\d{6}$/.test(code) && !this.verifying()) this.verify();
    });
  }
  async copy(value: string, key: 'url' | 'secret'): Promise<void> {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // fallback สำหรับ http หรือ browser ที่ไม่อนุญาต clipboard API
      const el = document.createElement('textarea');
      el.value = value;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }

    this.copiedKey.set(key);
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => this.copiedKey.set(null), 2000);
  }

  start(): void {
    this.loading.set(true);
    this.error.set('');

    this.totpApi
      .setup()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: async (data) => {
          try {
            this.secret.set(data.secret);
            this.backupCodes.set(data.backupCodes ?? []);
            this.urlCode.set(data.qrCodeUrl);
            this.qrDataUrl.set(await QRCode.toDataURL(data.qrCodeUrl, { width: 240, margin: 1 }));
          } catch {
            this.error.set('Unable to generate the authenticator QR code.');
          }
        },
        error: (err: { message?: string; error?: string | { message?: string } }) =>
          this.error.set(this.errorMessage(err, 'Unable to start 2FA setup.')),
      });
  }

  verify(): void {
    this.otp.markAsTouched();
    this.otp.markAsDirty();
    if (this.otp.invalid || this.verifying()) return;

    this.verifying.set(true);
    this.error.set('');
    this.totpApi
      .verifySetup(this.otp.getRawValue())
      .pipe(finalize(() => this.verifying.set(false)))
      .subscribe({
        next: () => {
          this.verified.set(true);
          this.totpApi.loadStatus();
        },
        error: (err: { message?: string; error?: string | { message?: string } }) =>
          this.error.set(this.errorMessage(err, 'Invalid authentication code. Please try again.')),
      });
  }

  /** เรียกเมื่อปิดหน้าหรือยืนยันเสร็จ */
  reset(): void {
    this.secret.set('');
    this.qrDataUrl.set('');
    this.backupCodes.set([]);
    this.otp.reset('');
    this.verified.set(false);
    this.copied.set(false);
    this.error.set('');
  }

  async copyBackupCodes(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.backupCodes().join('\n'));
      this.copied.set(true);
    } catch {
      this.error.set('Unable to copy backup codes. Please copy them manually.');
    }
  }

  private errorMessage(
    error: { message?: string; error?: string | { message?: string } },
    fallback: string,
  ): string {
    return typeof error.error === 'string'
      ? error.error
      : error.error?.message || error.message || fallback;
  }
}

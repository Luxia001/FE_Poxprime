import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LanguageService } from '../../../core/services/language';
import { LoginApiService } from '../services/login-api';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { LoginData } from '../models/login.model';
import { errorResponse } from '../../../core/models/index.model';
import { getErrorMessage } from '../../../core/utils/error-message';
import { OtpModal } from '../../../shared/components/UI/modals/otp-modal/otp-modal';

@Component({
  imports: [ReactiveFormsModule, RouterLink, NzButtonModule, NzInputModule, OtpModal],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loginApi = inject(LoginApiService);
  private readonly authStorage = inject(AuthStorageService);
  readonly locale = inject(LanguageService);
  readonly text = this.locale.text;
  readonly showPassword = signal(false);
  readonly submitted = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly twoFactorOpen = signal(false);
  readonly twoFactorSubmitting = signal(false);
  readonly twoFactorError = signal('');
  readonly preAuthToken = signal('');
  readonly rememberDevice = signal(true);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly validateForm = this.fb.group({
    Email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [true],
  });
  readonly twoFactorCode = this.fb.control('', [
    Validators.required,
    Validators.pattern(/^\d{6}$/),
  ]);

  submitForm(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.validateForm.markAllAsTouched();
    if (this.validateForm.invalid || this.loading()) return;

    const form = this.validateForm.getRawValue();
    this.loading.set(true);
    this.loginApi.login({ usernameOrEmail: form.Email.trim(), password: form.password }).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.data.require2FA) {
          this.preAuthToken.set(response.data.preAuthToken);
          this.twoFactorCode.reset('');
          this.twoFactorCode.markAsUntouched();
          this.twoFactorError.set('');
          this.twoFactorOpen.set(true);
          return;
        }
        this.completeLogin(response.data);
      },
      error: (error: errorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(getErrorMessage(error, this.text().signInUnavailable));
      },
    });
  }

  verifyTwoFactor(): void {
    this.twoFactorCode.markAsTouched();
    this.twoFactorCode.markAsDirty();
    this.twoFactorCode.updateValueAndValidity();
    if (this.twoFactorCode.invalid || this.twoFactorSubmitting()) return;

    this.twoFactorSubmitting.set(true);
    this.twoFactorError.set('');
    this.loginApi
      .verifyTwoFactor({
        preAuthToken: this.preAuthToken(),
        totpToken: this.twoFactorCode.getRawValue(),
        rememberDevice: this.rememberDevice(),
      })
      .subscribe({
        next: (response) => {
          this.twoFactorSubmitting.set(false);
          this.twoFactorOpen.set(false);
          this.completeLogin(response.data);
        },
        error: (error: errorResponse) => {
          this.twoFactorSubmitting.set(false);
          this.errorMessage.set(getErrorMessage(error, this.text().signInUnavailable));
        },
      });
  }

  closeTwoFactor(): void {
    if (this.twoFactorSubmitting()) return;
    this.twoFactorOpen.set(false);
    this.preAuthToken.set('');
    this.twoFactorCode.reset('');
    this.twoFactorError.set('');
  }

  private completeLogin(data: LoginData): void {
    this.authStorage.save(data);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    void this.router.navigateByUrl(
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/general/dashboard',
    );
  }
}

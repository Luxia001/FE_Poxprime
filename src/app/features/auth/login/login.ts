import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LanguageService } from '../../../core/services/language';
import { LoginApiService } from '../services/login-api';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { LoginErrorResponse } from '../models/login.model';

@Component({
  imports: [ReactiveFormsModule, RouterLink, NzButtonModule, NzInputModule],
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
  private readonly fb = inject(NonNullableFormBuilder);
  readonly validateForm = this.fb.group({
    Email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [true],
  });

  submitForm(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.validateForm.markAllAsTouched();
    if (this.validateForm.invalid || this.loading()) return;

    const form = this.validateForm.getRawValue();
    this.loading.set(true);
    this.loginApi.login({ usernameOrEmail: form.Email.trim(), password: form.password }).subscribe({
      next: (response) => {
        this.authStorage.save(response.data);
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(
          returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
            ? returnUrl
            : '/general/dashboard',
        );
      },
      error: (error: LoginErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(error.error || error.message || this.text().signInUnavailable);
      },
    });
  }
}

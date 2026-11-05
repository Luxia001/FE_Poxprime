import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EmailVerificationApi } from '../services/email.service';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { ProfileApi } from '../../account/services/profile-api';

@Component({
  imports: [NzSpinModule, RouterLink],
  selector: 'app-verify-email',
  templateUrl: './login-email.html',
})
export class VerifyEmail implements OnInit {
  private readonly api = inject(EmailVerificationApi);
  private readonly authStorage = inject(AuthStorageService);
  private readonly profileApi = inject(ProfileApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token')?.trim();
    if (!token) {
      this.loading.set(false);
      this.error.set('Verification token is missing.');
      return;
    }
    this.verify(token);
  }

  private verify(token: string): void {
    this.api.verify(token).subscribe({
      next: (data) => {
        if (!data.accessToken || !data.refreshToken || !data.sessionUid) {
          this.loading.set(false);
          this.error.set('Verification succeeded, but the login session could not be created.');
          return;
        }

        this.authStorage.save({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          sessionUid: data.sessionUid,
        });

        if (!this.authStorage.isAuthenticated()) {
          this.loading.set(false);
          this.error.set('Unable to save your login session. Please continue to the login page.');
          return;
        }

        this.profileApi.loadProfile();
        void this.router.navigateByUrl('/general/dashboard', { replaceUrl: true });
      },
      error: (err: { message?: string; error?: string | { message?: string } }) => {
        const detail = typeof err.error === 'string' ? err.error : err.error?.message;
        this.error.set(detail || err.message || 'Verification link is invalid or has expired.');
        this.loading.set(false);
      },
    });
  }
}

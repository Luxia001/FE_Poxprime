import { Component, computed, inject, input, signal } from '@angular/core';
import { LanguageService } from '../../../../core/services/language';
import { ProfileApi } from '../../../../features/account/services/profile-api';
import { AuthStorageService } from '../../../../core/services/auth-storage';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { finalize } from 'rxjs';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB (ปรับตาม backend)
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
@Component({
  imports: [NzIconModule, NzButtonModule, NzAvatarComponent],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  private readonly route = inject(Router);
  readonly locale = inject(LanguageService);
  readonly text = this.locale.text;
  readonly profileApi = inject(ProfileApi);
  private readonly authStorage = inject(AuthStorageService);
  readonly uploading = signal(false);
  readonly error = signal('');

  readonly profile = input.required<{
    fullName: string;
    country: string;
    formattedBirthDate: string;
    phoneNumber: string;
    email: string;
    username: string;
    profileImageUrl: string;
    initials: string;
  }>();

  signOut(): void {
    this.authStorage.clear();
    this.profileApi.clear();
    void this.route.navigate(['/login']);
  }

  onSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // เลือกไฟล์เดิมซ้ำได้
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      this.error.set('Only JPG or PNG files are supported.');
      return;
    }
    if (file.size > MAX_SIZE) {
      this.error.set('File size must not exceed 2 MB.');
      return;
    }

    this.error.set('');
    this.uploading.set(true);

    this.profileApi
      .uploadImageProfile(file)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        error: (err: { message?: string }) =>
          this.error.set(err.message ?? 'Upload failed. Please try again.'),
      });
  }
}

import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../../../core/services/language';
import { ProfileApi } from '../../../../features/account/services/profile-api';
import { AuthStorageService } from '../../../../core/services/auth-storage';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  imports: [NzIconModule, NzButtonModule],
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
}

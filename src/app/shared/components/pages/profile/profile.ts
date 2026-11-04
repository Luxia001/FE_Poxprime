import { Component, computed, inject } from '@angular/core';
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
  private readonly authStorage = inject(AuthStorageService);
  readonly locale = inject(LanguageService);
  readonly text = this.locale.text;
  readonly profileApi = inject(ProfileApi);
  readonly profile = computed(() => {
    const response = this.profileApi.profile();
    const member = response?.member;
    const locale = this.locale.language() === 'th' ? 'th-TH' : 'en-GB';
    const birthDate = member?.m_birthdate;
    return {
      fullName: member ? `${member.m_name} ${member.m_lastname}`.trim() : '',
      country: member?.m_country ?? '',
      formattedBirthDate: birthDate
        ? new Date(birthDate).toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '',
      phoneNumber: member?.m_phone ?? '',
      email: member?.email ?? '',
      username: member?.username ?? '',
      profileImageUrl: member?.m_image_url ?? '',
      initials: this.profileApi.initials(),
    };
  });

  constructor() {
    this.profileApi.loadProfile();
  }
  signOut(): void {
    this.authStorage.clear();
    this.profileApi.clear();
    void this.route.navigate(['/login']);
  }
}

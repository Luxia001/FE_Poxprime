import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language';
import { Verify } from '../../../shared/components/UI/cards/verify/verify';
import { ProfileApi } from '../services/profile-api';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Profile } from '../../../shared/components/pages/profile/profile';
import { KycApi } from '../../../shared/services/verify/kyc.service';
import { BarHead } from '../../../shared/components/UI/headers/bar-head/bar-head';
import { TotpApi } from '../../../shared/services/verify/google.service';

@Component({
  imports: [Verify, NzIconModule, NzButtonModule, Profile, BarHead],
  selector: 'app-user',
  styleUrl: './user.css',
  templateUrl: './user.html',
})
export class User {
  private readonly router = inject(Router);
  readonly locale = inject(LanguageService);
  readonly text = this.locale.text;
  readonly activeTab = signal(0);
  readonly kycApi = inject(KycApi);
  readonly profileApi = inject(ProfileApi);
  readonly totpApi = inject(TotpApi);

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
  readonly emailVerifyStatus = computed(() =>
    this.profileApi.profile()?.member.isConfirm === 1 ? 1 : 2,
  );
  readonly googleAuthStatus = computed(() =>
    this.totpApi.status()?.isEnabled ? 1 : this.totpApi.status()?.isSetupPending ? 2 : 3,
  );
  readonly VerifyStatus = computed(() => {
    return {
      kyc: this.kycApi.kyc()?.kyc_stat ?? 3,
      phone:
        this.kycApi.kyc()?.kyc_note && this.profileApi.profile()?.member.m_phone_code === '+66'
          ? 1
          : 3,
    };
  });

  constructor() {
    this.profileApi.loadProfile();
    this.kycApi.load();
    this.totpApi.loadStatus();
  }

  openKycVerification(): void {
    void this.router.navigate(['/account/kyc-verification']);
  }
  openGoogelVerification(): void {
    void this.router.navigate(['/account/google-verification']);
  }
}

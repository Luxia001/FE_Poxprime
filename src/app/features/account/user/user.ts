import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language';
import { Verify } from '../../../shared/components/cards/verify/verify';
import { KycResponse } from '../models/kyc-response';
import { ProfileApi } from '../services/profile-api';
import { Router } from '@angular/router';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  imports: [Verify, NzIconModule, NzButtonModule],
  selector: 'app-user',
  styleUrl: './user.css',
  templateUrl: './user.html',
})
export class User {
  readonly profileApi = inject(ProfileApi);
  private readonly router = inject(Router);
  readonly locale = inject(LanguageService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly route = inject(Router);
  readonly text = this.locale.text;
  readonly activeTab = signal(0);
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

  openKycVerification(): void {
    void this.router.navigate(['/main/kyc-verification']);
  }
  readonly kycResponse = signal<KycResponse>({
    result: true,
    message: 'KYC record retrieved successfully',
    data: {
      id: 1,
      memberId: 1,
      kyc_type: 'id',
      kyc_id_type: 'National ID card',
      kyc_image_url: 'string',
      kyc_stat: 3,
      rejectionReason: 'string',
      createdAt: '2026-11-03T04:24:01.101Z',
      updatedAt: '2026-11-03T04:24:01.101Z',
    },
    code: 200,
  });
  readonly kycCard = computed(() => {
    const record = this.kycResponse().data;
    const status =
      record.kyc_stat === 1
        ? this.text().status.verified
        : record.kyc_stat === 2
          ? this.text().status.rejected
          : this.text().status.pending;
    const tone = record.kyc_stat === 1 ? 'success' : record.kyc_stat === 2 ? 'danger' : 'warning';
    const details = [
      { label: this.text().documentType, value: record.kyc_id_type || this.text().notProvided },
      {
        label: this.text().updatedAt,
        value: new Intl.DateTimeFormat(this.locale.language() === 'th' ? 'th-TH' : 'en-GB', {
          dateStyle: 'medium',
        }).format(new Date(record.updatedAt)),
      },
    ];
    if (record.kyc_stat === 2 && record.rejectionReason)
      details.push({ label: this.text().rejectionReason, value: record.rejectionReason });
    return { status, tone: tone as 'success' | 'warning' | 'danger', details };
  });

  signOut(): void {
    this.authStorage.clear();
    this.profileApi.clear();
    void this.route.navigate(['/login']);
  }
}

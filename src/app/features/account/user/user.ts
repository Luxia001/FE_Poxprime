import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language';
import { Verify } from '../../../shared/components/cards/verify/verify';
import { KycResponse } from './models/kyc-response';
import { ProfileResponse } from './models/profile-response';

@Component({
  imports: [Verify],
  selector: 'app-user',
  styleUrl: './user.css',
  templateUrl: './user.html',
})
export class User {
  readonly locale = inject(LanguageService);
  readonly text = this.locale.userText;
  readonly activeTab = signal(0);
  readonly profileResponse = signal<ProfileResponse>({
    result: true,
    message: 'Profile retrieved successfully',
    data: { id: 1, username: 'john_doe', email: 'john@example.com', firstName: 'John', lastName: 'Doe', phoneNumber: '+66812345678', country: 'Thailand', dateOfBirth: '1990-01-15', isKYC: true, referralCode: 'ABC123', profileImageUrl: 'string', createdAt: '2026-11-03T04:44:34.581Z', updatedAt: '2026-11-03T04:44:34.581Z' },
    code: 200,
  });
  readonly profile = computed(() => {
    const data = this.profileResponse().data;
    const locale = this.locale.language() === 'th' ? 'th-TH' : 'en-GB';
    return {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      initials: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase(),
      formattedBirthDate: new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${data.dateOfBirth}T00:00:00Z`)),
      formattedCreatedAt: new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(data.createdAt)),
    };
  });
  readonly kycResponse = signal<KycResponse>({
    result: true,
    message: 'KYC record retrieved successfully',
    data: {
      id: 1,
      memberId: 1,
      kyc_type: 'id',
      kyc_id_type: 'National ID card',
      kyc_image_url: 'string',
      kyc_stat: 1,
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
        ? this.text().verified
        : record.kyc_stat === 2
          ? this.text().rejected
          : this.text().pending;
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
}

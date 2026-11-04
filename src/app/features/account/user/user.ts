import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language';
import { Verify } from '../../../shared/components/UI/cards/verify/verify';
import { KycResponse } from '../models/kyc-response';
import { ProfileApi } from '../services/profile-api';
import { Router } from '@angular/router';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Profile } from '../../../shared/components/pages/profile/profile';

@Component({
  imports: [Verify, NzIconModule, NzButtonModule, Profile],
  selector: 'app-user',
  styleUrl: './user.css',
  templateUrl: './user.html',
})
export class User {
  private readonly router = inject(Router);
  readonly locale = inject(LanguageService);
  readonly text = this.locale.text;
  readonly activeTab = signal(0);

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
}

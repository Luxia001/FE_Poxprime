import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileApi } from '../account/services/profile-api';
import {
  Gender,
  ProfileUpdateErrorResponse,
  ProfileUpdateRequest,
} from '../account/models/profile-request.model';
import {
  StatusModal,
  StatusModalType,
} from '../../shared/components/modals/status-modal/status-modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PHONE_CODES } from '../../shared/pipes/phoneCode';
import { VerifyApi } from '../../shared/services/verify-sms.service';
import { CodeOTP } from '../auth/register/steps/code-otp/code-otp';

@Component({
  imports: [
    RouterLink,
    ReactiveFormsModule,
    StatusModal,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    CodeOTP,
  ],
  selector: 'app-kyc-verification',
  styleUrl: './kyc-verification.css',
  templateUrl: './kyc-verification.html',
})
export class KycVerification {
  readonly profileApi = inject(ProfileApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly verifyApi = inject(VerifyApi);
  private readonly profilePatched = signal(false);
  readonly submitted = signal(false);
  readonly modalOpen = signal(false);
  readonly modalType = signal<StatusModalType>('loading');
  readonly modalTitle = signal('');
  readonly modalMessage = signal('');
  readonly modalDetails = signal<string[]>([]);
  readonly otpRequested = signal(false);
  readonly otpModalOpen = signal(false);
  readonly otpSubmitting = signal(false);
  readonly otpError = signal('');
  readonly otpMemberRef = signal('');
  readonly otpExpiresAt = signal<number | null>(null);
  readonly sendOtpOnConfirm = signal(false);
  readonly phoneCodes = PHONE_CODES;
  readonly otp = this.fb.control('', [Validators.required, Validators.pattern(/^\d{6}$/)]);

  readonly profile = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z\s'-]*$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z\s'-]*$/)]],
    gender: this.fb.control<Gender | ''>('', Validators.required),
    nationality: ['', Validators.required],
    country: ['', Validators.required],
    identity: ['', Validators.required],
    birthDate: ['', Validators.required],
    phoneCode: ['+66', [Validators.required, Validators.pattern(/^\+\d{1,3}$/)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{5,14}$/)]],
    addressNo: ['', Validators.required],
    district: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{3,10}$/)]],
  });
  constructor() {
    this.profileApi.loadProfile();

    effect(() => {
      const response = this.profileApi.profile();
      if (!response) return;

      const { member, address } = response;

      this.profile.patchValue({
        firstName: member.m_name ?? '',
        lastName: member.m_lastname ?? '',
        gender: member.m_gender ?? '',
        nationality: member.m_nationality ?? '',
        country: member.m_country ?? '',
        identity: member.m_identity ?? '',
        birthDate: member.m_birthdate ? member.m_birthdate.slice(0, 10) : '',
        phoneCode: member.m_phone_code || '+66',
        phoneNumber: this.toLocalPhone(member.m_phone, member.m_phone_code),
        addressNo: address?.address_no ?? '',
        district: address?.address_district ?? '',
        city: address?.address_city ?? '',
        state: address?.address_state ?? member.m_state ?? '',
        zipCode: address?.address_zipcode ?? '',
      });

      this.profilePatched.set(true);
    });
  }

  /** ตัดรหัสประเทศและอักขระที่ไม่ใช่ตัวเลขออก */
  private toLocalPhone(phone: string | null, code: string | null): string {
    if (!phone) return '';
    const digitsCode = (code ?? '').replace(/\D/g, '');
    let digits = phone.replace(/\D/g, '');
    // ถ้าเบอร์ขึ้นต้นด้วยรหัสประเทศ (เช่น +660900000003) ให้ตัดออก
    if (phone.startsWith('+') && digitsCode && digits.startsWith(digitsCode)) {
      digits = digits.slice(digitsCode.length);
    }
    return digits;
  }

  submitForm(): void {
    this.submitted.set(true);
    Object.values(this.profile.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
    if (this.profile.invalid) return;
    const value = this.profile.getRawValue();
    const request: ProfileUpdateRequest = {
      member: {
        m_name: value.firstName.trim(),
        m_lastname: value.lastName.trim(),
        m_phone: value.phoneCode + value.phoneNumber,
        m_phone_code: value.phoneCode,
        m_gender: value.gender as Gender,
        m_nationality: value.nationality.trim() || null,
        m_country: value.country.trim() || null,
        m_identity: value.identity.trim() || null,
        m_birthdate: value.birthDate || null,
      },
      address: {
        address_no: value.addressNo.trim() || null,
        address_district: value.district.trim() || null,
        address_city: value.city.trim() || null,
        address_state: value.state.trim() || null,
        address_zipcode: value.zipCode.trim() || null,
      },
    };
    this.showModal(
      'loading',
      'Saving profile',
      'Please wait while we update your KYC information.',
    );
    this.profileApi.updateProfile(request).subscribe({
      next: (response) => {
        this.profileApi.loadProfile(true);
        this.sendOtpOnConfirm.set(true);
        this.showModal(
          'success',
          'Profile updated',
          response.message || 'Your information is ready for verification.',
        );
      },
      error: (error: ProfileUpdateErrorResponse) => {
        const details = (error.errors ?? []).map((item) =>
          typeof item === 'string' ? item : JSON.stringify(item),
        );
        this.showModal('error', 'Unable to update profile', error.error || error.message, details);
      },
    });
  }

  closeModal(): void {
    if (this.modalType() !== 'loading') this.modalOpen.set(false);
  }
  modalAction(): void {
    if (this.modalType() === 'success' && this.sendOtpOnConfirm()) {
      this.sendOtp();
      return;
    }
    this.modalOpen.set(false);
  }

  sendOtp(): void {
    this.otpModalOpen.set(false);
    this.sendOtpOnConfirm.set(false);
    this.showModal('loading', 'Sending OTP', 'Please wait while we send an OTP to your phone.');
    this.verifyApi.sendSmsOtp().subscribe({
      next: (data) => {
        this.modalOpen.set(false);
        this.otpRequested.set(true);
        this.otpMemberRef.set(data.memberRef);
        this.otpExpiresAt.set(data.expiresAt);
        this.otp.setValue('');
        this.otp.markAsUntouched();
        this.otpError.set('');
        this.otpModalOpen.set(true);
      },
      error: (error: { message?: string; error?: string | { message?: string } }) => {
        const detail = typeof error.error === 'string' ? error.error : error.error?.message;
        this.showModal(
          'error',
          'Unable to send OTP',
          detail || error.message || 'Please try again.',
        );
      },
    });
  }

  verifyOtp(): void {
    this.otp.markAsTouched();
    this.otp.markAsDirty();
    this.otp.updateValueAndValidity();
    if (this.otp.invalid || this.otpSubmitting()) return;

    this.otpSubmitting.set(true);
    this.otpError.set('');
    this.verifyApi
      .verifySmsOtp({
        memberRef: this.otpMemberRef(),
        otpCode: this.otp.getRawValue(),
        optional: 'KYC',
      })
      .subscribe({
        next: (response) => {
          this.otpSubmitting.set(false);
          this.otpModalOpen.set(false);
          this.sendOtpOnConfirm.set(false);
          this.showModal(
            'success',
            'OTP verified',
            response.message || 'Your phone number has been verified.',
          );
        },
        error: (error: { message?: string; error?: string | { message?: string } }) => {
          this.otpSubmitting.set(false);
          this.otpError.set(
            typeof error.error === 'string'
              ? error.error
              : error.error?.message || error.message || 'Invalid OTP.',
          );
        },
      });
  }

  private showModal(
    type: StatusModalType,
    title: string,
    message: string,
    details: string[] = [],
  ): void {
    this.modalType.set(type);
    this.modalTitle.set(title);
    this.modalMessage.set(message);
    this.modalDetails.set(details);
    this.modalOpen.set(true);
  }
}

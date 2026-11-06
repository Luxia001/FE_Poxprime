import { Component, ViewChild, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  StatusModal,
  StatusModalType,
} from '../../shared/components/UI/modals/status-modal/status-modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { VerifyApi } from '../../shared/services/verify/verify-sms.service';
import { Image } from '../../shared/components/UI/input/image/image';
import { KycApi } from '../../shared/services/verify/kyc.service';
import { KycIdType } from '../../shared/models/kyc-image';
import { finalize } from 'rxjs';
import { LanguageService } from '../../core/services/language';
import { ProfileEdit } from '../../shared/components/pages/profile-edit/profile-edit';
import { ProfileApi } from '../account/services/profile-api';
import { ProfileUpdateErrorResponse, ProfileUpdateRequest } from '../account/models/profile-request.model';
import { OtpModal } from '../../shared/components/UI/modals/otp-modal/otp-modal';

@Component({
  imports: [
    RouterLink,
    ReactiveFormsModule,
    StatusModal,
    NzButtonModule,
    OtpModal,
    Image,
    ProfileEdit,
  ],
  selector: 'app-kyc-verification',
  styleUrl: './kyc-verification.css',
  templateUrl: './kyc-verification.html',
})
export class KycVerification {
  @ViewChild(ProfileEdit) private profileForm?: ProfileEdit;
  readonly profileApi = inject(ProfileApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly verifyApi = inject(VerifyApi);
  private readonly kycApi = inject(KycApi);
  readonly locale = inject(LanguageService);
  readonly text = this.locale.text;
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
  readonly otp = this.fb.control('', [Validators.required, Validators.pattern(/^\d{6}$/)]);
  readonly idFile = signal<File | null>(null);
  readonly idType = signal<KycIdType>('National ID card');

  submitForm(): void {
    this.submitted.set(true);
    if (!this.idFile()) return;
    this.profileForm?.submitForm();
  }

  updateProfileForKyc(request: ProfileUpdateRequest): void {
    this.showModal('loading', 'Saving profile', 'Please wait while we update your KYC information.');
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
        next: () => this.uploadKycImage(),
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

  private uploadKycImage(): void {
    const file = this.idFile();
    if (!file) {
      this.otpSubmitting.set(false);
      this.otpError.set(
        'Identity document image is required. Please close this dialog and select a file.',
      );
      return;
    }

    this.otpModalOpen.set(false);
    this.showModal(
      'loading',
      'Uploading document',
      'OTP verified. Please wait while we upload your identity document.',
    );
    this.kycApi
      .upload(file, this.idType())
      .pipe(finalize(() => this.otpSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.sendOtpOnConfirm.set(false);
          this.kycApi.load();
          this.showModal(
            'success',
            'KYC submitted',
            'Your OTP was verified and identity document was uploaded successfully.',
          );
        },
        error: (error: { message?: string; error?: string | { message?: string } }) => {
          const detail = typeof error.error === 'string' ? error.error : error.error?.message;
          this.showModal(
            'error',
            'Unable to upload document',
            detail || error.message || 'Please try again.',
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

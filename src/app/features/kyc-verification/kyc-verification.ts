import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileApi } from '../account/services/profile-api';
import { Gender, ProfileUpdateErrorResponse, ProfileUpdateRequest } from '../account/models/profile-request.model';
import { StatusModal, StatusModalType } from '../../shared/components/modals/status-modal/status-modal';

@Component({
  imports: [RouterLink, ReactiveFormsModule, StatusModal],
  selector: 'app-kyc-verification',
  styleUrl: './kyc-verification.css',
  templateUrl: './kyc-verification.html',
})
export class KycVerification {
  readonly profileApi = inject(ProfileApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly profilePatched = signal(false);
  readonly submitted = signal(false);
  readonly modalOpen = signal(false);
  readonly modalType = signal<StatusModalType>('loading');
  readonly modalTitle = signal('');
  readonly modalMessage = signal('');
  readonly modalDetails = signal<string[]>([]);
  readonly otpRequested = signal(false);

  readonly form = this.fb.group({
    firstName: ['', Validators.required], lastName: ['', Validators.required],
    gender: this.fb.control<Gender>('MALE', Validators.required), nationality: ['', Validators.required],
    country: ['', Validators.required], identity: ['', Validators.required], birthDate: ['', Validators.required],
    phoneCode: ['+66', [Validators.required, Validators.pattern(/^\+\d{1,3}$/)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{5,14}$/)]],
    addressNo: ['', Validators.required], district: [''], city: ['', Validators.required], state: [''],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{3,10}$/)]],
  });

  constructor() {
    this.profileApi.loadProfile();
    effect(() => {
      const profile = this.profileApi.profile();
      if (!profile || this.profilePatched()) return;
      this.form.patchValue({ firstName: profile.firstName, lastName: profile.lastName, phoneNumber: profile.phone.replace(/\D/g, ''), country: profile.country ?? '' });
      this.profilePatched.set(true);
    });
  }

  submitForm(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const request: ProfileUpdateRequest = {
      member: {
        m_name: value.firstName.trim(), m_lastname: value.lastName.trim(), m_phone: value.phoneNumber,
        m_phone_code: value.phoneCode, m_gender: value.gender, m_nationality: value.nationality.trim() || null,
        m_country: value.country.trim() || null, m_identity: value.identity.trim() || null, m_birthdate: value.birthDate || null,
      },
      address: {
        address_no: value.addressNo.trim() || null, address_district: value.district.trim() || null,
        address_city: value.city.trim() || null, address_state: value.state.trim() || null,
        address_zipcode: value.zipCode.trim() || null,
      },
    };
    this.showModal('loading', 'Saving profile', 'Please wait while we update your KYC information.');
    this.profileApi.updateProfile(request).subscribe({
      next: (response) => {
        this.profileApi.loadProfile(true);
        this.showModal('success', 'Profile updated', response.message || 'Your information is ready for verification.');
      },
      error: (error: ProfileUpdateErrorResponse) => {
        const details = (error.errors ?? []).map((item) => typeof item === 'string' ? item : JSON.stringify(item));
        this.showModal('error', 'Unable to update profile', error.error || error.message, details);
      },
    });
  }

  closeModal(): void { if (this.modalType() !== 'loading') this.modalOpen.set(false); }
  modalAction(): void {
    if (this.modalType() === 'success') this.otpRequested.set(true);
    this.modalOpen.set(false);
  }

  private showModal(type: StatusModalType, title: string, message: string, details: string[] = []): void {
    this.modalType.set(type); this.modalTitle.set(title); this.modalMessage.set(message);
    this.modalDetails.set(details); this.modalOpen.set(true);
  }
}

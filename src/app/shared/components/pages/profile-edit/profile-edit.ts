import { Component, effect, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Gender,
  ProfileUpdateRequest,
} from '../../../../features/account/models/profile-request.model';
import { maxBirthDate, minAge } from '../../../pipes/validate-age.validators';
import { ProfileApi } from '../../../../features/account/services/profile-api';
import { PHONE_CODES, toLocalPhone } from '../../../pipes/phoneCode';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
  selector: 'app-profile-edit',
  styleUrl: './profile-edit.css',
  templateUrl: './profile-edit.html',
})
export class ProfileEdit {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly profileApi = inject(ProfileApi);
  private readonly profilePatched = signal(false);
  readonly phoneCodes = PHONE_CODES;
  readonly maxBirthDate = maxBirthDate(18);
  readonly submitted = signal(false);
  readonly submitting = input(false);
  readonly submitLabel = input('Save changes');
  readonly showSubmit = input(true);
  readonly formSubmitted = output<ProfileUpdateRequest>();

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
        phoneNumber: toLocalPhone(member.m_phone, member.m_phone_code),
        addressNo: address?.address_no ?? '',
        district: address?.address_district ?? '',
        city: address?.address_city ?? '',
        state: address?.address_state ?? member.m_state ?? '',
        zipCode: address?.address_zipcode ?? '',
      });

      this.profilePatched.set(true);
    });
  }

  readonly profile = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z\s'-]*$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z\s'-]*$/)]],
    gender: this.fb.control<Gender | ''>('', Validators.required),
    nationality: ['', Validators.required],
    country: ['', Validators.required],
    identity: ['', Validators.required],
    birthDate: ['', [Validators.required, minAge(18)]],
    phoneCode: ['+66', [Validators.required, Validators.pattern(/^\+\d{1,3}$/)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{5,14}$/)]],
    addressNo: ['', Validators.required],
    district: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{3,10}$/)]],
  });

  submitForm(): void {
    this.submitted.set(true);
    Object.values(this.profile.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    });
    if (this.profile.invalid || this.submitting()) return;

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

    this.formSubmitted.emit(request);
  }
}

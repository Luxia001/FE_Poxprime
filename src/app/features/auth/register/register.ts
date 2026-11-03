import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ContactPassword } from './steps/contact-password/contact-password';

import { TermCondition } from './steps/term-condition/term-condition';
import { GeneralInfo } from './steps/general-info/general-info';
import { RegisterRequest } from './models/register-request';
import { RegisterApiService } from './services/register-api';
import { RegisterErrorResponse } from './models/register-response';
import {
  StatusModal,
  StatusModalType,
} from '../../../shared/components/modals/status-modal/status-modal';

@Component({
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    GeneralInfo,
    ContactPassword,
    TermCondition,
    StatusModal,
  ],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly registerApi = inject(RegisterApiService);
  readonly checkbox = signal(false);
  readonly step = signal(0);
  readonly submitting = signal(false);
  readonly modalOpen = signal(false);
  readonly modalType = signal<StatusModalType>('loading');
  readonly modalTitle = signal('');
  readonly modalMessage = signal('');
  readonly modalDetails = signal<string[]>([]);
  readonly locale = inject(LanguageService);
  readonly text = this.locale.registerText;
  readonly titles = computed(() => [
    this.text().terms,
    this.text().generalInfo,
    this.text().contactPassword,
  ]);
  readonly profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)]],
    gender: ['', Validators.required],
    country: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
  });
  readonly contactForm = this.fb.group(
    {
      phoneNumberPrefix: ['+66', [Validators.required, Validators.pattern(/^\+\d{1,3}$/)]],
      phoneNumber: [
        '',
        [
          Validators.required,
          (control: AbstractControl) =>
            /^[\d\s()-]+$/.test(control.value) &&
            /^\d{5,14}$/.test(control.value.replace(/\D/g, ''))
              ? null
              : { phone: true },
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: (group: AbstractControl) => {
        const errors: Record<string, boolean> = {};
        if (group.get('password')?.value !== group.get('confirmPassword')?.value)
          errors['passwordMismatch'] = true;
        const phone =
          `${group.get('phoneNumberPrefix')?.value ?? ''}${group.get('phoneNumber')?.value ?? ''}`.replace(
            /\D/g,
            '',
          );
        if (phone.length < 8 || phone.length > 15) errors['phoneLength'] = true;
        return Object.keys(errors).length ? errors : null;
      },
    },
  );
  next(): void {
    if (!this.checkbox()) return;
    if (this.step() === 1) {
      this.profileForm.markAllAsTouched();
      if (this.profileForm.invalid) return;
    }
    if (this.step() === 2) {
      this.submitRegistration();
      return;
    }
    if (this.step() < 2) this.step.update((step) => step + 1);
  }

  goback(): void {
    if (this.step() > 0) this.step.update((step) => step - 1);
    else void this.router.navigate(['/login']);
  }

  submitForm(): RegisterRequest | null {
    this.profileForm.markAllAsTouched();
    this.contactForm.markAllAsTouched();
    if (!this.checkbox() || this.profileForm.invalid || this.contactForm.invalid) return null;

    const profile = this.profileForm.getRawValue();
    const contact = this.contactForm.getRawValue();
    const request: RegisterRequest = {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email: contact.email.trim(),
      password: contact.password,
      confirmPassword: contact.confirmPassword,
      phoneCode: contact.phoneNumberPrefix,
      phoneNumber: contact.phoneNumber.replace(/\D/g, ''),
      country: profile.country.trim(),
      referralCode: '',
      saleCode: '',
      terms: 'true',
    };
    return request;
  }

  submitRegistration(): void {
    const request = this.submitForm();
    if (!request || this.submitting()) return;

    this.submitting.set(true);
    this.showModal(
      'loading',
      'Creating your account',
      'Please wait while we register your account.',
    );
    this.registerApi.register(request).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.showModal('success', 'Registration successful', response.message);
      },
      error: (error: RegisterErrorResponse) => {
        this.submitting.set(false);
        const message = error.error?.message ?? error.message;
        this.showModal('error', 'Registration failed', message, error.errors ?? []);
      },
    });
  }

  closeModal(): void {
    if (this.submitting()) return;
    const succeeded = this.modalType() === 'success';
    this.modalOpen.set(false);
    if (succeeded) void this.router.navigate(['/login']);
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

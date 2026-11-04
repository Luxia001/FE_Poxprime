import { LanguageService } from '../../../../../core/services/language';
import { Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
export type ContactForm = FormGroup<{
  phoneNumberPrefix: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}>;
@Component({
  selector: 'app-contact-password',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-password.html',
})
export class ContactPassword {
  readonly text = inject(LanguageService).text;
  readonly form = input.required<ContactForm>();
  readonly fields = [
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      autocomplete: 'email',
      placeholder: 'you@example.com',
      error: 'Enter a valid email address.',
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      autocomplete: 'new-password',
      placeholder: 'At least 8 characters',
      hint: 'Use 8+ characters with uppercase, lowercase and a number.',
      error:
        'Password must be at least 8 characters and include uppercase, lowercase and a number.',
    },
    {
      key: 'confirmPassword',
      label: 'Confirm password',
      type: 'password',
      autocomplete: 'new-password',
      placeholder: 'Re-enter your password',
      error: 'Confirm your password.',
    },
  ] as const;
}

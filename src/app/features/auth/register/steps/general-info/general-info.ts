import { LanguageService } from '../../../../../core/services/language';
import { Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type ProfileForm = FormGroup<{
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  gender: FormControl<string>;
  country: FormControl<string>;
}>;

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-general-info',
  styleUrl: './general-info.css',
  templateUrl: './general-info.html',
})
export class GeneralInfo {
  readonly text = inject(LanguageService).text;
  readonly form = input.required<ProfileForm>();
  readonly names = [
    { key: 'firstName', label: 'First name (Eng)', autocomplete: 'given-name' },
    { key: 'lastName', label: 'Last name (Eng)', autocomplete: 'family-name' },
  ] as const;
}


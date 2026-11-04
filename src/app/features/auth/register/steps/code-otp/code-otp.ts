import { LanguageService } from '../../../../../core/services/language';
import { Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';

@Component({
  imports: [ReactiveFormsModule, NzInputOtpComponent],
  selector: 'app-code-otp',
  styleUrl: './code-otp.css',
  templateUrl: './code-otp.html',
})
export class CodeOTP {
  readonly text = inject(LanguageService).text;
  readonly control = input.required<FormControl<string>>();
  readonly formatter = (value: string): string => value.replace(/\D/g, '');
}


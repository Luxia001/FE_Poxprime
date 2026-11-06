import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankAccountApi } from '../services/bookbank.service';
import { BANKS } from '../../../shared/pipes/bank.pipe';
import { finalize } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LanguageService } from '../../../core/services/language';

@Component({
  imports: [ReactiveFormsModule, NzFormModule, NzSelectModule, NzInputModule, NzButtonModule],
  selector: 'app-book-bank',
  styleUrl: './book-bank.css',
  templateUrl: './book-bank.html',
})
export class BookBank {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly api = inject(BankAccountApi);
  readonly text = inject(LanguageService).text;

  readonly banks = BANKS;
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly submitted = signal(false);

  readonly form = this.fb.group({
    bankCode: ['', Validators.required],
    branch: ['', [Validators.required, Validators.maxLength(100)]],
    accountName: ['', [Validators.required, Validators.maxLength(100)]],
    accountNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
  });

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const bank = this.banks.find((b) => b.code === v.bankCode);
    if (!bank) return;

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.api
      .add({
        bank_name: bank.nameTh,
        bank_branch: v.branch.trim(),
        bank_code: bank.code,
        bank_account_number: v.accountNumber,
        bank_account_name: v.accountName.trim(),
        bank_image: bank.image,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.form.reset({ bankCode: '', branch: '', accountName: '', accountNumber: '' });
          this.submitted.set(false);
          this.success.set('Bank account added successfully.');
        },
        error: (err: { message?: string; error?: string | { message?: string } }) => {
          const detail = typeof err.error === 'string' ? err.error : err.error?.message;
          this.error.set(detail || err.message || 'Unable to add bank account.');
        },
      });
  }

  sanitizeAccountNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 15);
    input.value = digits;
    this.form.controls.accountNumber.setValue(digits);
  }

  maskAccountNumber(value: string): string {
    if (value.length <= 4) return value;
    return `•••• •••• ${value.slice(-4)}`;
  }
}

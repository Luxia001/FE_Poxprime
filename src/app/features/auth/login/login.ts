import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LanguageService } from '../../../core/services/language';

@Component({
  imports: [ReactiveFormsModule, RouterLink, NzButtonModule, NzInputModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly router = inject(Router);
  readonly locale = inject(LanguageService);
  readonly text = this.locale.loginText;
  readonly showPassword = signal(false);
  readonly submitted = signal(false);
  readonly unavailable = signal(false);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly validateForm = this.fb.group({
    Email: ['', Validators.required, Validators.email],
    password: ['', Validators.required],
    remember: [true],
  });

  submitForm(): void {
    this.submitted.set(true);
    this.unavailable.set(false);
    this.validateForm.markAllAsTouched();
    if (this.validateForm.valid) {
         this.unavailable.set(true);
    }
    this.router.navigate(['/main/user']);
  }
}

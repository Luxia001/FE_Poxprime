import { Component, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CodeOTP } from '../../../../../features/auth/register/steps/code-otp/code-otp';

@Component({
  selector: 'app-otp-modal',
  imports: [NzButtonModule, CodeOTP],
  templateUrl: './otp-modal.html',
})
export class OtpModal {
  readonly open = input(false);
  readonly title = input('Verify OTP');
  readonly message = input('Enter the 6-digit verification code.');
  readonly control = input.required<FormControl<string>>();
  readonly submitting = input(false);
  readonly error = input('');
  readonly showResend = input(false);
  readonly rememberDevice = input(false);
  readonly showRememberDevice = input(false);
  readonly closed = output<void>();
  readonly confirmed = output<void>();
  readonly resend = output<void>();
  readonly rememberDeviceChange = output<boolean>();
}

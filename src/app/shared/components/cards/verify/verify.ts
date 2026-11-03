import { Component, input, output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
export interface VerifyCardDetail {
  label: string;
  value: string;
}

@Component({
  imports: [NzIconModule],
  selector: 'app-verify',
  styleUrl: './verify.css',
  templateUrl: './verify.html',
})
export class Verify {
  readonly title = input('Title');
  readonly description = input('description');
  readonly iconType = input('safety');
  readonly status = input('');
  readonly statusTone = input<'success' | 'warning' | 'danger' | 'neutral'>('neutral');
  readonly actionLabel = input('');
  readonly details = input<VerifyCardDetail[]>([]);
  readonly action = output<void>();
}

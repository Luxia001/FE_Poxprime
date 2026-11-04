import { Component, computed, inject, input, output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LanguageService } from '../../../../core/services/language';

export interface VerifyCardDetail {
  label: string;
  value: string;
}

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';
type StatusKey = 'pending' | 'verified' | 'notVerified';

const STATE_MAP: Record<number, { status: StatusKey; tone: StatusTone }> = {
  1: { status: 'verified', tone: 'success' },
  3: { status: 'notVerified', tone: 'warning' },
};

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
  readonly actionLabel = input(3);
  readonly action = output<void>();

  private readonly locale = inject(LanguageService);
  readonly text = this.locale.text;

  private readonly state = computed(() => STATE_MAP[this.actionLabel()] ?? STATE_MAP[3]);

  readonly status = computed(() => this.text().status[this.state().status]);
  readonly statusTone = computed(() => this.state().tone);
}

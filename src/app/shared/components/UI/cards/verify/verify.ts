import { Component, computed, inject, input, output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LanguageService } from '../../../../../core/services/language';

export interface VerifyCardDetail {
  label: string;
  value: string;
}

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';
type StatusKey = 'pending' | 'verified' | 'notVerified' | 'notEnabled';
type DisplayMode = 'badge' | 'link';

const STATE_MAP: Record<number, { status: StatusKey; tone: StatusTone; mode: DisplayMode }> = {
  0: { status: 'pending', tone: 'warning', mode: 'badge' },
  1: { status: 'verified', tone: 'success', mode: 'badge' },
  2: { status: 'notVerified', tone: 'danger', mode: 'link' },
  3: { status: 'notEnabled', tone: 'neutral', mode: 'link' },
};

@Component({
  imports: [NzIconModule],
  selector: 'app-verify',
  styleUrl: './verify.css',
  templateUrl: './verify.html',
})
export class Verify {
  readonly title = input('Title');
  readonly description = input<string | string[]>('');
  readonly iconType = input('safety');
  readonly actionLabel = input(0);
  readonly action = output<void>();

  private readonly locale = inject(LanguageService);
  readonly text = this.locale.text;
  private readonly state = computed(() => STATE_MAP[this.actionLabel()] ?? STATE_MAP[3]);

  readonly descriptionLines = computed(() => {
    const d = this.description();
    return Array.isArray(d) ? d : d ? [d] : [];
  });
  readonly status = computed(() => this.text().status[this.state().status]);
  readonly statusTone = computed(() => this.state().tone);
  readonly mode = computed(() => this.state().mode);
}

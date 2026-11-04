import { Component, input, output } from '@angular/core';

export type StatusModalType = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.html',
})
export class StatusModal {
  readonly open = input(false);
  readonly type = input<StatusModalType>('loading');
  readonly title = input('');
  readonly message = input('');
  readonly details = input<string[]>([]);
  readonly actionLabel = input('');
  readonly closed = output<void>();
  readonly confirmed = output<void>();
}

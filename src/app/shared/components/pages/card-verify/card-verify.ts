import { Component, computed, input } from '@angular/core';

export type CardDocType = 'National ID card' | 'Passport';

@Component({
  selector: 'app-card-verify',
  styleUrl: './card-verify.css',
  templateUrl: './card-verify.html',
})
export class CardVerify {
  readonly docType = input<CardDocType>('National ID card');

  readonly isPassport = computed(() => this.docType() === 'Passport');

  readonly sample = computed(() =>
    this.isPassport()
      ? { src: '/images/cards/passport.png', alt: 'Passport sample' }
      : { src: '/images/cards/idcard.png', alt: 'ID card sample' },
  );
}

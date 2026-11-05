import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../../../../core/services/language';

@Component({
  imports: [],
  selector: 'app-bar-head',
  styleUrl: './bar-head.css',
  templateUrl: './bar-head.html',
})
export class BarHead {
  readonly locale = inject(LanguageService);
  readonly text = this.locale.text;
  readonly header = input.required<string>();
  readonly title = computed(() => {
    const texts = this.text() as Record<string, unknown>;
    const value = texts[this.header()];
    return typeof value === 'string' ? value : this.header(); // ไม่เจอ key ให้โชว์ key เอง จะได้เห็นว่าพิมพ์ผิด
  });
}

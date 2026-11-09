import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-text-head',
  styleUrl: './text-head.css',
  templateUrl: './text-head.html',
})
export class TextHead {
  readonly title = input<string | number>('Menu'); // มีค่า default
}

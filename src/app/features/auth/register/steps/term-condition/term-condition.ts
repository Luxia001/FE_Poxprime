import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-term-condition',
  styleUrl: './term-condition.css',
  templateUrl: './term-condition.html',
})
export class TermCondition {
  readonly accepted = input(false);
  readonly acceptedChange = output<boolean>();
}

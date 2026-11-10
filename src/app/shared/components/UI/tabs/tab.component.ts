import { Component, ElementRef, input, model, viewChildren } from '@angular/core';

export interface TabItem<K extends string = string> {
  key: K;
  label: string;
  count?: number; // แสดง badge ถ้ามี
  disabled?: boolean;
}

@Component({
  imports: [],
  selector: 'app-tabs',
  templateUrl: './tab.component.html',
})
export class TabUI {
  readonly tabs = input.required<TabItem[]>();
  readonly active = model.required<string>();
  readonly label = input('Tabs');

  select(key: string): void {
    this.active.set(key);
  }
}

import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    NzButtonModule,
    NzIconModule,
    NzMenuModule,
    NzTooltipModule,
  ],
  selector: 'app-sidebar-button',
  styleUrl: './sidebar-button.css',
  templateUrl: './sidebar-button.html',
})
export class SidebarButton {
  readonly title = input.required<string>();
  readonly iconType = input.required<string>();
  readonly routeLink = input<string | null>(null);
  readonly isCollapsed = input(false);
  readonly navigated = output<void>();
}

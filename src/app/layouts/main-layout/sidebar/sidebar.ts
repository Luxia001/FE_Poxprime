import { Component, inject, model, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { TextHead } from '../../../shared/components/headers/text-head/text-head';

@Component({
  imports: [
    NzAvatarModule,
    NzButtonModule,
    NzIconModule,
    NzMenuModule,
    NzTooltipModule,
    RouterLink,
    TextHead,
  ],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly isCollapsed = model(false);
  private readonly route = inject(Router);

  toggleCollapsed(): void {
    this.isCollapsed.update((isCollapsed) => !isCollapsed);
  }

  signOut() {
    this.route.navigate(['login']);
  }
}

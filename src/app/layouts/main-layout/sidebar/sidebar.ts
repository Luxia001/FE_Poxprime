import { Component, inject, model, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { TextHead } from '../../../shared/components/headers/text-head/text-head';
import { AuthStorageService } from '../../../core/services/auth-storage';
import { ProfileApi } from '../../../features/account/services/profile-api';

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
  readonly navigated = output<void>();
  private readonly route = inject(Router);
  private readonly authStorage = inject(AuthStorageService);
  readonly profileApi = inject(ProfileApi);

  constructor() {
    this.profileApi.loadProfile();
  }

  toggleCollapsed(): void {
    this.isCollapsed.update((isCollapsed) => !isCollapsed);
  }

  signOut(): void {
    this.authStorage.clear();
    this.profileApi.clear();
    this.navigated.emit();
    void this.route.navigate(['/login']);
  }
}

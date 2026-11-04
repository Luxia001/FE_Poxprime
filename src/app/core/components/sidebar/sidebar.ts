import { Component, inject, model, output } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { TextHead } from '../../../shared/components/headers/text-head/text-head';
import { ProfileApi } from '../../../features/account/services/profile-api';
import { SidebarButton } from '../../../shared/components/button/sidebar-button/sidebar-button';

interface MenuItem {
  title: string;
  icon: string;
  link: string | null;
}

interface SidebarMenu {
  header: string;
  menu: MenuItem[];
}

@Component({
  imports: [
    NzAvatarModule,
    NzButtonModule,
    NzIconModule,
    NzMenuModule,
    NzTooltipModule,
    TextHead,
    SidebarButton,
  ],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly isCollapsed = model(false);
  readonly navigated = output<void>();
  readonly profileApi = inject(ProfileApi);
  readonly accountMenus: SidebarMenu[] = [
    {
      header: 'General',
      menu: [
        { title: 'Dashboard', icon: '', link: null },
        { title: 'Profile', icon: '', link: null },
      ],
    },
    {
      header: 'Feature',
      menu: [
        { title: 'Pip Battle', icon: '', link: null },
        { title: 'Social Trade', icon: '', link: null },
        { title: 'Guzebot', icon: '', link: null },
        { title: 'Investment', icon: '', link: null },
        { title: 'Rebate Program', icon: '', link: null },
        { title: 'Transactions', icon: '', link: null },
      ],
    },
    {
      header: 'Partner Program',
      menu: [
        { title: 'IB Partner', icon: '', link: null },
        { title: 'Referrals', icon: '', link: null },
      ],
    },
    {
      header: 'Account',
      menu: [
        { title: 'Notification Center', icon: '', link: null },
        { title: 'Profile', icon: 'user', link: '/main/user' },
        { title: 'Account Security', icon: 'safety-certificate', link: '/main/security' },
        { title: 'Download MT5', icon: '', link: null },
      ],
    },
  ];

  constructor() {
    this.profileApi.loadProfile();
  }

  toggleCollapsed(): void {
    this.isCollapsed.update((isCollapsed) => !isCollapsed);
  }
}

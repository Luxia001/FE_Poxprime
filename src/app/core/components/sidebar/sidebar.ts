import { Component, computed, inject, model, output } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { TextHead } from '../../../shared/components/UI/headers/text-head/text-head';
import { ProfileApi } from '../../../features/account/services/profile-api';
import { SidebarButton } from '../../../shared/components/UI/button/sidebar-button/sidebar-button';

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
  readonly profileDisplay = computed(() => {
    const response = this.profileApi.profile();
    return {
      fullName: `${response?.member.m_name} ${response?.member.m_lastname}`.trim(),
      email: response?.member.email,
      imageUrl: response?.member.m_image_url,
    };
  });
  readonly accountMenus: SidebarMenu[] = [
    {
      header: 'General',
      menu: [
        { title: 'Dashboard', icon: 'appstore', link: '/general/dashboard' },
        { title: 'MT5 & Wallet', icon: 'wallet', link: null },
      ],
    },
    {
      header: 'Feature',
      menu: [
        { title: 'Pip Battle', icon: 'sketch', link: null },
        { title: 'Social Trade', icon: 'usergroup-add', link: null },
        { title: 'Guzebot', icon: 'robot', link: null },
        { title: 'Investment', icon: 'credit-card', link: null },
        { title: 'Rebate Program', icon: 'product', link: null },
        { title: 'Transactions', icon: 'transaction', link: null },
      ],
    },
    {
      header: 'Partner Program',
      menu: [
        { title: 'IB Partner', icon: 'gateway', link: null },
        { title: 'Referrals', icon: 'user-add', link: null },
      ],
    },
    {
      header: 'Account',
      menu: [
        { title: 'Notification Center', icon: 'bell', link: null },
        { title: 'Profile', icon: 'user', link: '/account/user' },
        { title: 'Account Security', icon: 'safety-certificate', link: '/account/security' },
        { title: 'Download MT5', icon: 'cloud-download', link: '/account/downloadMT5' },
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

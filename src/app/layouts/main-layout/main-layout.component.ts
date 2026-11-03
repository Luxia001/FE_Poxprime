import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="flex bg-[#F9FAFB] p-5">
      <app-sidebar />
      <main class="flex-1 overflow-auto mx-5">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [],
})
export class MainLayoutComponent {}

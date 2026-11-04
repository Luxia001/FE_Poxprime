import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../core/components/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="relative md:flex min-h-dvh bg-[#F9FAFB] p-5">
      <button
        type="button"
        (click)="mobileSidebarOpen.set(true)"
        class="sticky left-4 top-4 z-30 flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 shadow-md md:hidden"
        aria-label="Open navigation"
        [attr.aria-expanded]="mobileSidebarOpen()"
      >
        ☰
      </button>

      @if (mobileSidebarOpen()) {
        <button
          type="button"
          class="fixed inset-0 z-40 border-0 bg-slate-950/50 backdrop-blur-sm md:hidden"
          aria-label="Close navigation"
          (click)="mobileSidebarOpen.set(false)"
        ></button>
      }

      <div
        class="absolute inset-y-0 left-0 z-50 transition-transform duration-300 md:static md:translate-x-0 md:pr-5"
        [class.translate-x-0]="mobileSidebarOpen()"
        [class.-translate-x-full]="!mobileSidebarOpen()"
      >
        <button
          type="button"
          (click)="mobileSidebarOpen.set(false)"
          class="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-lg bg-white/20 text-xl text-white md:hidden"
          aria-label="Close navigation"
        >
          ×
        </button>
        <app-sidebar (navigated)="mobileSidebarOpen.set(false)" />
      </div>

      <main class="min-w-0 flex-1 w-full">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [],
})
export class MainLayoutComponent {
  readonly mobileSidebarOpen = signal(false);
}

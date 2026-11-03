import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../core/components/navbar/navbar';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  template: `
    <div class=" grid gap-2 grid-cols-1 place-content-start  bg-blue-100 p-3 min-h-dvh">
      <app-navbar />
      <router-outlet />
    </div>
  `,
  styles: [],
})
export class AuthLayoutComponent {}

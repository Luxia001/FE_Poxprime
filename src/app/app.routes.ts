import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { User } from './features/account/user/user';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AccountSecurity } from './features/account/account-security/account-security';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'signup',
        component: Register,
      },
    ],
  },
  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [],
    children: [
      { path: 'user', component: User },
      {
        path: 'security',
        component: AccountSecurity,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

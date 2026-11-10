import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { User } from './features/account/user/user';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AccountSecurity } from './features/account/account-security/account-security';
import { authGuard } from './core/guards/auth.guard';
import { KycVerification } from './features/kyc-verification/kyc-verification';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { Download } from './features/account/download/download';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'general/dashboard',
  }, // app.routes.ts (อยู่นอก authGuard, ใต้ auth layout หรือ route เดี่ยว)
  {
    path: 'v1/member/verification/:token',
    loadComponent: () =>
      import('./features/auth/login/login-email.component').then((m) => m.VerifyEmail),
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
      {
        path: 'forgotpassword',
        component: ForgotPassword,
      },
    ],
  },
  {
    path: 'account',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'user',
        component: User,
      },
      { path: 'kyc-verification', component: KycVerification },
      {
        path: 'edit-profile',
        loadComponent: () =>
          import('./features/account/edit-profile/edit-profile').then(
            (component) => component.EditProfilePage,
          ),
      },
      {
        path: 'google-verification',
        loadComponent: () =>
          import('./shared/components/pages/google-auth/google-auth').then(
            (component) => component.GoogleAuth,
          ),
      },
      {
        path: 'security',
        component: AccountSecurity,
      },
      {
        path: 'downloadMT5',
        component: Download,
      },
    ],
  },
  {
    path: 'general',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/general/dashboard/dashboard').then((component) => component.Dashboard),
      },
      {
        path: 'wallet',
        loadComponent: () =>
          import('./features/general/wallet/wallet').then((component) => component.Wallet),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

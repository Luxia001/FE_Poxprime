import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/auth-storage';

export const authGuard: CanActivateFn = (_route, state) => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (authStorage.isAuthenticated()) return true;

  authStorage.clear();
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

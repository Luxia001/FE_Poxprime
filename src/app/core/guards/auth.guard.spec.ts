import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStorageService } from '../services/auth-storage';

describe('authGuard', () => {
  let storage: AuthStorageService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    storage = TestBed.inject(AuthStorageService);
    router = TestBed.inject(Router);
    storage.clear();
  });

  afterEach(() => storage.clear());

  it('should redirect unauthenticated users to login with a return URL', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/main/user' } as never),
    );
    expect(router.serializeUrl(result as ReturnType<Router['createUrlTree']>)).toBe(
      '/login?returnUrl=%2Fmain%2Fuser',
    );
  });

  it('should allow users when all authentication values exist', () => {
    storage.save({ accessToken: 'access', refreshToken: 'refresh', sessionUid: 'session' });
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/main/user' } as never),
    );
    expect(result).toBe(true);
  });
});

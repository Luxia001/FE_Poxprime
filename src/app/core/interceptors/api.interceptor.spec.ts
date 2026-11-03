import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStorageService } from '../services/auth-storage';
import { apiInterceptor, refreshTokenInterceptor } from './api.interceptor';

describe('API refresh token interceptors', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let storage: AuthStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiInterceptor, refreshTokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    storage = TestBed.inject(AuthStorageService);
    storage.save({ accessToken: 'expired-token', refreshToken: 'refresh-token', sessionUid: 'session-uid' });
  });

  afterEach(() => {
    controller.verify();
    storage.clear();
  });

  it('should refresh an expired token and retry the original request', () => {
    let result: unknown;
    http.get('https://stg-portal-api.speedandnumber.com/v1/member/profile').subscribe((value) => result = value);

    const failedRequest = controller.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile');
    expect(failedRequest.request.headers.get('Authorization')).toBe('Bearer expired-token');
    failedRequest.flush({ message: 'jwt expired' }, { status: 401, statusText: 'Unauthorized' });

    const refreshRequest = controller.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/refresh-token');
    expect(refreshRequest.request.body).toEqual({ refreshToken: 'refresh-token' });
    refreshRequest.flush({
      result: true,
      message: 'Token refreshed',
      data: { accessToken: 'new-token', expiresIn: 900000 },
      code: 200,
    });

    const retriedRequest = controller.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile');
    expect(retriedRequest.request.headers.get('Authorization')).toBe('Bearer new-token');
    retriedRequest.flush({ result: true });

    expect(storage.accessToken).toBe('new-token');
    expect(storage.refreshToken).toBe('refresh-token');
    expect(result).toEqual({ result: true });
  });
});

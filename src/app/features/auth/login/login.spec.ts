import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([{ path: 'main/user', component: Login }]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
    await fixture.whenStable();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate empty credentials and mask the password by default', async () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(2);
    expect(fixture.nativeElement.querySelector('#password').type).toBe('password');
    fixture.nativeElement.querySelector('.toggle-password').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('#password').type).toBe('text');
    expect(component.errorMessage()).toBe('');
  });

  it('should store tokens and navigate after a successful login', () => {
    component.validateForm.setValue({ Email: 'john@example.com', password: 'Password123', remember: true });
    component.submitForm();

    const request = http.expectOne('https://stg-portal-api.speedandnumber.com/v1/auth/login');
    expect(request.request.body).toEqual({ usernameOrEmail: 'john@example.com', password: 'Password123' });
    request.flush({
      result: true,
      message: 'Login successful',
      data: {
        require2FA: false,
        member: {},
        accessToken: 'access-123',
        refreshToken: 'refresh-123',
        expiresIn: 900000,
        sessionUid: 'session-123',
      },
      code: 200,
    });

    expect(localStorage.getItem('accessToken')).toBe('access-123');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-123');
    expect(localStorage.getItem('sessionUid')).toBe('session-123');
  });

  it('should show the API error without storing credentials', () => {
    component.validateForm.setValue({ Email: 'john@example.com', password: 'wrong-password', remember: true });
    component.submitForm();
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/auth/login').flush(
      { result: false, message: 'Invalid credentials', code: 401 },
      { status: 401, statusText: 'Unauthorized' },
    );
    expect(component.errorMessage()).toBe('Invalid credentials');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});

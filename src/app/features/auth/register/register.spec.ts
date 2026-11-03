import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map a valid register request only after validation', () => {
      expect(component.submitForm()).toBeNull();
      component.checkbox.set(true);
      component.profileForm.setValue({ firstName: 'Fox', lastName: 'Guze', gender: 'male', country: 'Thailand' });
      component.contactForm.setValue({ phoneNumberPrefix: '+66', phoneNumber: '869 666 363', email: 'foxguze@gmail.com', password: 'Welcome168', confirmPassword: 'Welcome168' });
      const request = component.submitForm();
      expect(request).toEqual({ firstName: 'Fox', lastName: 'Guze', email: 'foxguze@gmail.com', password: 'Welcome168', confirmPassword: 'Welcome168', phoneCode: '+66', phoneNumber: '869666363', country: 'Thailand', referralCode: '', saleCode: '', terms: 'true' });
  });

  it('should enable Next only while the terms checkbox is checked', async () => {
    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const next = fixture.nativeElement.querySelector('button[nz-button]') as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    checkbox.click();
    await fixture.whenStable();
    expect(next.disabled).toBe(false);
    checkbox.click();
    await fixture.whenStable();
    expect(next.disabled).toBe(true);
  });

  it('should validate each step and preserve data when going back', async () => {
    component.next();
    expect(component.step()).toBe(0);
    component.checkbox.set(true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(component.step()).toBe(1);
    expect(fixture.nativeElement.querySelector('app-general-info')).not.toBeNull();
    component.next();
    expect(component.step()).toBe(1);
    component.profileForm.setValue({ firstName: 'John', lastName: 'Smith', gender: 'male', country: 'Thailand' });
    component.next();
    expect(component.step()).toBe(2);
    component.contactForm.setValue({ phoneNumberPrefix: '+66', phoneNumber: '81 234 5678', email: 'john@example.com', password: 'password123', confirmPassword: 'different' });
    component.next();
    expect(component.step()).toBe(2);
    component.contactForm.controls.confirmPassword.setValue('password123');
    component.next();
    expect(component.step()).toBe(2);
    expect(component.submitting()).toBe(true);
    const request = http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/register');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.terms).toBe('true');
    request.flush({ result: true, message: 'Member registered successfully', data: { id: 1 }, code: 200 });
    expect(component.modalType()).toBe('success');
    component.goback();
    component.goback();
    expect(component.profileForm.controls.firstName.value).toBe('John');
    expect(component.contactForm.controls.email.value).toBe('john@example.com');
    expect(component.checkbox()).toBe(true);
  });

  it('should display the API error in the status modal', () => {
    component.checkbox.set(true);
    component.profileForm.setValue({ firstName: 'John', lastName: 'Smith', gender: 'male', country: 'Thailand' });
    component.contactForm.setValue({ phoneNumberPrefix: '+66', phoneNumber: '812345678', email: 'john@example.com', password: 'password123', confirmPassword: 'password123' });
    component.submitRegistration();
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/register').flush(
      { result: false, message: 'Validation failed', error: { code: 'VALIDATION_ERROR', message: 'Invalid input data' } },
      { status: 400, statusText: 'Bad Request' },
    );
    fixture.detectChanges();
    expect(component.modalType()).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('Invalid input data');
  });
});

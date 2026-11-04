import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KycVerification } from './kyc-verification';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('KycVerification', () => {
  let component: KycVerification;
  let fixture: ComponentFixture<KycVerification>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycVerification],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(KycVerification);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile').flush({ result: false, message: 'No profile', code: 404 }, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the profile and expose the Send OTP modal action', () => {
    component.form.setValue({
      firstName: 'John', lastName: 'Doe', gender: 'MALE', nationality: 'Thai', country: 'Thailand',
      identity: 'AA123456', birthDate: '1990-01-15', phoneCode: '+66', phoneNumber: '812345678',
      addressNo: '1/1', district: 'Pathum Wan', city: 'Bangkok', state: 'Bangkok', zipCode: '10330',
    });
    component.submitForm();

    const update = http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile');
    expect(update.request.method).toBe('PUT');
    expect(update.request.body.member.m_identity).toBe('AA123456');
    update.flush({ result: true, message: 'Profile updated successfully', data: {}, code: 200 });
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile').flush({ result: false, message: 'Refresh later', code: 503 }, { status: 503, statusText: 'Unavailable' });

    expect(component.modalType()).toBe('success');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Send OTP');
    component.modalAction();
    expect(component.otpRequested()).toBe(true);
  });
});

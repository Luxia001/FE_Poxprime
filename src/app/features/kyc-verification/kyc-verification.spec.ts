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

  it('should mark every field touched and keep gender invalid on an empty submit', () => {
    component.submitForm();
    expect(component.profile.controls.gender.value).toBe('');
    expect(component.profile.controls.gender.touched).toBe(true);
    expect(component.profile.controls.gender.dirty).toBe(true);
    expect(component.profile.controls.gender.invalid).toBe(true);
    expect(Object.values(component.profile.controls).every((control) => control.touched)).toBe(true);
  });

  it('should update profile, send OTP and verify the entered code', () => {
    component.profile.setValue({
      firstName: 'John', lastName: 'Doe', gender: 'MALE', nationality: 'Thai', country: 'Thailand',
      identity: 'AA123456', birthDate: '1990-01-15', phoneCode: '+66', phoneNumber: '812345678',
      addressNo: '1/1', district: 'Pathum Wan', city: 'Bangkok', state: 'Bangkok', zipCode: '10330',
    });
    component.idFile.set(new File(['identity-image'], 'identity.png', { type: 'image/png' }));
    component.submitForm();

    const update = http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile/update');
    expect(update.request.method).toBe('PUT');
    expect(update.request.body.member.m_identity).toBe('AA123456');
    update.flush({ result: true, message: 'Profile updated successfully', data: {}, code: 200 });
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile').flush({ result: false, message: 'Refresh later', code: 503 }, { status: 503, statusText: 'Unavailable' });

    expect(component.modalType()).toBe('success');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Send OTP');
    component.modalAction();
    const sendOtp = http.expectOne('https://stg-portal-api.speedandnumber.com/v1/verify/sms/send');
    expect(sendOtp.request.method).toBe('POST');
    sendOtp.flush({ result: true, message: 'OTP sent', data: { memberRef: 'member-ref-1', expiresAt: 1793786542 }, code: 200 });
    expect(component.otpRequested()).toBe(true);
    expect(component.otpModalOpen()).toBe(true);
    component.otp.setValue('123456');
    component.verifyOtp();
    const verifyOtp = http.expectOne('https://stg-portal-api.speedandnumber.com/v1/verify/sms/verify');
    expect(verifyOtp.request.body).toEqual({ memberRef: 'member-ref-1', otpCode: '123456', optional: 'KYC' });
    verifyOtp.flush({ result: true, message: 'OTP verified', code: 200 });
    const upload = http.expectOne('https://stg-portal-api.speedandnumber.com/v1/verify/kyc/image');
    expect(upload.request.method).toBe('POST');
    expect(upload.request.body.get('kycImage').name).toBe('identity.png');
    expect(upload.request.body.get('kycIdType')).toBe('National ID card');
    upload.flush({ result: true, message: 'Uploaded', data: { kycIdType: 'National ID card', imageUrl: 'https://example.com/id.png' }, code: 200 });
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/verify/kyc').flush({ result: false, message: 'Refresh later', code: 503 }, { status: 503, statusText: 'Unavailable' });
    expect(component.otpModalOpen()).toBe(false);
    expect(component.modalTitle()).toBe('KYC submitted');
  });
});

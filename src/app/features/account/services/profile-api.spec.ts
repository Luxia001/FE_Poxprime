import { TestBed } from '@angular/core/testing';
import { ProfileApi } from './profile-api';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProfileApi', () => {
  let service: ProfileApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProfileApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the mapped profile through a signal', () => {
    service.loadProfile();
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile').flush(profileResponse);
    expect(service.profile()?.fullName).toBe('John Doe');
    expect(service.profile()?.phone).toBe('+66812345678');
    expect(service.initials()).toBe('JD');
  });
});

const profileResponse = {
  result: true,
  message: 'Profile retrieved successfully',
  data: {
    member: { id: 1, username: 'john_doe', email: 'john@example.com', m_image_url: '', m_name: 'John', m_lastname: 'Doe', m_phone: '812345678', m_phone_code: '+66', m_gender: 'MALE', m_nationality: null, m_country: 'Thailand', m_state: null, m_identity: null, isActive: 1, isConfirm: 1, isKYC: 1, campaign_name: null, lastLogin: '2026-11-03T00:00:00Z', createdAt: '2026-11-03T00:00:00Z', updatedAt: '2026-11-03T00:00:00Z', ib: 0, ibType: 0, mt5_category: 0, member_roles: [] },
    address: { id: 1, member_id: 1, address_no: null, address_district: null, address_city: null, address_state: null, address_zipcode: null, address_stat: 1, createdAt: '2026-11-03T00:00:00Z', updatedAt: '2026-11-03T00:00:00Z' },
    isTrusted: true,
  },
  code: 200,
};

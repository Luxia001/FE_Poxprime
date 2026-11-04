import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from './user';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

describe('User', () => {
  let component: User;
  let fixture: ComponentFixture<User>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [User],
      providers: [provideNzIconsTesting(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(User);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile').flush(profileResponse);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render four account tabs', () => {
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(4);
    expect(fixture.nativeElement.textContent).toContain('ข้อมูลผู้ใช้');
    expect(fixture.nativeElement.textContent).toContain('บัญชีธนาคาร');
    expect(fixture.nativeElement.textContent).toContain('กระเป๋าคริปโต');
    expect(fixture.nativeElement.textContent).toContain('การยืนยันตัวตน');
  });

  it('should render profile data returned by the API', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('John Doe');
    expect(content).toContain('john_doe');
    expect(content).toContain('john@example.com');
    expect(content).toContain('812345678');
  });

  it('should switch the visible content when a tab is clicked', async () => {
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>;
    expect(fixture.nativeElement.textContent).toContain('ข้อมูลส่วนตัว');
    expect(fixture.nativeElement.textContent).not.toContain('ยังไม่มีบัญชีธนาคาร');
    tabs[1].click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.activeTab()).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('ยังไม่มีบัญชีธนาคาร');
    expect(fixture.nativeElement.textContent).not.toContain('ข้อมูลส่วนตัว');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('should render KYC API data as a verification card', async () => {
    component.activeTab.set(3);
    fixture.detectChanges();
    await fixture.whenStable();
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('การยืนยันตัวตน KYC');
    expect(fixture.nativeElement.querySelectorAll('app-verify').length).toBe(4);
  });

  it('should navigate to KYC verification from the KYC card action', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.activeTab.set(3);
    fixture.detectChanges();
    const kycButton = fixture.nativeElement.querySelector('app-verify button') as HTMLButtonElement;
    kycButton.click();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith(['/main/kyc-verification']);
  });
});

const profileResponse = {
  result: true, message: 'Profile retrieved successfully', code: 200,
  data: {
    member: { id: 1, username: 'john_doe', email: 'john@example.com', m_image_url: '', m_name: 'John', m_lastname: 'Doe', m_phone: '812345678', m_phone_code: '+66', m_gender: 'MALE', m_nationality: null, m_country: 'Thailand', m_state: null, m_identity: null, isActive: 1, isConfirm: 1, isKYC: 1, campaign_name: null, lastLogin: '2026-11-03T00:00:00Z', createdAt: '2026-11-03T00:00:00Z', updatedAt: '2026-11-03T00:00:00Z', ib: 0, ibType: 0, mt5_category: 0, member_roles: [] },
    address: { id: 1, member_id: 1, address_no: null, address_district: null, address_city: null, address_state: null, address_zipcode: null, address_stat: 1, createdAt: '2026-11-03T00:00:00Z', updatedAt: '2026-11-03T00:00:00Z' },
    isTrusted: true,
  },
};

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Wallet } from './wallet';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Wallet', () => {
  let component: Wallet;
  let fixture: ComponentFixture<Wallet>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wallet],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Wallet);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    const type = {
      id: 5, account_type: 'live', account_name: 'Core Cent', account_group: 'real\\Zaurix-USC',
      account_path: 'Zaurix CENT', account_leverage: [50, 100, 200], account_limit: 99,
      account_min_deposit: 0, account_max_deposit: 999999999, account_socialtrade: 0,
      account_status: 1, account_admin_access: 0, account_currency: 'USC', account_rate: 100,
      admin_id: null, createdAt: '2026-06-04T08:25:51.000Z', updatedAt: '2026-06-05T07:25:54.000Z',
    };
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/trading/wallet-types').flush({ result: true, message: 'OK', data: [type], code: 200 });
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/trading/account-types').flush({ result: true, message: 'OK', data: [type], code: 200 });
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/trading').flush({ result: true, message: 'OK', data: [], code: 200 });
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.api.types().length).toBe(1);
  });
});

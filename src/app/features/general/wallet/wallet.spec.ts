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
      id: 5,
      account_type: 'live',
      account_name: 'Core Cent',
      account_group: 'real\\Zaurix-USC',
      account_path: 'Zaurix CENT',
      account_leverage: [50, 100, 200],
      account_limit: 99,
      account_min_deposit: 0,
      account_max_deposit: 999999999,
      account_socialtrade: 0,
      account_status: 1,
      account_admin_access: 0,
      account_currency: 'USC',
      account_rate: 100,
      admin_id: null,
      createdAt: '2026-06-04T08:25:51.000Z',
      updatedAt: '2026-06-05T07:25:54.000Z',
    };
    http
      .expectOne('https://stg-portal-api.speedandnumber.com/v1/trading/wallet-types')
      .flush({ result: true, message: 'OK', data: [type], code: 200 });
    http
      .expectOne('https://stg-portal-api.speedandnumber.com/v1/trading/account-types')
      .flush({ result: true, message: 'OK', data: [type], code: 200 });
    http
      .expectOne('https://stg-portal-api.speedandnumber.com/v1/trading')
      .flush({ result: true, message: 'OK', data: [], code: 200 });
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.api.types().length).toBe(1);
  });

  it('should load a wallet by id before showing its details', () => {
    component.openWallet(7);

    expect(component.walletModalOpen()).toBe(true);
    expect(component.walletDetailLoading()).toBe(true);

    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/trading/7').flush({
      result: true,
      message: 'OK',
      code: 200,
      data: {
        id: 7,
        member_id: 1,
        wallet_type: '',
        wallet_trading_type: 'live',
        wallet_account_name: 'Standard',
        wallet_account_no: '100007',
        wallet_account_type: '5',
        wallet_account_type_name: 'Standard',
        wallet_account_group: 'real',
        wallet_leverage: 100,
        wallet_balance: 250,
        wallet_credit: 10,
        wallet_margin: 5,
        wallet_equity: 255,
        wallet_iv: null,
        wallet_symbol_us: '$',
        wallet_symbol_th: '฿',
        wallet_currency: 'USD',
        wallet_server: 'MT5',
        wallet_status: 1,
        wallet_master_type: '',
        wallet_master_no: null,
        wallet_master_name: null,
        wallet_following_name: null,
        wallet_rights: 0,
        wallet_deposit_max: 0,
        createdAt: '2026-11-09T00:00:00.000Z',
        updatedAt: null,
        isWithdraw: 1,
        isDeposit: 1,
        isTranIn: 1,
        isTranOut: 1,
        isLeverage: 1,
        isTrading: 1,
        isTradingEnabled: 1,
      },
    });

    expect(component.selectedWallet()?.id).toBe(7);
    expect(component.selectedWallet()?.wallet_balance).toBe('250.00');
    expect(component.walletDetailLoading()).toBe(false);
  });
});

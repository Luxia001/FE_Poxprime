import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from './user';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

describe('User', () => {
  let component: User;
  let fixture: ComponentFixture<User>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [User],
      providers: [provideNzIconsTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(User);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

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
    expect(content).toContain('+66812345678');
    expect(content).toContain('ABC123');
    expect(content).toContain('ยืนยันแล้ว');
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
    expect(content).toContain('ยืนยันแล้ว');
    expect(content).toContain('National ID card');
    expect(content).toContain('3 พ.ย. 2569');
    expect(fixture.nativeElement.querySelectorAll('app-verify').length).toBe(4);
  });
});

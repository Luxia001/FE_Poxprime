import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Verify } from './verify';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

describe('Verify', () => {
  let component: Verify;
  let fixture: ComponentFixture<Verify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verify],
      providers: [provideNzIconsTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Verify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render status, details, and emit its action', () => {
    fixture.componentRef.setInput('status', 'Verified');
    fixture.componentRef.setInput('statusTone', 'success');
    fixture.componentRef.setInput('details', [{ label: 'Document type', value: 'National ID card' }]);
    fixture.componentRef.setInput('actionLabel', 'Manage');
    fixture.detectChanges();
    let emitted = false;
    component.action.subscribe(() => emitted = true);
    fixture.nativeElement.querySelector('button').click();
    expect(fixture.nativeElement.textContent).toContain('National ID card');
    expect(emitted).toBe(true);
  });
});

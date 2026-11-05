import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarButton } from './sidebar-button';
import { provideRouter } from '@angular/router';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

describe('SidebarButton', () => {
  let component: SidebarButton;
  let fixture: ComponentFixture<SidebarButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarButton],
      providers: [provideRouter([]), provideNzIconsTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Dashboard');
    fixture.componentRef.setInput('iconType', 'appstore');
    fixture.componentRef.setInput('routeLink', '/general/dashboard');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

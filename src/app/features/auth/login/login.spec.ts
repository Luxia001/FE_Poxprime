import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideRouter } from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate empty credentials and mask the password by default', async () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(2);
    expect(fixture.nativeElement.querySelector('#password').type).toBe('password');
    fixture.nativeElement.querySelector('.toggle-password').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('#password').type).toBe('text');
    expect(component.unavailable()).toBe(false);
  });
});

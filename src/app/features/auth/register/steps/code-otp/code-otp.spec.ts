import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeOTP } from './code-otp';
import { FormControl, Validators } from '@angular/forms';

describe('CodeOTP', () => {
  let component: CodeOTP;
  let fixture: ComponentFixture<CodeOTP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeOTP],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeOTP);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{6}$/)] }));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind all six digits to the parent control', async () => {
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    expect(inputs.length).toBe(6);
    inputs.forEach((input, index) => {
      input.value = String(index + 1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await fixture.whenStable();
    expect(component.control().value).toBe('123456');
    expect(component.control().valid).toBe(true);
    expect(component.formatter('a1b2')).toBe('12');
  });

  it('should show an error for incomplete code and restore a parent value', async () => {
    component.control().setValue('123');
    component.control().markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#otp-error')).not.toBeNull();
    component.control().setValue('654321');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#otp-error')).toBeNull();
    expect(Array.from(fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>).map(input => input.value).join('')).toBe('654321');
  });
});

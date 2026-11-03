import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralInfo } from './general-info';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

describe('GeneralInfo', () => {
  let component: GeneralInfo;
  let fixture: ComponentFixture<GeneralInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralInfo);
    component = fixture.componentInstance;
    const fb = TestBed.inject(NonNullableFormBuilder);
    fixture.componentRef.setInput('form', fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
    }));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the shared parent form through its inputs without nesting a form', () => {
    const firstName = fixture.nativeElement.querySelector('#firstName') as HTMLInputElement;
    firstName.value = 'John';
    firstName.dispatchEvent(new Event('input'));
    const gender = fixture.nativeElement.querySelector('#gender') as HTMLSelectElement;
    gender.value = 'male';
    gender.dispatchEvent(new Event('change'));
    expect(component.form().controls.firstName.value).toBe('John');
    expect(component.form().controls.gender.value).toBe('male');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });
});

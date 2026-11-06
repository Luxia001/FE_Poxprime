import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleAuth } from './google-auth';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GoogleAuth', () => {
  let component: GoogleAuth;
  let fixture: ComponentFixture<GoogleAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleAuth],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

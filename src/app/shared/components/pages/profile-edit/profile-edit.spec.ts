import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileEdit } from './profile-edit';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProfileEdit', () => {
  let component: ProfileEdit;
  let fixture: ComponentFixture<ProfileEdit>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEdit],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileEdit);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    http.expectOne('https://stg-portal-api.speedandnumber.com/v1/member/profile').flush(
      { result: false, message: 'No profile', code: 404 },
      { status: 404, statusText: 'Not Found' },
    );
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookBank } from './book-bank';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BookBank', () => {
  let component: BookBank;
  let fixture: ComponentFixture<BookBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookBank],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(BookBank);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

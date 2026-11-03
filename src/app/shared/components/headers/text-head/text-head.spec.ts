import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextHead } from './text-head';

describe('TextHead', () => {
  let component: TextHead;
  let fixture: ComponentFixture<TextHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextHead],
    }).compileComponents();

    fixture = TestBed.createComponent(TextHead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

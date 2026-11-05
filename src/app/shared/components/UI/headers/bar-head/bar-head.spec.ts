import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarHead } from './bar-head';

describe('BarHead', () => {
  let component: BarHead;
  let fixture: ComponentFixture<BarHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarHead],
    }).compileComponents();

    fixture = TestBed.createComponent(BarHead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

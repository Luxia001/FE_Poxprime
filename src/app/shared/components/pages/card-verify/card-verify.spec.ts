import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardVerify } from './card-verify';

describe('CardVerify', () => {
  let component: CardVerify;
  let fixture: ComponentFixture<CardVerify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardVerify],
    }).compileComponents();

    fixture = TestBed.createComponent(CardVerify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

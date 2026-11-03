import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { provideRouter } from '@angular/router';
import { NzI18nService } from 'ng-zorro-antd/i18n';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch navigation labels and component locale from the dropdown', async () => {
    component.locale.setLanguage('th');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.language-button').textContent).toContain('ไทย');
    fixture.nativeElement.querySelector('.language-button').click();
    await new Promise(resolve => setTimeout(resolve, 200));
    await fixture.whenStable();
    const english = Array.from(document.querySelectorAll<HTMLElement>('.ant-dropdown-menu-item'))
      .find(item => item.textContent?.trim() === 'English');
    expect(english).toBeDefined();
    english!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.language-button').textContent).toContain('English');
    expect(document.documentElement.lang).toBe('en');
    expect(TestBed.inject(NzI18nService).getLocale().locale).toBe('en');
    component.locale.setLanguage('th');
  });
});


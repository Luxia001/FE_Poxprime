import { Component, inject } from '@angular/core';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { LanguageService } from '../../services/language';

@Component({
  imports: [NzDropdownModule],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  readonly locale = inject(LanguageService);
}

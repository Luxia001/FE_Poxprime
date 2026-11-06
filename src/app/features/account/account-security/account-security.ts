import { Component } from '@angular/core';
import { Session } from '../../../shared/components/pages/session/session';
import { BarHead } from '../../../shared/components/UI/headers/bar-head/bar-head';

@Component({
  imports: [Session, BarHead],
  selector: 'app-account-security',
  styleUrl: './account-security.css',
  templateUrl: './account-security.html',
})
export class AccountSecurity {}

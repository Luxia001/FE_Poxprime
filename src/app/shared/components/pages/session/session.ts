import { Component, computed, inject } from '@angular/core';
import { ActiveSession } from '../../../models/session.model';
import { SessionApi } from '../../../services/session.service';
import { AuthStorageService } from '../../../../core/services/auth-storage';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-session',
  styleUrl: './session.css',
  templateUrl: './session.html',
})
export class Session {
  readonly sessionApi = inject(SessionApi);
  private readonly authStorage = inject(AuthStorageService);

  readonly pageSize = 10;
  readonly currentSessionUid = this.authStorage.sessionUid;
  readonly visiblePages = computed(() => {
    const pagination = this.sessionApi.pagination();
    if (!pagination) return [];
    const start = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
    const end = Math.min(pagination.totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  constructor() {
    this.sessionApi.load(1, this.pageSize);
  }

  onPageChange(page: number): void {
    const pagination = this.sessionApi.pagination();
    if (!pagination || page < 1 || page > pagination.totalPages || page === pagination.page) return;
    this.sessionApi.load(page, this.pageSize);
  }

  /** วินาที -> Date */
  toDate(seconds: number): Date {
    return new Date(seconds * 1000);
  }

  location(s: ActiveSession): string {
    return [s.session_city, s.session_country].filter(Boolean).join(', ') || '-';
  }
}

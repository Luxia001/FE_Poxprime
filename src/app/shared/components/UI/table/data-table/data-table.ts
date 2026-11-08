import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

export type TableAlign = 'left' | 'center' | 'right';
export interface TableColumn<T extends object = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  align?: TableAlign;
  width?: string;
  headerClass?: string;
  cellClass?: string;
  formatter?: (value: unknown, row: T, rowIndex: number) => string | number;
}

@Component({ selector: 'app-data-table', imports: [NgClass], templateUrl: './data-table.html', styleUrl: './data-table.css' })
export class DataTable<T extends object = Record<string, unknown>> {
  readonly columns = input.required<readonly TableColumn<T>[]>();
  readonly data = input.required<readonly T[]>();
  readonly loading = input(false);
  readonly emptyMessage = input('No data available.');
  readonly ariaLabel = input('Data table');
  readonly rowKey = input<keyof T | string>('id');
  readonly striped = input(false);

  value(row: T, column: TableColumn<T>, rowIndex: number): string | number {
    const raw = this.readPath(row, String(column.key));
    const formatted = column.formatter?.(raw, row, rowIndex);
    if (formatted !== undefined && formatted !== null) return formatted;
    if (raw === undefined || raw === null || raw === '') return '-';
    return typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
  }
  trackRow(index: number, row: T): unknown { return this.readPath(row, String(this.rowKey())) ?? index; }
  alignClass(align: TableAlign = 'left'): string { return align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'; }
  private readPath(row: T, path: string): unknown {
    return path.split('.').reduce<unknown>((value, key) => value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined, row);
  }
}

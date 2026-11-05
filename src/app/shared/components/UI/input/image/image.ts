import { Component, DestroyRef, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { KycIdType } from '../../../../models/kyc-image';
import { CardVerify } from '../../../pages/card-verify/card-verify';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB (ปรับตาม backend)
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

@Component({
  imports: [FormsModule, NzButtonModule, NzIconModule, NzSelectModule, CardVerify],
  selector: 'app-image',
  styleUrl: './image.css',
  templateUrl: './image.html',
})
export class Image {
  readonly submitted = input(false);
  readonly file = model<File | null>(null);

  readonly idTypes: KycIdType[] = ['National ID card', 'Passport'];
  readonly idType = model<KycIdType>('National ID card');

  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly error = signal('');

  constructor() {
    // ล้าง object URL เมื่อ component ถูกทำลาย
    inject(DestroyRef).onDestroy(() => this.revokePreview());
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      this.error.set('Only JPG or PNG files are supported.');
      this.selectedFile.set(null);
      this.file.set(null);
      this.revokePreview();
      this.previewUrl.set(null);
      input.value = '';
      return;
    }
    if (file.size > MAX_SIZE) {
      this.error.set('File size must not exceed 5 MB.');
      this.selectedFile.set(null);
      this.file.set(null);
      this.revokePreview();
      this.previewUrl.set(null);
      input.value = '';
      return;
    }

    this.error.set('');
    this.selectedFile.set(file);
    this.file.set(file);
    this.revokePreview();
    this.previewUrl.set(URL.createObjectURL(file));
  }

  removeFile(input: HTMLInputElement): void {
    input.value = '';
    this.selectedFile.set(null);
    this.file.set(null);
    this.revokePreview();
    this.previewUrl.set(null);
    this.error.set('');
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
  }
}

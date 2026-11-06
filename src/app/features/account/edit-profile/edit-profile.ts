import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProfileEdit } from '../../../shared/components/pages/profile-edit/profile-edit';
import { StatusModal, StatusModalType } from '../../../shared/components/UI/modals/status-modal/status-modal';
import { ProfileUpdateErrorResponse, ProfileUpdateRequest } from '../models/profile-request.model';
import { ProfileApi } from '../services/profile-api';

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;
const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png'];

@Component({
  selector: 'app-edit-profile-page',
  imports: [RouterLink, ProfileEdit, StatusModal],
  templateUrl: './edit-profile.html',
})
export class EditProfilePage {
  private readonly router = inject(Router);
  readonly profileApi = inject(ProfileApi);
  readonly saving = signal(false);
  readonly uploadingImage = signal(false);
  readonly imageError = signal('');
  readonly modalOpen = signal(false);
  readonly modalType = signal<StatusModalType>('loading');
  readonly modalTitle = signal('');
  readonly modalMessage = signal('');
  readonly modalDetails = signal<string[]>([]);

  updateProfile(request: ProfileUpdateRequest): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.showModal('loading', 'Saving profile', 'Please wait while we update your profile.');
    this.profileApi.updateProfile(request).subscribe({
      next: (response) => {
        this.saving.set(false);
        this.profileApi.loadProfile(true);
        this.showModal('success', 'Profile updated', response.message || 'Your profile has been updated.');
      },
      error: (error: ProfileUpdateErrorResponse) => {
        this.saving.set(false);
        const details = (error.errors ?? []).map((item) => typeof item === 'string' ? item : JSON.stringify(item));
        this.showModal('error', 'Unable to update profile', error.error || error.message, details);
      },
    });
  }

  changeProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.uploadingImage()) return;
    if (!PROFILE_IMAGE_TYPES.includes(file.type)) {
      this.imageError.set('Only JPG or PNG files are supported.');
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      this.imageError.set('File size must not exceed 2 MB.');
      return;
    }

    this.imageError.set('');
    this.uploadingImage.set(true);
    this.profileApi.uploadImageProfile(file).pipe(finalize(() => this.uploadingImage.set(false))).subscribe({
      next: () => this.showModal('success', 'Profile image updated', 'Your profile image has been updated.'),
      error: (error: { message?: string }) => this.imageError.set(error.message || 'Unable to upload profile image.'),
    });
  }

  closeModal(): void {
    if (!this.saving()) this.modalOpen.set(false);
  }

  modalAction(): void {
    const shouldReturn = this.modalType() === 'success';
    this.modalOpen.set(false);
    if (shouldReturn) void this.router.navigate(['/account/user']);
  }

  private showModal(type: StatusModalType, title: string, message: string, details: string[] = []): void {
    this.modalType.set(type);
    this.modalTitle.set(title);
    this.modalMessage.set(message);
    this.modalDetails.set(details);
    this.modalOpen.set(true);
  }
}

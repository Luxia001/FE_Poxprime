import { Component, signal } from '@angular/core';
import { BarHead } from '../../../shared/components/UI/headers/bar-head/bar-head';
import { Verify } from '../../../shared/components/UI/cards/verify/verify';

@Component({
  imports: [BarHead, Verify],
  selector: 'app-download',
  styleUrl: './download.css',
  templateUrl: './download.html',
})
export class Download {
  data = [
    {
      platform: 'Mac OS',
      icon: 'apple',
      download: '',
      description: [
        'macOS 11 (Big Sur) or higher',
        'Supports Apple Silicon and Intel',
        'At least 4 GB of RAM',
        'At least 200 MB of free space',
      ],
    },
    {
      platform: 'IOS',
      icon: 'apple',
      download: '',
      description: [
        'Requires iOS 13 or later',
        'Supports iPhone and iPad',
        'At least 100 MB of free space',
        'Internet connection required',
      ],
    },
    {
      platform: 'Windows',
      icon: 'windows',
      download: '',
      description: [
        'Windows 10 or newer (64-bit)',
        'At least 4 GB of RAM',
        'At least 200 MB of free space',
        'Internet connection required',
      ],
    },
    {
      platform: 'Android',
      icon: 'android',
      download: '',
      description: [
        'Android version 7.0 or higher',
        'At least 100 MB of free space',
        'Stable internet connection',
      ],
    },
  ];
}

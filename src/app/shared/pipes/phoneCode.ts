export interface PhoneCode {
  code: string;
  country: string;
}

export const PHONE_CODES: readonly PhoneCode[] = [
  { code: '+66', country: 'Thailand' },
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+60', country: 'Malaysia' },
  { code: '+65', country: 'Singapore' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+84', country: 'Vietnam' },
  { code: '+86', country: 'China' },
  { code: '+91', country: 'India' },
];

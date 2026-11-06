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

export function toLocalPhone(phone: string | null, code: string | null): string {
  if (!phone) return '';
  const digitsCode = (code ?? '').replace(/\D/g, '');
  let digits = phone.replace(/\D/g, '');
  // ถ้าเบอร์ขึ้นต้นด้วยรหัสประเทศ (เช่น +660900000003) ให้ตัดออก
  if (phone.startsWith('+') && digitsCode && digits.startsWith(digitsCode)) {
    digits = digits.slice(digitsCode.length);
  }
  return digits;
}

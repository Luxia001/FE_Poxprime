export interface Bank {
  code: string;
  nameTh: string;
  nameEn: string;
  image: string;
}

export const BANKS: Bank[] = [
  {
    code: 'SCB',
    nameTh: 'ธนาคารไทยพาณิชย์',
    nameEn: 'Siam Commercial Bank',
    image: '/images/banks/scb.png',
  },
  {
    code: 'KBANK',
    nameTh: 'ธนาคารกสิกรไทย',
    nameEn: 'Kasikornbank',
    image: '/images/banks/kbank.png',
  },
  { code: 'BBL', nameTh: 'ธนาคารกรุงเทพ', nameEn: 'Bangkok Bank', image: '/images/banks/bbl.png' },
  // ...เพิ่มตามที่ระบบรองรับ
];

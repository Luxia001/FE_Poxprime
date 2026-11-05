import { ValidatorFn } from '@angular/forms';

/** อายุขั้นต่ำ (ปี) จากค่า input type="date" รูปแบบ YYYY-MM-DD */
export const minAge =
  (years: number): ValidatorFn =>
  (control) => {
    const value = control.value as string;
    if (!value) return null; // ให้ required จัดการ

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return { invalidDate: true };

    const [, y, m, d] = match.map(Number);
    const birth = new Date(y, m - 1, d); // ตีเป็นเวลาท้องถิ่น กัน timezone เพี้ยน
    if (birth.getMonth() !== m - 1) return { invalidDate: true }; // เช่น 2008-02-31

    const today = new Date();
    if (birth > today) return { futureDate: true };

    let age = today.getFullYear() - y;
    const hadBirthday =
      today.getMonth() > m - 1 || (today.getMonth() === m - 1 && today.getDate() >= d);
    if (!hadBirthday) age--;

    return age >= years ? null : { minAge: { required: years, actual: age } };
  };

/** วันที่มากสุดที่เลือกได้ (วันนี้ลบ N ปี) รูปแบบ YYYY-MM-DD */
export const maxBirthDate = (years: number): string => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

import { v4 as uuidv4 } from 'uuid';
export const deleteDatePast = (listDate: [Date]): [Date] => {
  const today = new Date();
  const removedPastDates: [Date] = listDate.filter((date) => {
    const currDate = new Date(date);
    const isSameDay =
      currDate.getDate() === today.getDate() &&
      currDate.getMonth() === today.getMonth() &&
      currDate.getFullYear() === today.getFullYear();

    return isSameDay || currDate > today;
  }) as [Date];
  return removedPastDates;
};

export function generateShortCode(): string {
  const uuid = uuidv4(); // Tạo một UUID duy nhất
  // Lấy 6 ký tự cuối cùng của UUID và loại bỏ dấu gạch ngang
  const shortCode = uuid.substr(-6).replace(/-/g, '');
  return shortCode;
}

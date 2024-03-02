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

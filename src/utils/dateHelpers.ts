export const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

export const formatMonthYear = (date: Date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

import { format, formatDistanceToNow } from 'date-fns';

export const formatDateTime = (date: Date): string => {
  return format(date, 'EEE, d MMM · hh:mm a');
};

export const formatDateShort = (date: Date): string => {
  return format(date, 'd MMM');
};

export const formatTimeOnly = (date: Date): string => {
  return format(date, 'hh:mm a');
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatTimeSlot = (start: Date, end: Date): string => {
  return `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
};

export const isLotOpenAt = (
  hours: { is24Hours: boolean; openTime: string; closeTime: string; closedDays: number[] },
  date: Date
): boolean => {
  if (hours.is24Hours) return true;
  const day = date.getDay();
  if (hours.closedDays.includes(day)) return false;
  const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  return time >= hours.openTime && time <= hours.closeTime;
};

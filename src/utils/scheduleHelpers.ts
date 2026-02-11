import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  parseISO,
  set,
} from 'date-fns';
import { ko } from 'date-fns/locale';

// 캘린더 7열 맞추기 위해 이전/다음 달 날짜 포함
export const getCalendarDays = (currentMonth: Date): Date[] => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const isInCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

export const formatDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'M월 d일 (EEE)', { locale: ko });
};

export const extractTimeFromISO = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, 'HH:mm');
};

export const combineDateAndTime = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
  return combined.toISOString();
};

export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};

export const isEndTimeAfterStartTime = (
  startTime: string,
  endTime: string,
): boolean => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  return startHour * 60 + startMin < endHour * 60 + endMin;
};

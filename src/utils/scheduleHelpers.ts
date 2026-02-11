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

/**
 * 캘린더에 표시할 날짜 배열 생성
 * 이전 달 끝 + 현재 달 + 다음 달 시작 (7열 맞추기 위해)
 */
export const getCalendarDays = (currentMonth: Date): Date[] => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

/**
 * 날짜가 현재 달에 속하는지 확인
 */
export const isInCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

/**
 * 날짜를 "yyyy-MM-dd" 형식으로 변환
 */
export const formatDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * 날짜를 "M월 d일 (요일)" 형식으로 변환
 */
export const formatDisplayDate = (date: Date): string => {
  return format(date, 'M월 d일 (EEE)', { locale: ko });
};

/**
 * ISO 시간 문자열에서 시간만 추출 ("14:00")
 */
export const extractTimeFromISO = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, 'HH:mm');
};

/**
 * 날짜와 시간 문자열을 ISO 8601 형식으로 결합
 */
export const combineDateAndTime = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
  return combined.toISOString();
};

/**
 * 시간 문자열이 유효한지 검증 (HH:mm 형식)
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};

/**
 * 종료 시간이 시작 시간보다 나중인지 검증
 */
export const isEndTimeAfterStartTime = (
  startTime: string,
  endTime: string,
): boolean => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  return startHour * 60 + startMin < endHour * 60 + endMin;
};

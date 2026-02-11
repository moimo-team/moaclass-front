import { useQuery } from '@tanstack/react-query';
import { fetchLessonSchedules } from '@/api/schedule.api';
import type { LessonSchedule, SchedulesByDate } from '@/models/schedule.model';
import { format } from 'date-fns';

/**
 * 날짜별로 일정을 그룹화하는 헬퍼 함수
 */
const groupSchedulesByDate = (schedules: LessonSchedule[]): SchedulesByDate => {
  return schedules.reduce((acc, schedule) => {
    const dateKey = format(new Date(schedule.startAt), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(schedule);
    return acc;
  }, {} as SchedulesByDate);
};

/**
 * 클래스 일정 조회 훅
 * 일정은 자주 바뀔 수 있으므로 staleTime을 1분으로 설정
 */
export const useScheduleQuery = (lessonId: number) => {
  return useQuery({
    queryKey: ['schedules', lessonId],
    queryFn: () => fetchLessonSchedules(lessonId),
    staleTime: 1000 * 60, // 1분
    select: (data) => ({
      raw: data,
      byDate: groupSchedulesByDate(data),
    }),
  });
};

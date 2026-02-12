import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetchLessonSchedules } from '@/api/schedule.api';
import type { LessonSchedule, SchedulesByDate } from '@/models/schedule.model';

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

// staleTime 1분: 일정은 자주 바뀔 수 있으므로 짧게 설정
export const useScheduleQuery = (lessonId: number) => {
  return useQuery({
    queryKey: ['schedules', lessonId],
    queryFn: () => fetchLessonSchedules(lessonId),
    staleTime: 1000 * 60,
    select: (data) => ({
      raw: data,
      byDate: groupSchedulesByDate(data),
    }),
  });
};

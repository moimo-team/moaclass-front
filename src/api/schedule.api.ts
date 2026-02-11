import { apiClient } from './client';
import type {
  LessonSchedule,
  CreateScheduleRequest,
} from '@/models/schedule.model';

export const fetchLessonSchedules = async (
  lessonId: number,
): Promise<LessonSchedule[]> => {
  const { data } = await apiClient.get<LessonSchedule[]>(
    `/lessons/${lessonId}/schedules`,
  );
  return data;
};

// 백엔드가 배열로 받으므로 개별/반복 등록 모두 단일 POST
export const createSchedules = async (
  lessonId: number,
  schedulesData: CreateScheduleRequest[],
): Promise<void> => {
  await apiClient.post(`/lessons/${lessonId}/schedules`, schedulesData);
};

// 신청자가 있으면 400 에러 반환
export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  await apiClient.delete(`/lessons/schedules/${scheduleId}`);
};

export const deleteSchedules = async (scheduleIds: number[]): Promise<void> => {
  await apiClient.delete('/lessons/schedules', { data: { scheduleIds } });
};

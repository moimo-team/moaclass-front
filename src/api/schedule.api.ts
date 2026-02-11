import { apiClient } from './client';
import type {
  LessonSchedule,
  CreateScheduleRequest,
  ScheduleParticipant,
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

// 특정 일정의 신청자 목록 조회
export const fetchScheduleParticipants = async (
  scheduleId: number,
): Promise<ScheduleParticipant[]> => {
  const { data } = await apiClient.get<ScheduleParticipant[]>(
    `/lessons/schedules/${scheduleId}/participants`,
  );
  return data;
};

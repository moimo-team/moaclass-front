import { apiClient } from './client';
import type {
  LessonSchedule,
  CreateScheduleRequest,
} from '@/models/schedule.model';

/**
 * 특정 클래스의 일정 목록 조회
 */
export const fetchLessonSchedules = async (
  lessonId: number,
): Promise<LessonSchedule[]> => {
  const { data } = await apiClient.get<LessonSchedule[]>(
    `/lessons/${lessonId}/schedules`,
  );
  return data;
};

/**
 * 일정 일괄 등록 (배열로 전송)
 * 개별 등록이든 반복 등록이든 모두 배열 형태로 전송
 */
export const createSchedules = async (
  lessonId: number,
  schedulesData: CreateScheduleRequest[],
): Promise<void> => {
  await apiClient.post(`/lessons/${lessonId}/schedules`, schedulesData);
};

/**
 * 일정 삭제
 * 신청자가 있으면 400 에러 반환
 */
export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  await apiClient.delete(`/lessons/schedules/${scheduleId}`);
};

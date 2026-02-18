import type {
	LessonSchedule,
	CreateScheduleRequest,
	ScheduleParticipant,
} from '@/models/schedule.model';

import { apiClient } from './client';

/**
 * 클래스 일정 목록 조회
 * (백엔드 개발중)
 */
export const fetchLessonSchedules = async (lessonId: number): Promise<LessonSchedule[]> => {
	const { data } = await apiClient.get<LessonSchedule[]>(`/lessons/${lessonId}/schedules`);
	return data;
};

export const createSchedules = async (
	lessonId: number,
	schedulesData: CreateScheduleRequest[],
): Promise<void> => {
	await apiClient.post(`/lessons/${lessonId}/schedules`, schedulesData);
};

export const deleteSchedule = async (scheduleId: number): Promise<void> => {
	await apiClient.delete(`/lessons/schedules/${scheduleId}`);
};

/**
 * 다수 일정 삭제
 * 백엔드 사양에 다수 삭제 API가 없으므로 프론트엔드에서 병렬 처리합니다.
 */
export const deleteSchedules = async (scheduleIds: number[]): Promise<void[]> => {
	return Promise.all(scheduleIds.map((id) => deleteSchedule(id)));
};

// 특정 일정의 신청자(모멘티) 목록 조회
export const fetchScheduleParticipants = async (
	scheduleId: number,
): Promise<ScheduleParticipant[]> => {
	const { data } = await apiClient.get<ScheduleParticipant[]>(
		`/lessons/schedules/${scheduleId}/participants`,
	);
	return data;
};

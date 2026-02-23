import type {
	LessonSchedule,
	CreateScheduleRequest,
	ScheduleParticipant,
} from '@/models/schedule.model';
import { toLocalISOString } from '@/utils/dateFormat';

import { apiClient } from './client';

export const fetchLessonSchedules = async (lessonId: number): Promise<LessonSchedule[]> => {
	const { data } = await apiClient.get<LessonSchedule[]>(`/lessons/${lessonId}/schedules`);
	return data;
};

export const createSchedules = async (
	lessonId: number,
	schedulesData: CreateScheduleRequest[],
): Promise<void> => {
	const normalized = schedulesData.map((s) => ({
		startAt: toLocalISOString(s.startAt),
		endAt: toLocalISOString(s.endAt),
	}));
	await apiClient.post(`/lessons/${lessonId}/schedules`, normalized);
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
	lessonId: number,
	scheduleId: number,
): Promise<ScheduleParticipant[]> => {
	const { data } = await apiClient.get<ScheduleParticipant[]>(
		`/lessons/${lessonId}/schedules/${scheduleId}/participants`,
	);
	return data;
};

export type LessonScheduleStatus = 'RECRUITING' | 'CLOSED' | 'COMPLETED';

export interface Schedule {
	id: number;
	startAt: string;
	endAt: string;
	status: LessonScheduleStatus;
	currentParticipants: number;
}

export interface LessonSchedule {
	id: number;
	lessonId: number;
	startAt: string; // ISO 8601 (예: "2026-02-24T14:00:00")
	endAt: string;
	currentParticipants: number;
	maxParticipants: number;
	status: LessonScheduleStatus;
	createdAt: string;
}

export interface CreateScheduleRequest {
	startAt: string;
	endAt: string;
}

export type SchedulesByDate = Record<string, LessonSchedule[]>;

export interface RecurringScheduleFormData {
	startDate: Date;
	endDate: Date;
	startTime: string; // "14:00"
	endTime: string; // "16:00"
}

export interface TimeSlot {
	startTime: string;
	endTime: string;
}

export interface ScheduleParticipant {
	userId: number;
	nickname: string;
	profileImage: string | null;
}

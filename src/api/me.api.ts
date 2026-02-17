import type { Lesson } from '@/models/lesson.model';
import type { PaginationMeta } from '@/models/pagination.model';
import type { ParticipationStatus } from '@/models/participation.model';
import type { Schedule } from '@/models/schedule.model';

import { apiClient } from './client';

export interface MyMeetingsResponse {
	meetingId: number;
	title: string;
	meetingImage: string;
	interestId: number;
	interestName: string;
	address: string;
	meetingDate: string;
	currentParticipants: number;
	maxParticipants: number;
	status: ParticipationStatus;
	isHost: boolean;
	isCompleted: boolean;
}

export interface MyMeetingsListResponse {
	data: MyMeetingsResponse[];
	meta: PaginationMeta;
}

// 내 모임 목록조회
export const getMyMeetings = async (
	view: 'joined' | 'hosted' | 'all',
	status: string,
	page = 1,
	limit = 5,
): Promise<MyMeetingsListResponse> => {
	const response = await apiClient.get<MyMeetingsListResponse>(
		`/meetings/me?view=${view}&status=${status}&page=${page}&limit=${limit}`,
	);
	return response.data;
};

export interface MyEnrollmentResponse {
	enrollmentId: number;
	scheduleId: Schedule['id'];
	image: Lesson['representativeImage'];
	title: Lesson['title'];
	startAt: Schedule['startAt'];
	endAt: Schedule['endAt'];
	status: string; // "수강예정", "수강취소" 등
	transactionStatus: string;
	transactionId: number;
	refundTransactionId: number | null;
	reviewId: number | null;
}

export interface MyEnrollmentListResponse {
	data: MyEnrollmentResponse[];
	meta: PaginationMeta;
}

// 내 신청 클래스 목록 조회
export const getMyEnrollments = async (
	page = 1,
	limit = 10,
	filter?: string,
): Promise<MyEnrollmentListResponse> => {
	const url = filter
		? `/enrollments/me?page=${page}&limit=${limit}&filter=${filter}`
		: `/enrollments/me?page=${page}&limit=${limit}`;
	const response = await apiClient.get<MyEnrollmentListResponse>(url);
	return response.data;
};

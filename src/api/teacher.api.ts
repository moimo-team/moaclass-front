import { apiClient } from '@/api/client';
import type { FetchLessonsResponse, TeacherProfile } from '@/models/lesson.model';
import type { FetchTeacherReviewsParams, TeacherReviewsResponse } from '@/models/teacher.model';

// 프로필 등록
export const createTeacherProfile = async (formData: FormData): Promise<void> => {
	await apiClient.post('/teachers', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};
// 프로필 수정
export const updateTeacherProfile = async (formData: FormData): Promise<void> => {
	await apiClient.put('/teachers', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

// 프로필 조회
export const fetchTeacherProfile = async (userId: number): Promise<TeacherProfile> => {
	const response = await apiClient.get<TeacherProfile>(`/teachers/${userId}`);
	return response.data;
};

// 클래스 조회 (선생님 전용)
export const fetchTeacherLessons = async (teacherId: number): Promise<FetchLessonsResponse> => {
	const response = await apiClient.get<FetchLessonsResponse>('/lessons', {
		params: { userId: teacherId },
	});
	return response.data;
};

// 리뷰 조회
export const fetchTeacherReviews = async (
	teacherId: number,
	params?: FetchTeacherReviewsParams,
): Promise<TeacherReviewsResponse> => {
	const response = await apiClient.get<TeacherReviewsResponse>(`/teachers/${teacherId}/reviews`, {
		params: {
			page: params?.page || 1,
			limit: params?.limit || 6,
		},
	});
	return response.data;
};

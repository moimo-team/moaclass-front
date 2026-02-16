import { apiClient } from '@/api/client';
import type { TeacherProfile } from '@/models/lesson.model';

// 선생님 프로필 등록
export const createTeacherProfile = async (formData: FormData): Promise<void> => {
	await apiClient.post('/teachers', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

// 선생님 프로필 수정
export const updateTeacherProfile = async (formData: FormData): Promise<void> => {
	await apiClient.put('/teachers', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

// 선생님 프로필 조회
export const getTeacherProfile = async (userId: number): Promise<TeacherProfile> => {
	const response = await apiClient.get<TeacherProfile>(`/teachers/${userId}`);
	return response.data;
};

// 선생님 프로필 삭제
export const deleteTeacherProfile = async (userId: number): Promise<void> => {
	await apiClient.delete(`/teachers/${userId}`);
};

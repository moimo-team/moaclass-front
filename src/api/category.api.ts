import type { LessonCategory, LessonSubCategory } from '@/models/lesson.model';

import { apiClient } from './client';

// 클래스 카테고리 조회
export const getLessonCategories = async (): Promise<LessonCategory[]> => {
	const response = await apiClient.get('/lesson-categories');
	return response.data;
};

// 서브 클래스 카테고리 조회
export const getLessonSubCategories = async (id: number): Promise<LessonSubCategory[]> => {
	const response = await apiClient.get(`/lesson-categories/${id}`);
	return response.data;
};

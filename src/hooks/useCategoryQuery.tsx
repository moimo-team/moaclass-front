import { useQuery } from '@tanstack/react-query';

import { getLessonCategories, getLessonSubCategories } from '@/api/category.api';
import { LESSON_CATEGORIES, LESSON_SUB_CATEGORIES } from '@/constants/lessonCategories';
import type { LessonCategory, LessonSubCategory } from '@/models/lesson.model';

// 대분류 카테고리 조회
export const useCategoryQuery = () => {
	return useQuery<LessonCategory[]>({
		queryKey: ['lessonCategories'],
		queryFn: async () => {
			try {
				const data = await getLessonCategories();
				if (!data || data.length === 0) return LESSON_CATEGORIES;
				return data;
			} catch (error) {
				console.warn('카테고리 데이터를 불러오지 못했습니다. 기본값을 사용합니다.', error);
				return LESSON_CATEGORIES;
			}
		},
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		retry: 1,
	});
};

// 소분류 카테고리 조회
export const useSubCategoryQuery = (id: number | null) => {
	return useQuery<LessonSubCategory[]>({
		queryKey: ['lessonSubCategories', id],
		queryFn: async () => {
			try {
				const data = await getLessonSubCategories(id!);
				if (!data || data.length === 0) {
					return LESSON_SUB_CATEGORIES.filter((sub) => sub.categoryId === id);
				}
				return data;
			} catch (error) {
				console.warn('소분류 데이터를 불러오지 못했습니다. 기본값을 사용합니다.', error);
				return LESSON_SUB_CATEGORIES.filter((sub) => sub.categoryId === id);
			}
		},
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		retry: 1,
		enabled: typeof id === 'number' && id > 0, // 클래스 조회 페이지 렌더링마다 lesson-category/0이 실행되는 오류 수정
	});
};

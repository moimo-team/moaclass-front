import { getLessonCategories, getLessonSubCategories } from "@/api/category.api";
import type { LessonCategory, LessonSubCategory } from "@/models/lesson.model";
import { useQuery } from "@tanstack/react-query";

// 대분류 카테고리 조회
export const useCategoryQuery = () => {
    return useQuery<LessonCategory[]>({
        queryKey: ["lessonCategories"],
        queryFn: getLessonCategories,
        staleTime: 1000 * 60 * 60, // 1시간 동안 데이터를 '신선한(fresh)' 상태로 간주
        gcTime: 1000 * 60 * 60 * 24, // 가비지 컬렉션 타임을 24시간으로 설정하여 캐시 유지
        retry: 1, // 실패 시 재시도 횟수 제한
    });
}

// 소분류 카테고리 조회
export const useSubCategoryQuery = (id: number) => {
    return useQuery<LessonSubCategory[]>({
        queryKey: ["lessonSubCategories", id],
        queryFn: () => getLessonSubCategories(id),
        staleTime: 1000 * 60 * 60, // 1시간 동안 데이터를 '신선한(fresh)' 상태로 간주
        gcTime: 1000 * 60 * 60 * 24, // 가비지 컬렉션 타임을 24시간으로 설정하여 캐시 유지
        retry: 1, // 실패 시 재시도 횟수 제한
    });
}
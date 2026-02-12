import {
  getLessonCategories,
  getLessonSubCategories,
} from "@/api/category.api";
import type { LessonCategory, LessonSubCategory } from "@/models/lesson.model";
import { useQuery } from "@tanstack/react-query";

// 대분류 카테고리 조회
export const useCategoryQuery = () => {
  return useQuery<LessonCategory[]>({
    queryKey: ["lessonCategories"],
    queryFn: getLessonCategories,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });
};

// 소분류 카테고리 조회
export const useSubCategoryQuery = (id: number | null) => {
  return useQuery<LessonSubCategory[]>({
    queryKey: ["lessonSubCategories", id],
    queryFn: () => getLessonSubCategories(id!),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
    enabled: typeof id === "number" && id > 0, // 클래스 조회 페이지 렌더링마다 lesson-category/0이 실행되는 오류 수정
  });
};

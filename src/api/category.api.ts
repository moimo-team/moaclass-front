import type { LessonCategoriesResponse, LessonSubCategoriesResponse } from "@/models/category.model";
import { apiClient } from "./client";

// 클래스 카테고리 조회
export const getLessonCategories = async (): Promise<LessonCategoriesResponse> => {
    try {
        const response = await apiClient.get("/lesson-categories");
        return response.data;
    } catch (error) {
        console.error("getLessonCategories error:", error);
        throw error;
    }
}

// 서브 클래스 카테고리 조회
export const getLessonSubCategories = async (id: number): Promise<LessonSubCategoriesResponse> => {
    try {
        const response = await apiClient.get(`/lesson-categories/${id}`);
        return response.data;
    } catch (error) {
        console.error("getLessonSubCategories error:", error);
        throw error;
    }
}
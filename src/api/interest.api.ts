import { apiClient } from "@/api/client";
import type { LessonCategory } from "@/models/lesson.model";

/** 
 * @deprecated 
 * getLessonCategories로 변경됨
*/
// 관심사 카테고리 조회
export const getInterests = async () => {
    try {
        const response = await apiClient.get<LessonCategory[]>("/lesson-categories");
        return response.data;
    } catch (error) {
        console.error("관심사 카테고리 조회 에러:", error);
        throw error;
    }
}
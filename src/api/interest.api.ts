import { apiClient } from "@/api/client";
import type { Interest } from "@/models/interest.model";

// 모임 카테고리 조회
export const getInterests = async () => {
    try {
        const response = await apiClient.get<Interest[]>("/interests");
        return response.data;
    } catch (error) {
        console.error("모임 카테고리 조회 에러:", error);
        throw error;
    }
}
import { apiClient } from "@/api/client";
import type { Interest } from "@/models/interest.model";

// 관심사 조회
export const getInterests = async () => {
    try {
        const response = await apiClient.get<Interest[]>("/interests");
        return response.data;
    } catch (error) {
        console.error("getInterests error:", error);
        throw error;
    }
}
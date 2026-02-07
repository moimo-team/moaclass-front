import type { Region } from "@/models/region.model";
import { apiClient } from "./client";

// 지역 조회
export const getRegions = async (): Promise<Region[]> => {
    try {
        const response = await apiClient.get("/regions");
        return response.data;
    } catch (error) {
        console.error("getRegions error:", error);
        throw error;
    }
}
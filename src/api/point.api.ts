import type { PointResponse } from "@/models/point.model";
import { apiClient } from "./client";

/**
 * 사용자 포인트 내역 조회
 * @returns 포인트 목록
 */
export const getUserPoints = async (): Promise<PointResponse[]> => {
  try {
    const response = await apiClient.get<PointResponse[]>("/points/me");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("getUserPoints error:", error.message);
    }
    throw error;
  }
};

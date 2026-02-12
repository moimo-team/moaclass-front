import type { OrderListResponse } from "@/models/order.model";
import { apiClient } from "./client";

// 내 클래스 결제내역 조회
export const getOrderList = async (
  status: string,
  page = 1,
  limit = 6,
): Promise<OrderListResponse> => {
  try {
    const response = await apiClient.get<OrderListResponse>(
      `/enrollments/me?status=${status}&page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error("getOrderList error:", error);
    throw error;
  }
};

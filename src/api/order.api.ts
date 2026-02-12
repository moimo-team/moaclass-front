import type {
  CancelClassRequest,
  CancelClassResponse,
  OrderListResponse,
} from "@/models/order.model";
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

// 수강취소 내역 조회
export const getCancelClass = async (
  id: number,
): Promise<CancelClassResponse> => {
  try {
    const response = await apiClient.get<CancelClassResponse>(
      `/enrollments/${id}/cancel`,
    );
    return response.data;
  } catch (error) {
    console.error("getCancelClass error:", error);
    throw error;
  }
};

// 수강취소
export const cancelClass = async (
  id: number,
  data: CancelClassRequest,
): Promise<void> => {
  try {
    await apiClient.post(`/enrollments/${id}/cancel`, data);
  } catch (error) {
    console.error("cancelClass error:", error);
    throw error;
  }
};

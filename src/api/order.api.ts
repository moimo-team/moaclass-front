import type {
  CancelClassRequest,
  CancelClassResponse,
  OrderDetailResponse,
  OrderListResponse,
} from "@/models/order.model";
import { apiClient } from "./client";

// 내 클래스 결제내역 조회
export const getOrderList = async (
  filter: string,
  page = 1,
  limit = 6,
): Promise<OrderListResponse> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filter && filter !== "전체") {
      params.append("filter", filter);
    }

    const response = await apiClient.get<OrderListResponse>(
      `/enrollments/me?${params.toString()}`,
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

// 결제상세 조회
export const getOrderDetail = async (
  pointTransactionId: number,
): Promise<OrderDetailResponse> => {
  try {
    const response = await apiClient.get<OrderDetailResponse>(
      `/payments/detail/${pointTransactionId}`,
    );
    return response.data;
  } catch (error) {
    console.error("getOrderDetail error:", error);
    throw error;
  }
};

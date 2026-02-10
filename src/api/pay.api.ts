import { apiClient } from "@/api/client";
import type { PayPreviewResponse } from "@/models/pay.model";

export interface GetPayPreviewParams {
  scheduleId: number;
  quantity: number;
}

// 결제 프리뷰 조회
export const getPayPreview = async (
  params: GetPayPreviewParams,
): Promise<PayPreviewResponse> => {
  try {
    const response = await apiClient.get(
      `/payments/preview?scheduleId=${params.scheduleId}&quantity=${params.quantity}`,
    );
    return response.data;
  } catch (error) {
    console.error("getPayPreview error:", error);
    throw error;
  }
};

export interface PayInfoValues {
  scheduleId: number;
  amount: number;
  couponId: number | null;
}

// 결제하기
export const createPayment = async (data: PayInfoValues) => {
  try {
    const response = await apiClient.post("/payments", data);
    return response.data;
  } catch (error) {
    console.error("createPayment error:", error);
    throw error;
  }
};

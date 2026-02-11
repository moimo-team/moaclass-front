import { apiClient } from "@/api/client";
import type {
  CouponCalculateResponse,
  PayPreviewResponse,
} from "@/models/pay.model";

export interface GetPayPreviewParams {
  scheduleId: number;
  quantity: number;
}

// 결제 프리뷰 조회
export const getPayPreview = async (
  params: GetPayPreviewParams,
): Promise<PayPreviewResponse> => {
  const response = await apiClient.get(
    `/payments/preview?scheduleId=${params.scheduleId}&quantity=${params.quantity}`,
  );
  return response.data;
};

export interface CouponCalculateValues {
  scheduleId: number;
  quantity: number;
  couponId: number;
}

// 쿠폰 선택 계산
export const calculateCouponDiscount = async (
  data: CouponCalculateValues,
): Promise<CouponCalculateResponse> => {
  const response = await apiClient.post(`/payments/calculate`, data);
  return response.data;
};

export interface PayInfoValues {
  scheduleId: number;
  amount: number;
  couponId: number | null;
}

// 결제하기
export const createPayment = async (data: PayInfoValues) => {
  const response = await apiClient.post("/payments", data);
  return response.data;
};

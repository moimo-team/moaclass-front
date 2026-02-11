import { apiClient } from "@/api/client";
import type { ParticipationStatus } from "@/models/participation.model";
import type {
  CouponCalculateResponse,
  PayPreviewResponse,
  PayStatus,
} from "@/models/pay.model";
import type { PointType } from "@/models/point.model";

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
  finalPrice: number;
  couponId: number | null;
}

export interface CreatePaymentResponse {
  enrollmentId: number;
  status: ParticipationStatus; // 참여상태
  transaction: {
    id: number;
    amount: number;
    type: PointType; // USE / CHARGE / REFUND
    status: PayStatus; // 결제 상태
  };
  remainingPoints: number;
}

// 결제(수강생 등록)
export const createEnrollment = async (
  data: PayInfoValues,
): Promise<CreatePaymentResponse> => {
  const response = await apiClient.post("/enrollments", data);
  return response.data;
};

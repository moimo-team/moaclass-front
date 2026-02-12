import type { CouponInfo } from "./coupon.model";
import type { LessonCategory } from "./lesson.model";

// 결제상태(결제대기 | 결제완료 | 결제취소 | 결제실패)
export type PayStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";

export interface PayPreviewResponse {
  lesson: {
    category?: LessonCategory;
    title: string;
    representativeImage: string;
    schedule: {
      startAt: string;
      endAt: string;
    };
    address: string;
  };
  originalPrice: number;
  quantity: number;
  subtotal: number;
  availableCoupons: CouponInfo[];
  userPoints: number;
  canPay: boolean;
}

export interface CouponCalculateResponse {
  subtotal: number;
  couponDiscount: number;
  finalPrice: number;
  userPoints: number;
  canPay: boolean;
}

// 결제 시 포인트 부족 에러
export interface PayErrorResponse {
  canPay: boolean;
  error: {
    code: string;
    message: string;
  };
  requiredPoints?: number;
  userPoints?: number;
}

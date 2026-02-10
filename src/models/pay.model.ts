import type { CouponInfo } from "./coupon.model";
import type { LessonCategory } from "./lesson.model";

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

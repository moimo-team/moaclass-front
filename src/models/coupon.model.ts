export type DiscountType = "FIXED" | "PERCENT";
export type CouponStatus = "USED" | "AVAILABLE" | "EXPIRED";

// 쿠폰
export interface Coupons {
  id: number;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxUsage: number; // 최대 사용 횟수
  currentUsage: number; // 현재 사용 횟수
  validFrom: string; // 유효 시작일
  validUntil: string; // 유효 종료일
}

// 유저 쿠폰
export interface userCoupons {
  id: number;
  userId: number;
  couponId: number;
  isUsed: boolean; // 사용 여부
  usedAt: string; // 사용 일시
  issuedAt: string; // 발급 일시
}

export type CouponInfo = Partial<Coupons> & {
  name?: string;
  status?: CouponStatus;
};

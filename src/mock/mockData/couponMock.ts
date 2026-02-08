import type { Coupons, userCoupons } from "@/models/coupon.model";

// 1. Coupons 테이블 (쿠폰 마스터 데이터)
export const coupons: Coupons[] = [
    {
        id: 1,
        code: "WINTER2026",
        description: "[겨울방학 특가] 전 클래스 10% 할인 쿠폰",
        discountType: "PERCENT",
        discountValue: 10,
        maxUsage: 1000,
        currentUsage: 150,
        validFrom: "2025-12-01T00:00:00",
        validUntil: "2026-02-28T23:59:59"
    },
    {
        id: 2,
        code: "WELCOME_MOA",
        description: "모아클래스 첫 주문 감사 쿠폰",
        discountType: "FIXED",
        discountValue: 5000,
        maxUsage: 1,
        currentUsage: 0,
        validFrom: "2024-01-01T00:00:00",
        validUntil: "2026-12-31T23:59:59"
    },
    {
        id: 3,
        code: "EXPIRED_COUPON",
        description: "만료된 할인 쿠폰",
        discountType: "PERCENT",
        discountValue: 15,
        maxUsage: 100,
        currentUsage: 50,
        validFrom: "2025-01-01T00:00:00",
        validUntil: "2025-12-31T23:59:59" // 이미 만료됨
    },
    {
        id: 4,
        code: "USED_COUPON",
        description: "이미 사용한 3000원 할인 쿠폰",
        discountType: "FIXED",
        discountValue: 3000,
        maxUsage: 1,
        currentUsage: 1,
        validFrom: "2025-01-01T00:00:00",
        validUntil: "2026-03-31T23:59:59"
    }
];

// 2. UserCoupons 테이블 (유저가 보유한 쿠폰)
// 가정: 현재 로그인한 유저의 ID는 1이라고 가정
export const userCouponsData: userCoupons[] = [
    {
        id: 101,
        userId: 1,
        couponId: 1, // [겨울방학 특가] - 사용 가능
        isUsed: false,
        usedAt: "",
        issuedAt: "2026-01-15T10:00:00"
    },
    {
        id: 102,
        userId: 1,
        couponId: 2, // 첫 주문 감사 - 사용 가능
        isUsed: false,
        usedAt: "",
        issuedAt: "2026-02-01T09:00:00"
    },
    {
        id: 103,
        userId: 1,
        couponId: 3, // 만료된 쿠폰
        isUsed: false,
        usedAt: "",
        issuedAt: "2025-06-01T09:00:00"
    },
    {
        id: 104,
        userId: 1,
        couponId: 4, // 사용 완료된 쿠폰
        isUsed: true,
        usedAt: "2026-01-20T14:30:00",
        issuedAt: "2026-01-10T09:00:00"
    }
];
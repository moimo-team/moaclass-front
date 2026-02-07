import type { CouponInfo } from "@/models/coupon.model";
import { apiClient } from "./client";

/**
 * 사용 가능한 쿠폰 목록 조회
 * @param userId 유저 ID
 * @returns 쿠폰 목록
 */
export const getAvailableCoupons = async (userId: number): Promise<CouponInfo[]> => {
    try {
        const response = await apiClient.get<CouponInfo[]>(`/coupons/${userId}`);
        return response.data;
    } catch (error) {
        console.error("getAvailableCoupons error:", error);
        throw error;
    }
};

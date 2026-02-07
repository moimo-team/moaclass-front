import { getAvailableCoupons } from "@/api/coupon.api";
import { useQuery } from "@tanstack/react-query";

/**
 * 사용 가능한 쿠폰 목록 조회
 * @param userId 유저 ID
 * @returns 쿠폰 목록
 */
export const useAvailableCouponsQuery = (userId: number) => {
    return useQuery({
        queryKey: ["availableCoupons", userId],
        queryFn: () => getAvailableCoupons(userId),
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
        enabled: !!userId
    });
};
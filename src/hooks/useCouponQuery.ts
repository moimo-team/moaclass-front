import { getAvailableCoupons, getUserCoupons } from "@/api/coupon.api";
import { useQuery } from "@tanstack/react-query";

/**
 * 사용자 쿠폰 내역 조회
 * @returns 쿠폰 목록
 */
export const useUserCouponsQuery = () => {
    return useQuery({
        // queryKey를 계층적으로 구조화하면 향후 쿼리 무효화(invalidation) 관리가 더 용이해짐
        queryKey: ["coupons", "me"],
        queryFn: () => getUserCoupons(),
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
    });
};

/**
 * 사용 가능한 쿠폰 목록 조회 (결제 모달용)
 * @returns 현재 사용 가능한 쿠폰 목록 (만료되지 않고 사용하지 않은 쿠폰만)
 */
export const useAvailableCouponsQuery = () => {
    return useQuery({
        queryKey: ["coupons", "available"],
        queryFn: () => getAvailableCoupons(),
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
    });
};
import type { CouponInfo } from '@/models/coupon.model';

import { apiClient } from './client';

/**
 * 사용자 쿠폰 내역 조회
 * @returns 쿠폰 목록
 */
export const getUserCoupons = async (): Promise<CouponInfo[]> => {
	try {
		const response = await apiClient.get<CouponInfo[]>(`/coupons/me`);
		return response.data;
	} catch (error) {
		console.error('getUserCoupons error:', error);
		throw error;
	}
};

/**
 * 사용 가능한 쿠폰 목록 조회 (결제 모달용)
 * @returns 현재 사용 가능한 쿠폰 목록 (만료되지 않고 사용하지 않은 쿠폰만)
 */
export const getAvailableCoupons = async (): Promise<CouponInfo[]> => {
	try {
		const response = await apiClient.get<CouponInfo[]>(`/coupons/available`);
		return response.data;
	} catch (error) {
		console.error('getAvailableCoupons error:', error);
		throw error;
	}
};

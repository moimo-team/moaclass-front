import type { CouponInfo } from '@/models/coupon.model';

import { apiClient } from './client';

export interface IssueCouponRequest {
	userId: number;
	couponId: number;
}

export interface IssueCouponResponse {
	id: number;
	userId: number;
	couponId: number;
	isUsed: boolean;
	usedAt: string | null;
	issuedAt: string;
}

/**
 * 사용자 쿠폰 내역 조회
 */
export const getUserCoupons = async (): Promise<CouponInfo[]> => {
	const response = await apiClient.get<CouponInfo[]>(`/coupons/me`);
	return response.data;
};

/**
 * 사용 가능한 쿠폰 목록 조회 (결제 모달용)
 */
export const getAvailableCoupons = async (): Promise<CouponInfo[]> => {
	const response = await apiClient.get<CouponInfo[]>(`/coupons/available`);
	return response.data;
};

/**
 * 특정 사용자에게 쿠폰 발급
 */
export const issueCoupon = async (data: IssueCouponRequest): Promise<IssueCouponResponse> => {
	const response = await apiClient.post<IssueCouponResponse>(`/coupons/issue`, data);
	return response.data;
};

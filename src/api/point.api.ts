import type { PointChargeResponse, PointResponse } from '@/models/point.model';

import { apiClient } from './client';

/**
 * 사용자 포인트 내역 조회
 * @returns 포인트 목록
 */
export const getUserPoints = async (): Promise<PointResponse> => {
	const response = await apiClient.get<PointResponse>('/points/me');
	return response.data;
};

/**
 * 포인트 충전
 * @returns
 */
export const chargePoint = async (amount: number): Promise<PointChargeResponse> => {
	const response = await apiClient.post<PointChargeResponse>('/points/charge', {
		amount,
	});
	return response.data;
};

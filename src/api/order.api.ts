import type {
	CancelClassRequest,
	CancelClassResponse,
	OrderDetailResponse,
	OrderListResponse,
	RefundResponse,
} from '@/models/order.model';

import { apiClient } from './client';

// 내 클래스 결제내역 조회
export const getOrderList = async (
	filter: string,
	page = 1,
	limit = 6,
): Promise<OrderListResponse> => {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});

	if (filter && filter !== '전체') {
		params.append('filter', filter);
	}

	const response = await apiClient.get<OrderListResponse>(`/enrollments/me?${params.toString()}`);
	return response.data;
};

// 수강취소 내역 조회
export const getCancelClass = async (enrollmentId: number): Promise<CancelClassResponse> => {
	const response = await apiClient.get<CancelClassResponse>(
		`/enrollments/${enrollmentId}/cancel-info`,
	);
	return response.data;
};

// 수강취소
export const cancelClass = async (
	enrollmentId: number,
	data: CancelClassRequest,
): Promise<RefundResponse> => {
	const response = await apiClient.put<RefundResponse>(
		`/enrollments/${enrollmentId}/cancel`,
		data,
	);
	return response.data;
};

// 결제상세 조회
export const getOrderDetail = async (enrollmentId: number): Promise<OrderDetailResponse> => {
	const response = await apiClient.get<OrderDetailResponse>(`/payments/detail/${enrollmentId}`);
	return response.data;
};

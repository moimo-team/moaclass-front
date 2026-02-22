import { apiClient } from '@/api/client';
import type { ParticipationStatus } from '@/models/participation.model';
import type {
	CancelInfoResponse,
	CouponCalculateResponse,
	PaymentDetailResponse,
	PayPreviewResponse,
	PayStatus,
} from '@/models/pay.model';
import type { PointType } from '@/models/point.model';

export interface GetPayPreviewParams {
	scheduleId: number;
	quantity: number;
}

// 결제 프리뷰 조회
export const getPayPreview = async (params: GetPayPreviewParams): Promise<PayPreviewResponse> => {
	const response = await apiClient.get<PayPreviewResponse>(
		`/payments/preview?scheduleId=${params.scheduleId}&quantity=${params.quantity}`,
	);
	return response.data;
};

export interface CouponCalculateValues {
	scheduleId: number;
	quantity: number;
	couponId: number;
}

// 쿠폰 선택 계산
export const calculateCouponDiscount = async (
	data: CouponCalculateValues,
): Promise<CouponCalculateResponse> => {
	const response = await apiClient.post<CouponCalculateResponse>(`/payments/calculate`, data);
	return response.data;
};

export interface PayInfoValues {
	quantity: number;
	scheduleId: number;
	finalPrice: number;
	couponId: number | null;
	email: string;
}

export interface CreatePaymentResponse {
	enrollmentId: number;
	status: ParticipationStatus; // 참여상태
	transaction: {
		id: number;
		amount: number;
		couponId: number | null;
		type: PointType; // USE / CHARGE / REFUND
		status: PayStatus; // 결제 상태
	};
	remainingPoints: number;
	teacherBalance: number; // 최신 명세 반영
}

// 결제(수강생 등록)
export const createEnrollment = async (data: PayInfoValues): Promise<CreatePaymentResponse> => {
	const response = await apiClient.post<CreatePaymentResponse>('/enrollments', data);
	return response.data;
};

// 수강 취소 조회
export const getEnrollmentCancelInfo = async (
	enrollmentId: number,
): Promise<CancelInfoResponse> => {
	const response = await apiClient.get<CancelInfoResponse>(
		`/enrollments/${enrollmentId}/cancel-info`,
	);
	return response.data;
};

// 수강 취소 처리
export interface CancelEnrollmentParams {
	reason: string;
	detailReason: string;
}

export const cancelEnrollment = async (
	enrollmentId: number,
	data: CancelEnrollmentParams,
): Promise<unknown> => {
	const response = await apiClient.put(`/enrollments/${enrollmentId}/cancel`, data);
	return response.data;
};

// 결제 상세 정보 조회
export const getPaymentDetail = async (enrollmentId: number): Promise<PaymentDetailResponse> => {
	const response = await apiClient.get<PaymentDetailResponse>(`/payments/detail/${enrollmentId}`);
	return response.data;
};

import type { CouponInfo } from './coupon.model';
import type { Lesson, LessonCategory } from './lesson.model';
import type { Schedule } from './schedule.model';

// 결제상태(결제대기 | 결제완료 | 결제취소 | 결제실패)
export type PayStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export interface PayPreviewResponse {
	lessons: {
		// 명세서에 따른 필드명 (lessons)
		category?: LessonCategory;
		representativeImage: Lesson['representativeImage'];
		title: Lesson['title'];
		schedule: Pick<Schedule, 'startAt' | 'endAt'>;
		address: Lesson['address'];
	};
	originalPrice: number;
	quantity: number;
	subtotal: number;
	availableCoupons: CouponInfo[];
	userPoints: number;
	canPay: boolean;
}

export interface CouponCalculateResponse {
	subtotal: number;
	couponDiscount: number;
	finalPrice: number;
	userPoints: number;
	canPay: boolean;
}

// 결제 시 포인트 부족 에러
export interface PayErrorResponse {
	canPay: boolean;
	error: {
		code: string;
		message: string;
	};
	finalPrice?: number;
	userPoints?: number;
}

// 결제 상세 정보 (GET /payments/detail/{enrollmentId})
export interface PaymentDetailResponse {
	orderId: number;
	transactionStatus: PayStatus;
	paymentDate: string;
	classInfo: {
		title: string;
		teacherName: string;
		startAt: string;
		endAt: string;
	};
	paymentInfo: {
		originPrice: number;
		discountAmount: number;
		finalPrice: number;
		quantity: number;
		coupon: CouponInfo | null;
	};
	refundInfo: RefundDetail | null;
}

// 수강 취소 정보 (GET /enrollments/{id}/cancel-info)
export interface CancelInfoResponse {
	classInfo: {
		title: string;
		teacherName: string;
		startAt: string;
		endAt: string;
	};
	paymentInfo: {
		originPrice: number;
		discountAmount: number;
		finalPrice: number;
		quantity: number;
		coupon: CouponInfo | null;
	};
	refundInfo: {
		deductedAmount: number;
		refundAmount: number;
		paidAmount: number;
	};
}

export interface RefundDetail {
	deductedAmount: number;
	refundAmount: number;
	paidAmount: number;
	refundDate?: string;
	reason?: string;
	detailReason?: string;
}

import type { CouponInfo } from './coupon.model';
import type { PaginationMeta } from './pagination.model';
import type { PayStatus } from './pay.model';

// "전체" | "수강예정" | "수강취소" | "수강완료";
export type OrderStatus = '수강예정' | '수강취소' | '수강완료';

export interface Order {
	enrollmentId: number;
	lessonId: number;
	scheduleId: number;
	pointTransactionId: number;
	title: string;
	startAt: string;
	endAt: string;
	image: string;
	status: OrderStatus;
	transactionStatus: string;
	reviewId: number | null;
}

export interface OrderListResponse {
	data: Order[];
	meta: PaginationMeta;
}

export interface CancelClassResponse {
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
		coupon: CouponInfo;
	};
	refundInfo: {
		paidAmount: number; // 실 결제금액
		deductedAmount: number; // 차감된 포인트
		refundAmount: number; // 환급된 포인트
	};
}

export interface CancelClassRequest {
	reason: string;
	detailReason: string;
}

export interface RefundResponse {
	enrollmentId: number;
	status: string;
	refundAmount: number;
	remainingPoints: number;
}

export interface OrderDetailResponse {
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
		coupon: {
			id: number;
			name: string;
			discountType: string;
			discountValue: number;
		};
	};
	refundInfo: {
		paidAmount: number;
		deductedAmount: number;
		refundAmount: number;
		refundDate: string;
		reason: string;
		detailReason: string;
	} | null;
}

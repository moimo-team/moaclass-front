import type { CouponInfo } from './coupon.model';
import type { PayStatus } from './pay.model';

export type PointType = 'CHARGE' | 'USE' | 'REFUND' | 'EARN' | 'DEDUCT'; // 충전 / 사용 / 환불 / 수익 / 차감

// 포인트 히스토리
export interface PointHistory {
	transactionId: number;
	title: string;
	type: PointType;
	status: PayStatus;
	amount: number;
	coupon: CouponInfo | null;
	createdAt: string;
}
// 포인트 내역 타입 정의
export interface PointResponse {
	userPoints: number;
	teacherProfit: number;
	history: PointHistory[];
}

export interface PointChargeResponse {
	transaction: {
		id: number;
		amount: number;
		type: PointType;
		status: PayStatus;
		createdAt: string;
	};
	userPoints: number;
}

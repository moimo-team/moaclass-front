import type { PaginationMeta } from "./pagination.model";

// "전체" | "수강예정" | "수강취소" | "수강완료";
export type OrderStatus = "수강예정" | "수강취소" | "수강완료";

export interface Order {
  enrollmentId: number;
  lessonId: number;
  scheduleId: number;
  pointTransactionId: number;
  title: string;
  date: string;
  image: string;
  status: OrderStatus;
  transactionStatus: string;
}

export interface OrderListResponse {
  data: Order[];
  meta: PaginationMeta;
}

export interface CancelClassResponse extends Order {
  payments: {
    totalAmount: number;
    couponAmount: number;
    pointAmount: number;
    finalAmount: number;
  };
  refunds: {
    totalAmount: number;
    couponAmount: number;
    pointAmount: number;
    finalAmount: number;
  };
}

export interface CancelClassRequest {
  reason: string;
  detailReason: string;
}

export interface OrderDetailResponse {
  orderId: number;
  title: string;
  teacherName: string;
  originPrice: number;
  discountedAmount: number;
  amount: number;
  paymentDate: string;
  status: OrderStatus;
  reason?: string;
  detailReason?: string;
  refundAmount?: number;
  refundDate?: string;
}

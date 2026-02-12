import type { PaginationMeta } from "./pagination.model";

// "전체" | "수강예정" | "수강취소" | "수강완료";
export type OrderStatus = "ACCEPTED" | "CANCEL" | "COMPLETED";

export interface Order {
  id: number;
  lessonId: number;
  title: string;
  startAt: string;
  endAt: string;
  status: OrderStatus;
  representativeImage: string;
  price: number;
  teacherNickname: string;
  isCompleted: boolean;
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

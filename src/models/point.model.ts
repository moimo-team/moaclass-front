export type PointType = "CHARGE" | "USE" | "REFUND"; // 충전 / 사용 / 환불

// 포인트 내역 타입 정의
export interface PointResponse {
  pointId: string;
  type: PointType;
  title: string;
  amount: number;
  createdAt: string;
  // date: string;
  // time: string;
}

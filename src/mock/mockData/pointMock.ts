import type { PointResponse } from "@/models/point.model";

export const MOCK_POINT_HISTORY: PointResponse[] = [
  {
    pointId: "1",
    type: "CHARGE",
    title: "포인트 충전",
    amount: 31,
    createdAt: "20260102 13:00:00",
  },
  {
    pointId: "2",
    type: "CHARGE",
    title: "포인트 충전",
    amount: 284,
    createdAt: "20260103 15:30:00",
  },
  {
    pointId: "3",
    type: "CHARGE",
    title: "포인트 충전",
    amount: 15,
    createdAt: "20260104 10:00:00",
  },
  {
    pointId: "4",
    type: "USE",
    title: "원데이클래스 1회권",
    amount: -2700,
    createdAt: "20260105 11:12:00",
  },
  {
    pointId: "5",
    type: "USE",
    title: "원데이클래스 10회권",
    amount: -20000,
    createdAt: "20260106 12:12:00",
  },
  {
    pointId: "6",
    type: "REFUND",
    title: "원데이클래스 1회권 취소",
    amount: 20000,
    createdAt: "20260107 13:12:00",
  },
];

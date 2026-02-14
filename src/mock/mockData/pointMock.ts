import type { PointHistory } from "@/models/point.model";

export const MOCK_POINT_HISTORY: PointHistory[] = [
  {
    transactionId: 4,
    title: "국어 강의",
    type: "USE",
    status: "CANCELLED",
    amount: 54000,
    coupon: {
      code: "JOIN10",
      discountType: "PERCENT",
      discountValue: 10,
    },
    createdAt: "2026-02-11T21:17:53.575Z",
  },
  {
    transactionId: 3,
    title: "국어 강의",
    type: "USE",
    status: "COMPLETED",
    amount: 54000,
    coupon: {
      code: "JOIN10",
      discountType: "PERCENT",
      discountValue: 10,
    },
    createdAt: "2026-02-11T21:15:03.350Z",
  },
  {
    transactionId: 2,
    title: "국어 강의",
    type: "USE",
    status: "COMPLETED",
    amount: 9999,
    coupon: null,
    createdAt: "2026-02-11T17:57:48.634Z",
  },
  {
    transactionId: 1,
    title: "국어 강의",
    type: "USE",
    status: "COMPLETED",
    amount: 60000,
    coupon: null,
    createdAt: "2026-02-11T14:54:56.513Z",
  },
];

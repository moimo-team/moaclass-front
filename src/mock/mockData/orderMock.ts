// 결제내역 조회 데이터
export const MOCK_ORDERS = Array.from({ length: 15 }, (_, i) => ({
  enrollmentId: i + 1,
  lessonId: i + 1, // 테스트를 위해 ID와 동일하게 설정
  scheduleId: i + 1, // 테스트를 위해 ID와 동일하게 설정
  pointTransactionId: i + 1, // 테스트를 위해 ID와 동일하게 설정
  title: `클래스명${i + 1}`,
  startAt: "2026-02-14T01:02:00.000Z",
  endAt: "2026-02-14T03:02:00.000Z",
  image: `https://picsum.photos/seed/${i + 100}/200/120`,
  // status: i % 3 === 0 ? "ACCEPTED" : i % 3 === 1 ? "CANCEL" : "COMPLETED",
  status: i % 3 === 0 ? "수강예정" : i % 3 === 1 ? "수강취소" : "수강완료",
  transactionStatus:
    i % 3 === 0 ? "CANCELLED" : i % 3 === 1 ? "FAILED" : "COMPLETED",
}));

// 수강취소 페이지용 Mock Data
export const MOCK_CANCEL_ORDERS = Array.from({ length: 15 }, (_, i) => ({
  ...MOCK_ORDERS[0],
  payments: {
    totalAmount: 33000,
    couponAmount: 0,
    pointAmount: 0,
    finalAmount: 33000,
  },
  refunds: {
    totalAmount: 33000,
    couponAmount: 0,
    pointAmount: 0,
    finalAmount: 33000,
  },
}));

// 결제 상세 조회 데이터
export const MOCK_ORDER_DETAIL = {
  orderId: 4,
  title: "국어 강의",
  teacherName: "닉네임",
  originPrice: 60000,
  discountedAmount: 6000,
  amount: 54000,
  paymentDate: "2026-02-11T21:17:53.575Z",
  status: "COMPLETED",
};

// 결제 환불 상세 조회 데이터
export const MOCK_ORDER_CANCEL_DETAIL = {
  orderId: 5,
  title: "수학 강의",
  teacherName: "홍길동",
  originPrice: 50000,
  discountedAmount: 0,
  amount: 50000,
  paymentDate: "2026-02-10T14:00:00.000Z",
  status: "CANCELLED",
  reason: "개인 사정",
  detailReason: "갑작스러운 일정 변경",
  refundAmount: 50000,
  refundDate: "2026-02-11T09:00:00.000Z",
};

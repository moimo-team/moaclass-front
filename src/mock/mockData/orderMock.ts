export const MOCK_ORDERS = Array.from({ length: 15 }, (_, i) => ({
  enrollmentId: i + 1,
  lessonId: i + 1, // 테스트를 위해 ID와 동일하게 설정
  scheduleId: i + 1, // 테스트를 위해 ID와 동일하게 설정
  pointTransactionId: i + 1, // 테스트를 위해 ID와 동일하게 설정
  title: `클래스명${i + 1}`,
  date: "2026-02-14T01:02:00.000Z",
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

// 결제 프리뷰 데이터
export const payPreviewMock = {
  lesson: {
    category: { id: 1, name: "공예" },
    title: "나만의 모우인형, 귀염뽀짝 모우키링 만들기",
    representativeImage: "https://picsum.photos/id/301/1200/400",
    schedule: {
      startAt: "2026-02-20T14:00:00.000Z",
      endAt: "2026-02-20T16:00:00.000Z",
    },
    address: "서울 강남구 테헤란로 123",
  },
  originalPrice: 20000,
  quantity: 2,
  subtotal: 40000,
  availableCoupons: [
    {
      id: 1,
      name: "가입 10% 할인",
      discountType: "PERCENT",
      discountValue: 10,
    },
    {
      id: 2,
      name: "6만원 이상 1만원 할인",
      discountType: "FIXED",
      discountValue: 10000,
    },
  ],
  userPoints: 8000,
  canPay: false,
};

import { http, HttpResponse, delay } from "msw";
import { httpUrl } from "./mockData/mockData";
import { payPreviewMock } from "./mockData/payPreviewMock";

// 결제 프리뷰 페이지 조회
const getPayPreview = http.get(
  `${httpUrl}/payments/preview`,
  async ({ request }) => {
    await delay(500);
    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        { message: "토큰이 없습니다." },
        { status: 401 },
      );
    }

    try {
      const url = new URL(request.url);
      const scheduleId = Number(url.searchParams.get("scheduleId"));
      const quantity = Number(url.searchParams.get("quantity")) || 1; // 기본값 1

      return HttpResponse.json(payPreviewMock, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        { message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }
  },
);

// 쿠폰 선택 계산
const calculateCouponDiscount = http.post(
  `${httpUrl}/payments/calculate`,
  async ({ request }) => {
    await delay(500);
    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        { message: "토큰이 없습니다." },
        { status: 401 },
      );
    }

    try {
      // const { scheduleId, quantity, couponId } = (await request.json()) as any;

      // TODO: 실제 쿠폰 계산 로직 구현
      // 현재는 성공 응답만 반환
      return HttpResponse.json(
        {
          message: "쿠폰이 적용되었습니다.",
          subtotal: 10000,
          couponDiscount: 1000,
          finalPrice: 9000,
          userPoints: 8000,
          canPay: false,
        },
        { status: 200 },
      );
    } catch (error) {
      return HttpResponse.json(
        { message: "쿠폰 계산 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }
  },
);

// 결제 생성
const createPayment = http.post(`${httpUrl}/payments`, async ({ request }) => {
  await delay(500);
  const token = request.headers.get("Authorization");
  if (!token) {
    return HttpResponse.json({ message: "토큰이 없습니다." }, { status: 401 });
  }

  try {
    const { scheduleId, amount, couponId } = (await request.json()) as any;
    console.log("Creating payment with body:", {
      scheduleId,
      amount,
      couponId,
    });

    // TODO: 실제 결제 처리 로직 구현
    // 현재는 성공 응답만 반환
    return HttpResponse.json(
      {
        message: "결제가 성공적으로 생성되었습니다.",
        paymentId: Math.floor(Math.random() * 1000000) + 1,
        status: "PENDING",
      },
      { status: 201 },
    );
  } catch (error) {
    return HttpResponse.json(
      { message: "결제 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
});

export const payHandler = [
  getPayPreview,
  createPayment,
  calculateCouponDiscount,
];

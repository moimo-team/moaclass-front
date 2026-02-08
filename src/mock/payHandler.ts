import { http, HttpResponse, delay } from "msw";
import { httpUrl } from "./mockData/mockData";
import { payPreviewMock } from "./mockData/payPreviewMock";


// 결제 프리뷰 페이지 조회
const getPayPreview = http.get(`${httpUrl}/payments/preview`, async ({ request }) => {
    await delay(500);
    const token = request.headers.get("Authorization");
    if (!token) {
        return HttpResponse.json(
            { message: "토큰이 없습니다." },
            { status: 401 }
        );
    }

    try {
        const url = new URL(request.url);
        const lessonId = url.searchParams.get("lessonId");
        const scheduleId = url.searchParams.get("scheduleId");
        const quantity = Number(url.searchParams.get("quantity")) || 1; // 기본값 1

        console.log(`Fetching pay preview for lessonId: ${lessonId}, scheduleId: ${scheduleId}, quantity: ${quantity}`);

        // 가격 계산 로직
        const unitPrice = payPreviewMock.lesson.discountedPrice;
        const subtotal = unitPrice * quantity;

        const responseData = {
            ...payPreviewMock,
            price: {
                quantity: quantity,
                subtotal: subtotal,
                total: subtotal
            }
        };

        return HttpResponse.json(responseData,
            { status: 200 }
        );

    } catch (error) {
        return HttpResponse.json(
            { message: "잘못된 요청입니다." },
            { status: 400 }
        );
    }
});

// 결제 생성
const createPayment = http.post(`${httpUrl}/payments`, async ({ request }) => {
    await delay(500);
    const token = request.headers.get("Authorization");
    if (!token) {
        return HttpResponse.json(
            { message: "토큰이 없습니다." },
            { status: 401 }
        );
    }

    try {
        const { userId, lessonId, scheduleId, amount, couponId } = (await request.json()) as any;
        console.log("Creating payment with body:", { userId, lessonId, scheduleId, amount, couponId });

        // TODO: 실제 결제 처리 로직 구현
        // 현재는 성공 응답만 반환
        return HttpResponse.json(
            {
                message: "결제가 성공적으로 생성되었습니다.",
                paymentId: Math.floor(Math.random() * 1000000) + 1,
                status: "PENDING"
            },
            { status: 201 }
        );

    } catch (error) {
        return HttpResponse.json(
            { message: "결제 생성 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
});

export const payHandler = [
    getPayPreview,
    createPayment
]

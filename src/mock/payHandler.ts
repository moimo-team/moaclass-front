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
})

export const payHandler = [
    getPayPreview
]

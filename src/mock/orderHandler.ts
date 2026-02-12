import { http, HttpResponse, delay } from "msw";
import { httpUrl } from "./mockData/mockData";
import { MOCK_CANCEL_ORDERS, MOCK_ORDERS } from "./mockData/orderMock";

// 결제내역 조회
const getOrderList = http.get(
  `${httpUrl}/enrollments/me`,
  async ({ request }) => {
    await delay(500);
    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        { message: "토큰이 없습니다." },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "8");

    let filteredOrders = MOCK_ORDERS;

    // 상태 필터링
    if (status !== "all") {
      if (status === "cancel") {
        // 수강취소
        filteredOrders = filteredOrders.filter((o) => o.status === "CANCEL");
      } else if (status === "accepted") {
        // 수강예정
        filteredOrders = filteredOrders.filter(
          (o) => o.status === "ACCEPTED" && !o.isCompleted,
        );
      } else if (status === "completed") {
        // 수강완료
        filteredOrders = filteredOrders.filter((o) => o.isCompleted);
      }
    }

    // 페이지네이션 로직
    const totalCount = filteredOrders.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedOrders = filteredOrders.slice(
      (page - 1) * limit,
      page * limit,
    );

    return HttpResponse.json(
      {
        data: paginatedOrders,
        meta: {
          totalCount,
          page,
          limit,
          totalPages,
        },
      },
      { status: 200 },
    );
  },
);

// 수강취소 내역 조회
const getCancelClass = http.get(
  `${httpUrl}/enrollments/:id/cancel`,
  async ({ request, params }) => {
    await delay(500);
    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        { message: "토큰이 없습니다." },
        { status: 401 },
      );
    }

    const { id } = params;
    const order = MOCK_ORDERS.find((o) => o.id === Number(id));
    if (!order) {
      return HttpResponse.json(
        { message: "해당 주문 내역을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const cancelOrder =
      MOCK_CANCEL_ORDERS.find((o) => o.id === Number(id)) ||
      MOCK_CANCEL_ORDERS[0];
    return HttpResponse.json(cancelOrder, { status: 200 });
  },
);

// 수강취소하기
const cancelClass = http.post(
  `${httpUrl}/enrollments/:id/cancel`,
  async ({ request, params }) => {
    await delay(500);
    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        { message: "토큰이 없습니다." },
        { status: 401 },
      );
    }

    const { id } = params;
    const order = MOCK_ORDERS.find((o) => o.id === Number(id));
    if (!order) {
      return HttpResponse.json(
        { message: "해당 주문 내역을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    try {
      const { reason, detailReason } = (await request.json()) as any;

      console.log("reason", reason);
      console.log("detailReason", detailReason);

      return HttpResponse.json(
        { message: "환불 신청이 완료되었습니다." },
        { status: 200 },
      );
    } catch (error) {
      return HttpResponse.json(
        { message: "요청 데이터를 찾을 수 없습니다." },
        { status: 400 },
      );
    }
  },
);

export const orderHandler = [getOrderList, getCancelClass, cancelClass];

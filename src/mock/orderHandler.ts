import { http, HttpResponse, delay } from "msw";
import { httpUrl } from "./mockData/mockData";
import { MOCK_ORDERS } from "./mockData/orderMock";

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

export const orderHandler = [getOrderList];

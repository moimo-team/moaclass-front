import { delay, http, HttpResponse } from "msw";
import { httpUrl } from "./mockData/mockData";
import { MOCK_POINT_HISTORY } from "./mockData/pointMock";

// 유저 포인트 내역 조회
const getUserPoints = http.get(`${httpUrl}/points/me`, async ({ request }) => {
  await delay(1000);
  const token = request.headers.get("Authorization");
  if (!token) {
    console.error("getUserPoints mock error: 토큰이 없습니다.");
    return HttpResponse.json({ message: "토큰이 없습니다." }, { status: 401 });
  }

  return HttpResponse.json(MOCK_POINT_HISTORY, { status: 200 });
});

export const pointHandlers = [getUserPoints];

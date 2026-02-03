import { http, HttpResponse, delay } from "msw";
import { httpUrl, mockLessons } from "./mockData";

export const lessonHandlers = [
  // TODO: URL 확정되면 수정
  http.get(`${httpUrl}/lessons/latest`, async () => {
    await delay(500);
    return HttpResponse.json(mockLessons, { status: 200 });
  }),
];

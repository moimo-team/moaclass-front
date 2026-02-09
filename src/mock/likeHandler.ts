import { http, HttpResponse, delay } from "msw";
import { WishlistLessons } from "./mockData/wishlistMock";
import { httpUrl } from "./mockData/mockData";

// 위시리스트 조회
const getWishlist = http.get(`${httpUrl}/likes/me`, async ({ request }) => {
  await delay(500);
  const token = request.headers.get("Authorization");
  if (!token) {
    return HttpResponse.json({ message: "토큰이 없습니다." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const limit = Number(url.searchParams.get("limit") || "8");

  const filteredLessons = WishlistLessons;

  const totalCount = filteredLessons.length;
  const totalPages = Math.ceil(totalCount / limit);
  const paginatedLessons = filteredLessons.slice(
    (page - 1) * limit,
    page * limit,
  );

  return HttpResponse.json(
    {
      data: paginatedLessons,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
      },
    },
    { status: 200 },
  );
});

// 좋아요 취소
const cancelLike = http.delete(
  `${httpUrl}/likes/:lessonId`,
  async ({ request, params }) => {
    await delay(500);

    const token = request.headers.get("Authorization");
    if (!token) {
      return HttpResponse.json(
        { message: "토큰이 없습니다." },
        { status: 401 },
      );
    }

    const { lessonId } = params;
    const index = WishlistLessons.findIndex(
      (lesson) => lesson.lessonId === Number(lessonId),
    );

    if (index === -1) {
      return HttpResponse.json(
        { message: "위시리스트에 없는 클래스입니다." },
        { status: 404 },
      );
    }

    WishlistLessons.splice(index, 1);

    return HttpResponse.json(
      { message: "위시리스트에서 삭제되었습니다." },
      { status: 200 },
    );
  },
);

export const likeHandlers = [getWishlist, cancelLike];

import { http, HttpResponse, delay } from "msw";
import { WishlistLessons } from "./mockData/wishlistMock";
import { httpUrl } from "./mockData/mockData";

const getWishlist = http.get(`${httpUrl}/likes/me`, async ({ request }) => {
  await delay(500);

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

export const wishlistHandlers = [getWishlist];

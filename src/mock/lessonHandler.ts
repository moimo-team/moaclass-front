import { http, HttpResponse, delay } from "msw";
import { httpUrl, mockLessons, mockReviews } from "@/mock/mockData/mockData";
import { LESSON_CATEGORIES } from "@/mock/mockData/categoryMock";
import type { Level } from "@/models/lesson.model";
import type { FetchLessonsResponse } from "@/models/lesson.model";

export const lessonHandlers = [
  // TODO: URL 확정되면 수정
  http.get(`${httpUrl}/lessons/latest`, async () => {
    await delay(500);
    return HttpResponse.json(mockLessons.slice(0, 5), { status: 200 });
  }),

  http.get(`${httpUrl}/lessons`, async ({ request }) => {
    await delay(500);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "12");
    const categories = url.searchParams.getAll("categories");
    const regions = url.searchParams.getAll("regions");
    //const days = url.searchParams.getAll("days");
    const difficulty = url.searchParams.getAll("difficulty");
    const personnel = Number(url.searchParams.get("personnel") || "0");
    const minTime = Number(url.searchParams.get("minTime") || "0");
    const maxTime = Number(url.searchParams.get("maxTime") || "24");
    const minPrice = Number(url.searchParams.get("minPrice") || "0");
    const maxPrice = Number(url.searchParams.get("maxPrice") || "500000");

    let filteredLessons = mockLessons;

    const difficultyMap: Record<string, Level> = {
      입문: "BEGINNER",
      중급: "INTERMEDIATE",
      고급: "ADVANCED",
    };
    const mappedDifficulty: Level[] = difficulty
      .map((d) => difficultyMap[d])
      .filter((d): d is Level => d !== undefined);

    // 필터 적용
    if (categories.length > 0) {
      filteredLessons = filteredLessons.filter((lesson) => {
        const categoryName = LESSON_CATEGORIES.find(
          (cat) => cat.id === lesson.classCategoryId,
        )?.name;
        return categoryName && categories.includes(categoryName);
      });
    }

    if (regions.length > 0) {
      filteredLessons = filteredLessons.filter((lesson) =>
        regions.some((region) => lesson.address.includes(region)),
      );
    }

    if (mappedDifficulty.length > 0) {
      filteredLessons = filteredLessons.filter((lesson) =>
        mappedDifficulty.includes(lesson.level),
      );
    }

    if (personnel > 0) {
      filteredLessons = filteredLessons.filter(
        (lesson) =>
          lesson.maxParticipants && lesson.maxParticipants >= personnel,
      );
    }

    if (minTime > 0 || maxTime < 24) {
      filteredLessons = filteredLessons.filter(
        (lesson) =>
          lesson.durationMin &&
          lesson.durationMin >= minTime * 60 &&
          lesson.durationMin <= maxTime * 60,
      );
    }

    if (minPrice > 0 || maxPrice < 500000) {
      filteredLessons = filteredLessons.filter(
        (lesson) =>
          lesson.discountedPrice >= minPrice &&
          lesson.discountedPrice <= maxPrice,
      );
    }

    const totalCount = filteredLessons.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedLessons = filteredLessons.slice(
      (page - 1) * limit,
      page * limit,
    );

    return HttpResponse.json(
      {
        lessons: paginatedLessons,
        totalCount,
        totalPages,
      } as FetchLessonsResponse,
      { status: 200 },
    );
  }),

  // 클래스 1개 정보
  http.get(`${httpUrl}/lessons/:lessonId`, async ({ params }) => {
    await delay(500);
    const lessonId = Number(params.lessonId);
    const lesson = mockLessons.find((l) => l.id === lessonId);

    if (lesson) {
      return HttpResponse.json(lesson, { status: 200 });
    } else {
      return HttpResponse.json(
        { message: "레슨을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
  }),

  // 레슨 리뷰 목록
  http.get(`${httpUrl}/lessons/:lessonId/reviews`, async ({ params }) => {
    await delay(300); // Simulate API call delay
    const lessonId = Number(params.lessonId);
    const filteredReviews = mockReviews.filter(
      (review) => review.lesson_id === lessonId,
    );

    return HttpResponse.json(filteredReviews, { status: 200 });
  }),
];

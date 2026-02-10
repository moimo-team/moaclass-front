import { http, HttpResponse } from "msw";

let mockLikedLessons: number[] = [];

export const likeHandlers = [
  http.post("/api/likes", async ({ request }) => {
    const { lessonId } = (await request.json()) as { lessonId: number };

    if (!lessonId) {
      return HttpResponse.json(
        { message: "Lesson ID is required" },
        { status: 400 },
      );
    }

    if (!mockLikedLessons.includes(lessonId)) {
      mockLikedLessons.push(lessonId);
      console.log(
        `Mock: Liked lesson ${lessonId}. Current likes:`,
        mockLikedLessons,
      );
      return HttpResponse.json(
        { message: `Lesson ${lessonId} liked successfully` },
        { status: 201 },
      );
    } else {
      return HttpResponse.json(
        { message: `Lesson ${lessonId} already liked` },
        { status: 200 },
      );
    }
  }),

  http.delete("/api/likes/:lessonId", ({ params }) => {
    const lessonId = Number(params.lessonId);

    if (isNaN(lessonId)) {
      return HttpResponse.json(
        { message: "Invalid Lesson ID" },
        { status: 400 },
      );
    }

    const initialLength = mockLikedLessons.length;
    mockLikedLessons = mockLikedLessons.filter((id) => id !== lessonId);

    if (mockLikedLessons.length < initialLength) {
      console.log(
        `Mock: Unliked lesson ${lessonId}. Current likes:`,
        mockLikedLessons,
      );
      return HttpResponse.json(
        { message: `Lesson ${lessonId} unliked successfully` },
        { status: 200 },
      );
    } else {
      return HttpResponse.json(
        { message: `Lesson ${lessonId} was not liked` },
        { status: 204 },
      );
    }
  }),

  http.get("/api/likes", () => {
    return HttpResponse.json(mockLikedLessons, { status: 200 });
  }),
];

export const isLessonLiked = (lessonId: number) =>
  mockLikedLessons.includes(lessonId);

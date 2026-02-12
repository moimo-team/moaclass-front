import { http, HttpResponse, delay } from "msw";
import { httpUrl } from "./mockData/mockData";
import {
  LESSON_CATEGORIES,
  LESSON_SUB_CATEGORIES,
} from "./mockData/categoryMock";

// 클래스 카테고리
const getLessonCategories = http.get(
  `${httpUrl}/lesson-categories`,
  async () => {
    await delay(1000);
    return HttpResponse.json(LESSON_CATEGORIES, {
      status: 200,
    });
  },
);

// 서브 클래스 카테고리
const getLessonSubCategories = http.get(
  `${httpUrl}/lesson-categories/:id`,
  async ({ params }) => {
    await delay(1000);
    const { id } = params;
    return HttpResponse.json(
      LESSON_SUB_CATEGORIES.filter(
        (subCategory) => subCategory.categoryId === Number(id),
      ),
      {
        status: 200,
      },
    );
  },
);

export const categoryHandler = [getLessonCategories, getLessonSubCategories];

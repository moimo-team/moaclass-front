import { http, HttpResponse, delay } from "msw";
import { httpUrl, mockLessons, mockReviews } from "@/mock/mockData/mockData";
import { LESSON_CATEGORIES, LESSON_SUB_CATEGORIES } from "@/mock/mockData/categoryMock";
import type { Level, Lesson } from "@/models/lesson.model";
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
        categoryName && categories.includes(categoryName);
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

  // 클래스 리뷰 목록
  http.get(`${httpUrl}/lessons/:lessonId/reviews`, async ({ params }) => {
    await delay(300);
    const lessonId = Number(params.lessonId);
    const filteredReviews = mockReviews.filter(
      (review) => review.lessonId === lessonId,
    );

    return HttpResponse.json(filteredReviews, { status: 200 });
  }),

  // 클래스 생성 
  http.post(`${httpUrl}/lessons`, async ({ request }) => {
    await delay(1000);
    const formData = await request.formData();
    
    // FormData에서 데이터 추출
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const curriculum = formData.get("curriculum") as string;
    const lessonCategoryId = Number(formData.get("lessonCategoryId"));
    const subCategoryIdsStr = formData.get("subCategoryIds") as string;
    const subCategoryIds = subCategoryIdsStr ? JSON.parse(subCategoryIdsStr) : [];
    const level = formData.get("level") as Level;
    const durationMin = Number(formData.get("durationMin"));
    const price = Number(formData.get("price"));
    const discountRate = Number(formData.get("discountRate"));
    const discountedPrice = Number(formData.get("discountedPrice"));
    const maxParticipants = Number(formData.get("maxParticipants"));
    const regionId = Number(formData.get("regionId"));
    const address = formData.get("address") as string;
    const latitude = Number(formData.get("latitude"));
    const longitude = Number(formData.get("longitude"));
    const detailAddress = formData.get("detailAddress") as string || "";
    const directionsText = formData.get("directionsText") as string || "";
    const reservationLeadDays = Number(formData.get("reservationLeadDays"));

    // 새 클래스 ID 생성
    const newId = Math.max(...mockLessons.map(l => l.id), 0) + 1;
    
    // 카테고리 정보 찾기
    const category = LESSON_CATEGORIES.find(c => c.id === lessonCategoryId);
    
    // 소분류 카테고리 찾기
    const subCategories = LESSON_SUB_CATEGORIES
      .filter((sub: any) => subCategoryIds.includes(sub.id))
      .map((sub: any) => ({
        id: sub.id,
        categoryId: sub.categoryId || sub.category_id,
        name: sub.name,
      }));

    console.log("📦 생성할 클래스 데이터:", {
      lessonCategoryId,
      subCategoryIds,
      subCategories,
    });

    // 새 클래스 객체 생성
    const newLesson: Lesson = {
      id: newId,
      teacherId: 1,
      classCategoryId: lessonCategoryId,
      title,
      description,
      curriculum,
      level,
      durationMin,
      status: "ACTIVE",
      price,
      discountRate,
      discountedPrice,
      maxParticipants,
      currentParticipants: 0,
      representativeImage: "https://placehold.co/600x400?text=New+Class",
      likes: 0,
      regionId,
      address,
      latitude,
      longitude,
      detailAddress,
      directionsText,
      reservationLeadDays,
      rate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      classCategory: category ? { id: category.id, name: category.name } : undefined,
      subClassCategories: subCategories,
    };

    // mockLessons 배열 맨 앞에 추가
    mockLessons.unshift(newLesson);

    console.log("✅ Mock Lesson Created:", newLesson);
    console.log("📋 Total Lessons:", mockLessons.length);

    return HttpResponse.json({ 
      id: newId,
      message: "클래스가 성공적으로 생성되었습니다. (Mock)" 
    }, { status: 201 });
  }),

  // 클래스 수정
  http.put(`${httpUrl}/lessons/:lessonId`, async ({ params, request }) => {
    await delay(1000);
    const lessonId = Number(params.lessonId);
    const formData = await request.formData();
    
    // FormData에서 데이터 추출
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const curriculum = formData.get("curriculum") as string;
    const lessonCategoryId = Number(formData.get("lessonCategoryId"));
    const subCategoryIdsStr = formData.get("subCategoryIds") as string;
    const subCategoryIds = subCategoryIdsStr ? JSON.parse(subCategoryIdsStr) : [];
    const level = formData.get("level") as Level;
    const durationMin = Number(formData.get("durationMin"));
    const price = Number(formData.get("price"));
    const discountRate = Number(formData.get("discountRate"));
    const discountedPrice = Number(formData.get("discountedPrice"));
    const maxParticipants = Number(formData.get("maxParticipants"));
    const regionId = Number(formData.get("regionId"));
    const address = formData.get("address") as string;
    const latitude = Number(formData.get("latitude"));
    const longitude = Number(formData.get("longitude"));
    const detailAddress = formData.get("detailAddress") as string || "";
    const directionsText = formData.get("directionsText") as string || "";
    const reservationLeadDays = Number(formData.get("reservationLeadDays"));

    // 기존 클래스 찾기
    const lessonIndex = mockLessons.findIndex(l => l.id === lessonId);
    
    if (lessonIndex !== -1) {
      const category = LESSON_CATEGORIES.find(c => c.id === lessonCategoryId);
      
      // 소분류 카테고리 찾기
      const subCategories = LESSON_SUB_CATEGORIES
        .filter((sub: any) => subCategoryIds.includes(sub.id))
        .map((sub: any) => ({
          id: sub.id,
          categoryId: sub.categoryId || sub.category_id,
          name: sub.name,
        }));

      console.log("📦 수정할 클래스 데이터:", {
        lessonId,
        lessonCategoryId,
        subCategoryIds,
        subCategories,
      });
      
      // 클래스 업데이트
      mockLessons[lessonIndex] = {
        ...mockLessons[lessonIndex],
        title,
        description,
        curriculum,
        classCategoryId: lessonCategoryId,
        level,
        durationMin,
        price,
        discountRate,
        discountedPrice,
        maxParticipants,
        regionId,
        address,
        latitude,
        longitude,
        detailAddress,
        directionsText,
        reservationLeadDays,
        updatedAt: new Date().toISOString(),
        classCategory: category ? { id: category.id, name: category.name } : undefined,
        subClassCategories: subCategories,
      };

      console.log("✅ Mock Lesson Updated:", mockLessons[lessonIndex]);

      return HttpResponse.json({ 
        id: lessonId,
        message: "클래스가 성공적으로 수정되었습니다. (Mock)" 
      }, { status: 200 });
    } else {
      return HttpResponse.json({ 
        message: "클래스를 찾을 수 없습니다." 
      }, { status: 404 });
    }
  }),

  // 클래스 삭제
  http.delete(`${httpUrl}/lessons/:lessonId`, async ({ params }) => {
    await delay(500);
    const lessonId = Number(params.lessonId);
    
    const lessonIndex = mockLessons.findIndex(l => l.id === lessonId);
    
    if (lessonIndex !== -1) {
      // mockLessons 배열에서 제거
      mockLessons.splice(lessonIndex, 1);
      
      console.log(`✅ Mock Lesson Deleted: ID ${lessonId}`);
      console.log(`📋 Remaining Lessons: ${mockLessons.length}`);

      return HttpResponse.json({ 
        message: "클래스가 삭제되었습니다. (Mock)" 
      }, { status: 200 });
    } else {
      return HttpResponse.json({ 
        message: "클래스를 찾을 수 없습니다." 
      }, { status: 404 });
    }
  }),
];

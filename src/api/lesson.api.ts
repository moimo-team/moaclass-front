import { apiClient } from "./client";
import type { FetchLessonsResponse, Lesson } from "@/models/lesson.model";

// --- 클래스 조회(GET) 관련 ---

export const fetchLatestLessons = async (): Promise<Lesson[]> => {
  const response = await apiClient.get<Lesson[]>("/lessons/latest");
  return response.data;
};

export const fetchLessons = async (
  mappedParams: Record<string, any>,
): Promise<FetchLessonsResponse> => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(mappedParams).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // 배열인 경우 각 요소를 개별 쿼리 파라미터로 추가
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, String(item)));
      } else {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/lessons?${queryString}` : "/lessons";

    const response = await apiClient.get<FetchLessonsResponse>(url);
    return response.data;
  } catch (error) {
    console.error("fetchLessons error:", error);
    throw error;
  }
};

export const fetchLesson = async (lessonId: number): Promise<Lesson> => {
  try {
    const response = await apiClient.get<Lesson>(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error(`fetchLesson (ID: ${lessonId}) error:`, error);
    throw error;
  }
};

// --- 클래스 생성/수정/삭제 관련 ---

// 1. 클래스 생성
export const createLesson = async (formData: FormData) => {
  const response = await apiClient.post("/lessons", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 2. 클래스 수정
export const updateLesson = async (lessonId: number, formData: FormData) => {
  const response = await apiClient.put(`/lessons/${lessonId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 3. 레슨 삭제
export const deleteLesson = async (lessonId: number) => {
  const response = await apiClient.delete(`/lessons/${lessonId}`);
  return response.data;
};

// --- 클래스 일정 관련 ---

// 4. 클래스 일정 추가
export const addLessonSchedule = async (lessonId: number, data: any) => {
  const response = await apiClient.post(`/lessons/${lessonId}/schedules`, data);
  return response.data;
};

// 5. 클래스 일정 수정
export const updateLessonSchedule = async (scheduleId: number, data: any) => {
  const response = await apiClient.put(
    `/lessons/schedules/${scheduleId}`,
    data,
  );
  return response.data;
};

// 6. 레슨 일정 삭제
export const deleteLessonSchedule = async (scheduleId: number) => {
  const response = await apiClient.delete(`/lessons/schedules/${scheduleId}`);
  return response.data;
};

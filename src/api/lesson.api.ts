import { apiClient } from "./client";
import type {
  FetchLessonsParams,
  FetchLessonsResponse,
  Lesson,
} from "@/models/lesson.model";

export const fetchLatestLessons = async (): Promise<Lesson[]> => {
  // TODO: URL 확정되면 수정
  const response = await apiClient.get<Lesson[]>("/lessons/latest");
  return response.data;
};

export const fetchLessons = async (
  params: FetchLessonsParams,
): Promise<FetchLessonsResponse> => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

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

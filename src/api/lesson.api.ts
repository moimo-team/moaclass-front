import { apiClient } from "./client";
import type { Lesson } from "@/models/lesson.model";

export const fetchLatestLessons = async (): Promise<Lesson[]> => {
  // TODO: URL 확정되면 수정
  const response = await apiClient.get<Lesson[]>("/lessons/latest");
  return response.data;
};

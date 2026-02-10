import { apiClient } from "@/api/client";

export const addLessonLike = async (lessonId: number) => {
  const response = await apiClient.post("/likes", { lessonId });
  return response.data;
};

export const removeLessonLike = async (lessonId: number) => {
  const response = await apiClient.delete(`/likes/${lessonId}`);
  return response.data;
};

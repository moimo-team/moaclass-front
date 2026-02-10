import { apiClient } from "@/api/client";

export const addLike = async (lessonId: number) => {
  const response = await apiClient.post(`/likes/${lessonId}`);
  return response.data;
};

export const cancelLike = async (lessonId: number) => {
  const response = await apiClient.delete(`/likes/${lessonId}`);
  return response.data;
};

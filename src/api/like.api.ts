import { apiClient } from "@/api/client";

// 좋아요 추가
export const addLessonLike = async (lessonId: number) => {
  const response = await apiClient.post("/likes", { lessonId });
  return response.data;
};

// 좋아요 취소
export const removeLessonLike = async (lessonId: number) => {
  const response = await apiClient.delete(`/likes/${lessonId}`);
  return response.data;
};

import { apiClient } from "@/api/client";
import type { Review } from "@/models/review.model";

export const getLessonReviews = async (lessonId: number): Promise<Review[]> => {
  try {
    const response = await apiClient.get<Review[]>(
      `/lessons/${lessonId}/reviews`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for lesson ${lessonId}:`, error);
    throw error;
  }
};

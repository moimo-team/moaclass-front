import { apiClient } from "@/api/client";
import type { WishlistResponse } from "@/models/wishlist.model";

export const addLike = async (lessonId: number) => {
  const response = await apiClient.post(`/likes/${lessonId}`);
  return response.data;
};

export const cancelLike = async (lessonId: number) => {
  const response = await apiClient.delete(`/likes/${lessonId}`);
  return response.data;

// 위시리스트 조회
export const getWishlist = async (page = 1, limit = 8) => {
  try {
    const response = await apiClient.get<WishlistResponse>(
      `/likes/me?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error("getWishlist error:", error);
    throw error;
  }
};

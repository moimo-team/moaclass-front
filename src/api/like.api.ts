import { apiClient } from "./client";
import type { WishlistResponse } from "@/models/wishlist.model";

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

// 좋아요 추가
export const addLike = async (lessonId: number) => {
  try {
    const response = await apiClient.post(`/likes/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error("addLike error:", error);
    throw error;
  }
};

// 좋아요 취소
export const cancelLike = async (lessonId: number) => {
  try {
    const response = await apiClient.delete(`/likes/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error("cancelLike error:", error);
    throw error;
  }
};

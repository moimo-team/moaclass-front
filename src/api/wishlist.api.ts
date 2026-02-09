import { apiClient } from "./client";
import type { WishlistResponse } from "@/models/wishlist.model";

// 위시리스트 조회
export const getWishlist = async (page = 1, limit = 8) => {
    try {
        const response = await apiClient.get<WishlistResponse>(`/likes/me?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("getWishlist error:", error);
        throw error;
    }
};

// 위시리스트 삭제
export const deleteWishlist = async (lessonId: number) => {
    try {
        const response = await apiClient.delete(`/likes/me/${lessonId}`);
        return response.data;
    } catch (error) {
        console.error("deleteWishlist error:", error);
        throw error;
    }
};
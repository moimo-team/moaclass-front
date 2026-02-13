import { apiClient } from '@/api/client';
import type { Review, ReviewInfo } from '@/models/review.model';

// 클래스 리뷰 목록 조회
export const getLessonReviews = async (lessonId: number): Promise<Review[]> => {
	try {
		const response = await apiClient.get<Review[]>(`/lessons/${lessonId}/reviews`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching reviews for lesson ${lessonId}:`, error);
		throw error;
	}
};

// 리뷰 작성
export const writeReview = async (data: FormData) => {
	const response = await apiClient.post<ReviewInfo>(`/reviews`, data, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};
// 내가 작성한 특정 클래스 리뷰 조회
export const getMyReview = async (lessonId: number) => {
	const response = await apiClient.get<ReviewInfo>(`/reviews/me/${lessonId}`);
	return response.data;
};
// 리뷰 수정
export const updateReview = async (reviewId: number, data: FormData) => {
	const response = await apiClient.put<ReviewInfo>(`/reviews/${reviewId}`, data, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};
// 리뷰 삭제
export const deleteReview = async (reviewId: number) => {
	const response = await apiClient.delete<void>(`/reviews/${reviewId}`);
	return response.data;
};

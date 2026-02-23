import { apiClient } from '@/api/client';
import type {
	LatestReviewListResponse,
	LessonReviewListItemRaw,
	LessonReviewListResponse,
	LessonReviewListResponseRaw,
	Review,
	MyReviewItem,
} from '@/models/review.model';

const getReviewImages = (review: LessonReviewListItemRaw): string[] =>
	[
		review.image1,
		review.image2,
		review.image3,
		review.image4,
		review.image5,
		review.image6,
		review.image7,
		review.image8,
	].filter((image): image is string => Boolean(image));

const normalizeLessonReview = (review: LessonReviewListItemRaw): Review => {
	const images = getReviewImages(review);
	const timestamp = review.createdAt ?? new Date().toISOString();

	return {
		id: review.id,
		lessonId: review.lessonId,
		lessonTitle: review.lessonTitle,
		userId: review.userId,
		user: {
			id: review.userId,
			nickname: `User ${review.userId}`,
			profileImage: null,
		},
		rating: review.rating,
		representativeImage: images[0] ?? null,
		content: review.content,
		createdAt: timestamp,
		updatedAt: review.updatedAt ?? timestamp,
	};
};

// GET /lessons/{lessonId}/reviews?page=1&limit=6
export const getLessonReviews = async (
	lessonId: number,
	page = 1,
	limit = 6,
): Promise<LessonReviewListResponse> => {
	const response = await apiClient.get<LessonReviewListResponseRaw>(
		`/lessons/${lessonId}/reviews?page=${page}&limit=${limit}`,
	);

	return {
		data: response.data.data.map(normalizeLessonReview),
		meta: response.data.meta,
	};
};

export const getLatestReviews = async (): Promise<LatestReviewListResponse> => {
	const response = await apiClient.get<LatestReviewListResponse>('/reviews?page=1&limit=6');
	return response.data;
};

export const writeReview = async (data: FormData) => {
	const response = await apiClient.post<MyReviewItem>(`/reviews`, data, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

export const getMyReview = async (lessonId: number) => {
	const response = await apiClient.get<MyReviewItem>(`/reviews/me/${lessonId}`);
	return response.data;
};

export const updateReview = async (reviewId: number, data: FormData) => {
	const response = await apiClient.put<MyReviewItem>(`/reviews/${reviewId}`, data, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

export const deleteReview = async (reviewId: number) => {
	const response = await apiClient.delete<void>(`/reviews/${reviewId}`);
	return response.data;
};

import type { PaginationMeta } from '@/models/pagination.model';

export interface UserProfileForReview {
	id: number;
	nickname: string;
	profileImage: string | null;
}

export interface ReviewImage {
	id: number;
	reviewId: number;
	image: string;
	sequence: number;
}

export interface Review {
	id: number;
	user: UserProfileForReview;
	lessonId: number;
	lessonTitle?: string;
	userId?: number;
	rating: number;
	representativeImage: string | null;
	images?: string[];
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface LessonReviewListItemRaw {
	id: number;
	lessonId: number;
	lessonTitle: string;
	userId: number;
	rating: number;
	content: string;
	image1: string | null;
	image2: string | null;
	image3: string | null;
	image4: string | null;
	image5: string | null;
	image6: string | null;
	image7: string | null;
	image8: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface LessonReviewListResponse {
	data: Review[];
	meta: PaginationMeta;
}

export interface LessonReviewListResponseRaw {
	data: LessonReviewListItemRaw[];
	meta: PaginationMeta;
}

export interface LatestReviewItem {
	id: number;
	lessonId: number;
	lessonTitle: string;
	userId: number;
	nickname: string;
	profileImage: string | null;
	rating: number;
	content: string;
	representativeImage: string | null;
}

export interface LatestReviewListResponse {
	data: LatestReviewItem[];
	meta: PaginationMeta;
}

export type MyReviewItem = {
	hasReview: boolean;
	review: Partial<LessonReviewListItemRaw> | null;
};

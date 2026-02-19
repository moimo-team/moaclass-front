import type { PaginationMeta } from '@/models/pagination.model';

export interface TeacherReview {
	id: number;
	lessonId: number;
	lessonTitle: string;
	userId: number;
	rating: number;
	content: string;
	representativeImage: string | null;
	createdAt?: string;
}

export interface TeacherReviewsResponse {
	data: TeacherReview[];
	meta: PaginationMeta;
}

export interface FetchTeacherReviewsParams {
	page?: number;
	limit?: number;
}

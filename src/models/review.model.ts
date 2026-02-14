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
	rating: number;
	representativeImage: string | null;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export type ReviewInfo = Partial<Review> & {
	userId?: number;
	images?: string[];
};

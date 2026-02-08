export interface UserProfileForReview {
  id: number;
  nickname: string;
  profile_image: string | null;
}

export interface ReviewImage {
  id: number;
  review_id: number;
  image: string;
  sequence: number;
}

export interface Review {
  id: number;
  user: UserProfileForReview;
  lesson_id: number;
  rating: number;
  representative_image: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

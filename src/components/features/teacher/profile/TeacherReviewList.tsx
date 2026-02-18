import React from 'react';

import { ReviewItem } from '@/components/features/lessons/ReviewItem';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { TeacherReview } from '@/models/teacher.model';

interface TeacherReviewListProps {
	reviews: TeacherReview[];
	isLoading: boolean;
}

export const TeacherReviewList: React.FC<TeacherReviewListProps> = ({ reviews, isLoading }) => {
	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">대표 후기</h2>
				<span className="text-sm text-gray-500">이미지가 포함된 후기만 표시됩니다</span>
			</div>

			{isLoading ? (
				<div className="space-y-4">
					{[1, 2].map((i) => (
						<Skeleton key={i} className="h-32 w-full rounded-2xl" />
					))}
				</div>
			) : reviews.length > 0 ? (
				<Card className="rounded-2xl shadow-sm border-gray-100 p-6 space-y-4">
					{reviews.map((review) => (
						<ReviewItem
							key={review.id}
							review={{
								id: review.id,
								lessonId: review.lessonId,
								rating: review.rating,
								content: review.content,
								representativeImage: review.representativeImage,
								createdAt: review.createdAt || new Date().toISOString(),
								updatedAt: review.createdAt || new Date().toISOString(),
								user: {
									id: review.userId,
									nickname: '수강생', // API 보완 필요 시 여기서 수정
									profileImage: null,
								},
							}}
						/>
					))}
				</Card>
			) : (
				<div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed">
					작성된 후기가 없습니다.
				</div>
			)}
		</section>
	);
};

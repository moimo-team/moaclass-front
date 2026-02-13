import { useState } from 'react';

import ReviewList from '@/components/features/home/ReviewList';
import ReviewModal from '@/components/features/home/ReviewModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useReviewsQuery } from '@/hooks/useReviewsQuery';
import type { Review } from '@/mock/reviewMock';

const ReviewListSection = () => {
	const { reviews, isLoading, isError } = useReviewsQuery();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedReview, setSelectedReview] = useState<Review | null>(null);

	const handleReviewClick = (review: Review) => {
		setSelectedReview(review);
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedReview(null);
	};

	const REVIEWS = 6;

	return (
		<div className="w-full py-8 pt-12">
			<div className="flex justify-between w-full mb-4">
				<div className="text-xl font-bold ">모멘티들의 따끈따끈한 후기</div>
			</div>
			{isLoading && (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
					{[...Array(4)].map((_, index) => (
						<Skeleton key={index} className="w-full h-80 rounded-lg" />
					))}
				</div>
			)}
			{isError && (
				<p className="text-center text-red-500">후기를 불러오는 중 에러가 발생했습니다.</p>
			)}
			{!isLoading && !isError && reviews.length > 0 && (
				<ReviewList reviews={reviews.slice(0, REVIEWS)} onReviewClick={handleReviewClick} />
			)}
			{!isLoading && !isError && reviews.length === 0 && (
				<p className="text-center py-16">후기가 없습니다.</p>
			)}

			{selectedReview && (
				<ReviewModal
					open={isModalOpen}
					onOpenChange={handleModalClose}
					review={selectedReview}
				/>
			)}
		</div>
	);
};

export default ReviewListSection;

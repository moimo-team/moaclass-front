import { useState, useEffect } from 'react';

import { mockReviews, type MeetingReview as Review } from '@/mock/reviewMock';

interface UseReviewsQueryResult {
	reviews: Review[];
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
}

// TODO: mock data 사용해 useReviewsQuery 비동기 로딩 시뮬레이션, API 확정되면 수정
export function useReviewsQuery(): UseReviewsQueryResult {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchReviews = async () => {
			setIsLoading(true);
			setIsError(false);
			setError(null);
			try {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setReviews(mockReviews);
			} catch (err) {
				setIsError(true);
				setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
			} finally {
				setIsLoading(false);
			}
		};

		fetchReviews();
	}, []);

	return { reviews, isLoading, isError, error };
}

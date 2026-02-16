import { useQuery } from '@tanstack/react-query';

import { getLatestReviews } from '@/api/review.api';

export function useReviewsQuery() {
	const query = useQuery({
		queryKey: ['reviews', 'latest6'],
		queryFn: getLatestReviews,
	});

	return {
		reviews: query.data?.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
	};
}

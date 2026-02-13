import type { ReviewInfo } from '@/models/review.model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { writeReview } from '@/api/review.api';

// 리뷰 작성 훅
export const useReviewMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: FormData) => writeReview(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
		},
	});
};

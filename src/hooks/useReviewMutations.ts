import type { ReviewInfo } from '@/models/review.model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReview, writeReview } from '@/api/review.api';
import { toast } from 'sonner';

// 리뷰 작성 훅
export const useReviewMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: FormData) => writeReview(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orderlist'] });
			toast.success('리뷰가 작성되었습니다.');
		},
		onError: () => {
			toast.error('리뷰 작성에 실패했습니다.');
		},
	});
};

// 리뷰 수정 훅
export const useUpdateReviewMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ reviewId, data }: { reviewId: number; lessonId: number; data: FormData }) =>
			updateReview(reviewId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['myReview', variables.lessonId] });
			queryClient.invalidateQueries({ queryKey: ['orderlist'] });
			toast.success('리뷰가 수정되었습니다.');
		},
		onError: () => {
			toast.error('리뷰 수정에 실패했습니다.');
		},
	});
};

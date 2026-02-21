import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateReview, writeReview } from '@/api/review.api';
import type { MyReviewItem } from '@/models/review.model';

// 리뷰 작성 훅
export const useReviewMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: FormData) => writeReview(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orderlist'] });
			toast.success('리뷰가 작성되었습니다.');
		},
	});
};

// 리뷰 수정 훅
export const useUpdateReviewMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ reviewId, data }: { reviewId: number; lessonId: number; data: FormData }) =>
			updateReview(reviewId, data),
		onSuccess: (updatedReview, variables) => {
			// 응답 데이터를 캐시에 직접 주입 → enabled=false 상태에서도 즉시 반영
			queryClient.setQueryData<MyReviewItem>(['myReview', variables.lessonId], updatedReview);
			queryClient.invalidateQueries({ queryKey: ['orderlist'] });
			toast.success('리뷰가 수정되었습니다.');
		},
	});
};

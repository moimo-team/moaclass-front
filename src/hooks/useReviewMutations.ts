import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateReview, writeReview } from '@/api/review.api';

// 리뷰 작성 훅
export const useReviewMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: FormData) => writeReview(data),
		meta: {
			errorMessages: {
				403: '수강완료 참여자만 작성할 수 있습니다.',
				default: '리뷰 작성 중 오류가 발생했습니다.',
			},
		},
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
		mutationFn: ({
			reviewId,
			data,
		}: {
			reviewId: number;
			enrollmentId: number;
			data: FormData;
		}) => updateReview(reviewId, data),
		onSuccess: (_, variables) => {
			// 백엔드가 204 No Content를 반환하므로 updatedReview가 없음.
			// 대신 쿼리를 무효화하여 모달 재오픈 시 신규 데이터를 가져오도록 함.
			queryClient.invalidateQueries({ queryKey: ['myReview', variables.enrollmentId] });
			queryClient.invalidateQueries({ queryKey: ['orderlist'] });
			toast.success('리뷰가 수정되었습니다.');
		},
	});
};

import { useQuery } from '@tanstack/react-query';

import { getMyReview } from '@/api/review.api';
import type { MyReviewItem } from '@/models/review.model';

/**
 * 특정 레슨에 대해 내가 작성한 리뷰를 조회하는 훅
 * @param enrollmentId 등록 ID
 * @returns 쿼리 결과 (data: MyReviewItem | undefined)
 */
export const useMyReviewQuery = (enrollmentId: number, options: { enabled?: boolean } = {}) => {
	return useQuery({
		queryKey: ['myReview', enrollmentId],
		queryFn: async () => {
			const data = await getMyReview(enrollmentId);
			return data as MyReviewItem;
		},
		enabled: options.enabled !== false && !!enrollmentId,
	});
};

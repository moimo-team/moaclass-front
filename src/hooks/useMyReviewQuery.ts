import { useQuery } from '@tanstack/react-query';

import { getMyReview } from '@/api/review.api';
import type { MyReviewItem } from '@/models/review.model';

/**
 * 특정 레슨에 대해 내가 작성한 리뷰를 조회하는 훅
 * @param lessonId 레슨 ID
 * @returns 쿼리 결과 (data: MyReviewItem | undefined)
 */
export const useMyReviewQuery = (lessonId: number, options: { enabled?: boolean } = {}) => {
	return useQuery({
		queryKey: ['myReview', lessonId],
		queryFn: async () => {
			const data = await getMyReview(lessonId);
			return data as MyReviewItem;
		},
		enabled: options.enabled !== false && !!lessonId,
	});
};

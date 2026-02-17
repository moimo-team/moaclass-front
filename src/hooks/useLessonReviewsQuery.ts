import { useQuery } from '@tanstack/react-query';

import { getLessonReviews } from '@/api/review.api';

export const useLessonReviewsQuery = (lessonId: number) => {
	return useQuery({
		queryKey: ['lessonReviews', lessonId],
		queryFn: () => getLessonReviews(lessonId, 1, 6),
		enabled: !!lessonId,
	});
};

import { useQuery } from '@tanstack/react-query';

import { fetchTeacherReviews } from '@/api/teacher.api';
import type { FetchTeacherReviewsParams } from '@/models/teacher.model';

export const useTeacherReviewsQuery = (teacherId: number, params?: FetchTeacherReviewsParams) => {
	return useQuery({
		queryKey: ['reviews', 'teacher', teacherId, params],
		queryFn: () => fetchTeacherReviews(teacherId, params),
		enabled: !!teacherId,
	});
};

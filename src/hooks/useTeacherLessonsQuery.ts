import { useQuery } from '@tanstack/react-query';

import { fetchTeacherLessons } from '@/api/teacher.api';

export const useTeacherLessonsQuery = (teacherId: number) => {
	return useQuery({
		queryKey: ['lessons', 'teacher', teacherId],
		queryFn: () => fetchTeacherLessons(teacherId),
		enabled: !!teacherId,
	});
};

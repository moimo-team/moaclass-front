import LessonListSection from '@/components/features/lessons/LessonListSection';
import { useHomeLessonSectionQuery } from '@/hooks/useLessonsQuery';
import type { FetchLessonsParams } from '@/models/lesson.model';

interface HomeLessonSectionProps {
	title: string;
	seeMoreHref: string;
	queryParams: FetchLessonsParams;
	limit?: number;
	hideIfEmpty?: boolean;
	enabled?: boolean;
}

function HomeLessonSection({
	title,
	seeMoreHref,
	queryParams,
	limit = 10,
	hideIfEmpty = true,
	enabled = true,
}: HomeLessonSectionProps) {
	const { data, isLoading, isError } = useHomeLessonSectionQuery(queryParams, { limit, enabled });
	const safeLessons = data || [];

	return (
		<LessonListSection
			title={title}
			seeMoreHref={seeMoreHref}
			hideIfEmpty={hideIfEmpty}
			lessons={safeLessons}
			isLoading={isLoading}
			isError={isError}
		/>
	);
}

export default HomeLessonSection;

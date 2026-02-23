import LessonListSection from '@/components/features/lessons/LessonListSection';
import { useLatestLessonsQuery } from '@/hooks/useLessonsQuery';

function NewLessonList() {
	const { data, isLoading, isError } = useLatestLessonsQuery();
	const safeLessons = data || [];

	return (
		<LessonListSection
			title="신규 원데이 클래스"
			seeMoreHref="/lessons?sort=LATEST"
			hideIfEmpty={true}
			lessons={safeLessons}
			isLoading={isLoading}
			isError={isError}
		/>
	);
}

export default NewLessonList;

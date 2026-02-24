import Link from 'next/link';

import LessonList from '@/components/features/lessons/LessonList';
import { Skeleton } from '@/components/ui/skeleton';
import type { Lesson } from '@/models/lesson.model';

interface LessonListSectionProps {
	title: string;
	seeMoreHref?: string;
	hideIfEmpty?: boolean;
	lessons: Lesson[];
	isLoading: boolean;
	isError: boolean;
}

function LessonListSection({
	title,
	seeMoreHref,
	hideIfEmpty = false,
	lessons,
	isLoading,
	isError,
}: LessonListSectionProps) {
	if (hideIfEmpty && !isLoading && lessons.length === 0) {
		return null;
	}

	return (
		<div className="w-full py-8 pt-12">
			<div className="flex justify-between items-center w-full mb-6">
				<div className="text-2xl font-bold text-foreground">{title}</div>
				{seeMoreHref && (
					<Link
						href={seeMoreHref}
						className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors"
					>
						전체보기
					</Link>
				)}
			</div>
			{isLoading && (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 justify-items-center">
					{[...Array(4)].map((_, index) => (
						<Skeleton key={index} className="w-full h-[380px] rounded-lg" />
					))}
				</div>
			)}
			{isError && (
				<p className="text-center text-red-500 py-16">
					수업 목록을 불러오는 중 에러가 발생했습니다.
				</p>
			)}
			{!isLoading && !isError && lessons.length > 0 && <LessonList lessons={lessons} />}
			{!isLoading && !isError && lessons.length === 0 && (
				<p className="text-center py-16">수업이 없습니다.</p>
			)}
		</div>
	);
}

export default LessonListSection;

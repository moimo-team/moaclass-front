import React from 'react';

import { LessonCard } from '@/components/features/lessons/LessonCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Lesson } from '@/models/lesson.model';

interface TeacherLessonListProps {
	lessons: Lesson[];
	isLoading: boolean;
}

export const TeacherLessonList: React.FC<TeacherLessonListProps> = ({ lessons, isLoading }) => {
	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">클래스 목록</h2>
				<span className="text-sm text-gray-500">총 {lessons.length}개</span>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{[1, 2].map((i) => (
						<Skeleton key={i} className="h-64 w-full rounded-xl" />
					))}
				</div>
			) : lessons.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{lessons.map((lesson) => (
						<LessonCard key={lesson.id} lesson={lesson} />
					))}
				</div>
			) : (
				<div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed">
					등록된 클래스가 없습니다.
				</div>
			)}
		</section>
	);
};

import { fetchLesson } from '@/api/lesson.api';
import LessonClient from '@/app/lessons/[lessonId]/LessonClient';
import { createPageMetadata } from '@/utils/metadata';

import type { Metadata } from 'next';

type Props = {
	params: Promise<{ lessonId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lessonId } = await params;
	const id = Number(lessonId);

	if (!Number.isFinite(id)) {
		return createPageMetadata({
			title: '클래스를 찾을 수 없습니다',
			description: '유효하지 않은 클래스 경로입니다.',
			noindex: true,
		});
	}

	try {
		const lesson = await fetchLesson(id);

		return createPageMetadata({
			title: lesson.title,
			description: lesson.description || '모아클래스 클래스 상세 페이지입니다.',
			image: lesson.representativeImage,
			canonical: `/lessons/${id}`,
		});
	} catch {
		return createPageMetadata({
			title: '클래스를 찾을 수 없습니다',
			description: '요청한 클래스를 찾지 못했습니다.',
			noindex: true,
		});
	}
}

export default async function LessonDetailPage({ params }: Props) {
	const { lessonId } = await params;
	return <LessonClient lessonId={lessonId} />;
}

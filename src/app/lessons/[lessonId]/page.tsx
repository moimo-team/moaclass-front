import LessonClient from '@/app/lessons/[lessonId]/LessonClient';
import { createPageMetadata } from '@/utils/metadata';

import type { Metadata } from 'next';

type Props = {
	params: { lessonId: string };
};

// SEO: 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lessonId } = await params;

	// 실제 데이터 페칭 로직이 필요하지만, 현재는 Mock 데이터 기반이거나 클라이언트 사이드 데이터 위주이므로
	// 우선 기본적인 타이틀 설정만 적용하고, 추후 API 호출을 통해 동적 데이터를 가져오도록 구현합니다.
	// 실제 구현 예시: const lesson = await fetchLesson(lessonId);

	return createPageMetadata({
		title: `클래스 상세 ${lessonId}`,
		description: `클래스 상세 ${lessonId}`,
	});
}

export default async function LessonDetailPage({ params }: Props) {
	const { lessonId } = await params;
	return <LessonClient lessonId={lessonId} />;
}

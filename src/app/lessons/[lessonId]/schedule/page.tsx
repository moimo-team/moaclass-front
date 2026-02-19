import ScheduleManagementClient from '@/app/lessons/[lessonId]/schedule/ScheduleManagementClient';

import type { Metadata } from 'next';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * 개인정보 및 관리 기능이 포함된 페이지이므로 인덱싱 차단(noindex) 설정을 권장합니다.
 */
export const metadata: Metadata = {
	title: '일정 및 예약 관리 | 모아클',
	robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
	const { lessonId } = await params;

	return <ScheduleManagementClient lessonId={lessonId} />;
}

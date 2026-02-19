import ScheduleManagementClient from '@/app/lessons/[lessonId]/schedule/ScheduleManagementClient';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '일정 및 예약 관리',
	description: '클래스 일정 및 예약 관리 페이지',
	noindex: true,
});

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
	const { lessonId } = await params;

	return <ScheduleManagementClient lessonId={lessonId} />;
}

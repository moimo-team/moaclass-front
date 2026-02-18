'use client';

import { useRouter } from 'next/navigation';

import { ScheduleManagementContent } from '@/pages/class/manage/ScheduleManagementPage';

export default function ScheduleManagementClient({ lessonId }: { lessonId: string }) {
	const router = useRouter();

	return (
		<ScheduleManagementContent
			lessonId={lessonId}
			onBack={() => router.back()}
			onNavigate={(path) => router.push(path)}
		/>
	);
}

import { Suspense } from 'react';

import MeetingsClient from '@/app/meetings/MeetingsClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '모임 목록',
	description: '모아클래스에서 다양한 모임을 찾아보세요.',
	canonical: '/meetings',
});

export default function MeetingsPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<MeetingsClient />
		</Suspense>
	);
}

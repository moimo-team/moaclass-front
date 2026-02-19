import { Suspense } from 'react';

import MeetingsSearchClient from '@/app/meetings/search/MeetingsSearchClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '모임 검색',
	description: '키워드로 원하는 모임을 검색해보세요.',
	canonical: '/meetings/search',
});

export default function MeetingsSearchPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<MeetingsSearchClient />
		</Suspense>
	);
}

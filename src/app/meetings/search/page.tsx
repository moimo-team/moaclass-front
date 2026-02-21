import { Suspense } from 'react';

import MeetingsSearchClient from '@/app/meetings/search/MeetingsSearchClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toAbsoluteUrl } from '@/constants/site';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '모임 검색',
	description: '키워드로 원하는 모임을 검색해보세요.',
	canonical: '/meetings/search',
});

export default function MeetingsSearchPage() {
	const meetingsSearchJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'SearchResultsPage',
		name: '모임 검색 결과',
		url: toAbsoluteUrl('/meetings/search'),
		mainEntity: {
			'@type': 'ItemList',
			name: '모아클래스 모임 검색 결과 목록',
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(meetingsSearchJsonLd) }}
			/>
			<Suspense fallback={<LoadingSpinner />}>
				<MeetingsSearchClient />
			</Suspense>
		</>
	);
}

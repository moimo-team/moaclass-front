import { Suspense } from 'react';

import MeetingsClient from '@/app/meetings/MeetingsClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toAbsoluteUrl } from '@/constants/site';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '지금 참여 가능한 모임 찾기',
	description: '마감 임박 모임부터 최신 모임까지.',
	canonical: '/meetings',
	image: '/og/og-meetings.png',
});

export default function MeetingsPage() {
	const meetingsJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: '모임 목록',
		url: toAbsoluteUrl('/meetings'),
		mainEntity: {
			'@type': 'ItemList',
			name: '모아클래스 모임 목록',
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(meetingsJsonLd) }}
			/>
			<Suspense fallback={<LoadingSpinner />}>
				<MeetingsClient />
			</Suspense>
		</>
	);
}

import { Suspense } from 'react';

import MeetingsClient from '@/app/meetings/MeetingsClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toAbsoluteUrl } from '@/constants/site';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '모임 목록',
	description: '모아클래스에서 다양한 모임을 찾아보세요.',
	canonical: '/meetings',
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

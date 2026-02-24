import { Suspense } from 'react';

import { LessonsClient } from '@/app/lessons/LessonsClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toAbsoluteUrl } from '@/constants/site';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '취향을 찾는 원데이 클래스',
	description: '지금 바로 예약 가능한 클래스 모아보기.',
	canonical: '/lessons',
	image: '/og/og-lessons.png',
});

export default function LessonsPage() {
	const lessonsJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: '클래스 목록',
		url: toAbsoluteUrl('/lessons'),
		mainEntity: {
			'@type': 'ItemList',
			name: '모아클래스 클래스 목록',
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonsJsonLd) }}
			/>
			<Suspense fallback={<LoadingSpinner />}>
				<LessonsClient />
			</Suspense>
		</>
	);
}

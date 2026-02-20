import { Suspense } from 'react';

import { LessonsClient } from '@/app/lessons/LessonsClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toAbsoluteUrl } from '@/constants/site';
import { createPageMetadata } from '@/utils/metadata';

// 필터링된 페이지를 노출시키지 않아서 정적 메타데이터 사용
export const metadata = createPageMetadata({
	title: '클래스 목록',
	description: '모아클래스에서 다양한 클래스를 찾아보세요.',
	canonical: '/lessons',
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

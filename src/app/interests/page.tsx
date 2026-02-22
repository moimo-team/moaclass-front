import InterestsClient from '@/app/interests/InterestsClient';
import { toAbsoluteUrl } from '@/constants/site';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '관심사 모두보기',
	description: '관심 분야별 모임을 확인해보세요.',
	canonical: '/interests',
});

export default function Page() {
	const interestsJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: '관심사 목록',
		url: toAbsoluteUrl('/interests'),
		mainEntity: {
			'@type': 'ItemList',
			name: '모아클래스 관심사 목록',
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(interestsJsonLd) }}
			/>
			<InterestsClient />
		</>
	);
}

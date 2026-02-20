import HomeClient from '@/app/HomeClient';
import { toAbsoluteUrl } from '@/constants/site';
import { createPageMetadata } from '@/utils/metadata';

// 메타 데이터 적용
export const metadata = createPageMetadata({
	title: '홈',
	description: '모아클래스에서 다양한 강의를 만나보세요.',
	canonical: '/',
});

export default function Page() {
	const websiteJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: '모아클래스',
		url: toAbsoluteUrl('/'),
	};

	const organizationJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: '모아클래스',
		url: toAbsoluteUrl('/'),
		logo: toAbsoluteUrl('/moaclass-icon.svg'),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
			/>
			<HomeClient />
		</>
	);
}

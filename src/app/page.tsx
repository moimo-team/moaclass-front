import HomeClient from '@/app/HomeClient';
import { toAbsoluteUrl } from '@/constants/site';
import { createPageMetadata } from '@/utils/metadata';

export const metadata = createPageMetadata({
	title: '모아클래스',
	description: '원데이 클래스와 모임을 한곳에서.',
	canonical: '/',
	image: '/og/og-home.png',
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

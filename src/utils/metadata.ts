import { toAbsoluteUrl } from '@/constants/site';

import type { Metadata } from 'next';

type MetadataParams = {
	title: string;
	description: string;
	image?: string;
	canonical?: string;
	noindex?: boolean;
};

export function createPageMetadata({
	title,
	description,
	image,
	canonical,
	noindex,
}: MetadataParams): Metadata {
	const ogTitle = `${title} | 모아클래스`;
	const ogImage = toAbsoluteUrl(image || '/og/og-home.png');
	const ogUrl = canonical ? toAbsoluteUrl(canonical) : undefined;

	return {
		title,
		description,
		openGraph: {
			type: 'website',
			title: ogTitle,
			description,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: ogTitle,
				},
			],
			...(ogUrl && { url: ogUrl }),
		},
		twitter: {
			card: 'summary_large_image',
			title: ogTitle,
			description,
			images: [ogImage],
		},
		...(canonical && { alternates: { canonical } }),
		...(noindex && { robots: { index: false, follow: false } }),
	};
}

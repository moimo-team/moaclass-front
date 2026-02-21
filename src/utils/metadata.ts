import type { Metadata } from 'next';

type MetadataParams = {
	title: string;
	description: string;
	image?: string;
	canonical?: string;
	noindex?: boolean;
};

/**
 * 페이지별 메타데이터 공통 생성 함수
 *
 * Next.js metadata 병합 규칙:
 * - layout.tsx에 title.template이 있으면 페이지 title 문자열과 조합됩니다.
 * - 따라서 여기서는 페이지 고유 title만 받고, 브랜드 suffix는 layout에서 일괄 처리합니다.
 */
export function createPageMetadata({
	title,
	description,
	image,
	canonical,
	noindex,
}: MetadataParams): Metadata {
	const ogTitle = `${title} | 모아클래스`;

	return {
		title,
		description,
		openGraph: {
			title: ogTitle,
			description,
			...(image && { images: [image] }),
		},
		...(canonical && { alternates: { canonical } }),
		...(noindex && { robots: { index: false, follow: false } }),
	};
}

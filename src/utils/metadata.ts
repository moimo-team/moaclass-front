import type { Metadata } from 'next';

type MetadataParams = {
	title: string;
	description: string;
	image?: string; // 선택적 이미지 경로
};

/**
 * 페이지별 메타데이터 생성 함수
 *
 * Next.js의 metadata 병합 규칙:
 * - 페이지에서 title을 문자열로 설정하면 layout의 template이 무시됩니다
 * - 따라서 여기서 직접 template을 적용한 완전한 title을 반환합니다
 */
export function createPageMetadata({ title, description, image }: MetadataParams): Metadata {
	const fullTitle = `${title} | 모아클`;

	return {
		title: fullTitle, // layout template 대신 직접 완전한 title 생성
		description,
		openGraph: {
			title: fullTitle,
			description,
			...(image && { images: [image] }),
		},
	};
}

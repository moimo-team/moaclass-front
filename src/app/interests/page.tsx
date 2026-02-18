import InterestsClient from '@/app/interests/InterestsClient';

import type { Metadata } from 'next';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 */
export const metadata: Metadata = {
	title: '관심사 모두보기 | 모아클',
	description: '관심 분야별 모임을 확인해보세요.',
};

export default function Page() {
	return <InterestsClient />;
}

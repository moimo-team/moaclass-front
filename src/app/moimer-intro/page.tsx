import MoimerIntroClient from '@/app/moimer-intro/MoimerIntroClient';

import type { Metadata } from 'next';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 */
export const metadata: Metadata = {
	title: '모이머 안내 | 모아클',
	description: '모이머 신청하고 나만의 모임을 만들어보세요.',
};

export default function Page() {
	return <MoimerIntroClient />;
}

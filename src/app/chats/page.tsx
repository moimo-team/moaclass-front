import ChattingClient from '@/app/chats/ChattingClient';
import ProtectedRouteNext from '@/components/common/next/ProtectedRouteNext';

import type { Metadata } from 'next';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * 개인 채팅 페이지이므로 인덱싱 차단(noindex) 설정을 권장합니다.
 */
export const metadata: Metadata = {
	title: '메시지 | 모아클',
	robots: { index: false, follow: false },
};

export default function Page() {
	return (
		<ProtectedRouteNext>
			<ChattingClient />
		</ProtectedRouteNext>
	);
}

import { Suspense } from 'react';

import LoadingSpinner from '@/components/common/LoadingSpinner';

import MeetingsSearchClient from './MeetingsSearchClient';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * export const metadata: Metadata = { ... }
 *
 * 동적 메타데이터가 필요한 경우 generateMetadata 함수를 사용하세요.
 * export async function generateMetadata({ searchParams }: Props): Promise<Metadata> { ... }
 */

export default function MeetingsSearchPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<MeetingsSearchClient />
		</Suspense>
	);
}

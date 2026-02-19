import MeetingDetailClient from './MeetingDetailClient';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * export const metadata: Metadata = { ... }
 *
 * 동적 메타데이터가 필요한 경우 generateMetadata 함수를 사용하세요.
 * export async function generateMetadata({ searchParams }: Props): Promise<Metadata> { ... }
 */

export default async function MeetingDetailPage() {
	return <MeetingDetailClient />;
}

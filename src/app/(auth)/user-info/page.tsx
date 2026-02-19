import UserInfoClient from './UserInfoClient';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * 개인정보가 포함될 수 있는 페이지이므로 인덱싱 차단(noindex) 설정을 권장합니다.
 * export const metadata: Metadata = {
 *   robots: { index: false, follow: false },
 * }
 *
 * 동적 메타데이터가 필요한 경우 generateMetadata 함수를 사용하세요.
 * export async function generateMetadata({ searchParams }: Props): Promise<Metadata> { ... }
 */

export default function UserInfoPage() {
	return <UserInfoClient />;
}

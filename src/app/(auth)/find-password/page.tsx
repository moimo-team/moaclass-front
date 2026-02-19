import FindPasswordClient from './FindPasswordClient';

/**
 * SEO 담당자 전용: 메타데이터 설정 위치
 * 인증 관련 페이지이므로 인덱싱 차단(noindex) 설정을 권장합니다.
 * export const metadata: Metadata = {
 *   robots: { index: false, follow: false },
 * }
 *
 * 동적 메타데이터가 필요한 경우 generateMetadata 함수를 사용하세요.
 * export async function generateMetadata({ searchParams }: Props): Promise<Metadata> { ... }
 */

export default function FindPasswordPage() {
	return <FindPasswordClient />;
}
